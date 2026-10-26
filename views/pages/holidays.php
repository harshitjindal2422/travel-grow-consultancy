<?php
/**
 * TravelGrow Consultancy - Holiday Packages Catalog View
 */
?>
<!-- Signature Page Header Banner -->
<section class="pomaii-page-header">
  <div class="container">
    <div class="pomaii-page-hero-card">
      <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80" alt="Mountain Lake Panoramic View" class="hero-bg-photo" loading="lazy">
      <div class="hero-leaf-accent">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M11 20A7 7 0 0 1 4 13C4 7 11 3 11 3S18 7 18 13A7 7 0 0 1 11 20Z"/><path d="M11 13V20"/></svg>
      </div>
      <div class="page-breadcrumb">
        <a href="/">Home</a> <span>/</span> <span>Holidays &amp; Destinations</span>
      </div>
      <div class="pomaii-eyebrow">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 20A7 7 0 0 1 4 13C4 7 11 3 11 3S18 7 18 13A7 7 0 0 1 11 20Z"/><path d="M11 13V20"/></svg>
        <span>CURATED TRAVEL PORTFOLIO</span>
      </div>
      <h1 class="page-title">Bespoke Holiday Packages</h1>
      <p class="page-subtitle">
        Explore our handpicked itineraries. Every package is completely flexible: custom dates, boutique villa upgrades, and transparent INR (₹) estimates.
      </p>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <!-- Filter Bar -->
    <div class="packages-filter-bar">
      <button type="button" class="filter-btn active" data-filter="all">All Packages</button>
      <button type="button" class="filter-btn" data-filter="domestic">Domestic Escapes</button>
      <button type="button" class="filter-btn" data-filter="international">International Destinations</button>
    </div>

    <!-- Packages Grid Container -->
    <div class="packages-grid" id="packagesContainer">
      <?php if (!empty($packages)): ?>
        <?php foreach ($packages as $pkg): ?>
          <div class="package-card" data-id="<?= htmlspecialchars($pkg['id']) ?>" data-region="<?= htmlspecialchars($pkg['region']) ?>">
            <div class="package-image-wrap">
              <a href="/package-details?id=<?= urlencode($pkg['id']) ?>">
                <img src="<?= htmlspecialchars($pkg['hero_image']) ?>" alt="<?= htmlspecialchars($pkg['title']) ?>" class="package-image" loading="lazy">
              </a>
              <span class="package-tag-badge"><?= htmlspecialchars($pkg['tag']) ?></span>
              <span class="package-duration-badge"><?= htmlspecialchars($pkg['duration']) ?></span>
            </div>
            <div class="package-body">
              <div class="package-destination"><?= htmlspecialchars($pkg['destination']) ?></div>
              <h3 class="package-title">
                <a href="/package-details?id=<?= urlencode($pkg['id']) ?>" style="color: inherit;"><?= htmlspecialchars($pkg['title']) ?></a>
              </h3>
              <p class="package-desc"><?= htmlspecialchars($pkg['description']) ?></p>
              <div class="package-footer">
                <div class="package-price-wrap">
                  <span class="package-price-label">Sample Starting Estimate</span>
                  <span class="package-price"><?= htmlspecialchars($pkg['sample_price']) ?></span>
                </div>
                <div style="display: flex; gap: 8px;">
                  <a href="/package-details?id=<?= urlencode($pkg['id']) ?>" class="btn btn-outline-navy btn-sm">Itinerary</a>
                  <button type="button" class="btn btn-primary btn-sm request-package-quote-btn" data-pkg-id="<?= htmlspecialchars($pkg['id']) ?>">Quote</button>
                </div>
              </div>
            </div>
          </div>
        <?php endforeach; ?>
      <?php endif; ?>
    </div>
  </div>
</section>
