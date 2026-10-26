<?php
/**
 * TravelGrow Consultancy - Multi-step Plan My Trip View
 * Pomaii Theme Unified Design
 */
?>
<!-- Signature Page Header Banner -->
<section class="pomaii-page-header">
  <div class="container">
    <div class="pomaii-page-hero-card">
      <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80" alt="Lake reflection in mountains" class="hero-bg-photo" loading="lazy">
      <div class="hero-leaf-accent">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M11 20A7 7 0 0 1 4 13C4 7 11 3 11 3S18 7 18 13A7 7 0 0 1 11 20Z"/><path d="M11 13V20"/></svg>
      </div>
      <div class="page-breadcrumb">
        <a href="/">Home</a> <span>/</span> <span>Plan My Trip</span>
      </div>
      <div class="pomaii-eyebrow">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 20A7 7 0 0 1 4 13C4 7 11 3 11 3S18 7 18 13A7 7 0 0 1 11 20Z"/><path d="M11 13V20"/></svg>
        <span>INTERACTIVE ITINERARY BUILDER</span>
      </div>
      <h1 class="page-title">Plan Your Bespoke Journey</h1>
      <p class="page-subtitle">
        Share your travel vision in under 2 minutes. Our dedicated travel planners will craft a tailored day-by-day itinerary with transparent pricing in Indian Rupees (₹).
      </p>
    </div>
  </div>
</section>

<section class="section" style="padding-top: 30px;">
  <div class="container" style="max-width: 860px;">
    <div class="enquiry-widget-card" id="planMyTripWizard" style="background: #FFFFFF; border-radius: var(--radius-xl); padding: 40px; border: 1px solid var(--color-border); box-shadow: var(--shadow-card);">
      <form id="wizardFinalForm" novalidate>
        <div style="display:none;" aria-hidden="true">
          <input type="text" name="website_address_hp" tabindex="-1" autocomplete="off">
        </div>

        <span class="pomaii-eyebrow" style="margin-bottom: 8px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
          <span>STEP 1 OF 1 &bull; TRIP PREFERENCES</span>
        </span>
        <h3 class="widget-title" style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--color-ink); margin-bottom: 8px;">
          Where Would You Like to Go?
        </h3>
        <p class="widget-subtitle" style="font-size: 0.95rem; color: var(--color-ink-soft); margin-bottom: 24px;">
          Domestic or International destination, or simply describe your preferred vibe.
        </p>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="wizardDestination">Preferred Destination / Region *</label>
            <input type="text" id="wizardDestination" name="destination" class="form-control" placeholder="e.g. Kashmir Valley, Switzerland, Kerala, Bali" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="wizardTravelDates">Expected Travel Month / Dates *</label>
            <input type="text" id="wizardTravelDates" name="travelDates" class="form-control" placeholder="e.g. Next month or 10-18 December" required>
          </div>
        </div>

        <div class="form-row form-row-3">
          <div class="form-group">
            <label class="form-label" for="wizardTravelers">Travellers Count *</label>
            <input type="text" id="wizardTravelers" name="travelers" class="form-control" placeholder="e.g. 2 Adults, 2 Kids" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="wizardDuration">Duration (Days)</label>
            <input type="text" id="wizardDuration" name="duration" class="form-control" placeholder="e.g. 7 Days">
          </div>
          <div class="form-group">
            <label class="form-label" for="wizardTripType">Trip Style *</label>
            <select id="wizardTripType" name="tripType" class="form-control" required>
              <option value="family" selected>Family Vacation</option>
              <option value="honeymoon">Honeymoon / Romantic</option>
              <option value="solo">Solo Adventure</option>
              <option value="group">Friends / Group</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div class="form-group" style="margin-bottom: 20px;">
          <label class="form-label" for="wizardNotes">Special Preferences or Requests</label>
          <textarea id="wizardNotes" name="notes" class="form-control" rows="3" placeholder="Hotel preferences (e.g. 4-star, boutique pool villa, pure vegetarian meals, child car seat, private car)"></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="wizardName">Your Full Name *</label>
            <input type="text" id="wizardName" name="name" class="form-control" placeholder="e.g. Amit Kapoor" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="wizardPhone">WhatsApp / Mobile Number *</label>
            <input type="tel" id="wizardPhone" name="phone" class="form-control" placeholder="+91 98765 43210" required>
          </div>
        </div>

        <div class="consent-group" style="margin-bottom: 24px;">
          <input type="checkbox" id="wizardConsent" name="consent" class="consent-checkbox" required>
          <label for="wizardConsent" class="consent-label" style="font-size: 0.875rem; color: var(--color-ink-soft);">
            I agree to the <a href="/privacy-policy" target="_blank" style="color: var(--color-forest); font-weight: 600;">Privacy Policy</a> and authorize Travel Grow Consultancy to share custom proposals in INR (₹).
          </label>
        </div>

        <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">
          Submit Itinerary Request &rarr;
        </button>
      </form>
    </div>
  </div>
</section>
