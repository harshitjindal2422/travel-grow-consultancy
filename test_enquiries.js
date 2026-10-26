const http = require('http');
const assert = require('assert');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');

const BASE_URL = 'http://localhost:3000';

function makeRequest(path, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Accept': 'application/json',
        ...headers
      }
    };

    let postData = null;
    if (data) {
      postData = JSON.stringify(data);
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(body);
        } catch (e) {
          json = null;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          rawBody: body,
          body: json
        });
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('=== STARTING TRAVELGROW ENQUIRY TEST SUITE ===\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      process.stdout.write(`Testing: ${name}... `);
      await fn();
      console.log('PASSED');
      passed++;
    } catch (err) {
      console.log('FAILED');
      console.error('   ->', err.message);
      failed++;
    }
  }

  // 1. Config endpoint & WhatsApp safe behavior
  await test('GET /api/config returns safe config without fake phone numbers', async () => {
    const res = await makeRequest('/api/config');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.config);
    assert.strictEqual(res.body.config.whatsapp.configured, false);
    assert.strictEqual(res.body.config.whatsapp.phoneNumber, null);
    assert.ok(res.body.config.whatsapp.defaultMessage.length > 5);
  });

  // 2. Flight enquiry submission (genuine persistence)
  let flightRef = '';
  await test('POST /api/enquiries/flight creates genuine enquiry with all required fields', async () => {
    const tomorrow = new Date(Date.now() + 86400000 * 15).toISOString().split('T')[0];
    const returnDate = new Date(Date.now() + 86400000 * 25).toISOString().split('T')[0];

    const payload = {
      full_name: 'Amara Vance',
      phone: '+44 7911 123456',
      email: 'amara.vance@example.co.uk',
      departure_city: 'London Heathrow (LHR)',
      destination: 'Tokyo Haneda (HND)',
      departure_date: tomorrow,
      return_date: returnDate,
      trip_type: 'return',
      adults: 2,
      children: 1,
      cabin_preference: 'Premium Economy',
      approximate_budget: '£3,500 - £4,500 total',
      privacy_consent: true,
      website_url: '' // honeypot empty
    };

    const res = await makeRequest('/api/enquiries/flight', 'POST', payload);
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.referenceNo.startsWith('TGC-FLT-'));
    assert.strictEqual(res.body.enquiryType, 'flight');
    // Ensure private data is NOT exposed in the JSON response
    assert.strictEqual(res.body.phone, undefined);
    assert.strictEqual(res.body.full_name, undefined);
    assert.strictEqual(res.body.email, undefined);
    flightRef = res.body.referenceNo;
  });

  // 3. Database persistence check for flight enquiry
  await test('Verify flight enquiry saved in SQLite database and agency notification recorded', async () => {
    const db = new DatabaseSync('data/enquiries.db');
    const row = db.prepare('SELECT * FROM enquiries WHERE reference_no = ?').get(flightRef);
    assert.ok(row, 'Enquiry record must exist in SQLite DB');
    assert.strictEqual(row.enquiry_type, 'flight');
    assert.strictEqual(row.full_name, 'Amara Vance');
    assert.strictEqual(row.phone, '+44 7911 123456');
    assert.strictEqual(row.departure_city, 'London Heathrow (LHR)');
    assert.strictEqual(row.destination, 'Tokyo Haneda (HND)');
    assert.strictEqual(row.trip_type, 'return');
    assert.strictEqual(row.adults_count, 2);
    assert.strictEqual(row.children_count, 1);
    assert.strictEqual(row.cabin_preference, 'Premium Economy');

    // Check notification recorded
    const notif = db.prepare('SELECT * FROM agency_notifications WHERE reference_no = ?').get(flightRef);
    assert.ok(notif, 'Agency notification must be logged');
    assert.strictEqual(notif.status, 'delivered');

    // Check agency inbox log file exists and contains ref
    const inbox = fs.readFileSync('data/agency_inbox.log', 'utf8');
    assert.ok(inbox.includes(flightRef), 'agency_inbox.log must contain reference');
  });

  // 4. Server-side validation for flight enquiries
  await test('Flight validation rejects invalid phone (< 7 digits)', async () => {
    const tomorrow = new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0];
    const res = await makeRequest('/api/enquiries/flight', 'POST', {
      full_name: 'Test User',
      phone: '123',
      departure_city: 'London',
      destination: 'Dubai',
      departure_date: tomorrow,
      privacy_consent: true
    });
    assert.strictEqual(res.status, 400);
    assert.ok(res.body.errors.some(e => e.includes('phone number')));
  });

  await test('Flight validation rejects past departure date', async () => {
    const res = await makeRequest('/api/enquiries/flight', 'POST', {
      full_name: 'Test User',
      phone: '+44 7911 123456',
      departure_city: 'London',
      destination: 'Dubai',
      departure_date: '2020-01-01',
      privacy_consent: true
    });
    assert.strictEqual(res.status, 400);
    assert.ok(res.body.errors.some(e => e.includes('Departure date must be today or in the future')));
  });

  await test('Flight validation rejects return date before departure date', async () => {
    const dep = new Date(Date.now() + 86400000 * 20).toISOString().split('T')[0];
    const ret = new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0];
    const res = await makeRequest('/api/enquiries/flight', 'POST', {
      full_name: 'Test User',
      phone: '+44 7911 123456',
      departure_city: 'London',
      destination: 'Dubai',
      departure_date: dep,
      return_date: ret,
      trip_type: 'return',
      privacy_consent: true
    });
    assert.strictEqual(res.status, 400);
    assert.ok(res.body.errors.some(e => e.includes('Return date must be on or after')));
  });

  await test('Flight validation rejects missing privacy consent', async () => {
    const dep = new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0];
    const res = await makeRequest('/api/enquiries/flight', 'POST', {
      full_name: 'Test User',
      phone: '+44 7911 123456',
      departure_city: 'London',
      destination: 'Dubai',
      departure_date: dep,
      privacy_consent: false
    });
    assert.strictEqual(res.status, 400);
    assert.ok(res.body.errors.some(e => e.includes('Privacy consent')));
  });

  await test('Flight validation silently rejects honeypot spam bot submission', async () => {
    const dep = new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0];
    const res = await makeRequest('/api/enquiries/flight', 'POST', {
      full_name: 'Bot User',
      phone: '+44 7911 123456',
      departure_city: 'London',
      destination: 'Dubai',
      departure_date: dep,
      privacy_consent: true,
      website_url: 'http://spam-link.example.com' // bot filled honeypot
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.errors.some(e => e.toLowerCase().includes('spam')));
  });

  // 5. Holiday enquiry submission
  let holidayRef = '';
  await test('POST /api/enquiries/holiday creates genuine holiday enquiry with all required fields', async () => {
    const payload = {
      name: 'Elena Rostova',
      phone: '+44 20 7946 0991',
      email: 'elena.rostova@example.co.uk',
      destination: 'Bali & Ubud Cultural Sanctuary',
      travel_dates: 'October 2026 / Autumn Season',
      travellers: '2 adults',
      days: 12,
      budget: '£4,000 - £5,500 total',
      trip_type: 'honeymoon',
      additional_requirements: 'Require private villa with infinity pool, dietary gluten-free for breakfast, romantic sunset dinner in Jimbaran Bay.',
      privacy_consent: true,
      website_url: ''
    };

    const res = await makeRequest('/api/enquiries/holiday', 'POST', payload);
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.referenceNo.startsWith('TGC-HOL-'));
    assert.strictEqual(res.body.enquiryType, 'holiday');
    holidayRef = res.body.referenceNo;
  });

  // 6. Holiday database persistence check
  await test('Verify holiday enquiry saved in SQLite database with all holiday parameters', async () => {
    const db = new DatabaseSync('data/enquiries.db');
    const row = db.prepare('SELECT * FROM enquiries WHERE reference_no = ?').get(holidayRef);
    assert.ok(row, 'Holiday enquiry record must exist in SQLite DB');
    assert.strictEqual(row.enquiry_type, 'holiday');
    assert.strictEqual(row.full_name, 'Elena Rostova');
    assert.strictEqual(row.destination, 'Bali & Ubud Cultural Sanctuary');
    assert.strictEqual(row.number_of_days, 12);
    assert.strictEqual(row.holiday_trip_type, 'honeymoon');
    assert.ok(row.additional_requirements.includes('infinity pool'));

    const notif = db.prepare('SELECT * FROM agency_notifications WHERE reference_no = ?').get(holidayRef);
    assert.ok(notif, 'Holiday agency notification must exist');
  });

  // 7. Holiday validation tests
  await test('Holiday validation accepts all specified trip types: family, honeymoon, solo, group, other', async () => {
    const validTypes = ['family', 'honeymoon', 'solo', 'group', 'other'];
    for (const t of validTypes) {
      const res = await makeRequest('/api/enquiries/holiday', 'POST', {
        name: `Tester ${t}`,
        phone: '+44 7911 000000',
        destination: 'Switzerland',
        travel_dates: 'November 2026',
        travellers: '2',
        days: 7,
        budget: '£3000',
        trip_type: t,
        privacy_consent: true
      });
      assert.strictEqual(res.status, 201, `Trip type ${t} must be valid`);
      assert.ok(res.body.referenceNo.startsWith('TGC-HOL-'));
    }
  });

  await test('Holiday validation rejects invalid trip type', async () => {
    const res = await makeRequest('/api/enquiries/holiday', 'POST', {
      name: 'Tester Bad',
      phone: '+44 7911 000000',
      destination: 'Switzerland',
      travel_dates: 'November 2026',
      travellers: '2',
      days: 7,
      budget: '£3000',
      trip_type: 'space_cruise',
      privacy_consent: true
    });
    assert.strictEqual(res.status, 400);
    assert.ok(res.body.errors.some(e => e.includes('trip type')));
  });

  // 8. General enquiry endpoint
  await test('POST /api/enquiries/general works for contact and callback forms', async () => {
    const res = await makeRequest('/api/enquiries/general', 'POST', {
      name: 'Oliver Twist',
      phone: '+44 7911 223344',
      email: 'oliver@example.co.uk',
      subject: 'Custom Multi-stop Tour Inquiry',
      message: 'Looking for a 3-week tour of New Zealand with campervan hire.',
      privacy_consent: true
    });
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.referenceNo.startsWith('TGC-GEN-'));
  });

  // 9. Admin audit endpoint (authenticated)
  await test('GET /api/admin/enquiries returns saved enquiries list for authorized admin', async () => {
    const loginRes = await makeRequest('/api/admin/login', 'POST', {
      username: 'tg_admin',
      password: 'TravelGrowAdmin2026!'
    });
    assert.strictEqual(loginRes.status, 200);
    const cookie = loginRes.headers['set-cookie'][0].split(';')[0];

    const res = await makeRequest('/api/admin/enquiries', 'GET', null, { 'Cookie': cookie });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.enquiries));
    assert.ok(res.body.enquiries.length >= 7, 'Must have at least 7 enquiries persisted');
  });

  // 10. Static frontend files verification
  const frontendFiles = [
    '/',
    '/flights.html',
    '/holidays.html',
    '/package-details.html',
    '/plan-my-trip.html',
    '/contact.html',
    '/about.html',
    '/faqs.html',
    '/privacy-policy.html',
    '/terms-conditions.html',
    '/cancellation-refund.html',
    '/js/enquiry.js',
    '/js/main.js',
    '/css/style.css'
  ];

  for (const page of frontendFiles) {
    await test(`Frontend file serves 200 OK: ${page}`, async () => {
      const res = await makeRequest(page);
      assert.strictEqual(res.status, 200, `Page ${page} must return 200`);
      assert.ok(res.rawBody.length > 50, `Page ${page} must not be empty`);
    });
  }

  console.log(`\n=== TEST RESULTS: ${passed} PASSED, ${failed} FAILED ===`);
  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
