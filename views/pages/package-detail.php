<?php
/**
 * TravelGrow Consultancy - Package Details & Day-by-Day Itinerary View
 * Pomaii Theme Unified Design
 */
$pkg = $package ?? null;
?>
<main id="packageDetailRoot">
  <!-- Signature Page Header Banner -->
  <section class="pomaii-page-header">
    <div class="container">
      <div class="pomaii-page-hero-card">
        <img src="<?= htmlspecialchars($pkg['hero_image'] ?? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80') ?>" alt="<?= htmlspecialchars($pkg['title'] ?? 'Holiday Package Itinerary') ?>" class="hero-bg-photo" id="pkgHeroBgPhoto" loading="lazy">
        <div class="hero-leaf-accent">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M11 20A7 7 0 0 1 4 13C4 7 11 3 11 3S18 7 18 13A7 7 0 0 1 11 20Z"/><path d="M11 13V20"/></svg>
        </div>
        <div class="page-breadcrumb">
          <a href="/">Home</a> <span>/</span> <a href="/holidays">Holidays</a> <span>/</span> <span id="pkgHeroBreadcrumb"><?= htmlspecialchars($pkg['title'] ?? 'Itinerary Details') ?></span>
        </div>
        <div class="pomaii-eyebrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 20A7 7 0 0 1 4 13C4 7 11 3 11 3S18 7 18 13A7 7 0 0 1 11 20Z"/><path d="M11 13V20"/></svg>
          <span id="pkgHeroTag"><?= htmlspecialchars($pkg['tag'] ?? 'CURATED BESPOKE ITINERARY') ?></span>
          <span style="opacity: 0.7;">&bull;</span>
          <span id="pkgHeroDuration"><?= htmlspecialchars($pkg['duration'] ?? 'Custom Duration') ?></span>
        </div>
        <h1 class="page-title" id="pkgHeroTitle"><?= htmlspecialchars($pkg['title'] ?? 'Package Itinerary') ?></h1>
        <div style="font-size: 1.15rem; color: #EAB308; font-weight: 700; margin-bottom: 12px;" id="pkgHeroDest">
          <?= htmlspecialchars($pkg['destination'] ?? 'Inspirational Destination') ?>
        </div>
        <p class="page-subtitle" id="pkgHeroDesc">
          <?= htmlspecialchars($pkg['description'] ?? 'A handpicked travel experience crafted by Travel Grow Consultancy. 100% customizable with transparent pricing in Indian Rupees (₹).') ?>
        </p>
      </div>
    </div>
  </section>

  <!-- Content Section -->
  <section class="section" style="padding-top: 30px;">
    <div class="container">
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 36px;" class="package-layout-grid">
        
        <!-- Left: Gallery, Itinerary Timeline, Inclusions/Exclusions -->
        <div>
          <!-- Main Photo & Gallery -->
          <div style="border-radius: var(--radius-xl); overflow: hidden; margin-bottom: 30px; box-shadow: var(--shadow-card); border: 1px solid var(--color-border); background: #FFFFFF;">
            <img src="<?= htmlspecialchars($pkg['hero_image'] ?? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80') ?>" alt="<?= htmlspecialchars($pkg['title'] ?? 'Destination scene') ?>" id="pkgMainGalleryImg" style="width: 100%; height: 420px; object-fit: cover;">
            <div id="pkgSubGallery" class="gallery-sub-grid" style="display: flex; gap: 10px; padding: 12px; background: #FFFFFF; border-top: 1px solid var(--color-border);">
              <!-- Populated by JS when available -->
            </div>
          </div>

          <!-- Day-by-Day Itinerary -->
          <div style="background: #FFFFFF; border-radius: var(--radius-xl); padding: 36px; border: 1px solid var(--color-border); box-shadow: var(--shadow-card); margin-bottom: 32px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border); padding-bottom: 16px; margin-bottom: 24px;">
              <div>
                <span class="pomaii-eyebrow" style="margin-bottom: 4px;">DAY-BY-DAY PLAN</span>
                <h2 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--color-ink); margin: 0;">
                  Sample Curated Itinerary
                </h2>
              </div>
              <span style="font-size: 0.8125rem; color: var(--color-forest); font-weight: 700; background: var(--color-paper-warm); padding: 6px 14px; border-radius: var(--radius-full); border: 1px solid var(--color-border);">
                100% Adaptable
              </span>
            </div>

            <div class="itinerary-timeline" id="pkgItineraryTimeline">
              <!-- Rendered by JS or static fallback -->
              <div class="itinerary-day-item">
                <h4 class="itinerary-day-title">Day 1: Arrival &amp; Private Hotel Transfer</h4>
                <p class="itinerary-day-desc">Warm airport greeting by our dedicated chauffeur. Check in to your handpicked boutique stay, unwind, and enjoy an evening orientation walk.</p>
              </div>
              <div class="itinerary-day-item">
                <h4 class="itinerary-day-title">Day 2: Guided Cultural Highlights &amp; Local Cuisine</h4>
                <p class="itinerary-day-desc">Explore iconic heritage monuments with a licensed storyteller guide. Authentic lunch at a vetted family-run eatery.</p>
              </div>
              <div class="itinerary-day-item">
                <h4 class="itinerary-day-title">Day 3: Scenic Excursion &amp; Signature Experiences</h4>
                <p class="itinerary-day-desc">Private day tour to pristine countryside views, boat cruise, or tranquil mountain meadows with personalized photo stops.</p>
              </div>
              <div class="itinerary-day-item">
                <h4 class="itinerary-day-title">Day 4: Leisure Morning &amp; Departure Transfer</h4>
                <p class="itinerary-day-desc">Enjoy breakfast at leisure. Chauffeur transfer to the airport or train station for your journey home.</p>
              </div>
            </div>
          </div>

          <!-- Inclusions & Exclusions -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 32px;">
            <!-- Inclusions -->
            <div style="background: #FFFFFF; border-radius: var(--radius-xl); padding: 28px; border: 1px solid var(--color-border); box-shadow: var(--shadow-card);">
              <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: var(--color-forest); margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>What Is Included</span>
              </h4>
              <ul class="check-list" id="pkgInclusionsList" style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px;">
                <?php 
                  $incs = json_decode($pkg['inclusions_json'] ?? '[]', true) ?: [
                    'Handpicked boutique hotel / luxury resort accommodations',
                    'Daily wholesome breakfast + select welcome dinners',
                    'Private AC vehicle for all transfers and sightseeing',
                    'Dedicated on-trip coordinator available 24/7 via WhatsApp',
                    'Toll taxes, parking fees, driver allowance and state permits'
                  ];
                  foreach ($incs as $inc): 
                ?>
                  <li style="display: flex; align-items: flex-start; gap: 10px; font-size: 0.9rem; color: var(--color-ink); line-height: 1.5;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-forest); flex-shrink: 0; margin-top: 3px;"><polyline points="20 6 9 17 4 12"/></svg>
                    <span><?= htmlspecialchars($inc) ?></span>
                  </li>
                <?php endforeach; ?>
              </ul>
            </div>

            <!-- Exclusions -->
            <div style="background: #FFFFFF; border-radius: var(--radius-xl); padding: 28px; border: 1px solid var(--color-border); box-shadow: var(--shadow-card);">
              <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: #DC2626; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                <span>What Is Not Included</span>
              </h4>
              <ul class="check-list" id="pkgExclusionsList" style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px;">
                <?php 
                  $excs = json_decode($pkg['exclusions_json'] ?? '[]', true) ?: [
                    'Personal expenses (laundry, room service, telephone calls)',
                    'Monument camera fees and optional adventure sports',
                    'Travel insurance (we can arrange on request in INR)',
                    'Anything not explicitly mentioned in the itinerary inclusions'
                  ];
                  foreach ($excs as $exc): 
                ?>
                  <li style="display: flex; align-items: flex-start; gap: 10px; font-size: 0.9rem; color: var(--color-ink-soft); line-height: 1.5;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 3px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    <span><?= htmlspecialchars($exc) ?></span>
                  </li>
                <?php endforeach; ?>
              </ul>
            </div>
          </div>
        </div>

        <!-- Right: Sticky Booking & Quotation Request Widget -->
        <div>
          <div class="enquiry-widget-card" style="position: sticky; top: 100px; background: #FFFFFF; border-radius: var(--radius-xl); padding: 32px; border: 1px solid var(--color-border); box-shadow: var(--shadow-card);">
            <span class="pomaii-eyebrow" style="margin-bottom: 8px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
              <span>ILLUSTRATIVE ESTIMATE</span>
            </span>
            <div style="margin-bottom: 8px;">
              <div style="font-size: 2rem; font-weight: 800; font-family: var(--font-heading); color: var(--color-forest);" id="pkgHeroPrice">
                <?= htmlspecialchars($pkg['sample_price'] ?? 'From ₹28,500') ?>
              </div>
              <div style="font-size: 0.8125rem; color: var(--color-ink-muted);" id="pkgHeroPriceNote">
                <?= htmlspecialchars($pkg['price_note'] ?? 'Per person on twin sharing basis in Indian Rupees (₹)') ?>
              </div>
            </div>

            <p style="font-size: 0.9rem; color: var(--color-ink-soft); line-height: 1.6; margin-bottom: 24px; border-bottom: 1px solid var(--color-border); padding-bottom: 16px;">
              Contact our senior destination advisor for an itemized day-by-day quote tailored to your exact dates and group size.
            </p>

            <form id="detailSidebarQuoteForm" novalidate>
              <div style="display:none;" aria-hidden="true">
                <input type="text" name="website_address_hp" tabindex="-1" autocomplete="off">
              </div>

              <div class="form-group" style="margin-bottom: 14px;">
                <label class="form-label" for="detailSidebarDest">Selected Package</label>
                <input type="text" id="detailSidebarDest" name="destination" class="form-control" value="<?= htmlspecialchars(($pkg['destination'] ?? 'Custom Package') . ' - ' . ($pkg['title'] ?? '')) ?>" readonly style="background: var(--color-paper-warm); font-weight: 600;">
              </div>

              <div class="form-group" style="margin-bottom: 14px;">
                <label class="form-label" for="detailSidebarDepart">Preferred Travel Date *</label>
                <input type="date" id="detailSidebarDepart" name="travelDates" class="form-control" required>
              </div>

              <div class="form-row" style="margin-bottom: 14px;">
                <div class="form-group">
                  <label class="form-label" for="detailSidebarPax">Travellers *</label>
                  <select id="detailSidebarPax" name="numberOfTravellers" class="form-control">
                    <option value="2" selected>2 Travellers</option>
                    <option value="1">1 Solo</option>
                    <option value="3">3 Travellers</option>
                    <option value="4">4 Travellers</option>
                    <option value="5">5+ Family</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label" for="detailSidebarDays">Duration</label>
                  <input type="text" id="detailSidebarDays" name="duration" class="form-control" value="<?= htmlspecialchars($pkg['duration'] ?? '6 Days') ?>">
                </div>
              </div>

              <div class="form-group" style="margin-bottom: 14px;">
                <label class="form-label" for="detailSidebarName">Your Name *</label>
                <input type="text" id="detailSidebarName" name="name" class="form-control" placeholder="e.g. Vikram Singhania" required>
              </div>

              <div class="form-group" style="margin-bottom: 20px;">
                <label class="form-label" for="detailSidebarPhone">WhatsApp / Mobile *</label>
                <input type="tel" id="detailSidebarPhone" name="phone" class="form-control" placeholder="+91 98765 43210" required>
              </div>

              <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">
                Request Personalized Quote &rarr;
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  </section>
</main>
