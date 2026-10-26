<?php
/**
 * TravelGrow / Pomaii Signature Homepage View
 * 100% Pixel-matched replica of Pomaii design reference
 */
?>
<!-- ==========================================================================
     Signature Pomaii Hero Section (Alpine Lake + Organic Cloud Pod Cradle)
     ========================================================================== -->
<section class="pomaii-hero-section" id="heroSection">
  <div class="pomaii-hero-stage">
    <!-- Full Panoramic Alpine Lake Backdrop (Lake Moraine Banff with boats) -->
    <div class="pomaii-hero-backdrop">
      <img src="https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=2000&q=90" alt="Alpine Mountain Lake with Wooden Boats and Snowy Peaks">
    </div>

    <!-- Organic Wave Shape Mask / Cream Cloud Overlay -->
    <div class="pomaii-hero-wave-overlay">
      <svg class="pomaii-wave-svg" viewBox="0 0 1440 700" fill="none" preserveAspectRatio="none">
        <!-- Subtle soft shadow layer under cloud -->
        <path d="M0,0 L730,0 C630,70 560,170 580,280 C600,380 520,470 410,530 C300,590 160,610 0,650 Z" fill="#F4EFEA" opacity="0.8"/>
        <!-- Main white cloud pod that cradles headline -->
        <path d="M0,0 L690,0 C590,65 530,160 550,270 C570,370 490,460 380,520 C270,580 140,600 0,640 Z" fill="#FAF8F5"/>
        <!-- Right side misty translucent organic wave -->
        <path d="M1440,60 C1340,180 1350,320 1440,440 Z" fill="rgba(255,255,255,0.45)"/>
        <!-- Bottom wave connecting smoothly into page -->
        <path d="M0,640 Q720,695 1440,640 L1440,700 L0,700 Z" fill="#FAF8F5"/>
      </svg>
    </div>

    <!-- Top Left Botanical Sprig Accent on Wave Edge -->
    <div class="pomaii-leaf-accent-top">
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#2D5A46" stroke-width="1.8"><path d="M12 2C6.5 2 2 6.5 2 12c0 5 3.5 9 8 9.8V12h-2v-2h2V8c0-2.8 1.7-4.3 4.2-4.3 1.2 0 2.4.1 2.8.1v3.1h-1.8c-1.3 0-1.6.6-1.6 1.6V10h3.3l-.4 2h-2.9v9.9c4.8-.7 8.4-4.8 8.4-9.9 0-5.5-4.5-10-10-10z"/><circle cx="17" cy="8" r="3" stroke="#2D5A46"/></svg>
    </div>

    <!-- Top Right 3x3 Dot Grid Badge -->
    <div class="pomaii-dot-grid-badge">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#94A3B8">
        <circle cx="4" cy="4" r="2"/><circle cx="12" cy="4" r="2"/><circle cx="20" cy="4" r="2"/>
        <circle cx="4" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="20" cy="12" r="2"/>
        <circle cx="4" cy="20" r="2"/><circle cx="12" cy="20" r="2"/><circle cx="20" cy="20" r="2"/>
      </svg>
    </div>

    <!-- Hero Text Content (Cradled in the organic cloud shape) -->
    <div class="container" style="position: relative; z-index: 3;">
      <div class="pomaii-hero-content">
        <div class="pomaii-eyebrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 20A7 7 0 0 1 4 13C4 7 11 3 11 3S18 7 18 13A7 7 0 0 1 11 20Z"/><path d="M11 13V20"/></svg>
          <span>EXPLORE THE WORLD</span>
        </div>
        <h1 class="pomaii-hero-title">
          Discover Nature.<br>
          Find Your <span class="escape-accent">Escape.<svg class="escape-swoosh" viewBox="0 0 160 20"><path d="M4 14 Q 80 2 156 12" stroke="#F08224" stroke-width="5" fill="none" stroke-linecap="round"/></svg></span>
        </h1>
        <p class="pomaii-hero-sub">
          Breathtaking places, unforgettable experiences, crafted just for you.
        </p>
        <button type="button" class="btn-pomaii-orange js-open-enquiry-modal" id="heroExploreBtn">
          <span>Explore Now</span>
          <span class="btn-arrow-circle">
            <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
          </span>
        </button>
      </div>
    </div>
  </div>

  <!-- Floating Horizontal Trip Search Pill (Overlapping the hero bottom) -->
  <div class="container pomaii-search-wrapper" id="searchWidgetSection">
    <div class="pomaii-search-pill">
      <!-- 1. Where to -->
      <div class="search-seg js-open-enquiry-modal">
        <div class="search-seg-icon">
          <svg width="18" height="18" fill="none" stroke="#64748B" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
        </div>
        <div class="search-seg-text">
          <span class="search-seg-label">Where to?</span>
          <span class="search-seg-val">Any destination</span>
        </div>
      </div>
      <div class="search-divider"></div>

      <!-- 2. Check in -->
      <div class="search-seg js-open-enquiry-modal">
        <div class="search-seg-icon">
          <svg width="18" height="18" fill="none" stroke="#64748B" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <div class="search-seg-text">
          <span class="search-seg-label">Check in</span>
          <span class="search-seg-val">Add date</span>
        </div>
      </div>
      <div class="search-divider"></div>

      <!-- 3. Check out -->
      <div class="search-seg js-open-enquiry-modal">
        <div class="search-seg-icon">
          <svg width="18" height="18" fill="none" stroke="#64748B" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <div class="search-seg-text">
          <span class="search-seg-label">Check out</span>
          <span class="search-seg-val">Add date</span>
        </div>
      </div>
      <div class="search-divider"></div>

      <!-- 4. Travelers -->
      <div class="search-seg js-open-enquiry-modal">
        <div class="search-seg-icon">
          <svg width="18" height="18" fill="none" stroke="#64748B" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div class="search-seg-text">
          <span class="search-seg-label">Travelers</span>
          <span class="search-seg-val">2 Travelers</span>
        </div>
      </div>

      <!-- Search button -->
      <button type="button" class="btn-search-forest js-open-enquiry-modal" id="pillSearchBtn">
        <span>Search</span>
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </button>
    </div>
  </div>
