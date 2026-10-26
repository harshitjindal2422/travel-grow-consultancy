// TravelGrow Consultancy - Server & Enquiry Engine
// Node.js HTTP Server with SQLite persistence, validation, spam protection, and agency notification
const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('./db');
const auth = require('./auth');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const CONFIG_PATH = path.join(__dirname, 'config.json');

// Load business configuration
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading config.json:', err.message);
  }
  return {
    agency: {
      name: "TravelGrow Consultancy",
      domain: "travelgrowconsultancy.com",
      email: "enquiries@travelgrowconsultancy.com"
    },
    whatsapp: {
      configured: false,
      phoneNumber: ""
    },
    rateLimit: {
      windowMinutes: 10,
      maxRequestsPerWindow: 15
    }
  };
}

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// In-memory rate limiter per IP address
const rateLimits = new Map();

function checkRateLimit(ip, maxRequests = 15, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  let tracker = rateLimits.get(ip);
  if (!tracker || now - tracker.startTime > windowMs) {
    tracker = { count: 1, startTime: now };
    rateLimits.set(ip, tracker);
    return true;
  }
  if (tracker.count >= maxRequests) {
    return false;
  }
  tracker.count++;
  return true;
}

// Clean up stale rate limits every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, tracker] of rateLimits.entries()) {
    if (now - tracker.startTime > 15 * 60 * 1000) {
      rateLimits.delete(ip);
    }
  }
}, 15 * 60 * 1000);

// Validate telephone number (national/international with at least 7 digits, max 16 digits)
function isValidPhoneNumber(phone) {
  if (typeof phone !== 'string') return false;
  const trimmed = phone.trim();
  const digitsOnly = trimmed.replace(/\D/g, '');
  if (digitsOnly.length < 7 || digitsOnly.length > 16) return false;
  // Allows optional leading +, digits, spaces, parentheses, hyphens
  const phoneRegex = /^\+?[0-9\s\-().]{7,25}$/;
  return phoneRegex.test(trimmed);
}

// Validate email format
function isValidEmail(email) {
  if (!email) return true; // email is optional in prompt specification
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(String(email).trim());
}

// Validate date string (YYYY-MM-DD or standard parseable date >= today's midnight)
function isValidFutureDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Allow departure date within last 24h to accommodate timezone offsets
  const cutoff = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  return d >= cutoff;
}

// Helper to parse JSON request body
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 50000) {
        // Prevent payload flood
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        resolve(parsed);
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', err => reject(err));
  });
}

function sendJsonResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  });
  res.end(JSON.stringify(data));
}

function getAuthenticatedAdmin(req) {
  const cookies = auth.parseCookies(req);
  const token = cookies.tgc_admin_token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') ? req.headers.authorization.slice(7).trim() : null);
  if (!token) return null;
  return db.getSessionWithUser(token);
}

function requireAdminAuth(req, res) {
  const user = getAuthenticatedAdmin(req);
  if (!user) {
    sendJsonResponse(res, 401, { success: false, error: 'Authentication required. Please sign in to access administration portal.' });
    return null;
  }
  return user;
}

