# TravelGrow Consultancy — Admin Dashboard & Security Setup Guide

This guide details how to initialize, configure, and maintain the secure administrative portal and quotation engine for **TravelGrow Consultancy** (`travelgrowconsultancy.com`).

---

## 🛡️ Security Architecture & Privacy Safeguards

1. **Zero Hardcoded Secrets**: No default administrator passwords or API keys are stored in code repositories or publicly accessible bundles.
2. **Cryptographic Password Hashing**: Passwords are saved with **scrypt** key derivation (`N: 16384, r: 8, p: 1`) combined with a 16-byte cryptographically random salt (`node:crypto`). Plain text passwords are never stored or logged.
3. **Timing-Attack Resistance**: Authentication utilizes `crypto.timingSafeEqual` to eliminate timing side-channel attacks during credential verification.
4. **Session Token Security**: Sessions generate 32-byte cryptographically secure tokens stored in the `admin_sessions` SQLite table with a 24-hour expiration window. Delivered via `HttpOnly`, `SameSite=Lax` cookies and/or `Authorization: Bearer <token>` headers.
5. **Strict Route Authorization**: Every `/api/admin/*` route requires a valid session token. Unauthorized requests immediately receive `401 Unauthorized`.
6. **Customer Privacy Protection**: Public customer quotation links (`/quote.html?token=...`) use 24-byte unguessable cryptographic tokens and automatically strip sensitive personal phone numbers and private email addresses from public response payloads.

---

## 🗄️ Database Architecture & Storage

All data is persistently stored in [`data/enquiries.db`](file:///d:/travel-grow-consltancy/data/enquiries.db) using Node.js v22's built-in `node:sqlite` (`DatabaseSync`), requiring **zero external npm dependencies**.

### Relational Schema:
- **`admin_users`**: Admin & agent profiles, scrypt hash, salt, role (`admin`, `senior_agent`, `agent`), active status, last login.
- **`admin_sessions`**: Cryptographic session tokens, user ID, client IP, user agent, expiration timestamp.
- **`enquiries`**: All flight, custom holiday, and general advisory submissions, passenger counts, cabin/budget preferences, assigned agent, status (`New`, `Contacted`, `Quote Sent`, `Confirmed`, `Completed`, `Cancelled`).
- **`enquiry_notes`**: Internal agent notes thread with author ID, author name, timestamp, and audit trail.
- **`holiday_packages`**: Admin-curated holiday packages with titles, destinations, regions, indicative prices, inclusions, exclusions, and hero images.
- **`destinations`**: Featured destination highlights with flight and package sample prices.
- **`quotations`**: Official client proposals with itemized travel options, total prices, validity windows, inclusions, exclusions, cancellation conditions, and unique `share_token`.
- **`agency_notifications`**: Delivery audit log for incoming client enquiries.

---

## 🔑 Initial Admin Account Setup

### Method 1: Using the Interactive CLI Script (Recommended)

Run the dedicated setup script:

```powershell
node scripts/create_admin.js <username> <email> <password> [fullName] [role]
```

**Example:**
```powershell
node scripts/create_admin.js tg_admin admin@travelgrowconsultancy.com "YourSecurePass2026!" "Sarah Jenkins" admin
```

- **Password Requirements**: Minimum 8 characters.
- **Allowed Roles**: `admin`, `senior_agent`, `agent`.
- **Update Behavior**: If the username already exists, running the script updates the password and details.

### Method 2: Automatic Bootstrap via Environment Variables

For automated container deployments (Docker, Render, AWS, Vercel), supply environment variables before starting the server:

```powershell
$env:ADMIN_BOOTSTRAP_USER = "tg_admin"
$env:ADMIN_BOOTSTRAP_EMAIL = "admin@travelgrowconsultancy.com"
$env:ADMIN_BOOTSTRAP_PASS = "YourSecurePass2026!"
$env:ADMIN_BOOTSTRAP_NAME = "Sarah Jenkins"

node server.js
```

The server automatically creates the admin account on first start if it does not already exist.

---

## ⚙️ Environment Variables Reference

| Variable | Description | Default | Example |
| :--- | :--- | :--- | :--- |
| `PORT` | Local HTTP listening port | `3000` | `8080` |
| `WHATSAPP_PHONE` | Verified international WhatsApp business number | *Empty* (Safe unconfigured notice) | `+442079460991` |
| `ADMIN_BOOTSTRAP_USER` | Initial admin username for auto-creation | *None* | `tg_director` |
| `ADMIN_BOOTSTRAP_PASS` | Initial admin password for auto-creation | *None* | `HighEntropyP@ss2026!` |
| `ADMIN_BOOTSTRAP_EMAIL` | Initial admin email address | `admin@travelgrowconsultancy.com` | `admin@travelgrowconsultancy.com` |
| `ADMIN_BOOTSTRAP_NAME` | Initial admin display name | `TravelGrow Administrator` | `Sarah Jenkins` |

> [!IMPORTANT]
> **Production Safety Guarantee**: Never set a placeholder or fake phone number in `WHATSAPP_PHONE`. When left empty, the system safely guides users to the online quotation form or official email without misdialing.

---

## 🖥️ Using the Admin Dashboard

1. Navigate to `http://localhost:3000/admin` (or `/admin.html`).
2. Log in with your admin username and password.
3. Access the core administrative features:
   - **Overview**: Real-time KPI counters (`New`, `Contacted`, `Quotes Sent`, `Confirmed`) and recent activity snapshot.
   - **Enquiries**: Search across reference numbers, client names, phone, email, or destinations. Filter by enquiry type (`Flights`, `Holidays`, `General`) and status (`New`, `Contacted`, `Quote Sent`, `Confirmed`, `Completed`, `Cancelled`).
   - **Customer Details Drawer**: Open any enquiry to review complete passenger information, update status, assign an agent, view/add private notes, and trigger quotation creation.
   - **Holiday Packages**: Create and edit holiday packages, update indicative prices, edit inclusions/exclusions, and manage hero images.
   - **Destinations**: Maintain featured destinations and pricing guidelines.
   - **Quotations**: Record bespoke travel options, total prices, validity windows, inclusions, exclusions, and cancellation conditions. Generate secure shareable links (`/quote.html?token=...`) and download/print customer proposals.
   - **Mobile Friendly**: Features a responsive navigation drawer, touch controls, and optimized layout for mobile smartphones and tablets.

---

## 🧪 Automated Verification Test Suite

Two comprehensive test suites verify end-to-end functionality:

```powershell
# 1. Verify Public Enquiry Forms (28 tests)
node test_enquiries.js

# 2. Verify Secure Admin Dashboard & Quotations (23 tests)
node test_admin.js
```

**Total Verified**: 51/51 automated tests passing with 100% success.

---

## 💾 Database Backup & Disaster Recovery

The entire database is contained within a single file:
`data/enquiries.db`

### Recommended Backup Procedure:
```powershell
# Standard file copy backup
Copy-Item data/enquiries.db -Destination "data/backups/enquiries_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').db"
```
The agency audit log [`data/agency_inbox.log`](file:///d:/travel-grow-consltancy/data/agency_inbox.log) serves as an independent, append-only operational text backup of all incoming requests.