</section>

<!-- ==========================================================================
     Trust Badges Strip (4 horizontal items)
     ========================================================================== -->
<section class="pomaii-trust-strip">
  <div class="container pomaii-trust-grid">
    <div class="trust-item">
      <div class="trust-icon-box">
        <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
      </div>
      <div>
        <h4 class="trust-title">Handpicked Destinations</h4>
        <p class="trust-desc">Curated places you'll love.</p>
      </div>
    </div>
    <div class="trust-item">
      <div class="trust-icon-box">
        <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
      </div>
      <div>
        <h4 class="trust-title">Best Price Guarantee</h4>
        <p class="trust-desc">Get the best deals always.</p>
      </div>
    </div>
    <div class="trust-item">
      <div class="trust-icon-box">
        <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>
      <div>
        <h4 class="trust-title">Safe &amp; Trusted Travel</h4>
        <p class="trust-desc">Your safety is our priority.</p>
      </div>
    </div>
    <div class="trust-item">
      <div class="trust-icon-box">
        <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
      </div>
      <div>
        <h4 class="trust-title">24/7 Customer Support</h4>
        <p class="trust-desc">We're here for you anytime.</p>
      </div>
    </div>
  </div>
</section>

<!-- ==========================================================================
     Popular Destinations (4 Tall Cards: Banff, Maldives, Kyoto, Iceland)
     ========================================================================== -->
