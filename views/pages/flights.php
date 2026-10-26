<?php
/**
 * TravelGrow Consultancy - Flight Deals & Advisory View
 */
?>
<!-- Signature Page Header Banner -->
<section class="pomaii-page-header">
  <div class="container">
    <div class="pomaii-page-hero-card">
      <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80" alt="Airplane flying above clouds" class="hero-bg-photo" loading="lazy">
      <div class="hero-leaf-accent">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M11 20A7 7 0 0 1 4 13C4 7 11 3 11 3S18 7 18 13A7 7 0 0 1 11 20Z"/><path d="M11 13V20"/></svg>
      </div>
      <div class="page-breadcrumb">
        <a href="/">Home</a> <span>/</span> <span>Flight Advisory</span>
      </div>
      <div class="pomaii-eyebrow">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 20A7 7 0 0 1 4 13C4 7 11 3 11 3S18 7 18 13A7 7 0 0 1 11 20Z"/><path d="M11 13V20"/></svg>
        <span>AIRFARE CONSOLIDATOR DESK</span>
      </div>
      <h1 class="page-title">Flight Deal Research &amp; Advisory</h1>
      <p class="page-subtitle">
        Direct human assistance for domestic and international flights. We check wholesale consolidator desks and airline route matrices in Indian Rupees (₹).
      </p>
    </div>
  </div>
</section>

<section class="section" style="padding-top: 30px;">
  <div class="container" style="max-width: 860px;">
    <div style="background: #FFFFFF; border-radius: var(--radius-xl); padding: 40px; border: 1px solid var(--color-border); box-shadow: var(--shadow-card);">
      <h3 style="font-family: var(--font-heading); font-size: 1.45rem; font-weight: 800; color: var(--color-ink); margin-bottom: 8px;">Submit Flight Inquiry</h3>
      <p style="font-size: 0.95rem; color: var(--color-ink-soft); line-height: 1.6;">Fill your departure and destination. An experienced consultant will verify genuine consolidator seats and share transparent options.</p>

      <form id="heroFlightForm" novalidate style="margin-top: 24px;">
        <div style="display:none;" aria-hidden="true">
          <input type="text" name="website_address_hp" tabindex="-1" autocomplete="off">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="flightOrigin">From (Departure City) *</label>
            <input type="text" id="flightOrigin" name="departureCity" class="form-control" placeholder="e.g. Mumbai (BOM), Delhi (DEL), Bengaluru" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="flightDest">To (Destination City) *</label>
            <input type="text" id="flightDest" name="destination" class="form-control" placeholder="e.g. Srinagar (SXR), Dubai (DXB), London" required>
          </div>
        </div>
        <div class="form-row form-row-3">
          <div class="form-group">
            <label class="form-label" for="flightDepDate">Departure Date *</label>
            <input type="date" id="flightDepDate" name="departureDate" class="form-control" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="flightRetDate">Return Date (Optional)</label>
            <input type="date" id="flightRetDate" name="returnDate" class="form-control">
          </div>
          <div class="form-group">
            <label class="form-label" for="flightCabin">Cabin Class</label>
            <select id="flightCabin" name="cabinPreference" class="form-control">
              <option value="Economy" selected>Economy</option>
              <option value="Premium Economy">Premium Economy</option>
              <option value="Business">Business Class</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="flightPassengerName">Primary Passenger Name *</label>
            <input type="text" id="flightPassengerName" name="name" class="form-control" placeholder="Full name as on Government ID" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="flightPhone">WhatsApp / Mobile Number *</label>
            <input type="tel" id="flightPhone" name="phone" class="form-control" placeholder="+91 98765 43210" required>
          </div>
        </div>
        <div class="consent-group">
          <input type="checkbox" id="flightConsent" name="consent" class="consent-checkbox" required>
          <label for="flightConsent" class="consent-label">
            I agree to the <a href="/privacy-policy" target="_blank">Privacy Policy</a> and allow TravelGrow to research flight fares.
          </label>
        </div>
        <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">
          Search Best Flight Routes &amp; Share Quote &rarr;
        </button>
      </form>
    </div>
  </div>
</section>
