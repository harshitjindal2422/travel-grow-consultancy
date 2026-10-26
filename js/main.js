/**
 * TravelGrow Consultancy - Main UI Interactions
 * Navigation, Package Filter, Dynamic Rendering, Destinations,
 * Package Details Viewer, Plan My Trip Wizard & FAQ Accordions
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFaqAccordions();
  initPackageCards();
  initPackageFilters();
  initDestinationsShowcase();
  initPackageDetailPage();
  initPlanMyTripWizard();
  initFaqPageFilters();
  initPomaiiInteractions();
});

// 1. Navigation & Mobile Drawer
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileDrawer');
  const closeBtn = document.getElementById('mobileDrawerClose');
  const overlay = document.getElementById('drawerOverlay');

  // Scroll effect on header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Mobile Drawer toggles
  function openDrawer() {
    drawer?.classList.add('open');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer?.classList.remove('open');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);

  // Close drawer when clicking a mobile link
  document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

// 2. Render Packages dynamically if container exists
function initPackageCards(filterRegion = 'all') {
  const container = document.getElementById('packagesContainer');
  if (!container || typeof SAMPLE_PACKAGES === 'undefined') return;

  const filtered = filterRegion === 'all'
    ? SAMPLE_PACKAGES
    : SAMPLE_PACKAGES.filter(p => p.region === filterRegion);

  container.innerHTML = '';

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: var(--slate-50); border-radius: var(--radius-lg); border: 1px dashed var(--slate-300);">
        <p style="font-size: 1.1rem; color: var(--slate-600); margin-bottom: 12px;">No sample packages found for this region.</p>
        <button type="button" class="btn btn-outline-navy btn-sm js-open-enquiry-modal">Request a Custom Itinerary</button>
      </div>
    `;
    return;
  }

  filtered.forEach(pkg => {
    const card = document.createElement('div');
    card.className = 'package-card';
    card.setAttribute('data-id', pkg.id);
    card.setAttribute('data-region', pkg.region);

    const inclusionsHtml = pkg.inclusions.slice(0, 3).map(inc => `
      <div class="package-inclusion-item">
        <svg class="package-inclusion-icon" viewBox="0 0 20 20">
          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
        </svg>
        <span>${escapeHtml(inc)}</span>
      </div>
    `).join('');

    card.innerHTML = `
      <div class="package-image-wrap">
        <a href="package-details.html?id=${pkg.id}" aria-label="View ${escapeHtml(pkg.title)} details">
          <img src="${pkg.heroImage}" alt="${escapeHtml(pkg.title)}" class="package-image" loading="lazy" />
        </a>
        <span class="package-tag-badge">${escapeHtml(pkg.tag)}</span>
        <span class="package-duration-badge">${escapeHtml(pkg.duration)}</span>
      </div>
      <div class="package-body">
        <div class="package-destination">${escapeHtml(pkg.destination)}</div>
        <h3 class="package-title">
          <a href="package-details.html?id=${pkg.id}" style="color: inherit;">${escapeHtml(pkg.title)}</a>
        </h3>
        <p class="package-desc">${escapeHtml(pkg.description)}</p>
        <div class="package-inclusions-list">
          ${inclusionsHtml}
        </div>
        <div class="package-footer">
          <div class="package-price-wrap">
            <span class="package-price-label">Sample Starting Estimate</span>
            <span class="package-price">${escapeHtml(pkg.samplePrice)}</span>
          </div>
          <div style="display: flex; gap: 8px;">
            <a href="package-details.html?id=${pkg.id}" class="btn btn-outline-navy btn-sm" title="View complete day-by-day itinerary">
              Itinerary
            </a>
            <button type="button" class="btn btn-primary btn-sm request-package-quote-btn" data-pkg-id="${pkg.id}">
              Quote
            </button>
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  attachPackageQuoteButtons();
}

// 3. Package Filters
function initPackageFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (!filterButtons.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterButtons.forEach(b => b.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      const region = target.getAttribute('data-filter') || 'all';
      initPackageCards(region);
    });
  });
}

function attachPackageQuoteButtons() {
  document.querySelectorAll('.request-package-quote-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pkgId = e.currentTarget.getAttribute('data-pkg-id');
      const pkg = SAMPLE_PACKAGES.find(p => p.id === pkgId);
      if (pkg && window.TravelEnquiry) {
        window.TravelEnquiry.openModalForPackage(pkg);
      }
    });
  });
}

// 4. Popular Destinations Showcase
function initDestinationsShowcase() {
  const container = document.getElementById('destinationsContainer');
  if (!container || typeof POPULAR_DESTINATIONS === 'undefined') return;

  container.innerHTML = '';
  POPULAR_DESTINATIONS.forEach(dest => {
    const card = document.createElement('a');
    card.href = dest.pkgRef ? `package-details.html?id=${dest.pkgRef}` : `holidays.html`;
    card.className = 'destination-card';
    card.innerHTML = `
      <img src="${dest.image}" alt="${escapeHtml(dest.name)}" class="destination-card-bg" loading="lazy" />
      <div class="destination-card-overlay"></div>
      <div class="destination-card-content">
        <h3 class="destination-card-title">${escapeHtml(dest.name)}</h3>
        <p class="destination-card-tagline">${escapeHtml(dest.tagline)}</p>
        <div class="destination-card-meta">
          <span style="display: inline-flex; align-items: center; gap: 5px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            <span>Flights: ${escapeHtml(dest.flightSample)}</span>
          </span>
          <span style="display: inline-flex; align-items: center; gap: 5px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            <span>Packages: ${escapeHtml(dest.packageSample)}</span>
          </span>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// 5. Individual Package Details Page Loader
function initPackageDetailPage() {
  const detailContainer = document.getElementById('packageDetailRoot');
  if (!detailContainer || typeof SAMPLE_PACKAGES === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const pkgId = urlParams.get('id') || 'pkg-kashmir-paradise';
  const pkg = SAMPLE_PACKAGES.find(p => p.id === pkgId) || SAMPLE_PACKAGES[0];

  if (!pkg) {
    detailContainer.innerHTML = `
      <div class="container text-center" style="padding: 100px 20px;">
        <h2 class="section-title">Package Not Found</h2>
        <p class="section-subtitle">We couldn't locate this sample package. Please browse our active catalog.</p>
        <a href="holidays.html" class="btn btn-primary" style="margin-top: 20px;">Browse All Packages</a>
      </div>
    `;
    return;
  }

  // Populate title & badges
  document.title = `${pkg.title} | TravelGrow Consultancy`;
  const titleEl = document.getElementById('pkgHeroTitle');
  const destEl = document.getElementById('pkgHeroDest');
  const tagEl = document.getElementById('pkgHeroTag');
  const durationEl = document.getElementById('pkgHeroDuration');
  const priceEl = document.getElementById('pkgHeroPrice');
  const priceNoteEl = document.getElementById('pkgHeroPriceNote');
  const descEl = document.getElementById('pkgHeroDesc');
  const bestTimeEl = document.getElementById('pkgBestTime');

  if (titleEl) titleEl.textContent = pkg.title;
  if (destEl) destEl.textContent = pkg.destination;
  if (tagEl) tagEl.textContent = pkg.tag;
  if (durationEl) durationEl.textContent = pkg.duration;
  if (priceEl) priceEl.textContent = pkg.samplePrice;
  if (priceNoteEl) priceNoteEl.textContent = pkg.priceNote;
  if (descEl) descEl.textContent = pkg.description;
  if (bestTimeEl && pkg.bestTime) bestTimeEl.textContent = pkg.bestTime;

  // Gallery
  const mainImg = document.getElementById('pkgMainGalleryImg');
  const subGallery = document.getElementById('pkgSubGallery');
  if (mainImg) {
    mainImg.src = pkg.gallery?.[0] || pkg.heroImage;
    mainImg.alt = pkg.title;
  }
  if (subGallery && pkg.gallery) {
    subGallery.innerHTML = '';
    pkg.gallery.slice(1, 4).forEach((imgUrl, idx) => {
      const img = document.createElement('img');
      img.src = imgUrl;
      img.alt = `${pkg.title} scene ${idx + 2}`;
      img.className = 'gallery-sub-img';
      img.loading = 'lazy';
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        if (mainImg) mainImg.src = imgUrl;
      });
      subGallery.appendChild(img);
    });
  }

  // Itinerary timeline
  const timelineContainer = document.getElementById('pkgItineraryTimeline');
  if (timelineContainer && pkg.sampleItinerary) {
    timelineContainer.innerHTML = '';
    pkg.sampleItinerary.forEach(item => {
      const dayNode = document.createElement('div');
      dayNode.className = 'itinerary-day-item';
      dayNode.innerHTML = `
        <h4 class="itinerary-day-title">${escapeHtml(item.day)}</h4>
        <p class="itinerary-day-desc">${escapeHtml(item.desc)}</p>
      `;
      timelineContainer.appendChild(dayNode);
    });
  }

  // Inclusions
  const incList = document.getElementById('pkgInclusionsList');
  if (incList && pkg.inclusions) {
    incList.innerHTML = pkg.inclusions.map(inc => `
      <li>
        <svg width="16" height="16" fill="var(--emerald-500)" viewBox="0 0 20 20" style="flex-shrink:0; margin-top:3px;"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
        <span>${escapeHtml(inc)}</span>
      </li>
    `).join('');
  }

  // Exclusions
  const excList = document.getElementById('pkgExclusionsList');
  if (excList && pkg.exclusions) {
    excList.innerHTML = pkg.exclusions.map(exc => `
      <li>
        <svg width="16" height="16" fill="#EF4444" viewBox="0 0 20 20" style="flex-shrink:0; margin-top:3px;"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
        <span>${escapeHtml(exc)}</span>
      </li>
    `).join('');
  }

  // Pre-fill sidebar form with package details
  const prefillInput = document.getElementById('detailSidebarDest');
  if (prefillInput) {
    prefillInput.value = `${pkg.destination} - ${pkg.title}`;
  }

  // Other Recommended Packages
  const otherContainer = document.getElementById('pkgOtherRecommended');
  if (otherContainer) {
    otherContainer.innerHTML = '';
    const otherPackages = SAMPLE_PACKAGES.filter(p => p.id !== pkg.id).slice(0, 3);
    otherPackages.forEach(other => {
      const card = document.createElement('div');
      card.className = 'package-card';
      card.innerHTML = `
        <div class="package-image-wrap" style="height: 180px;">
          <a href="package-details.html?id=${other.id}">
            <img src="${other.heroImage}" alt="${escapeHtml(other.title)}" class="package-image" loading="lazy" />
          </a>
          <span class="package-tag-badge">${escapeHtml(other.tag)}</span>
          <span class="package-duration-badge">${escapeHtml(other.duration)}</span>
        </div>
        <div class="package-body" style="padding: 18px;">
          <h4 style="font-family: var(--font-heading); font-size: 1.05rem; margin-bottom: 8px;">
            <a href="package-details.html?id=${other.id}" style="color: inherit;">${escapeHtml(other.title)}</a>
          </h4>
          <div class="package-footer" style="padding-top: 10px;">
            <span style="font-size: 0.875rem; font-weight: 700; color: var(--navy-900);">${escapeHtml(other.samplePrice)}</span>
            <a href="package-details.html?id=${other.id}" class="btn btn-outline-navy btn-sm">Explore</a>
          </div>
        </div>
      `;
      otherContainer.appendChild(card);
    });
  }
}

// 6. Interactive 'Plan My Trip' Multi-Step Wizard
function initPlanMyTripWizard() {
  const wizard = document.getElementById('planMyTripWizard');
  if (!wizard) return;

  let currentStep = 1;
  const totalSteps = 4;
  const stepNodes = document.querySelectorAll('.wizard-step-node');
  const stepPanes = document.querySelectorAll('.wizard-step-pane');
  const nextBtn = document.getElementById('wizardNextBtn');
  const prevBtn = document.getElementById('wizardPrevBtn');
  const submitBtn = document.getElementById('wizardSubmitBtn');

  // Option card toggle selections
  document.querySelectorAll('.wizard-option-card').forEach(card => {
    card.addEventListener('click', () => {
      const group = card.getAttribute('data-group');
      if (group) {
        document.querySelectorAll(`.wizard-option-card[data-group="${group}"]`).forEach(c => c.classList.remove('selected'));
      }
      card.classList.toggle('selected');
    });
  });

  function updateWizardView() {
    stepPanes.forEach(pane => {
      const paneStep = parseInt(pane.getAttribute('data-step'), 10);
      if (paneStep === currentStep) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    stepNodes.forEach(node => {
      const nodeStep = parseInt(node.getAttribute('data-step'), 10);
      node.classList.remove('active', 'completed');
      if (nodeStep === currentStep) {
        node.classList.add('active');
      } else if (nodeStep < currentStep) {
        node.classList.add('completed');
      }
    });

    if (prevBtn) prevBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
    if (nextBtn) nextBtn.style.display = currentStep < totalSteps ? 'inline-flex' : 'none';
    if (submitBtn) submitBtn.style.display = currentStep === totalSteps ? 'inline-flex' : 'none';
  }

  nextBtn?.addEventListener('click', () => {
    if (currentStep < totalSteps) {
      currentStep++;
      updateWizardView();
      wizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  prevBtn?.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      updateWizardView();
    }
  });
  // Note: wizardFinalForm submission and database persistence is handled by js/enquiry.js
}

// 7. FAQ Page Filter & Search
function initFaqPageFilters() {
  const searchInput = document.getElementById('faqSearchInput');
  const catButtons = document.querySelectorAll('.faq-cat-btn');
  const faqListContainer = document.getElementById('faqsPageList');

  if (!faqListContainer || typeof FAQS_DATA === 'undefined') return;

  function renderFaqs(filterCat = 'all', query = '') {
    const qLower = query.toLowerCase().trim();
    const filtered = FAQS_DATA.filter(item => {
      const matchesCat = filterCat === 'all' || item.category === filterCat;
      const matchesQuery = !query || item.q.toLowerCase().includes(qLower) || item.a.toLowerCase().includes(qLower);
      return matchesCat && matchesQuery;
    });

    faqListContainer.innerHTML = '';
    if (filtered.length === 0) {
      faqListContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; background: var(--white); border-radius: var(--radius-md); border: 1px solid var(--slate-200);">
          <p style="font-size: 1rem; color: var(--slate-600); margin-bottom: 12px;">No matching questions found for "${escapeHtml(query)}".</p>
          <a href="contact.html" class="btn btn-outline-navy btn-sm">Ask an Agent Directly</a>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const faqItem = document.createElement('div');
      faqItem.className = 'faq-item';
      faqItem.innerHTML = `
        <button type="button" class="faq-question" aria-expanded="false">
          <span>${escapeHtml(item.q)}</span>
          <svg class="faq-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
        </button>
        <div class="faq-answer">
          <div class="faq-answer-inner">
            ${escapeHtml(item.a)}
          </div>
        </div>
      `;
      faqListContainer.appendChild(faqItem);
    });

    // Re-attach accordion behaviors
    initFaqAccordions();
  }

  // Initial render on faqs.html
  renderFaqs();

  catButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      catButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat') || 'all';
      renderFaqs(cat, searchInput?.value || '');
    });
  });

  searchInput?.addEventListener('input', (e) => {
    const activeCat = document.querySelector('.faq-cat-btn.active')?.getAttribute('data-cat') || 'all';
    renderFaqs(activeCat, e.target.value);
  });
}

// 8. FAQ Accordion Handler
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    // Remove existing event listener duplicates if re-rendered
    const newBtn = questionBtn?.cloneNode(true);
    if (questionBtn && newBtn && questionBtn.parentNode) {
      questionBtn.parentNode.replaceChild(newBtn, questionBtn);
    }

    newBtn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
          other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        }
      });

      if (isActive) {
        item.classList.remove('active');
        if (answer) answer.style.maxHeight = null;
        newBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
        newBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// 9. Toast Notification System
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${escapeHtml(message)}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// 10. Pomaii-Themed Interactive Handlers (Search Pill, Category Pills, Header Icons)
function initPomaiiInteractions() {
  // A. Floating Search Pill Handler
  const pillSearchBtn = document.getElementById('pillSearchBtn');
  const pillDestSelect = document.getElementById('pillSearchDest');
  const pillCheckIn = document.getElementById('pillCheckIn');
  const pillCheckOut = document.getElementById('pillCheckOut');
  const pillTravelers = document.getElementById('pillTravelers');

  function handlePillSearch() {
    const dest = pillDestSelect ? pillDestSelect.value : 'Custom Destination';
    const travelers = pillTravelers ? pillTravelers.value : '2';
    const checkIn = pillCheckIn ? pillCheckIn.value : '';
    const checkOut = pillCheckOut ? pillCheckOut.value : '';

    // Pre-fill enquiry form fields if present
    const holidayDestInput = document.getElementById('holidayDestination');
    const holidayTravelersInput = document.getElementById('holidayTravelers');
    const holidayDatesInput = document.getElementById('holidayDates');

    if (holidayDestInput) holidayDestInput.value = dest;
    if (holidayTravelersInput) holidayTravelersInput.value = travelers;
    if (holidayDatesInput && checkIn) {
      holidayDatesInput.value = checkOut ? `${checkIn} to ${checkOut}` : checkIn;
    }

    // Also populate modal fields if present
    const modalDestInput = document.getElementById('modalEnquiryDestination');
    if (modalDestInput) modalDestInput.value = dest;

    // Smoothly scroll down to the enquiry desk
    const enquiryDesk = document.getElementById('enquiryDeskSection') || document.getElementById('enquiryWidget');
    if (enquiryDesk) {
      enquiryDesk.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Switch widget tab to Holiday tab if not already active
      const holidayTabBtn = document.querySelector('.widget-tab-btn[data-tab="holiday"]');
      if (holidayTabBtn) holidayTabBtn.click();
    } else {
      // If on another page, open modal
      if (window.TravelEnquiry && typeof window.TravelEnquiry.openModalForPackage === 'function') {
        window.TravelEnquiry.openModalForPackage({ title: dest, destination: dest });
      }
    }

    showToast(`Exploring curated deals for ${dest} (${travelers} travelers)...`, 'info');
  }

  pillSearchBtn?.addEventListener('click', handlePillSearch);
  document.querySelectorAll('.js-pill-search-trigger').forEach(btn => {
    if (btn !== pillSearchBtn) btn.addEventListener('click', handlePillSearch);
  });

  // B. Category Pills Click Handler
  const catPills = document.querySelectorAll('.pomaii-cat-pill');
  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const catName = pill.querySelector('span:not(.cat-icon-circle)')?.textContent?.trim() || 'Theme';
      showToast(`Showing ${catName} packages & handpicked stays`, 'info');
    });
  });

  // C. Header Search Icon Button
  document.querySelectorAll('.js-scroll-search').forEach(btn => {
    btn.addEventListener('click', () => {
      const searchSection = document.getElementById('searchWidgetSection');
      if (searchSection) {
        searchSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        pillDestSelect?.focus();
      } else {
        window.location.href = 'holidays.html';
      }
    });
  });

  // D. Wishlist Heart Toggle
  document.querySelectorAll('.js-wishlist-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const svg = btn.querySelector('svg');
      const isFilled = svg?.getAttribute('fill') === '#EF4444';
      if (isFilled) {
        svg?.setAttribute('fill', 'none');
        svg?.setAttribute('stroke', 'currentColor');
        showToast('Removed from saved wishlist', 'info');
      } else {
        svg?.setAttribute('fill', '#EF4444');
        svg?.setAttribute('stroke', '#EF4444');
        showToast('Saved to your TravelGrow Wishlist!', 'info');
      }
    });
  });
}

function escapeHtml(string) {
  if (!string) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

window.showToast = showToast;