<section class="section pomaii-destinations-section" id="popularDestinationsSection">
  <div class="container">
    <div class="dest-header">
      <h2 class="dest-title">
        <span>Popular Destinations</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D5A46" stroke-width="2"><path d="M11 20A7 7 0 0 1 4 13C4 7 11 3 11 3S18 7 18 13A7 7 0 0 1 11 20Z"/><path d="M11 13V20"/></svg>
      </h2>
      <a href="/holidays" class="dest-view-all">
        <span>View All Destinations</span>
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
      </a>
    </div>

    <!-- 4 Tall Vertical Cards -->
    <div class="pomaii-dest-grid">
      <!-- Card 1: Banff, Canada -->
      <a href="/package-details?id=pkg-kashmir-paradise" class="pomaii-dest-card js-open-enquiry-modal" data-destination="Banff, Canada">
        <span class="card-rating-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span>4.8</span>
        </span>
        <img src="https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=800&q=80" alt="Banff, Canada" class="card-img" loading="lazy">
        <div class="card-bottom-overlay">
          <h3 class="card-dest-title">Banff, Canada</h3>
          <p class="card-dest-sub">Majestic Lakes &amp; Mountains</p>
          <span class="card-dest-price">₹58,500</span>
        </div>
      </a>

      <!-- Card 2: Maldives -->
      <a href="/package-details?id=pkg-kerala-backwaters" class="pomaii-dest-card js-open-enquiry-modal" data-destination="Maldives">
        <span class="card-rating-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span>4.7</span>
        </span>
        <img src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80" alt="Maldives" class="card-img" loading="lazy">
        <div class="card-bottom-overlay">
          <h3 class="card-dest-title">Maldives</h3>
          <p class="card-dest-sub">Tropical Paradise</p>
          <span class="card-dest-price">₹74,900</span>
        </div>
      </a>

      <!-- Card 3: Kyoto, Japan -->
      <a href="/package-details?id=pkg-rajasthan-royals" class="pomaii-dest-card js-open-enquiry-modal" data-destination="Kyoto, Japan">
        <span class="card-rating-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span>4.9</span>
        </span>
        <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80" alt="Kyoto, Japan" class="card-img" loading="lazy">
        <div class="card-bottom-overlay">
          <h3 class="card-dest-title">Kyoto, Japan</h3>
          <p class="card-dest-sub">Timeless Culture</p>
          <span class="card-dest-price">₹66,500</span>
        </div>
      </a>

      <!-- Card 4: Iceland -->
      <a href="/package-details?id=pkg-himachal-highlands" class="pomaii-dest-card js-open-enquiry-modal" data-destination="Iceland">
        <span class="card-rating-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span>4.6</span>
        </span>
        <img src="https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80" alt="Iceland" class="card-img" loading="lazy">
        <div class="card-bottom-overlay">
          <h3 class="card-dest-title">Iceland</h3>
          <p class="card-dest-sub">Land of Fire &amp; Ice</p>
          <span class="card-dest-price">₹62,500</span>
        </div>
      </a>
    </div>

    <!-- Category Filter Pills Row -->
    <div class="pomaii-cat-strip">
      <button type="button" class="pomaii-cat-pill active">
        <span class="cat-icon-circle">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20L14 6l-4 6-2-3-6 11z"/></svg>
        </span>
        <span>Adventure</span>
      </button>
      <button type="button" class="pomaii-cat-pill">
        <span class="cat-icon-circle">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-9"/><path d="M12 13c-3-2-6-1-8 2 3-5 7-6 8-2z"/><path d="M12 13c3-2 6-1 8 2-3-5-7-6-8-2z"/><path d="M12 9c-2-3-5-4-7-2 3-3 7-2 7 2z"/><path d="M12 9c2-3 5-4 7-2-3-3-7-2-7 2z"/></svg>
        </span>
        <span>Beach</span>
      </button>
      <button type="button" class="pomaii-cat-pill">
        <span class="cat-icon-circle">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 4 13C4 7 11 3 11 3S18 7 18 13A7 7 0 0 1 11 20Z"/><path d="M11 13V20"/></svg>
        </span>
        <span>Nature</span>
      </button>
      <button type="button" class="pomaii-cat-pill">
        <span class="cat-icon-circle">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="20" x2="22" y2="20"/><path d="M4 10v7"/><path d="M9 10v7"/><path d="M15 10v7"/><path d="M20 10v7"/><path d="M2 10l10-6 10 6"/></svg>
        </span>
        <span>Culture</span>
      </button>
      <button type="button" class="pomaii-cat-pill">
        <span class="cat-icon-circle">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </span>
        <span>Honeymoon</span>
      </button>
      <button type="button" class="pomaii-cat-pill">
        <span class="cat-icon-circle">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </span>
        <span>Family</span>
      </button>
    </div>
  </div>
</section>

<!-- ==========================================================================
     Travel Stories & Guides Section
     ========================================================================== -->
<section class="section" id="travelStoriesSection">
  <div class="container">
    <div class="pomaii-stories-box">
      <div class="stories-left">
        <span class="stories-eyebrow">Need Inspiration?</span>
        <h2 class="stories-title">Travel Stories &amp; Guides</h2>
        <p class="stories-desc">
          Get travel tips, destination guides, and inspiring stories from around the world.
        </p>
        <a href="/holidays" class="btn-stories-forest">
          <span>Read Travel Stories</span>
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
        </a>
      </div>
      <div class="stories-right-grid">
        <div class="story-card">
          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" alt="10 Hidden Gems in Europe" class="story-img" loading="lazy">
          <div class="story-body">
            <h4 class="story-name">10 Hidden Gems in Europe</h4>
            <span class="story-meta">5 min read</span>
          </div>
        </div>
        <div class="story-card">
          <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80" alt="Packing Essentials for Every Trip" class="story-img" loading="lazy">
          <div class="story-body">
            <h4 class="story-name">Packing Essentials for Every Trip</h4>
            <span class="story-meta">4 min read</span>
          </div>
        </div>
      </div>
      <div class="stories-leaf-bot">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none"><path d="M10 50 C20 40 35 30 50 10 C40 25 30 40 20 50 Z" fill="#2D5A46" opacity="0.3"/></svg>
      </div>
    </div>
  </div>
</section>

<!-- ==========================================================================
     Wide Promotional Banner ("Your Next Adventure Starts Here")
     ========================================================================== -->
