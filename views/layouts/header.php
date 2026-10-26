<?php
/**
 * TravelGrow Consultancy - Pomaii Themed Header Component
 */
$activeNav = $activeNav ?? 'home';
?>
<!-- Header & Navigation (Pure Pomaii Style without dark topbar) -->
<header class="site-header">
  <div class="container header-container">
    <a href="/" class="brand-logo-pomaii" aria-label="Travel Grow Consultancy Home">
      <div class="brand-icon-pomaii">
        <svg viewBox="0 0 32 32" width="22" height="22"><path fill="#fff" d="M16 5c-1.2 0-2.3.9-2.8 2.2L6 23h20l-7.2-15.8C18.3 5.9 17.2 5 16 5zm0 5.5l4.5 9.5H11.5L16 10.5z"/></svg>
      </div>
      <div class="brand-text">
        <span class="brand-name">Travel Grow</span>
        <span class="brand-tagline">Consultancy</span>
      </div>
    </a>

    <!-- Desktop Nav with Pomaii-style active underline accent -->
    <nav class="nav-menu" aria-label="Main Navigation">
      <a href="/" class="nav-link <?= $activeNav === 'home' ? 'pomaii-active active' : '' ?>">Home</a>
      <a href="/holidays" class="nav-link <?= $activeNav === 'holidays' ? 'pomaii-active active' : '' ?>">Destinations</a>
      <a href="/holidays" class="nav-link <?= $activeNav === 'tours' ? 'pomaii-active active' : '' ?>">Tours</a>
      <a href="/flights" class="nav-link <?= $activeNav === 'flights' ? 'pomaii-active active' : '' ?>">Travel Guide</a>
      <a href="/#travelStoriesSection" class="nav-link">Blog</a>
      <a href="/about" class="nav-link <?= $activeNav === 'about' ? 'pomaii-active active' : '' ?>">About Us</a>
    </nav>

    <!-- Right Action Icons: Search, Wishlist, Hamburger (Exact Pomaii Design) -->
    <div class="header-actions">
      <button type="button" class="header-icon-btn js-scroll-search" aria-label="Search destinations" title="Search">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </button>
      <button type="button" class="header-icon-btn js-wishlist-toggle" aria-label="Saved Wishlist" title="Wishlist">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </button>
      <button type="button" class="header-icon-btn mobile-nav-toggle" id="mobileNavToggle" aria-label="Toggle navigation menu" title="Menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
    </div>
  </div>
</header>

<!-- Mobile Drawer -->
<div class="mobile-drawer" id="mobileDrawer">
  <div class="mobile-drawer-header">
    <div class="brand-logo-pomaii">
      <div class="brand-icon-pomaii">
        <svg viewBox="0 0 32 32" width="22" height="22"><path fill="#fff" d="M16 5c-1.2 0-2.3.9-2.8 2.2L6 23h20l-7.2-15.8C18.3 5.9 17.2 5 16 5zm0 5.5l4.5 9.5H11.5L16 10.5z"/></svg>
      </div>
      <div class="brand-text">
        <span class="brand-name">Travel Grow</span>
        <span class="brand-tagline">Consultancy</span>
      </div>
    </div>
    <button type="button" class="mobile-drawer-close" id="mobileDrawerClose" aria-label="Close menu">&times;</button>
  </div>
  <div class="mobile-nav-links">
    <a href="/" class="<?= $activeNav === 'home' ? 'active' : '' ?>">Home</a>
    <a href="/holidays" class="<?= $activeNav === 'holidays' ? 'active' : '' ?>">Holiday Packages</a>
    <a href="/flights" class="<?= $activeNav === 'flights' ? 'active' : '' ?>">Flight Assistance</a>
    <a href="/plan-my-trip" class="<?= $activeNav === 'plan' ? 'active' : '' ?>">Plan My Trip</a>
    <a href="/how-it-works" class="<?= $activeNav === 'how-it-works' ? 'active' : '' ?>">How It Works</a>
    <a href="/about" class="<?= $activeNav === 'about' ? 'active' : '' ?>">About Us</a>
    <a href="/faqs" class="<?= $activeNav === 'faqs' ? 'active' : '' ?>">FAQs</a>
    <a href="/contact" class="<?= $activeNav === 'contact' ? 'active' : '' ?>">Contact Us</a>
  </div>
  <div style="margin-top: auto; padding-top: 20px; border-top: 1px solid var(--color-border);">
    <button type="button" class="btn btn-primary btn-lg js-open-enquiry-modal" style="width: 100%; margin-bottom: 12px;">
      Request Custom Quote
    </button>
    <p style="font-size: 0.8125rem; color: var(--color-ink-muted); text-align: center;">
      Office: +91 98765 43210 (Demo)<br>
      Mon–Sat: 09:30 – 19:30 IST
    </p>
  </div>
</div>
<div class="drawer-overlay" id="drawerOverlay"></div>
