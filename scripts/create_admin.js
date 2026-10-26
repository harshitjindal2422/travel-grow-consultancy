#!/usr/bin/env node
/**
 * TravelGrow Consultancy - Admin Account Setup Utility
 * Securely creates an initial or additional admin account with scrypt password hashing.
 * 
 * Usage via CLI arguments:
 *   node scripts/create_admin.js <username> <email> <password> [fullName] [role]
 * 
 * Usage via Environment Variables:
 *   ADMIN_USER=admin ADMIN_EMAIL=admin@travelgrowconsultancy.com ADMIN_PASS="SecureP@ssw0rd!" node scripts/create_admin.js
 */

const path = require('path');
const db = require('../db');
const { hashPassword } = require('../auth');

function printUsage() {
  console.log(`
TravelGrow Consultancy - Admin Account Setup CLI
================================================
Usage:
  node scripts/create_admin.js <username> <email> <password> [fullName] [role]

Arguments:
  username    Unique handle for login (e.g. 'tgc_admin', min 3 characters)
  email       Official agency email address
  password    High-entropy password (minimum 8 characters)
  fullName    (Optional) Display name (default: "TravelGrow Administrator")
  role        (Optional) Role: 'admin' | 'senior_agent' | 'agent' (default: 'admin')

Or via environment variables:
  ADMIN_USER=... ADMIN_EMAIL=... ADMIN_PASS=... node scripts/create_admin.js
`);
}

async function main() {
  const args = process.argv.slice(2);

  const username = (args[0] || process.env.ADMIN_USER || process.env.ADMIN_USERNAME || '').trim();
  const email = (args[1] || process.env.ADMIN_EMAIL || '').trim();
  const password = (args[2] || process.env.ADMIN_PASS || process.env.ADMIN_PASSWORD || '').trim();
  const fullName = (args[3] || process.env.ADMIN_NAME || 'TravelGrow Administrator').trim();
  const role = (args[4] || process.env.ADMIN_ROLE || 'admin').trim().toLowerCase();

  if (!username || !email || !password) {
    console.error('Error: Username, email, and password are required.');
    printUsage();
    process.exit(1);
  }

  if (username.length < 3) {
    console.error('Error: Username must be at least 3 characters long.');
    process.exit(1);
  }

  if (!email.includes('@') || !email.includes('.')) {
    console.error('Error: Please provide a valid email address.');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('Error: Password must be at least 8 characters long for security compliance.');
    process.exit(1);
  }

  const validRoles = ['admin', 'senior_agent', 'agent'];
  if (!validRoles.includes(role)) {
    console.error(`Error: Invalid role "${role}". Allowed roles: ${validRoles.join(', ')}`);
    process.exit(1);
  }

  try {
    const existing = db.getAdminUserByUsername(username);
    if (existing) {
      console.log(`[UPDATE] Admin user "${username}" already exists. Updating password and details...`);
      const { hash, salt } = hashPassword(password);
      db.updateAdminUser(existing.id, {
        email,
        full_name: fullName,
        role,
        password_hash: hash,
        password_salt: salt,
        is_active: 1
      });
      console.log(`Successfully updated admin user: ${username} (${email}) with role: [${role}]`);
      return;
    }

    const { hash, salt } = hashPassword(password);
    const newUser = db.createAdminUser({
      username,
      email,
      fullName,
      role,
      passwordHash: hash,
      passwordSalt: salt
    });

    console.log('\n======================================================');
    console.log('  SUCCESS: TravelGrow Admin Account Created');
    console.log('======================================================');
    console.log(`  User ID:    ${newUser.id}`);
    console.log(`  Username:   ${newUser.username}`);
    console.log(`  Email:      ${newUser.email}`);
    console.log(`  Full Name:  ${newUser.full_name}`);
    console.log(`  Role:       ${newUser.role}`);
    console.log(`  Created At: ${newUser.created_at}`);
    console.log('------------------------------------------------------');
    console.log('  Security notice: Plain text password was securely');
    console.log('  hashed with scrypt and is NEVER stored in database.');
    console.log('======================================================\n');
  } catch (err) {
    console.error('Fatal error setting up admin user:', err.message);
    process.exit(1);
  }
}

main();