<section class="container">
  <div class="pomaii-promo-card">
    <div class="promo-photo-side">
      <img src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80" alt="Scenic Green Mountains & Lake" class="promo-bg-img" loading="lazy">
    </div>
    <div class="promo-content-side">
      <span class="promo-tag">
        <span>SPECIAL OFFER</span>
        <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20"><path d="M17.707 9.293l-5-5A1 1 0 0012 4H4a1 1 0 00-1 1v8a1 1 0 00.293.707l5 5a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"/></svg>
      </span>
      <h2 class="promo-title">Your Next Adventure Starts Here</h2>
      <p class="promo-sub">Exclusive packages. Flexible bookings. Memories that last a lifetime.</p>
      <button type="button" class="btn-promo-orange js-open-enquiry-modal">
        <span>Discover Packages</span>
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
      </button>
    </div>
    <!-- Detailed Tropical Flower Cluster at Bottom Right (Exact Pomaii Style) -->
    <div class="promo-flower-bot">
      <svg width="150" height="135" viewBox="0 0 160 145" fill="none" style="display: block;">
        <!-- Foliage Leaves behind -->
        <path d="M50 135 C35 110 50 80 75 90 C80 115 70 135 50 135 Z" fill="#254F3D"/>
        <path d="M120 145 C140 120 125 90 100 100 C95 125 105 145 120 145 Z" fill="#254F3D"/>
        <path d="M95 85 C110 60 135 70 130 95 C115 100 100 95 95 85 Z" fill="#1A382C"/>
        <!-- Large Blooming Lily / Hibiscus (Center) -->
        <g transform="translate(95, 75)">
          <path d="M0 0 C-28 -32 -10 -50 8 -36 C13 -18 9 -9 0 0 Z" fill="#F08224"/>
          <path d="M0 0 C22 -40 45 -26 32 -9 C18 4 9 4 0 0 Z" fill="#E67319"/>
          <path d="M0 0 C40 -13 48 13 26 22 C13 18 9 9 0 0 Z" fill="#F08224"/>
          <path d="M0 0 C18 36 -4 45 -13 26 C-13 13 -4 4 0 0 Z" fill="#D9630E"/>
          <path d="M0 0 C-32 26 -45 0 -26 -13 C-13 -13 -4 -4 0 0 Z" fill="#E67319"/>
          <circle cx="2" cy="-2" r="6" fill="#FDBA74"/>
          <circle cx="2" cy="-2" r="3" fill="#FED7AA"/>
        </g>
        <!-- Secondary Flower (Bottom Left) -->
        <g transform="translate(50, 105) scale(0.72)">
          <path d="M0 0 C-28 -32 -10 -50 8 -36 C13 -18 9 -9 0 0 Z" fill="#F08224"/>
          <path d="M0 0 C22 -40 45 -26 32 -9 C18 4 9 4 0 0 Z" fill="#E67319"/>
          <path d="M0 0 C40 -13 48 13 26 22 C13 18 9 9 0 0 Z" fill="#F08224"/>
          <path d="M0 0 C18 36 -4 45 -13 26 C-13 13 -4 4 0 0 Z" fill="#D9630E"/>
          <path d="M0 0 C-32 26 -45 0 -26 -13 C-13 -13 -4 -4 0 0 Z" fill="#E67319"/>
          <circle cx="2" cy="-2" r="6" fill="#FDBA74"/>
        </g>
      </svg>
    </div>
  </div>
</section>

<!-- ==========================================================================
     Stats Counter Strip (100+ Destinations, 50K+ Travelers, 4.8 Rating, 24/7)
     ========================================================================== -->
<div class="container">
  <div class="pomaii-stats-strip">
    <div class="pomaii-stats-grid">
      <div class="stat-block">
        <div class="stat-icon-wrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
        </div>
        <div>
          <div class="stat-number">100+</div>
          <div class="stat-label">Destinations</div>
        </div>
      </div>
      <div class="stat-block">
        <div class="stat-icon-wrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div>
          <div class="stat-number">50K+</div>
          <div class="stat-label">Happy Travelers</div>
        </div>
      </div>
      <div class="stat-block">
        <div class="stat-icon-wrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <div>
          <div class="stat-number">4.8★</div>
          <div class="stat-label">Average Rating</div>
        </div>
      </div>
      <div class="stat-block">
        <div class="stat-icon-wrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div>
          <div class="stat-number">24/7</div>
          <div class="stat-label">Support</div>
        </div>
      </div>
    </div>
    <div class="pomaii-social-wrap">
      <span class="social-label">Follow Us</span>
      <div class="social-icons">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Facebook">
          <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Instagram">
          <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Twitter">
          <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="YouTube">
          <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        </a>
      </div>
    </div>
  </div>
</div>
