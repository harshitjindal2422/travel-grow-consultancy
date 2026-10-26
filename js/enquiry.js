/**
 * TravelGrow Consultancy - Client-Side Enquiry & Consultation Engine
 * Handles flight and holiday enquiry submissions, client-side validation,
 * spam honeypot checks, privacy consent, genuine backend SQLite persistence,
 * dynamic reference display, and configurable WhatsApp contact handling.
 *
 * Privacy Notice: No customer personal data is logged to console or exposed in URLs.
 */

window.TravelEnquiry = (function () {
  let appConfig = {
    agencyName: 'TravelGrow Consultancy',
    agencyDomain: 'travelgrowconsultancy.com',
    businessHours: 'Mon-Fri: 08:30 - 18:30 GMT',
    whatsapp: {
      configured: false,
      phoneNumber: null,
      prefilledTemplate: 'Hello TravelGrow Consultancy, I have submitted enquiry {REF_CODE} for {DESTINATION}.',
      directChatTemplate: 'Hello TravelGrow Consultancy, I would like to request an obligation-free quote for my travel plans.'
    }
  };

  async function init() {
    await fetchConfig();
    initHeroWidgetTabs();
    initTripTypeToggles();
    initModalEvents();
    initForms();
    initWhatsAppLinks();
    initModalServiceTypeSwitcher();
    setMinDates();
  }

  // 1. Fetch server-side configuration (WhatsApp status, business info)
  async function fetchConfig() {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        appConfig = Object.assign(appConfig, data);
        updateWhatsAppUI();
      }
    } catch (e) {
      // Graceful fallback to default config
    }
  }

  // Set minimum date on all date pickers to today
  function setMinDates() {
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => {
      input.min = today;
    });
  }

  // 2. Configure WhatsApp triggers
  function initWhatsAppLinks() {
    document.addEventListener('click', (e) => {
      const waTrigger = e.target.closest('.js-whatsapp-link, .floating-whatsapp-btn');
      if (!waTrigger) return;

      const customRef = waTrigger.getAttribute('data-ref') || '';
      const customDest = waTrigger.getAttribute('data-dest') || '';

      if (appConfig.whatsapp && appConfig.whatsapp.configured && appConfig.whatsapp.phoneNumber) {
        // WhatsApp is properly configured with a real phone number
        let message = appConfig.whatsapp.directChatTemplate;
        if (customRef) {
          message = appConfig.whatsapp.prefilledTemplate
            .replace('{REF_CODE}', customRef)
            .replace('{DESTINATION}', customDest || 'my travel destination');
        }
        const cleanPhone = String(appConfig.whatsapp.phoneNumber).replace(/\D/g, '');
        waTrigger.href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
        waTrigger.target = '_blank';
        waTrigger.rel = 'noopener noreferrer';
      } else {
        // WhatsApp is NOT configured with a real phone number
        // NEVER link or dial a fake number!
        e.preventDefault();
        showWhatsAppUnconfiguredNotice();
      }
    });
  }

  function updateWhatsAppUI() {
    const waButtons = document.querySelectorAll('.js-whatsapp-link, .floating-whatsapp-btn');
    if (!appConfig.whatsapp || !appConfig.whatsapp.configured) {
      waButtons.forEach(btn => {
        btn.setAttribute('title', 'Direct WhatsApp line currently being connected');
      });
    }
  }

  function showWhatsAppUnconfiguredNotice() {
    const existing = document.getElementById('waNoticeModal');
    if (existing) existing.remove();

    const modalHtml = `
      <div class="modal-overlay open" id="waNoticeModal" role="dialog" aria-modal="true">
        <div class="modal-box" style="max-width: 480px; text-align: center; padding: 32px 28px;">
          <div style="width: 56px; height: 56px; background-color: rgba(37, 211, 102, 0.15); color: #25D366; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
            <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.585 1.961.945 2.796.945 3.18 0 5.767-2.587 5.767-5.766.001-3.182-2.585-5.732-5.767-5.732zm3.385 8.167c-.144.405-.838.774-1.171.823-.324.047-.745.068-1.205-.08-.307-.099-.7-.253-1.21-.476-2.164-.946-3.57-3.14-3.678-3.283-.107-.144-.874-1.163-.874-2.219 0-1.056.554-1.576.75-1.789.196-.214.429-.268.572-.268.143 0 .287.002.412.008.132.006.309-.05.483.369.179.431.611 1.492.664 1.602.053.109.089.237.018.381-.072.144-.108.234-.215.359-.107.126-.226.281-.322.378-.108.108-.22.226-.095.441.125.215.556.917 1.192 1.484.819.73 1.51.956 1.724 1.064.215.107.341.09.467-.054.125-.144.538-.627.681-.842.143-.215.287-.179.484-.107.197.072 1.253.591 1.468.699.215.108.358.162.412.253.054.09.054.522-.09.927z"/></svg>
          </div>
          <h3 style="font-family: var(--font-heading); font-size: 1.25rem; color: var(--navy-900); margin-bottom: 10px;">
            WhatsApp Direct Consultation Desk
          </h3>
          <p style="font-size: 0.875rem; color: var(--slate-600); line-height: 1.6; margin-bottom: 20px;">
            Our official verified WhatsApp Business channel is currently undergoing automated verification. In the meantime, please submit your travel enquiry via our secure online forms. Our consultants receive requests instantly and will message your provided phone/WhatsApp number directly within 2–4 business hours.
          </p>
          <div class="wa-notice-banner" style="margin-bottom: 20px; text-align: left;">
            <strong>Agency Direct Contact:</strong><br>
            • Email: <a href="mailto:enquiries@travelgrowconsultancy.com" style="color: var(--orange-500);">enquiries@travelgrowconsultancy.com</a><br>
            • Hours: ${appConfig.businessHours}<br>
            • Policy: We never use unverified phone numbers in production.
          </div>
          <button type="button" class="btn btn-primary" id="waNoticeCloseBtn" style="width: 100%;">
            Understood, Continue Online
          </button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('waNoticeCloseBtn')?.addEventListener('click', () => {
      document.getElementById('waNoticeModal')?.remove();
    });
    document.getElementById('waNoticeModal')?.addEventListener('click', (e) => {
      if (e.target.id === 'waNoticeModal') {
        document.getElementById('waNoticeModal')?.remove();
      }
    });
  }

  // 3. Tab Switching in Hero Widget
  function initHeroWidgetTabs() {
    const tabButtons = document.querySelectorAll('.widget-tab-btn');
    const tabPanes = document.querySelectorAll('.enquiry-tab-pane');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        tabButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        tabPanes.forEach(pane => {
          pane.style.display = (pane.id === targetTab) ? 'block' : 'none';
        });
      });
    });
  }

  // 4. Trip Type Toggle (Return vs One-Way vs Multi-City)
  function initTripTypeToggles() {
    document.querySelectorAll('input[name="tripType"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const form = e.target.closest('form');
        if (!form) return;
        const returnGroup = form.querySelector('.js-return-date-group, #returnDateGroup');
        const returnInput = form.querySelector('input[name="returnDate"]');
        if (returnGroup) {
          if (e.target.value === 'oneway') {
            returnGroup.style.display = 'none';
            if (returnInput) returnInput.required = false;
          } else {
            returnGroup.style.display = 'flex';
            if (returnInput && e.target.value === 'return') {
              returnInput.required = true;
            }
          }
        }
      });
    });
  }

  // 5. Validation helpers
  function validatePhoneNumber(phone) {
    if (!phone || typeof phone !== 'string') return false;
    const trimmed = phone.trim();
    const digits = trimmed.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 16) return false;
    return /^\+?[0-9\s\-().]{7,25}$/.test(trimmed);
  }

  function validateFutureDate(dateStr) {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cutoff = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    return d >= cutoff;
  }

  function clearErrors(form) {
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    form.querySelectorAll('.form-field-error').forEach(el => el.remove());
  }

  function showFieldError(input, message) {
    input.classList.add('is-invalid');
    const existing = input.parentElement.querySelector('.form-field-error');
    if (!existing) {
      const err = document.createElement('span');
      err.className = 'form-field-error';
      err.textContent = message;
      input.parentElement.appendChild(err);
    }
  }

  // 6. Generic Form Submission Engine with Genuine Persistence
  function initForms() {
    // Hero flight form
    const heroFlightForm = document.getElementById('heroFlightForm');
    heroFlightForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      submitFlightForm(heroFlightForm);
    });

    // Dedicated flight page form
    const dedicatedFlightForm = document.getElementById('dedicatedFlightForm');
    dedicatedFlightForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      submitFlightForm(dedicatedFlightForm);
    });

    // Hero holiday form
    const heroHolidayForm = document.getElementById('heroHolidayForm');
    heroHolidayForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      submitHolidayForm(heroHolidayForm);
    });

    // Hero corporate form
    const heroCorporateForm = document.getElementById('heroCorporateForm');
    heroCorporateForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      submitCorporateForm(heroCorporateForm);
    });

    // Package details sidebar quote form
    const detailSidebarQuoteForm = document.getElementById('detailSidebarQuoteForm');
    detailSidebarQuoteForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      submitHolidayForm(detailSidebarQuoteForm);
    });

    // Plan my trip wizard final form
    const wizardFinalForm = document.getElementById('wizardFinalForm');
    wizardFinalForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      submitHolidayForm(wizardFinalForm);
    });

    // Contact page form
    const contactPageForm = document.getElementById('contactPageForm');
    contactPageForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      submitGeneralForm(contactPageForm);
    });

    // Home quick contact form
    const homeQuickContactForm = document.getElementById('homeQuickContactForm');
    homeQuickContactForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      submitGeneralForm(homeQuickContactForm);
    });

    // Modal consultation form
    const modalEnquiryForm = document.getElementById('modalEnquiryForm');
    modalEnquiryForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      submitModalForm(modalEnquiryForm);
    });
  }

  // 7. Submit Flight Enquiry
  async function submitFlightForm(form) {
    clearErrors(form);
    const submitBtn = form.querySelector('button[type="submit"]');

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Spam honeypot
    if (data.website_url) {
      if (window.showToast) window.showToast('Submission error. Please retry.', 'error');
      return;
    }

    // Client-side validation
    let hasError = false;

    // Full Name
    const nameInput = form.querySelector('[name="fullName"], [name="name"]');
    const fullName = (data.fullName || data.name || '').trim();
    if (fullName.length < 2) {
      showFieldError(nameInput, 'Full name is required (min 2 characters).');
      hasError = true;
    }

    // Phone
    const phoneInput = form.querySelector('[name="phone"]');
    const phone = (data.phone || '').trim();
    if (!validatePhoneNumber(phone)) {
      showFieldError(phoneInput, 'Valid phone number is required (min 7 digits with country code).');
      hasError = true;
    }

    // Departure City
    const originInput = form.querySelector('[name="departureCity"], [name="origin"]');
    const departureCity = (data.departureCity || data.origin || '').trim();
    if (departureCity.length < 2) {
      showFieldError(originInput, 'Departure city or airport is required.');
      hasError = true;
    }

    // Destination
    const destInput = form.querySelector('[name="destination"]');
    const destination = (data.destination || '').trim();
    if (destination.length < 2) {
      showFieldError(destInput, 'Destination city or airport is required.');
      hasError = true;
    }

    // Departure Date
    const departInput = form.querySelector('[name="departureDate"], [name="departDate"]');
    const departureDate = (data.departureDate || data.departDate || '').trim();
    if (!validateFutureDate(departureDate)) {
      showFieldError(departInput, 'Please select a valid future departure date.');
      hasError = true;
    }

    // Return Date (if return trip)
    const tripType = data.tripType || 'return';
    const returnInput = form.querySelector('[name="returnDate"]');
    const returnDate = (data.returnDate || '').trim();
    if (tripType === 'return') {
      if (!returnDate) {
        showFieldError(returnInput, 'Return date is required for round trips.');
        hasError = true;
      } else if (new Date(returnDate) < new Date(departureDate)) {
        showFieldError(returnInput, 'Return date cannot be earlier than departure date.');
        hasError = true;
      }
    }

    // Adults count
    const adults = parseInt(data.adults || data.adultsCount || 1, 10);
    const children = parseInt(data.children || data.childrenCount || 0, 10);

    // Approximate Budget
    const budgetInput = form.querySelector('[name="approximateBudget"], [name="budget"]');
    const approximateBudget = (data.approximateBudget || data.budget || '').trim();
    if (!approximateBudget && budgetInput) {
      showFieldError(budgetInput, 'Please indicate an approximate budget.');
      hasError = true;
    }

    // Privacy Consent
    const consentInput = form.querySelector('[name="consent"]');
    if (consentInput && !consentInput.checked) {
      showFieldError(consentInput, 'Privacy policy consent is required.');
      hasError = true;
    }

    if (hasError) {
      if (window.showToast) window.showToast('Please correct the highlighted fields.', 'error');
      return;
    }

    // Payload construction (Clean and secure)
    const payload = {
      fullName,
      phone,
      email: (data.email || '').trim() || null,
      departureCity,
      destination,
      departureDate,
      returnDate: tripType === 'return' ? returnDate : null,
      tripType,
      adults: isNaN(adults) ? 1 : adults,
      children: isNaN(children) ? 0 : children,
      cabinPreference: data.cabinPreference || data.cabinClass || 'Economy',
      approximateBudget: approximateBudget || 'Standard Economy / Flexible',
      additionalRequirements: (data.notes || data.additionalRequirements || '').trim(),
      consent: true,
      website_url: ''
    };

    setButtonLoading(submitBtn, true);

    try {
      const response = await fetch('/api/enquiries/flight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      setButtonLoading(submitBtn, false);

      if (response.ok && result.success) {
        form.reset();
        displayConfirmationModal(result.referenceNo, 'Flight Deal & Route Consultation', destination, result.message);
      } else {
        const errorMsg = result.error || 'Failed to submit enquiry. Please check your connection.';
        if (window.showToast) window.showToast(errorMsg, 'error');
        alert(errorMsg);
      }
    } catch (err) {
      setButtonLoading(submitBtn, false);
      if (window.showToast) window.showToast('Network error while saving enquiry. Please retry.', 'error');
    }
  }

  // 8. Submit Holiday Enquiry
  async function submitHolidayForm(form) {
    clearErrors(form);
    const submitBtn = form.querySelector('button[type="submit"]');

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (data.website_url) {
      if (window.showToast) window.showToast('Submission error.', 'error');
      return;
    }

    let hasError = false;

    const nameInput = form.querySelector('[name="name"], [name="fullName"]');
    const name = (data.name || data.fullName || '').trim();
    if (name.length < 2) {
      showFieldError(nameInput, 'Full name is required (min 2 characters).');
      hasError = true;
    }

    const phoneInput = form.querySelector('[name="phone"]');
    const phone = (data.phone || '').trim();
    if (!validatePhoneNumber(phone)) {
      showFieldError(phoneInput, 'Valid phone number is required (min 7 digits).');
      hasError = true;
    }

    const destInput = form.querySelector('[name="destination"], [name="destIdea"]');
    const destination = (data.destination || data.destIdea || '').trim();
    if (destination.length < 2) {
      showFieldError(destInput, 'Destination is required.');
      hasError = true;
    }

    const datesInput = form.querySelector('[name="travelDates"], [name="departDate"], [name="exactDate"], [name="timing"]');
    const travelDates = (data.travelDates || data.departDate || data.exactDate || data.timing || '').trim();
    if (!travelDates) {
      showFieldError(datesInput, 'Please specify travel dates or season.');
      hasError = true;
    }

    const travellersInput = form.querySelector('[name="numberOfTravellers"], [name="travellers"], [name="passengers"]');
    let numberOfTravellers = parseInt(data.numberOfTravellers || data.travellers || data.passengers || 2, 10);
    if (isNaN(numberOfTravellers) || numberOfTravellers < 1) {
      numberOfTravellers = 2;
    }

    const daysInput = form.querySelector('[name="numberOfDays"], [name="durationDays"], [name="duration"]');
    let numberOfDays = parseInt(data.numberOfDays || data.durationDays || data.duration || 7, 10);
    if (isNaN(numberOfDays) || numberOfDays < 1) {
      numberOfDays = 7;
    }

    const budgetInput = form.querySelector('[name="budget"]');
    const budget = (data.budget || '').trim();
    if (!budget && budgetInput) {
      showFieldError(budgetInput, 'Please select your budget range.');
      hasError = true;
    }

    const tripTypeInput = form.querySelector('[name="tripType"], [name="style"]');
    const tripType = (data.tripType || data.style || 'family').toLowerCase();

    const consentInput = form.querySelector('[name="consent"]');
    if (consentInput && !consentInput.checked) {
      showFieldError(consentInput, 'Privacy policy consent is required.');
      hasError = true;
    }

    if (hasError) {
      if (window.showToast) window.showToast('Please correct highlighted fields.', 'error');
      return;
    }

    const payload = {
      name,
      phone,
      email: (data.email || '').trim() || null,
      destination,
      travelDates,
      numberOfTravellers,
      numberOfDays,
      budget: budget || '₹40,000 - ₹80,000 / person',
      tripType: ['family', 'honeymoon', 'solo', 'group', 'other'].includes(tripType) ? tripType : 'other',
      additionalRequirements: (data.additionalRequirements || data.notes || data.specialRequests || '').trim(),
      consent: true,
      website_url: ''
    };

    setButtonLoading(submitBtn, true);

    try {
      const response = await fetch('/api/enquiries/holiday', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      setButtonLoading(submitBtn, false);

      if (response.ok && result.success) {
        form.reset();
        displayConfirmationModal(result.referenceNo, 'Custom Holiday Package Consultation', destination, result.message);
      } else {
        const errorMsg = result.error || 'Failed to submit enquiry.';
        if (window.showToast) window.showToast(errorMsg, 'error');
        alert(errorMsg);
      }
    } catch (err) {
      setButtonLoading(submitBtn, false);
      if (window.showToast) window.showToast('Network error saving enquiry.', 'error');
    }
  }

  // 9. Submit Corporate / Group
  async function submitCorporateForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const payload = {
      name: (data.fullName || data.contactPerson || 'Group Organizer').trim(),
      phone: (data.phone || '').trim(),
      email: (data.email || '').trim() || null,
      destination: (data.destination || 'Corporate / Group Destination').trim(),
      travelDates: (data.departDate || data.targetDates || 'Flexible').trim(),
      numberOfTravellers: parseInt(data.passengers || data.groupSize || 10, 10),
      numberOfDays: 5,
      budget: 'Tailored Corporate / Group Budget',
      tripType: 'group',
      additionalRequirements: `Company: ${data.company || 'N/A'}. ${data.notes || ''}`.trim(),
      consent: true,
      website_url: data.website_url || ''
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    setButtonLoading(submitBtn, true);

    try {
      const response = await fetch('/api/enquiries/holiday', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      setButtonLoading(submitBtn, false);

      if (response.ok && result.success) {
        form.reset();
        displayConfirmationModal(result.referenceNo, 'Corporate & Group Travel', payload.destination, result.message);
      } else {
        alert(result.error || 'Error processing request.');
      }
    } catch (e) {
      setButtonLoading(submitBtn, false);
      alert('Network error while saving enquiry.');
    }
  }

  // 10. Submit General Advisory / Callback Form
  async function submitGeneralForm(form) {
    clearErrors(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (data.website_url) return;

    let hasError = false;
    const nameInput = form.querySelector('[name="fullName"], [name="name"]');
    const fullName = (data.fullName || data.name || '').trim();
    if (fullName.length < 2) {
      showFieldError(nameInput, 'Please provide your name.');
      hasError = true;
    }

    const phoneInput = form.querySelector('[name="phone"]');
    const phone = (data.phone || '').trim();
    if (!validatePhoneNumber(phone)) {
      showFieldError(phoneInput, 'Valid phone number is required.');
      hasError = true;
    }

    const consentInput = form.querySelector('[name="consent"]');
    if (consentInput && !consentInput.checked) {
      showFieldError(consentInput, 'Privacy consent is required.');
      hasError = true;
    }

    if (hasError) return;

    const payload = {
      fullName,
      phone,
      email: (data.email || '').trim() || null,
      destination: (data.destination || 'Advisory Request').trim(),
      departDate: (data.departDate || data.targetDate || '').trim(),
      passengers: data.passengers || '2 Adults',
      notes: (data.notes || data.message || '').trim(),
      consent: true,
      website_url: ''
    };

    setButtonLoading(submitBtn, true);

    try {
      const response = await fetch('/api/enquiries/general', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      setButtonLoading(submitBtn, false);

      if (response.ok && result.success) {
        form.reset();
        displayConfirmationModal(result.referenceNo, 'Travel Advisory & Callback', payload.destination, result.message);
      } else {
        alert(result.error || 'Error processing request.');
      }
    } catch (e) {
      setButtonLoading(submitBtn, false);
      alert('Network error while saving request.');
    }
  }

  // 11. Submit Modal Form
  function submitModalForm(form) {
    const serviceType = document.getElementById('modalServiceType')?.value || 'holiday';
    if (serviceType === 'flight') {
      submitFlightForm(form);
    } else {
      submitHolidayForm(form);
    }
  }

  function setButtonLoading(btn, isLoading) {
    if (!btn) return;
    if (isLoading) {
      btn.classList.add('is-loading');
      btn.disabled = true;
    } else {
      btn.classList.remove('is-loading');
      btn.disabled = false;
    }
  }

  // 12. Modal Form Category Switcher (Flight vs Holiday fields)
  function initModalServiceTypeSwitcher() {
    const serviceSelect = document.getElementById('modalServiceType');
    if (!serviceSelect) return;

    serviceSelect.addEventListener('change', () => {
      const isFlight = serviceSelect.value === 'flight';
      const flightFields = document.querySelectorAll('.modal-flight-field');
      const holidayFields = document.querySelectorAll('.modal-holiday-field');

      flightFields.forEach(el => el.style.display = isFlight ? 'block' : 'none');
      holidayFields.forEach(el => el.style.display = isFlight ? 'none' : 'block');
    });
  }

  // 13. Display Confirmation State
  function displayConfirmationModal(refCode, category, destination, message) {
    const modal = document.getElementById('enquiryModal');
    const formView = document.getElementById('modalFormState');
    const successView = document.getElementById('modalSuccessState');
    const refDisplay = document.getElementById('modalRefCodeDisplay');
    const waBtn = document.getElementById('modalWhatsAppShareBtn');
    const nextStepsList = document.getElementById('modalNextStepsList');

    if (formView) formView.style.display = 'none';
    if (successView) successView.style.display = 'block';

    if (refDisplay) refDisplay.textContent = refCode;

    // Configure WhatsApp button on success view
    if (waBtn) {
      if (appConfig.whatsapp && appConfig.whatsapp.configured && appConfig.whatsapp.phoneNumber) {
        const cleanPhone = String(appConfig.whatsapp.phoneNumber).replace(/\D/g, '');
        const messageText = appConfig.whatsapp.prefilledTemplate
          .replace('{REF_CODE}', refCode)
          .replace('{DESTINATION}', destination || 'my trip');
        waBtn.href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
        waBtn.target = '_blank';
        waBtn.rel = 'noopener noreferrer';
        waBtn.style.display = 'inline-flex';
      } else {
        // WhatsApp direct line not configured: hide external wa link, show advisor notice
        waBtn.style.display = 'none';
      }
    }

    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else if (window.showToast) {
      window.showToast(`Enquiry ${refCode} saved! Our advisors will review and reply within 2-4 hours.`, 'success');
    }
  }

  // 14. Modal Triggers & Lifecycle
  function initModalEvents() {
    const modal = document.getElementById('enquiryModal');
    const closeBtns = document.querySelectorAll('.js-close-modal');
    const triggers = document.querySelectorAll('.js-open-enquiry-modal');

    triggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    closeBtns.forEach(btn => {
      btn.addEventListener('click', closeModal);
    });

    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal?.classList.contains('open')) {
        closeModal();
      }
    });
  }

  function openModal(prefillData = null) {
    const modal = document.getElementById('enquiryModal');
    const formView = document.getElementById('modalFormState');
    const successView = document.getElementById('modalSuccessState');

    if (!modal) return;

    if (formView) formView.style.display = 'block';
    if (successView) successView.style.display = 'none';

    if (prefillData) {
      const typeSelect = document.getElementById('modalServiceType');
      const notesField = document.getElementById('modalSpecialRequests');
      const destField = document.getElementById('modalDestination');

      if (typeSelect && prefillData.serviceType) {
        typeSelect.value = prefillData.serviceType;
        typeSelect.dispatchEvent(new Event('change'));
      }
      if (destField && prefillData.destination) {
        destField.value = prefillData.destination;
      }
      if (notesField && prefillData.notes) {
        notesField.value = prefillData.notes;
      }
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const modal = document.getElementById('enquiryModal');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function openModalForPackage(pkg) {
    openModal({
      serviceType: 'holiday',
      destination: `${pkg.destination} - ${pkg.title}`,
      notes: `Package Ref: ${pkg.id} (${pkg.duration}). Requesting customized flight & accommodation quotation.`
    });
  }

  function openModalForFlightRoute(from, to, cabin) {
    openModal({
      serviceType: 'flight',
      destination: `${to}`,
      notes: `Route: ${from} to ${to}. Cabin: ${cabin || 'Economy'}. Please research consolidator and flexible fare quotes.`
    });
  }

  return {
    init,
    openModal,
    closeModal,
    openModalForPackage,
    openModalForFlightRoute,
    displayConfirmationModal
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  window.TravelEnquiry.init();
});
