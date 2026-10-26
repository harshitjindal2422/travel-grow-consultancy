// TravelGrow Consultancy - Authentication & Security Module
// Secure password hashing with scrypt and random salts
// Cryptographic session management using Node.js built-in node:crypto
const crypto = require('crypto');

const SALT_BYTES = 16;
const HASH_BYTES = 64;
const SCRYPT_OPTIONS = {
  N: 16384,
  r: 8,
  p: 1,
  maxmem: 32 * 1024 * 1024
};

/**
 * Hash a plain text password using scrypt and a cryptographically random salt
 */
function hashPassword(password) {
  if (typeof password !== 'string' || password.length < 8) {
    throw new Error('Password must be a string with at least 8 characters');
  }
  const salt = crypto.randomBytes(SALT_BYTES).toString('hex');
  const hash = crypto.scryptSync(password, salt, HASH_BYTES, SCRYPT_OPTIONS).toString('hex');
  return { hash, salt };
}

/**
 * Verify a plain text password against a stored scrypt hash and salt
 * Uses crypto.timingSafeEqual to prevent timing attacks
 */
function verifyPassword(password, storedHash, storedSalt) {
  if (!password || !storedHash || !storedSalt) return false;
  try {
    const derived = crypto.scryptSync(password, storedSalt, HASH_BYTES, SCRYPT_OPTIONS);
    const hashBuffer = Buffer.from(storedHash, 'hex');
    if (derived.length !== hashBuffer.length) return false;
    return crypto.timingSafeEqual(derived, hashBuffer);
  } catch (err) {
    console.error('[Auth Verify Error]', err.message);
    return false;
  }
}

/**
 * Generate a cryptographically secure random session token
 */
function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate a cryptographically secure random public share token for quotations
 */
function generateShareToken() {
  return crypto.randomBytes(24).toString('hex');
}

/**
 * Parse cookies from HTTP request header
 */
function parseCookies(req) {
  const list = {};
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return list;

  cookieHeader.split(';').forEach(cookie => {
    let [name, ...rest] = cookie.split('=');
    name = name?.trim();
    if (!name) return;
    const value = rest.join('=').trim();
    if (!value) return;
    list[name] = decodeURIComponent(value);
  });
  return list;
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateSessionToken,
  generateShareToken,
  parseCookies
};