const server = http.createServer(async (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const effectiveUrl = req.headers['x-matched-path'] || req.url;
  const parsedUrl = new URL(effectiveUrl, `http://${req.headers.host || 'localhost'}`);
  const reqPath = decodeURI(parsedUrl.pathname);
  const searchParams = parsedUrl.searchParams;

  // Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // HEALTH CHECK ROUTE: GET /api/health
  if (req.method === 'GET' && reqPath === '/api/health') {
    return sendJsonResponse(res, 200, {
      status: 'ok',
      service: 'TravelGrow Consultancy API',
      timestamp: new Date().toISOString()
    });
  }

  // API ROUTE 1: GET /api/config
  // Provides sanitized public configuration (WhatsApp status, business hours)
  // NEVER exposes private credentials or unconfigured fake numbers
  if (req.method === 'GET' && reqPath === '/api/config') {
    const config = loadConfig();
    const envPhone = process.env.WHATSAPP_PHONE ? process.env.WHATSAPP_PHONE.trim() : null;
    const configuredPhone = envPhone || (config.whatsapp && config.whatsapp.configured && config.whatsapp.phoneNumber ? config.whatsapp.phoneNumber.trim() : null);

    const isWaConfigured = Boolean(configuredPhone && configuredPhone.length >= 7);
    const waConfig = {
      configured: isWaConfigured,
      // Only provide genuine configured phone number. Never a fake number.
      phoneNumber: isWaConfigured ? configuredPhone : null,
      defaultMessage: config.whatsapp?.directChatTemplate || 'Hello TravelGrow Consultancy, I would like to request an obligation-free quote for my travel plans.',
      prefilledTemplate: config.whatsapp?.prefilledMessageTemplate || 'Hello TravelGrow Consultancy, I have submitted enquiry {REF_CODE} for {DESTINATION}.',
      directChatTemplate: config.whatsapp?.directChatTemplate || 'Hello TravelGrow Consultancy, I would like to request an obligation-free quote for my travel plans.'
    };

    return sendJsonResponse(res, 200, {
      success: true,
      agencyName: config.agency?.name || 'TravelGrow Consultancy',
      agencyDomain: config.agency?.domain || 'travelgrowconsultancy.com',
      businessHours: config.agency?.businessHours || 'Mon-Fri: 08:30 - 18:30 GMT',
      whatsapp: waConfig,
      config: {
        agencyName: config.agency?.name || 'TravelGrow Consultancy',
        agencyDomain: config.agency?.domain || 'travelgrowconsultancy.com',
        businessHours: config.agency?.businessHours || 'Mon-Fri: 08:30 - 18:30 GMT',
        whatsapp: waConfig
      }
    });
  }

  // API ROUTE 2: POST /api/enquiries/flight
  // Flight enquiry validation and persistent SQLite database storage
  if (req.method === 'POST' && reqPath === '/api/enquiries/flight') {
    const config = loadConfig();
    const maxReq = config.rateLimit?.maxRequestsPerWindow || 15;
    const windowMs = (config.rateLimit?.windowMinutes || 10) * 60 * 1000;

    if (!checkRateLimit(`enquiry:${clientIp}`, maxReq, windowMs)) {
      return sendJsonResponse(res, 429, {
        success: false,
        error: 'Too many requests. Please wait a few minutes before submitting another consultation request.',
        errors: ['Too many requests. Please wait a few minutes before submitting another consultation request.']
      });
    }

    try {
      const data = await parseJsonBody(req);

      // 1. Spam Honeypot Check
      const honeypotVal = data.website_url || data.websiteUrl || '';
      if (honeypotVal && String(honeypotVal).trim().length > 0) {
        console.warn(`[SPAM BLOCKED] Honeypot triggered from IP ${clientIp}`);
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Submission flagged by spam protection filter.',
          errors: ['Submission flagged by spam protection filter.']
        });
      }

      // 2. Privacy Consent Check (accepts consent, privacy_consent, privacyConsent)
      const consentVal = data.consent !== undefined ? data.consent : (data.privacy_consent !== undefined ? data.privacy_consent : data.privacyConsent);
      if (!consentVal || consentVal === 'false' || consentVal === false) {
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Please accept the privacy policy consent to proceed with your quotation request.',
          errors: ['Privacy consent is required to proceed with your quotation request.']
        });
      }

      // 3. Required Fields Validation
      const fullName = (data.fullName || data.full_name || data.name || '').trim();
      if (fullName.length < 2 || fullName.length > 100) {
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Please provide your full name (minimum 2 characters).',
          errors: ['Please provide your full name (minimum 2 characters).']
        });
      }

      const phone = (data.phone || data.phoneNumber || data.phone_number || '').trim();
      if (!isValidPhoneNumber(phone)) {
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Please enter a valid phone number (minimum 7 digits, including country/area code).',
          errors: ['Please enter a valid phone number (minimum 7 digits, including country/area code).']
        });
      }

      const email = (data.email || '').trim();
      if (email && !isValidEmail(email)) {
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Please enter a valid email address, or leave it blank if preferred.',
          errors: ['Please enter a valid email address, or leave it blank if preferred.']
        });
      }

      const departureCity = (data.departureCity || data.departure_city || data.origin || '').trim();
      if (departureCity.length < 2) {
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Please provide a departure city or airport.',
          errors: ['Please provide a departure city or airport.']
        });
      }

      const destination = (data.destination || '').trim();
      if (destination.length < 2) {
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Please provide your destination city or airport.',
          errors: ['Please provide your destination city or airport.']
        });
      }

      const departureDate = (data.departureDate || data.departure_date || data.departDate || data.depart_date || '').trim();
      if (!departureDate || !isValidFutureDate(departureDate)) {
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Departure date must be today or in the future.',
          errors: ['Departure date must be today or in the future.']
        });
      }

      const rawTripType = data.tripType || data.trip_type || 'return';
      const tripType = ['return', 'oneway', 'multicity'].includes(rawTripType) ? rawTripType : 'return';
      const returnDate = (data.returnDate || data.return_date || '').trim();

      if (tripType === 'return') {
        if (!returnDate) {
          return sendJsonResponse(res, 400, {
            success: false,
            error: 'Return date is required for round-trip flight enquiries.',
            errors: ['Return date is required for round-trip flight enquiries.']
          });
        }
        if (new Date(returnDate) < new Date(departureDate)) {
          return sendJsonResponse(res, 400, {
            success: false,
            error: 'Return date must be on or after your departure date.',
            errors: ['Return date must be on or after your departure date.']
          });
        }
      }

      const adults = parseInt(data.adults || data.adultsCount || data.adults_count, 10);
      if (isNaN(adults) || adults < 1) {
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'At least 1 adult passenger is required.',
          errors: ['At least 1 adult passenger is required.']
        });
      }

      const children = parseInt(data.children || data.childrenCount || data.children_count, 10) || 0;
      if (children < 0) {
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Number of children cannot be negative.',
          errors: ['Number of children cannot be negative.']
        });
      }

      const cabinPreference = data.cabinPreference || data.cabin_preference || data.cabinClass || data.cabin_class || 'Economy';

      const approximateBudget = (data.approximateBudget || data.approximate_budget || data.budget || '').trim();
      if (!approximateBudget) {
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Please specify an approximate budget so our agents can find suitable options.',
          errors: ['Please specify an approximate budget so our agents can find suitable options.']
        });
      }

      // 4. Save to Persistent SQLite Database
      const savedEnquiry = db.saveFlightEnquiry({
        fullName,
        phone,
        email: email || null,
        departureCity,
        destination,
        departureDate,
        returnDate: tripType === 'return' ? returnDate : null,
        tripType,
        adults,
        children,
        cabinPreference,
        approximateBudget,
        additionalRequirements: (data.notes || data.additionalRequirements || data.additional_requirements || '').trim(),
        consent: true
      }, {
        ip: clientIp,
        userAgent
      });

      // 5. Send Clean Response (No private customer data in response body!)
      return sendJsonResponse(res, 201, {
        success: true,
        referenceNo: savedEnquiry.reference_no,
        enquiryType: 'flight',
        destination: savedEnquiry.destination,
        message: 'Your flight consultation enquiry has been recorded in our database. An assigned travel specialist will research live airline consolidator inventory and send an itemized quotation.'
      });

    } catch (err) {
      console.error('[Flight Submission Error]', err);
      return sendJsonResponse(res, 500, {
        success: false,
        error: 'Unable to process flight enquiry. Please verify your connection or try again.',
        errors: ['Unable to process flight enquiry. Please verify your connection or try again.']
      });
    }
  }

  // API ROUTE 3: POST /api/enquiries/holiday
  // Holiday enquiry validation and persistent SQLite database storage
  if (req.method === 'POST' && reqPath === '/api/enquiries/holiday') {
    const config = loadConfig();
    const maxReq = config.rateLimit?.maxRequestsPerWindow || 15;
    const windowMs = (config.rateLimit?.windowMinutes || 10) * 60 * 1000;

    if (!checkRateLimit(`enquiry:${clientIp}`, maxReq, windowMs)) {
      return sendJsonResponse(res, 429, {
        success: false,
        error: 'Too many requests. Please wait a few minutes before submitting another consultation request.',
        errors: ['Too many requests. Please wait a few minutes before submitting another consultation request.']
      });
    }

    try {
      const data = await parseJsonBody(req);

      // 1. Spam Honeypot Check
      const honeypotVal = data.website_url || data.websiteUrl || '';
      if (honeypotVal && String(honeypotVal).trim().length > 0) {
        console.warn(`[SPAM BLOCKED] Honeypot triggered from IP ${clientIp}`);
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Submission flagged by spam protection filter.',
          errors: ['Submission flagged by spam protection filter.']
        });
      }

      // 2. Privacy Consent Check
      const consentVal = data.consent !== undefined ? data.consent : (data.privacy_consent !== undefined ? data.privacy_consent : data.privacyConsent);
      if (!consentVal || consentVal === 'false' || consentVal === false) {
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Please accept the privacy policy consent to proceed with your quotation request.',
          errors: ['Privacy consent is required to proceed with your quotation request.']
        });
      }

      // 3. Required Fields Validation
      const name = (data.name || data.fullName || data.full_name || '').trim();
      if (name.length < 2 || name.length > 100) {
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Please provide your name (minimum 2 characters).',
          errors: ['Please provide your name (minimum 2 characters).']
        });
      }

      const phone = (data.phone || data.phoneNumber || data.phone_number || '').trim();
      if (!isValidPhoneNumber(phone)) {
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Please enter a valid phone number (minimum 7 digits, including country/area code).',
          errors: ['Please enter a valid phone number (minimum 7 digits, including country/area code).']
        });
      }

      const email = (data.email || '').trim();
      if (email && !isValidEmail(email)) {
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Please enter a valid email address, or leave it blank if preferred.',
          errors: ['Please enter a valid email address, or leave it blank if preferred.']
        });
      }

      const destination = (data.destination || '').trim();
      if (destination.length < 2) {
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Please provide your holiday destination or region.',
          errors: ['Please provide your holiday destination or region.']
        });
      }

      const travelDates = (data.travelDates || data.travel_dates || data.departDate || data.departureDate || data.departure_date || '').trim();
      if (!travelDates) {
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Please provide your approximate or exact travel dates.',
          errors: ['Please provide your approximate or exact travel dates.']
        });
      }

      // Parse travellers count (e.g. 2, '2', '2 adults')
      const rawTravellers = data.numberOfTravellers || data.number_of_travellers || data.travellers || data.passengers || '';
      const numberOfTravellers = parseInt(String(rawTravellers).replace(/\D+/g, '') || rawTravellers, 10);
      if (isNaN(numberOfTravellers) || numberOfTravellers < 1) {
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Please specify the number of travellers (at least 1).',
          errors: ['Please specify the number of travellers (at least 1).']
        });
      }

      const numberOfDays = parseInt(data.numberOfDays || data.number_of_days || data.durationDays || data.duration || data.days, 10);
      if (isNaN(numberOfDays) || numberOfDays < 1) {
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Please specify the trip duration in days (minimum 1 day).',
          errors: ['Please specify the trip duration in days (minimum 1 day).']
        });
      }

      const budget = (data.budget || '').trim();
      if (!budget) {
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Please provide your budget range.',
          errors: ['Please provide your budget range.']
        });
      }

      const validTripTypes = ['family', 'honeymoon', 'solo', 'group', 'other'];
      const rawTripType = (data.tripType || data.trip_type || data.style || '').toLowerCase().trim();
      if (!rawTripType || !validTripTypes.includes(rawTripType)) {
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Please select a valid trip type (family, honeymoon, solo, group, or other).',
          errors: ['Invalid trip type. Allowed options: family, honeymoon, solo, group, or other.']
        });
      }
      const tripType = rawTripType;

      const additionalRequirements = (data.additionalRequirements || data.additional_requirements || data.notes || data.specialRequests || '').trim();

      // 4. Save to Persistent SQLite Database
      const savedEnquiry = db.saveHolidayEnquiry({
        name,
        phone,
        email: email || null,
        destination,
        travelDates,
        numberOfTravellers,
        numberOfDays,
        budget,
        tripType,
        additionalRequirements,
        consent: true
      }, {
        ip: clientIp,
        userAgent
      });

      // 5. Send Clean Response (No private customer data in response body!)
      return sendJsonResponse(res, 201, {
        success: true,
        referenceNo: savedEnquiry.reference_no,
        enquiryType: 'holiday',
        destination: savedEnquiry.destination,
        message: 'Your custom holiday package enquiry has been saved to our database. A specialist will curate 2-3 tailored options and prepare your itemized quotation.'
      });

    } catch (err) {
      console.error('[Holiday Submission Error]', err);
      return sendJsonResponse(res, 500, {
        success: false,
        error: 'Unable to process holiday enquiry. Please check your connection or try again.',
        errors: ['Unable to process holiday enquiry. Please check your connection or try again.']
      });
    }
  }

  // API ROUTE 4: POST /api/enquiries/general
  // Handles consultation requests from general contact or callback scheduler
  if (req.method === 'POST' && reqPath === '/api/enquiries/general') {
    const config = loadConfig();
    const maxReq = config.rateLimit?.maxRequestsPerWindow || 15;
    const windowMs = (config.rateLimit?.windowMinutes || 10) * 60 * 1000;

    if (!checkRateLimit(`enquiry:${clientIp}`, maxReq, windowMs)) {
      return sendJsonResponse(res, 429, {
        success: false,
        error: 'Too many requests. Please wait a few minutes before submitting another consultation request.',
        errors: ['Too many requests. Please wait a few minutes before submitting another consultation request.']
      });
    }

    try {
      const data = await parseJsonBody(req);

      const honeypotVal = data.website_url || data.websiteUrl || '';
      if (honeypotVal && String(honeypotVal).trim().length > 0) {
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Spam filter triggered.',
          errors: ['Spam filter triggered.']
        });
      }

      const consentVal = data.consent !== undefined ? data.consent : (data.privacy_consent !== undefined ? data.privacy_consent : data.privacyConsent);
      if (!consentVal || consentVal === 'false' || consentVal === false) {
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Please accept the privacy policy consent to proceed.',
          errors: ['Privacy consent is required to proceed.']
        });
      }

      const fullName = (data.fullName || data.full_name || data.name || '').trim();
      if (fullName.length < 2) {
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Please enter your name.',
          errors: ['Please enter your name.']
        });
      }

      const phone = (data.phone || data.phoneNumber || data.phone_number || '').trim();
      if (!isValidPhoneNumber(phone)) {
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Please enter a valid phone number.',
          errors: ['Please enter a valid phone number.']
        });
      }

      const email = (data.email || '').trim();
      if (email && !isValidEmail(email)) {
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Invalid email address.',
          errors: ['Invalid email address.']
        });
      }

      const savedEnquiry = db.saveGeneralEnquiry({
        fullName,
        phone,
        email: email || null,
        destination: (data.destination || data.subject || 'Custom Advisory').trim(),
        departureDate: (data.departDate || data.departureDate || data.travelDates || '').trim(),
        travellersCount: parseInt(data.passengers || data.numberOfTravellers || data.number_of_travellers, 10) || 1,
        budget: (data.budget || '').trim(),
        additionalRequirements: (data.message || data.notes || data.additionalRequirements || '').trim(),
        consent: true
      }, {
        ip: clientIp,
        userAgent
      });

      return sendJsonResponse(res, 201, {
        success: true,
        referenceNo: savedEnquiry.reference_no,
        enquiryType: 'general',
        destination: savedEnquiry.destination,
        message: 'Your consultation inquiry has been recorded. An advisor will contact you during our operating hours.'
      });
    } catch (err) {
      console.error('[General Submission Error]', err);
      return sendJsonResponse(res, 500, {
        success: false,
        error: 'Server error processing request.',
        errors: ['Server error processing request.']
      });
    }
  }

  // ========================================================
  // ADMIN AUTHENTICATION & MANAGEMENT ROUTES
  // ========================================================

  // ADMIN ROUTE 1: POST /api/admin/login
  if (req.method === 'POST' && reqPath === '/api/admin/login') {
    // Rate limit login attempts: max 30 per 5 mins per IP
    if (!checkRateLimit(`login:${clientIp}`, 30, 5 * 60 * 1000)) {
      return sendJsonResponse(res, 429, {
        success: false,
        error: 'Too many login attempts. Please wait 5 minutes before trying again.'
      });
    }

    try {
      const data = await parseJsonBody(req);
      const username = (data.username || '').trim();
      const password = (data.password || '').trim();

      if (!username || !password) {
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Please enter both username and password.'
        });
      }

      const user = db.getAdminUserByUsername(username);
      if (!user || !user.is_active) {
        return sendJsonResponse(res, 401, {
          success: false,
          error: 'Invalid credentials. Please verify your login details.'
        });
      }

      const isValid = auth.verifyPassword(password, user.password_hash, user.password_salt);
      if (!isValid) {
        return sendJsonResponse(res, 401, {
          success: false,
          error: 'Invalid credentials. Please verify your login details.'
        });
      }

      // Generate cryptographically random 32-byte session token
      const token = auth.generateSessionToken();
      db.createSession(user.id, token, clientIp, userAgent, 24);
      db.updateAdminLastLogin(user.id);

      // Set HttpOnly, SameSite=Lax cookie
      res.setHeader('Set-Cookie', `tgc_admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`);

      return sendJsonResponse(res, 200, {
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role: user.role
        }
      });
    } catch (err) {
      console.error('[Admin Login Error]', err);
      return sendJsonResponse(res, 500, { success: false, error: 'Internal login processing error.' });
    }
  }

  // ADMIN ROUTE 2: POST /api/admin/logout
  if (req.method === 'POST' && reqPath === '/api/admin/logout') {
    const cookies = auth.parseCookies(req);
    const token = cookies.tgc_admin_token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') ? req.headers.authorization.slice(7).trim() : null);
    if (token) {
      db.deleteSession(token);
    }
    res.setHeader('Set-Cookie', 'tgc_admin_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
    return sendJsonResponse(res, 200, { success: true, message: 'Logged out successfully.' });
  }

  // ADMIN ROUTE 3: GET /api/admin/me
  if (req.method === 'GET' && reqPath === '/api/admin/me') {
    const admin = requireAdminAuth(req, res);
    if (!admin) return;
    return sendJsonResponse(res, 200, {
      success: true,
      user: {
        id: admin.user_id,
        username: admin.username,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role
      }
    });
  }

  // ADMIN ROUTE 4: GET /api/admin/agents
  if (req.method === 'GET' && reqPath === '/api/admin/agents') {
    const admin = requireAdminAuth(req, res);
    if (!admin) return;
    const agents = db.getAllAdminUsers();
    return sendJsonResponse(res, 200, {
      success: true,
      agents: agents.map(a => ({ id: a.id, username: a.username, full_name: a.full_name, role: a.role }))
    });
  }

  // ADMIN ROUTE 5: GET /api/admin/enquiries/stats
  if (req.method === 'GET' && reqPath === '/api/admin/enquiries/stats') {
    const admin = requireAdminAuth(req, res);
    if (!admin) return;
    return sendJsonResponse(res, 200, {
      success: true,
      stats: db.getEnquiryStats()
    });
  }

  // ADMIN ROUTE 6: GET /api/admin/enquiries (Search, filter, paginate)
  if (req.method === 'GET' && reqPath === '/api/admin/enquiries') {
    const admin = requireAdminAuth(req, res);
    if (!admin) return;

    const q = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';
    const status = searchParams.get('status') || 'all';
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 500);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const result = db.searchEnquiries({ query: q, type, status, limit, offset });
    return sendJsonResponse(res, 200, {
      success: true,
      ...result
    });
  }

  // ADMIN ROUTE 7: GET /api/admin/enquiries/:id
  const enquiryDetailMatch = reqPath.match(/^\/api\/admin\/enquiries\/(\d+)$/);
  if (req.method === 'GET' && enquiryDetailMatch) {
    const admin = requireAdminAuth(req, res);
    if (!admin) return;

    const id = parseInt(enquiryDetailMatch[1], 10);
    const enquiry = db.getEnquiryById(id);
    if (!enquiry) {
      return sendJsonResponse(res, 404, { success: false, error: 'Enquiry not found.' });
    }
    const notes = db.getEnquiryNotes(id);
    return sendJsonResponse(res, 200, { success: true, enquiry, notes });
  }

  // ADMIN ROUTE 8: POST /api/admin/enquiries/:id/status
  const enquiryStatusMatch = reqPath.match(/^\/api\/admin\/enquiries\/(\d+)\/status$/);
  if (req.method === 'POST' && enquiryStatusMatch) {
    const admin = requireAdminAuth(req, res);
    if (!admin) return;

    const id = parseInt(enquiryStatusMatch[1], 10);
    try {
      const data = await parseJsonBody(req);
      const newStatus = data.status;
      const updated = db.updateEnquiryStatus(id, newStatus);
      db.addEnquiryNote(id, admin.user_id, admin.full_name, `Status updated to "${newStatus}" by ${admin.full_name}`);
      return sendJsonResponse(res, 200, { success: true, enquiry: updated });
    } catch (err) {
      return sendJsonResponse(res, 400, { success: false, error: err.message });
    }
  }

  // ADMIN ROUTE 9: POST /api/admin/enquiries/:id/assign
  const enquiryAssignMatch = reqPath.match(/^\/api\/admin\/enquiries\/(\d+)\/assign$/);
  if (req.method === 'POST' && enquiryAssignMatch) {
    const admin = requireAdminAuth(req, res);
    if (!admin) return;

    const id = parseInt(enquiryAssignMatch[1], 10);
    try {
      const data = await parseJsonBody(req);
      const agentId = data.agentId ? parseInt(data.agentId, 10) : null;
      const agentName = data.agentName || null;
      const updated = db.assignEnquiry(id, agentId, agentName);
      db.addEnquiryNote(id, admin.user_id, admin.full_name, `Assigned to ${agentName || 'Unassigned'} by ${admin.full_name}`);
      return sendJsonResponse(res, 200, { success: true, enquiry: updated });
    } catch (err) {
      return sendJsonResponse(res, 400, { success: false, error: err.message });
    }
  }

  // ADMIN ROUTE 10: POST /api/admin/enquiries/:id/notes
  const enquiryNoteMatch = reqPath.match(/^\/api\/admin\/enquiries\/(\d+)\/notes$/);
  if (req.method === 'POST' && enquiryNoteMatch) {
    const admin = requireAdminAuth(req, res);
    if (!admin) return;

    const id = parseInt(enquiryNoteMatch[1], 10);
    try {
      const data = await parseJsonBody(req);
      const noteText = data.note;
      const newNote = db.addEnquiryNote(id, admin.user_id, admin.full_name, noteText);
      return sendJsonResponse(res, 201, { success: true, note: newNote });
    } catch (err) {
      return sendJsonResponse(res, 400, { success: false, error: err.message });
    }
  }

  // ADMIN ROUTE 11: GET /api/admin/packages
  if (req.method === 'GET' && reqPath === '/api/admin/packages') {
    const admin = requireAdminAuth(req, res);
    if (!admin) return;
    const packages = db.getAllPackages(true);
    return sendJsonResponse(res, 200, { success: true, packages });
  }

  // ADMIN ROUTE 12: POST /api/admin/packages
  if (req.method === 'POST' && reqPath === '/api/admin/packages') {
    const admin = requireAdminAuth(req, res);
    if (!admin) return;

    try {
      const data = await parseJsonBody(req);
      const pkg = db.savePackage(data);
      return sendJsonResponse(res, 201, { success: true, package: pkg });
    } catch (err) {
      return sendJsonResponse(res, 400, { success: false, error: err.message });
    }
  }

  // ADMIN ROUTE 13: PUT /api/admin/packages/:id
  const packageEditMatch = reqPath.match(/^\/api\/admin\/packages\/([a-zA-Z0-9\-_]+)$/);
  if (req.method === 'PUT' && packageEditMatch) {
    const admin = requireAdminAuth(req, res);
    if (!admin) return;

    const id = packageEditMatch[1];
    try {
      const data = await parseJsonBody(req);
      const updated = db.updatePackage(id, data);
      return sendJsonResponse(res, 200, { success: true, package: updated });
    } catch (err) {
      return sendJsonResponse(res, 400, { success: false, error: err.message });
    }
  }

  // ADMIN ROUTE 14: DELETE /api/admin/packages/:id
  if (req.method === 'DELETE' && packageEditMatch) {
    const admin = requireAdminAuth(req, res);
    if (!admin) return;

    const id = packageEditMatch[1];
    db.deletePackage(id);
    return sendJsonResponse(res, 200, { success: true });
  }

  // ADMIN ROUTE 15: GET /api/admin/destinations
  if (req.method === 'GET' && reqPath === '/api/admin/destinations') {
    const admin = requireAdminAuth(req, res);
    if (!admin) return;
    const destinations = db.getAllDestinations(false);
    return sendJsonResponse(res, 200, { success: true, destinations });
  }

  // ADMIN ROUTE 16: POST /api/admin/destinations
  if (req.method === 'POST' && reqPath === '/api/admin/destinations') {
    const admin = requireAdminAuth(req, res);
    if (!admin) return;

    try {
      const data = await parseJsonBody(req);
      const dest = db.saveDestination(data);
      return sendJsonResponse(res, 201, { success: true, destination: dest });
    } catch (err) {
      return sendJsonResponse(res, 400, { success: false, error: err.message });
    }
  }

  // ADMIN ROUTE 17: GET /api/admin/quotations
  if (req.method === 'GET' && reqPath === '/api/admin/quotations') {
    const admin = requireAdminAuth(req, res);
    if (!admin) return;
    const quotations = db.getAllQuotations(100);
    return sendJsonResponse(res, 200, { success: true, quotations });
  }

  // ADMIN ROUTE 18: POST /api/admin/quotations
  if (req.method === 'POST' && reqPath === '/api/admin/quotations') {
    const admin = requireAdminAuth(req, res);
    if (!admin) return;

    try {
      const data = await parseJsonBody(req);
      const quote = db.createQuotation({
        ...data,
        created_by_id: admin.user_id,
        agent_name: admin.full_name
      });
      return sendJsonResponse(res, 201, { success: true, quotation: quote });
    } catch (err) {
      return sendJsonResponse(res, 400, { success: false, error: err.message });
    }
  }

  // ========================================================
  // PUBLIC QUOTATIONS & PACKAGES ROUTES
  // ========================================================

  // PUBLIC ROUTE 1: GET /api/quotations/view/:token (Secure shareable quote view)
  const quoteViewMatch = reqPath.match(/^\/api\/quotations\/view\/([a-zA-Z0-9\-_]+)$/);
  if (req.method === 'GET' && quoteViewMatch) {
    const token = quoteViewMatch[1];
    const quote = db.getQuotationByShareToken(token) || db.getQuotationById(token);

    if (!quote) {
      return sendJsonResponse(res, 404, { success: false, error: 'Quotation proposal not found or link has expired.' });
    }

    // Privacy Protection: Never expose private customer phone or personal email on public quotation URL
    const sanitizedQuote = {
      id: quote.id,
      customer_name: quote.customer_name,
      destination: quote.destination,
      title: quote.title,
      travel_options_json: quote.travel_options_json,
      total_price: quote.total_price,
      price_breakdown: quote.price_breakdown,
      validity_date: quote.validity_date,
      inclusions_json: quote.inclusions_json,
      exclusions_json: quote.exclusions_json,
      cancellation_conditions: quote.cancellation_conditions,
      agent_name: quote.agent_name,
      status: quote.status,
      created_at: quote.created_at
    };

    return sendJsonResponse(res, 200, { success: true, quotation: sanitizedQuote });
  }

  // PUBLIC ROUTE 2: GET /api/packages (Live catalog from SQLite)
  if (req.method === 'GET' && reqPath === '/api/packages') {
    const packages = db.getAllPackages(false);
    return sendJsonResponse(res, 200, { success: true, packages });
  }

  // PUBLIC ROUTE 3: GET /api/packages/:id
  const packagePublicMatch = reqPath.match(/^\/api\/packages\/([a-zA-Z0-9\-_]+)$/);
  if (req.method === 'GET' && packagePublicMatch) {
    const id = packagePublicMatch[1];
    const pkg = db.getPackageById(id);
    if (!pkg) {
      return sendJsonResponse(res, 404, { success: false, error: 'Package not found.' });
    }
    return sendJsonResponse(res, 200, { success: true, package: pkg });
  }

  // Static File Serving with URL aliases
  let targetFile = reqPath === '/' ? 'index.html' : reqPath.replace(/^\//, '');
  if (targetFile === 'admin' || targetFile === 'admin/') {
    targetFile = 'admin.html';
  } else if (targetFile === 'quote' || targetFile === 'quote/') {
    targetFile = 'quote.html';
  } else if (targetFile === 'cancellation-refund.html') {
    targetFile = 'cancellation-refund-policy.html';
  }
  let filePath = path.join(PUBLIC_DIR, targetFile);

  // Prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(`<h1>404 Not Found</h1><p>The requested file ${escapeHtml(reqPath)} was not found.</p><p><a href="/index.html">Back to Home</a></p>`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Bootstrap initial administrator from environment variables if specified
if (process.env.ADMIN_BOOTSTRAP_USER && process.env.ADMIN_BOOTSTRAP_PASS) {
  try {
    const existing = db.getAdminUserByUsername(process.env.ADMIN_BOOTSTRAP_USER);
    if (!existing) {
      const { hash, salt } = auth.hashPassword(process.env.ADMIN_BOOTSTRAP_PASS);
      db.createAdminUser({
        username: process.env.ADMIN_BOOTSTRAP_USER,
        email: process.env.ADMIN_BOOTSTRAP_EMAIL || 'admin@travelgrowconsultancy.com',
        fullName: process.env.ADMIN_BOOTSTRAP_NAME || 'TravelGrow Administrator',
        role: 'admin',
        passwordHash: hash,
        passwordSalt: salt
      });
      console.log(`[BOOTSTRAP] Created admin account: ${process.env.ADMIN_BOOTSTRAP_USER}`);
    }
  } catch (err) {
    console.error('[BOOTSTRAP Error]', err.message);
  }
}

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`TravelGrow Consultancy local server running at http://localhost:${PORT}/`);
    console.log(`Persistent SQLite database active at data/enquiries.db`);
  });
}

module.exports = server;
