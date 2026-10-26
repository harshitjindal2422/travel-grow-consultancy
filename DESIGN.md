# TravelGrow Consultancy — DESIGN.md

**Domain:** https://travelgrowconsultancy.com  
**Audience:** Indian travellers  
**Business model:** Human-assisted travel concierge. Customers submit an enquiry; the team researches suitable options, shares a quote, and books after customer approval. This is not an instant-booking portal.

## 1. Design goal

Create a polished, distinctive Indian travel consultancy website—not a generic AI template. The main conversion is a trip enquiry; secondary actions are WhatsApp contact and callback requests.

The visitor should quickly understand:
- TravelGrow helps find suitable flight and holiday options.
- A real agent researches options around dates, travellers and budget.
- The customer reviews a quote before approving a booking.

## 2. Reference websites

Use these as inspiration, not templates to copy. Do not reuse their exact layouts, text, logos, images or brand identity.

- **IKOU Holidays** — https://www.ikouholidays.com/  
  Study personalised travel-studio positioning, destination storytelling and how the planning process is explained.
- **Pushkar Tours** — https://pushkartours.co.in/  
  Study conversation-first trip planning and clear service categories.
- **Roameaze** — https://roameaze.com/  
  Study how custom holidays and trip types are organised for Indian travellers.
- **Towno** — https://towno.in/  
  Study destination navigation, INR price presentation and callback-oriented package enquiries.
- **Trip Inventor** — https://www.tripinventor.in/  
  Study how a travel agency presents expertise. Never copy credentials or trust claims unless TravelGrow can substantiate them.

Take the clear navigation, short enquiry path, useful destination details and personal-service positioning. Do not copy a competitor's visual identity or claims.

## 3. Brand personality

**Personal, reliable, considered, warm, clear, Indian and modern.**

Avoid a flight-search-engine look, overdone luxury positioning, generic AI copy, and repetitive card grids.

Good copy:
- “Tell us where you want to go.”
- “We’ll shortlist suitable options for your dates and budget.”
- “Review the quote before confirming your booking.”

Avoid claims such as “guaranteed cheapest fares”, “No. 1”, “instant booking” or “24/7 support” unless they are true and verified.

## 4. Visual system

### Colour tokens

```css
:root {
  --color-ink: #182B3A;
  --color-ink-soft: #435563;
  --color-paper: #FAF8F3;
  --color-surface: #FFFFFF;
  --color-border: #E5E0D7;
  --color-accent: #D96B32;
  --color-accent-hover: #B95324;
  --color-sage: #DCE6DC;
  --color-success: #246B4A;
  --color-error: #B42318;
}
```

Use mostly warm white/ivory and dark text, with photography and restrained orange accents. Avoid gradients and bright accent colours everywhere.

### Typography
- Headings: Manrope or DM Sans.
- Body/UI: Inter or DM Sans.
- Use no more than two font families.
- Hero heading: `clamp(2.6rem, 5vw, 4.8rem)`.
- Section heading: `clamp(1.5rem, 2.5vw, 2.2rem)`.
- Body: `1rem` to `1.125rem`.
- Maintain readable line lengths and clear hierarchy.

### Spacing and components
- Follow an 8px spacing rhythm.
- Content width: approximately 1120–1200px.
- Side padding: desktop 32–56px, tablet 24px, mobile 16–20px.
- Use whitespace and subtle dividers; avoid rounding every element.
- Corner radius usually 8–16px.
- One dominant primary CTA per visual region.
- All buttons must perform a real action.

## 5. Photography

Prioritise authentic, high-quality images of:
- Domestic: Kashmir, Himachal Pradesh, Rajasthan, Kerala, Goa, Uttarakhand and Andaman.
- International: Dubai, Thailand, Bali, Singapore and Vietnam.

Show relevant Indian traveller use cases: families, couples, small groups, weekend trips and longer holidays. Use one strong hero image rather than a collage of unrelated stock photos. Crop images intentionally, optimise them, provide alt text and confirm image licensing. Never use an image that misrepresents a package or property.

## 6. Sitemap

Main navigation:
1. Home
2. Holiday Packages
3. Destinations
4. Flight Assistance
5. Plan My Trip
6. About Us
7. Contact

Footer:
- FAQs
- Privacy Policy
- Terms & Conditions
- Cancellation / Refund Policy
- Verified contact details

Create destination/package pages only when there is enough real information; avoid dozens of thin, duplicated pages.

## 7. Homepage structure

1. **Header:** compact logo, simple navigation and “Plan My Trip” CTA. On mobile, keep contact easy to find.
2. **Hero:** editorial layout with one strong destination photograph and clear copy. Suggested headline:  
   **“Your trip. Your budget. A travel expert to help.”**  
   Supporting copy: “Tell us where you want to go. We’ll find suitable flight or holiday options and share a clear quote before you confirm.”  
   CTAs: “Plan My Trip” and “Get Flight Options”.
