<?php
/**
 * TravelGrow Consultancy - Pomaii Themed Footer Component
 */
?>
<!-- Clean Pomaii-Style Footer -->
<footer class="pomaii-footer">
  <div class="container pomaii-footer-grid">
    <div class="footer-brand-col">
      <div class="pomaii-logo">
        <div class="logo-emblem">
          <svg viewBox="0 0 32 32" width="20" height="20"><path fill="#fff" d="M16 5c-1.2 0-2.3.9-2.8 2.2L6 23h20l-7.2-15.8C18.3 5.9 17.2 5 16 5zm0 5.5l4.5 9.5H11.5L16 10.5z"/></svg>
        </div>
        <div class="logo-text">
          <span class="name">Travel Grow</span>
          <span class="tag">Consultancy</span>
        </div>
      </div>
      <p class="footer-bio">
        We bring you closer to the world's most amazing places with unforgettable travel experiences. Manual deal curation and personalized itinerary assistance for Indian travellers.
      </p>
    </div>

    <div class="footer-links-col">
      <h5 class="col-title">Company</h5>
      <ul>
        <li><a href="/about">About Us</a></li>
        <li><a href="/about">Careers</a></li>
        <li><a href="/about">Press</a></li>
        <li><a href="/contact">Contact Us</a></li>
      </ul>
    </div>

    <div class="footer-links-col">
      <h5 class="col-title">Support</h5>
      <ul>
        <li><a href="/faqs">Help Center</a></li>
        <li><a href="/faqs">FAQ</a></li>
        <li><a href="/terms-conditions">Terms &amp; Conditions</a></li>
        <li><a href="/privacy-policy">Privacy Policy</a></li>
      </ul>
    </div>

    <div class="footer-links-col">
      <h5 class="col-title">Top Destinations</h5>
      <ul>
        <li><a href="/package-details?id=pkg-bali-island">Bali, Indonesia</a></li>
        <li><a href="/holidays">Switzerland</a></li>
        <li><a href="/holidays">Thailand</a></li>
        <li><a href="/holidays">New Zealand</a></li>
      </ul>
    </div>

    <div class="footer-newsletter-col">
      <h5 class="col-title">Newsletter</h5>
      <p class="news-desc">Subscribe for travel inspiration and exclusive deals.</p>
      <form class="news-form" onsubmit="event.preventDefault(); alert('Thank you for subscribing to Travel Grow Consultancy updates!');">
        <input type="email" placeholder="Enter your email" required class="news-input">
        <button type="submit" class="btn-news-submit">Subscribe</button>
      </form>
    </div>
  </div>

  <div class="container footer-copyright-row">
    <div>&copy; <?= date('Y') ?> Travel Grow Consultancy. All rights reserved. &bull; <a href="/admin" style="color: inherit; text-decoration: none; opacity: 0.6;">Admin</a></div>
  </div>
</footer>

<!-- Floating WhatsApp Action -->
<a href="https://wa.me/919876543210?text=Hello%20Travel%20Grow%20Consultancy%2C%20I%20would%20like%20to%20plan%20a%20trip." target="_blank" rel="noopener noreferrer" class="floating-whatsapp-btn js-whatsapp-link" aria-label="Contact Travel Grow Consultancy via WhatsApp">
  <svg viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.585 1.961.945 2.796.945 3.18 0 5.767-2.587 5.767-5.766.001-3.182-2.585-5.732-5.767-5.732zm3.385 8.167c-.144.405-.838.774-1.171.823-.324.047-.745.068-1.205-.08-.307-.099-.7-.253-1.21-.476-2.164-.946-3.57-3.14-3.678-3.283-.107-.144-.874-1.163-.874-2.219 0-1.056.554-1.576.75-1.789.196-.214.429-.268.572-.268.143 0 .287.002.412.008.132.006.309-.05.483.369.179.431.611 1.492.664 1.602.053.109.089.237.018.381-.072.144-.108.234-.215.359-.107.126-.226.281-.322.378-.108.108-.22.226-.095.441.125.215.556.917 1.192 1.484.819.73 1.51.956 1.724 1.064.215.107.341.09.467-.054.125-.144.538-.627.681-.842.143-.215.287-.179.484-.107.197.072 1.253.591 1.468.699.215.108.358.162.412.253.054.09.054.522-.09.927z"/></svg>
  <span>WhatsApp Desk</span>
</a>

<!-- Global Interactive Enquiry Modal -->
<div class="modal-overlay" id="enquiryModal">
  <div class="modal-box">
    <div class="modal-header">
      <h3 class="modal-title" id="modalTitle">Request a Tailored Travel Quote</h3>
      <button type="button" class="modal-close-btn js-close-modal" aria-label="Close modal">&times;</button>
    </div>
    <div class="modal-body">
      <p style="font-size: 0.875rem; color: var(--color-ink-soft); margin-bottom: 20px;">
        Share your travel plans. An experienced travel consultant will manually check flight consolidators and local boutique hotels to share a transparent quotation.
      </p>

      <form id="modalEnquiryForm" novalidate>
        <div style="display:none;" aria-hidden="true">
          <input type="text" name="website_address_hp" tabindex="-1" autocomplete="off">
        </div>

        <input type="hidden" id="modalEnquiryType" name="enquiryType" value="holiday">
        <input type="hidden" id="modalPackageRef" name="packageRef" value="">

        <div class="form-group">
          <label class="form-label" for="modalEnquiryDestination">Destination / Trip Objective *</label>
          <input type="text" id="modalEnquiryDestination" name="destination" class="form-control" placeholder="e.g. Kashmir 6-day family holiday" required>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="modalEnquiryDates">Travel Dates / Season *</label>
            <input type="text" id="modalEnquiryDates" name="travelDates" class="form-control" placeholder="e.g. Next month / Oct 15-22" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="modalEnquiryTravelers">Travellers Count *</label>
            <input type="text" id="modalEnquiryTravelers" name="travelers" class="form-control" placeholder="e.g. 2 Adults, 1 Child" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="modalContactName">Your Full Name *</label>
            <input type="text" id="modalContactName" name="name" class="form-control" placeholder="e.g. Rahul Sharma" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="modalContactPhone">Phone / WhatsApp Number *</label>
            <input type="tel" id="modalContactPhone" name="phone" class="form-control" placeholder="+91 98765 43210" required>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="modalContactEmail">Email Address (Optional)</label>
          <input type="email" id="modalContactEmail" name="email" class="form-control" placeholder="name@domain.com">
        </div>

        <div class="consent-group">
          <input type="checkbox" id="modalConsent" name="consent" class="consent-checkbox" required>
          <label for="modalConsent" class="consent-label">
            I consent to Travel Grow Consultancy processing my contact details for this quotation under the <a href="/privacy-policy" target="_blank">Privacy Policy</a>.
          </label>
        </div>

        <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 6px;">
          Submit Consultation Request &rarr;
        </button>
      </form>
    </div>
  </div>
</div>
