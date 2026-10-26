const http = require('http');
const assert = require('assert');

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

async function runAdminTests() {
  console.log('=== STARTING TRAVELGROW SECURE ADMIN TEST SUITE ===\n');
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

  let adminToken = '';
  let cookieHeader = '';
  let targetEnquiryId = null;
  let testQuotationShareToken = '';

  // 1. Route security: unauthenticated requests must be blocked
  await test('Accessing /api/admin/enquiries without authentication returns 401 Unauthorized', async () => {
    const res = await makeRequest('/api/admin/enquiries');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.error.toLowerCase().includes('authentication required'));
  });

  await test('Accessing /api/admin/me without authentication returns 401 Unauthorized', async () => {
    const res = await makeRequest('/api/admin/me');
    assert.strictEqual(res.status, 401);
  });

  // 2. Login verification: bad password
  await test('Login with incorrect password returns 401 Unauthorized', async () => {
    const res = await makeRequest('/api/admin/login', 'POST', {
      username: 'tg_admin',
      password: 'IncorrectPassword123'
    });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  // 3. Login verification: valid credentials
  await test('Login with valid credentials returns 200, session token and user info', async () => {
    const res = await makeRequest('/api/admin/login', 'POST', {
      username: 'tg_admin',
      password: 'TravelGrowAdmin2026!'
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.token);
    assert.strictEqual(res.body.user.username, 'tg_admin');
    assert.strictEqual(res.body.user.role, 'admin');

    // Check Set-Cookie
    assert.ok(res.headers['set-cookie']);
    const setCookie = res.headers['set-cookie'][0];
    assert.ok(setCookie.includes('tgc_admin_token='));
    assert.ok(setCookie.includes('HttpOnly'));

    adminToken = res.body.token;
    cookieHeader = setCookie.split(';')[0];
  });

  // 4. Current user session verification
  await test('GET /api/admin/me with session returns authenticated user', async () => {
    const res = await makeRequest('/api/admin/me', 'GET', null, {
      'Cookie': cookieHeader
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.user.username, 'tg_admin');
  });

  // 5. Dashboard statistics endpoint
  await test('GET /api/admin/enquiries/stats returns status breakdown and totals', async () => {
    const res = await makeRequest('/api/admin/enquiries/stats', 'GET', null, {
      'Cookie': cookieHeader
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.stats);
    assert.ok(res.body.stats.total >= 1);
    assert.strictEqual(typeof res.body.stats.byStatus['New'], 'number');
  });

  // 6. Enquiries list and search
  await test('GET /api/admin/enquiries returns paginated customer enquiries', async () => {
    const res = await makeRequest('/api/admin/enquiries?limit=10', 'GET', null, {
      'Cookie': cookieHeader
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.enquiries));
    assert.ok(res.body.enquiries.length > 0);
    targetEnquiryId = res.body.enquiries[0].id;
  });

  await test('GET /api/admin/enquiries?q=... filters enquiries by search keyword', async () => {
    const res = await makeRequest('/api/admin/enquiries?q=Tokyo', 'GET', null, {
      'Cookie': cookieHeader
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.enquiries));
  });

  // 7. Enquiry Detail Inspection
  await test('GET /api/admin/enquiries/:id returns full customer details and notes', async () => {
    assert.ok(targetEnquiryId, 'Target enquiry id must exist');
    const res = await makeRequest(`/api/admin/enquiries/${targetEnquiryId}`, 'GET', null, {
      'Cookie': cookieHeader
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.enquiry);
    assert.strictEqual(res.body.enquiry.id, targetEnquiryId);
    assert.ok(Array.isArray(res.body.notes));
  });

  // 8. Update Enquiry Status
  await test('POST /api/admin/enquiries/:id/status updates status to "Contacted"', async () => {
    const res = await makeRequest(`/api/admin/enquiries/${targetEnquiryId}/status`, 'POST', {
      status: 'Contacted'
    }, {
      'Cookie': cookieHeader
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.enquiry.status, 'Contacted');
  });

  await test('Updating enquiry status with invalid status is rejected', async () => {
    const res = await makeRequest(`/api/admin/enquiries/${targetEnquiryId}/status`, 'POST', {
      status: 'InvalidStatusXYZ'
    }, {
      'Cookie': cookieHeader
    });
    assert.strictEqual(res.status, 400);
  });

  // 9. Assign Enquiry
  await test('POST /api/admin/enquiries/:id/assign assigns enquiry to agent', async () => {
    const res = await makeRequest(`/api/admin/enquiries/${targetEnquiryId}/assign`, 'POST', {
      agentId: 1,
      agentName: 'Sarah Jenkins'
    }, {
      'Cookie': cookieHeader
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.enquiry.assigned_to, 'Sarah Jenkins');
  });

  // 10. Add Internal Note
  await test('POST /api/admin/enquiries/:id/notes saves private agent note to database', async () => {
    const noteText = 'Called customer at 14:30. Discussed boutique options in Seminyak.';
    const res = await makeRequest(`/api/admin/enquiries/${targetEnquiryId}/notes`, 'POST', {
      note: noteText
    }, {
      'Cookie': cookieHeader
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.note.note, noteText);
    assert.strictEqual(res.body.note.author_name, 'Sarah Jenkins');
  });

  // 11. Holiday Packages Management
  await test('GET /api/admin/packages returns all packages from SQLite database', async () => {
    const res = await makeRequest('/api/admin/packages', 'GET', null, {
      'Cookie': cookieHeader
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.packages));
    assert.ok(res.body.packages.length >= 6);
  });

  let createdPackageId = '';
  await test('POST /api/admin/packages creates and persists a new holiday package', async () => {
    const payload = {
      title: 'Iceland Aurora Borealis & Glacier Expedition',
      destination: 'Reykjavik & Golden Circle, Iceland',
      region: 'europe',
      duration: '6 Days / 5 Nights',
      price_indicative: 'From £1,750pp',
      tag: 'Winter Adventure',
      hero_image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
      description: 'Chase the northern lights across volcanic landscapes, geothermal lagoons, and ice caves.',
      inclusions: ['5 nights 4-star boutique hotel', 'Superjeep northern lights hunt', 'Blue Lagoon retreat pass'],
      exclusions: ['International flights', 'Thermal boots hire']
    };

    const res = await makeRequest('/api/admin/packages', 'POST', payload, {
      'Cookie': cookieHeader
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.package.id);
    assert.strictEqual(res.body.package.title, payload.title);
    createdPackageId = res.body.package.id;
  });

  await test('PUT /api/admin/packages/:id edits package details', async () => {
    assert.ok(createdPackageId);
    const res = await makeRequest(`/api/admin/packages/${createdPackageId}`, 'PUT', {
      title: 'Iceland Aurora Borealis & Glacier Expedition (VIP)',
      destination: 'Reykjavik & Golden Circle, Iceland',
      region: 'europe',
      duration: '7 Days / 6 Nights',
      price_indicative: 'From £2,150pp',
      hero_image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
      description: 'Updated luxury description.',
      inclusions: ['VIP private superjeep', 'Blue Lagoon spa'],
      exclusions: ['International flights']
    }, {
      'Cookie': cookieHeader
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.package.price_indicative, 'From £2,150pp');
  });

  // 12. Public packages endpoint verification
  await test('GET /api/packages serves updated packages to public clients', async () => {
    const res = await makeRequest('/api/packages');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    const found = res.body.packages.find(p => p.id === createdPackageId);
    assert.ok(found, 'New package must be served by public API');
  });

  // 13. Quotation Management Feature
  await test('POST /api/admin/quotations generates official proposal with validity and cancellation terms', async () => {
    const quotePayload = {
      enquiry_id: targetEnquiryId,
      customer_name: 'Amara Vance',
      customer_email: 'amara.vance@example.co.uk',
      customer_phone: '+44 7911 123456',
      destination: 'Tokyo & Kyoto, Japan',
      title: 'Custom 10-Day Japan Luxury Shinkansen & Ryokan Journey',
      travel_options: [
        'Option 1: Japan Airlines Premium Economy direct + 4* Boutique Kyoto Villa',
        'Option 2: British Airways Club World Business + 5* Tokyo Bay Luxury Suite'
      ],
      total_price: '£3,850 total for 2 passengers',
      price_breakdown: 'Includes all international flights, 23kg baggage, 1st class rail passes, and boutique stays.',
      validity_date: 'Valid until 30 Oct 2026, 18:00 GMT (Airline inventory hold)',
      inclusions: [
        'Return scheduled flights with British Airways / JAL',
        '9 nights hand-picked 4* & 5* boutique accommodations',
        '7-day 1st Class Japan Rail Pass for Bullet Trains',
        'Chauffeured airport meet & greet transfers'
      ],
      exclusions: [
        'Personal travel & cancellation insurance',
        'Discretionary dining outside breakfast'
      ],
      cancellation_conditions: 'Fully refundable up to 28 days before departure less £100 per person airline ticketing administration charge.'
    };

    const res = await makeRequest('/api/admin/quotations', 'POST', quotePayload, {
      'Cookie': cookieHeader
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.quotation.id.startsWith('TGC-QTE-'));
    assert.ok(res.body.quotation.share_token);
    assert.strictEqual(res.body.quotation.total_price, quotePayload.total_price);
    testQuotationShareToken = res.body.quotation.share_token;
  });

  await test('Generating a quotation automatically advances linked enquiry status to "Quote Sent"', async () => {
    const res = await makeRequest(`/api/admin/enquiries/${targetEnquiryId}`, 'GET', null, {
      'Cookie': cookieHeader
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.enquiry.status, 'Quote Sent');
  });

  // 14. Customer-facing Quotation View (Privacy Protected)
  await test('GET /api/quotations/view/:token serves sanitized proposal and hides private customer data', async () => {
    assert.ok(testQuotationShareToken);
    const res = await makeRequest(`/api/quotations/view/${testQuotationShareToken}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.quotation);
    assert.strictEqual(res.body.quotation.destination, 'Tokyo & Kyoto, Japan');
    // Verify privacy: customer phone and email are NOT exposed in public view payload
    assert.strictEqual(res.body.quotation.customer_email, undefined);
    assert.strictEqual(res.body.quotation.customer_phone, undefined);
  });

  // 15. Frontend Page Delivery
  await test('Admin dashboard static page serves 200 OK: /admin', async () => {
    const res = await makeRequest('/admin');
    assert.strictEqual(res.status, 200);
    assert.ok(res.rawBody.includes('TravelGrow Admin Desk'));
  });

  await test('Customer quotation page serves 200 OK: /quote.html', async () => {
    const res = await makeRequest('/quote.html');
    assert.strictEqual(res.status, 200);
    assert.ok(res.rawBody.includes('Travel Quotation'));
  });

  // 16. Logout & Session Revocation
  await test('POST /api/admin/logout revokes session and invalidates access', async () => {
    const res = await makeRequest('/api/admin/logout', 'POST', null, {
      'Cookie': cookieHeader
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);

    // Subsequent call with old token must now be 401
    const checkRes = await makeRequest('/api/admin/me', 'GET', null, {
      'Cookie': cookieHeader
    });
    assert.strictEqual(checkRes.status, 401);
  });

  console.log(`\n=== TEST RESULTS: ${passed} PASSED, ${failed} FAILED ===`);
  if (failed > 0) process.exit(1);
}

runAdminTests().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