3. **Quick entry:** two clear paths—Flight Assistance and Plan a Holiday.
4. **Destinations:** curated collection with varied layouts, not identical cards repeated endlessly.
5. **Trip types:** family, honeymoon/couple, group, weekend getaway and custom trips—only if the client actually offers them.
6. **How it works:** Share your details → We research options → Review your quote → Approve and receive booking confirmation.
7. **Why TravelGrow:** only deliverable benefits such as personal assistance, tailored options and clear quotations.
8. **Featured packages:** use real approved packages or clearly labelled demo content. Show destination, duration, inclusions/exclusions, price basis and enquiry CTA.
9. **FAQs and final CTA:** answer how quotes, availability and booking approval work.
10. **Footer:** verified contact information and policy links.

The first screen should clearly explain the service without being crowded. Avoid oversized headings, floating UI cards and unnecessary badges.

## 8. Enquiry form UX

### Flight enquiry
- Full name
- Phone number; default country code +91
- Departure city and destination
- Departure date and return date if applicable
- Number of travellers
- Trip type
- Optional budget and notes

### Holiday enquiry
- Name and phone
- Destination or “Help me choose”
- Departure city
- Travel dates or approximate month
- Adults and children
- Trip type: family, couple/honeymoon, group, solo or other
- Approximate total budget in INR
- Trip duration and preferences

Form rules:
- Use visible labels, not placeholders alone.
- Validate on client and server.
- Show useful inline errors.
- Keep forms comfortable on mobile.
- Link to the privacy policy and explain how data is used.
- Show success only after the enquiry is actually saved.
- Add sensible spam protection.
- Never expose customer details publicly.

### WhatsApp
Use a configurable, client-approved number. Prefill a concise enquiry message only with details the customer agreed to share. Never ship a fake number. Keep a normal enquiry form available too.

## 9. Package/destination detail pages

Each useful page should contain:
1. Destination and strong lead image.
2. Summary and duration.
3. Who the trip suits.
4. Sample itinerary, if confirmed.
5. Inclusions and exclusions.
6. Indicative price and basis, if approved.
7. Booking and cancellation notes.
8. “Request details” CTA.

Never show an indicative price as a guaranteed live fare. Agents must confirm price and availability before booking.

## 10. Motion and responsiveness

Use restrained hover transitions, subtle image movement and visible focus states. Respect `prefers-reduced-motion`. Avoid scroll-jacking, constant floating animations and animated counters with unverified numbers.

Mobile:
- Single-column layouts where appropriate.
- Readable text, large touch targets and no horizontal overflow.
- Easy-to-find enquiry CTA.
- Sensible field order and mobile input types.

Desktop:
- Clear grid and intentional content width.
- Avoid stretching paragraphs across the whole screen.
- Ensure hero image and copy feel composed.

## 11. Accessibility, SEO and performance

- Semantic HTML and logical heading order.
- Keyboard-accessible navigation and forms.
- Visible focus indicators and accessible contrast.
- Meaningful alt text.
- Unique page titles and meta descriptions.
- Descriptive URL slugs, sitemap, robots configuration and Open Graph metadata.
- Structured data only when accurate.
- Compress images, lazy-load below-the-fold media and avoid unnecessary JavaScript.

## 12. Engineering constraints

- Inspect the existing repository/framework before editing.
- Preserve working features and integrations.
- Reuse existing components where sensible.
- Centralise company details and placeholders in configuration/CMS.
- Keep secrets in environment variables.
- Protect admin routes and customer information.
- Do not fake persistence or simulate successful form submission.
- Do not implement live flight booking or payments unless approved and integrations are configured.
- Do not change DNS or deploy to production without approval.

## 13. Replace before launch

Use clear placeholders for:
- `[CLIENT-APPROVED LOGO]`
- `[OFFICIAL PHONE / WHATSAPP]`
- `[OFFICIAL EMAIL]`
- `[BUSINESS ADDRESS, IF PUBLISHED]`
- `[VERIFIED SERVICES]`
- `[APPROVED PACKAGE DETAILS AND PRICES]`
- `[REAL CUSTOMER REVIEWS, WITH PERMISSION]`
- `[APPROVED POLICIES]`
- `[OFFICIAL SOCIAL LINKS]`

Never fabricate reviews, ratings, awards, years of experience, customer counts, accreditations or savings.

## 14. Acceptance checklist

- [ ] Feels like a considered Indian travel consultancy, not a generic AI template.
- [ ] First screen explains the service and has a clear CTA.
- [ ] Indian destinations and traveller use cases are represented accurately.
- [ ] Visual system is consistent across pages.
- [ ] Mobile layouts and forms work without horizontal scrolling.
- [ ] Forms validate and save through the actual backend.
- [ ] WhatsApp uses a verified, configurable number.
- [ ] Navigation and CTAs work.
- [ ] No invented reviews, credentials, prices or guarantees.
- [ ] SEO, accessibility and image performance are checked.
- [ ] Placeholders and launch blockers are documented.

## Final instruction to Antigravity

Audit the existing site first and identify the specific reasons it looks generic. Then implement the redesign in the existing project—do not stop at recommendations or simply recolour the UI. Test the result on desktop and mobile. Preserve working functionality and report what changed and what still needs client input.
