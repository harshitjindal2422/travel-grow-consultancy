# TravelGrow Consultancy (travelgrowconsultancy.com)

A complete, modern, professional, and responsive travel agency website tailored specifically for the manual quotation and advisory business model.

---

## 🧭 Business Model Overview

**TravelGrow Consultancy is an agent-assisted travel consultancy, NOT an automated instant booking engine.**

1. **Client Enquiry**: Travelers submit their flight or bespoke holiday wishes via interactive forms, phone, or WhatsApp.
2. **Manual Deal Research**: Senior human travel agents research global airline consolidator net fares, flexible date routings (+/- 1–3 days), and negotiated boutique hotel contracts.
3. **Itemized Written Quotations**: Clear, itemized proposals are sent to clients via Email and WhatsApp within 2–4 business hours (with zero upfront fees).
4. **Iterative Refinement**: Clients refine dates, room categories, or airline preferences directly with their dedicated consultant.
5. **Authorized Booking**: Formal payment authorization and ticketing occur only after the customer reviews and signs off on the final itinerary.
6. **24/7 Journey Concierge**: Dedicated agent support throughout travels for flight changes or emergency rerouting.

---

## 🎨 Design & Aesthetic Foundations

- **Primary Colors**: Deep Navy Blue (`#07101E`, `#0A192F`, `#0D203D`), crisp white surfaces, and warm orange accents (`#FF6B35`, `#FF844B`).
- **Typography**: Google Fonts [`Outfit`](https://fonts.google.com/specimen/Outfit) for headings & titles and [`Plus Jakarta Sans`](https://fonts.google.com/specimen/Plus+Jakarta+Sans) for body text and form controls.
- **Hero Headline**: **"Better Travel Deals, Made Personal"**
- **Homepage CTAs**: **"Find My Best Deal"** (Primary) & **"Talk to a Travel Expert"** (Secondary).
- **Transparency & Integrity**: Strict adherence to honest communication—no fabricated certifications, no fake client reviews, and clear demonstration disclaimers for placeholder data.

---

## 📂 Complete Site Directory

| Page | File | Description |
| :--- | :--- | :--- |
| **Home** | [index.html](file:///d:/travel-grow-consltancy/index.html) | Flagship landing page with headline *"Better Travel Deals, Made Personal"*, *"Find My Best Deal"* & *"Talk to a Travel Expert"* CTAs, interactive enquiry hub, flight assistance highlights, popular destinations showcase, sample holiday packages, 4-step journey, benefits table, FAQs, and contact section. |
| **Flight Deals** | [flights.html](file:///d:/travel-grow-consltancy/flights.html) | Dedicated Flight Enquiry Portal with multi-city stopover options, consolidator net fares explainer, cabin comparisons, airline alliance filters, and route guidance. |
| **Holiday Packages** | [holidays.html](file:///d:/travel-grow-consltancy/holidays.html) | Curated Holiday Packages catalog with interactive region filters (Asia, Europe, Middle East, Tropical Islands), inclusions, and quotation triggers. |
| **Package Details** | [package-details.html](file:///d:/travel-grow-consltancy/package-details.html?id=pkg-bali-escape) | Dynamic destination & package detail view featuring high-res scene gallery, day-by-day interactive itinerary timeline, inclusions/exclusions checklist, and pre-filled quotation sidebar. |
| **Plan My Trip** | [plan-my-trip.html](file:///d:/travel-grow-consltancy/plan-my-trip.html) | Interactive 4-step custom travel builder wizard (Travel Style &rarr; Duration &amp; Timing &rarr; Party &amp; Stays &rarr; Budget &amp; Delivery) with unique reference code generation. |
| **How It Works** | [how-it-works.html](file:///d:/travel-grow-consltancy/how-it-works.html) | Deep dive into the 6-stage manual consultation model, transparent fee policy, ticket authorization guarantee, and 24/7 concierge support. |
| **About Us** | [about.html](file:///d:/travel-grow-consltancy/about.html) | Company ethos, human consultant philosophy, transparency pledge, and representative specialist consultant profiles. |
| **FAQs** | [faqs.html](file:///d:/travel-grow-consltancy/faqs.html) | Comprehensive searchable knowledge base with category filter pills (Consultation Model, Flights, Holidays, Payments, Trip Support). |
| **Contact Us** | [contact.html](file:///d:/travel-grow-consltancy/contact.html) | Dedicated Contact &amp; Callback Scheduler Desk with multi-channel inquiry options (Email, Phone, WhatsApp). |
| **Privacy Policy** | [privacy-policy.html](file:///d:/travel-grow-consltancy/privacy-policy.html) | GDPR/UK DPA compliant privacy policy detailing data collection, processing, and passenger rights. |
| **Terms & Conditions** | [terms-conditions.html](file:///d:/travel-grow-consltancy/terms-conditions.html) | Complete terms governing agency advisory, obligation-free quotations, price validity windows, and passenger responsibilities. |
| **Cancellation & Refund Policy** | [cancellation-refund-policy.html](file:///d:/travel-grow-consltancy/cancellation-refund-policy.html) | Transparent policy on voluntary cancellations, airline disruption refunds, and concierge rebooking assistance. |
| **Admin Dashboard** | [admin.html](file:///d:/travel-grow-consltancy/admin.html) (`/admin`) | Secure, authenticated administrative portal for travel consultants: live enquiry management, search/filters, customer details drawer, internal notes, agent assignment, status transitions, holiday package/destination editor, and quotation generator. |
| **Customer Quotation** | [quote.html](file:///d:/travel-grow-consltancy/quote.html) (`/quote`) | Shareable, privacy-safe, branded customer quotation view with itemized travel options, pricing, validity countdown, inclusions/exclusions, cancellation policy, and print-to-PDF support. |

---

## 🚀 Running Locally & Testing
 
To launch the local web server:
 
```powershell
# Start local Node.js server with SQLite database persistence
node server.js
```
 
Then visit:
- **Public Website**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Setup & Security Guide**: See [SETUP_GUIDE.md](file:///d:/travel-grow-consltancy/SETUP_GUIDE.md) for full configuration, CLI account creation, and environment variable reference.

### Running Automated Test Suites

Two comprehensive automated test suites (51 assertions total) verify security, client/server validation, spam honeypot filters, privacy consent, SQLite persistence, admin authentication, RBAC, package CRUD, and quotation generation:

```powershell
# 1. Enquiry intake, validation, honeypot, and notification tests (28 tests)
node test_enquiries.js

# 2. Admin authentication, session tokens, enquiry filters, package CRUD, and quotation engine tests (23 tests)
node test_admin.js
```

---

## 💾 Functional Enquiry Engine & Persistence Architecture

The site features genuine, persistent enquiry processing across all client intake touchpoints. **Submissions are never simulated; all consultations are written directly to a persistent SQLite database.**

### 1. Database Layer (`db.js` & `data/enquiries.db`)
- Powered by Node.js v22 built-in `node:sqlite` (`DatabaseSync`), requiring zero external npm dependencies.
- **`enquiries` Table**: Stores all flight, custom holiday, and advisory requests with unique reference numbers (`TGC-FLT-2026-XXXX`, `TGC-HOL-2026-XXXX`, `TGC-GEN-2026-XXXX`), full passenger breakdown, travel dates, cabin/budget preferences, and privacy consent logs.
- **`agency_notifications` Table**: Records internal agency delivery status (`delivered`, timestamp, summary).
- **Agency Audit Inbox**: Every enquiry automatically appends an itemized operational briefing to [`data/agency_inbox.log`](file:///d:/travel-grow-consltancy/data/agency_inbox.log).

### 2. Enquiry Specifications & Field Validation

#### ✈️ Flight Enquiries (`POST /api/enquiries/flight`)
- **Required Fields**:
  - Full Name (min 2 characters)
  - Phone Number (valid national or international format, min 7 digits)
  - Email (optional, validated if supplied)
  - Departure City / Airport
  - Destination City / Airport
  - Departure Date (must be today or in the future)
  - Return Date (required if trip type is `return`; must be on or after departure date)
  - Trip Type (`return`, `oneway`, `multicity`)
  - Number of Adults (min 1) & Children (min 0)
  - Cabin Preference (`Economy`, `Premium Economy`, `Business`, `First`)
  - Approximate Budget (required)
  - Privacy Policy Consent (mandatory checkbox)
  - Hidden Spam Honeypot (`website_url` must be empty)

#### 🏝️ Custom Holiday Enquiries (`POST /api/enquiries/holiday`)
- **Required Fields**:
  - Name (min 2 characters)
  - Phone Number (min 7 digits)
  - Email (optional, validated if supplied)
  - Destination / Region
  - Travel Dates / Season
  - Number of Travellers (min 1)
  - Number of Days (min 1 day)
  - Approximate Budget
  - Trip Type (`family`, `honeymoon`, `solo`, `group`, or `other`)
  - Additional Requirements (dietary, room preferences, private transfers, etc.)
  - Privacy Policy Consent (mandatory checkbox)
  - Hidden Spam Honeypot (`website_url` must be empty)

---

## 💬 WhatsApp Integration & Production Safety

**Production Safety Guarantee: Never use a fake phone number in production.**

- Configured via [`config.json`](file:///d:/travel-grow-consltancy/config.json) under `whatsapp.configured` and `whatsapp.phoneNumber`, or via the environment variable `WHATSAPP_PHONE`.
- **Default State**: `whatsapp.configured: false`. When unconfigured, clicking any WhatsApp button displays an informative modal explaining that the official WhatsApp Business desk is pending automated verification, directing the customer to submit an enquiry online or contact [`enquiries@travelgrowconsultancy.com`](mailto:enquiries@travelgrowconsultancy.com). It **never dials or navigates to a placeholder or dummy phone number**.
- **Live State**: Once a verified WhatsApp business number is configured, buttons automatically generate secure direct chat URLs: `https://wa.me/<CLEAN_PHONE>?text=<PREFILLED_MESSAGE>`.

---

## 🔒 Security & Data Privacy

1. **Zero Data Leakage**: Customer phone numbers, email addresses, and full names are **never** exposed in URLs, browser console logs, or public pages.
2. **Sanitized API Responses**: All submission endpoints return `{ success: true, referenceNo, enquiryType, destination, message }` without echoing personal customer identifiers in the public payload.
3. **Spam Protection**: CSS-hidden, tab-indexed honeypot input field (`website_url`) blocks automated scrapers and bots.
4. **Rate Limiting**: In-memory IP window tracker blocks abusive request flooding.
5. **GDPR / Privacy Consent**: All intake forms require explicit opt-in consent linking to the [Privacy Policy](file:///d:/travel-grow-consltancy/privacy-policy.html).

---

## 🔒 Demonstration Content Notice

All corporate addresses (`Suite 402, St. George's Travel Plaza, London EC2A 4NE`), sample package prices, and representative profiles represent illustrative demonstration content for TravelGrow Consultancy. Genuine itineraries, flight tickets, and customer agreements are created upon individual client engagement.

