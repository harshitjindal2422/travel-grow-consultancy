/**
 * TravelGrow Consultancy - Admin Dashboard Client Controller
 * Securely handles session authentication, real-time enquiry filtering,
 * customer detail inspection, internal notes, agent assignment, status updates,
 * holiday package / destination editing, and custom quotation generation.
 */

(function () {
  let currentUser = null;
  let activeTab = 'overview';
  let currentEnquiries = [];
  let currentEnquiryDetail = null;
  let availableAgents = [];

  // ==========================================
  // INITIALIZATION
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initNavigation();
    initMobileDrawer();
    initForms();
  });

  async function initAuth() {
    try {
      const res = await fetch('/api/admin/me');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          currentUser = data.user;
          showDashboard();
          return;
        }
      }
    } catch (e) {
      // Not authenticated
    }
    showLogin();
  }

  function showLogin() {
    document.getElementById('loginWrapper').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
  }

  function showDashboard() {
    document.getElementById('loginWrapper').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'flex';

    // Populate user profile info
    document.getElementById('sidebarUserName').textContent = currentUser.full_name || currentUser.username;
    document.getElementById('sidebarUserRole').textContent = currentUser.role || 'Agent';
    const initials = (currentUser.full_name || currentUser.username).split(' ').map(s => s[0]).join('').substring(0, 2).toUpperCase();
    document.getElementById('sidebarAvatar').textContent = initials;

    loadAgents();
    loadDashboardStats();
    loadEnquiries();
    loadPackages();
    loadDestinations();
    loadQuotations();
  }

  // ==========================================
  // AUTHENTICATION: LOGIN & LOGOUT
  // ==========================================
  const adminLoginForm = document.getElementById('adminLoginForm');
  adminLoginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const alertBox = document.getElementById('loginAlert');
    const submitBtn = document.getElementById('loginSubmitBtn');
    alertBox.style.display = 'none';

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!username || !password) return;

    submitBtn.textContent = 'Verifying...';
    submitBtn.disabled = true;

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      submitBtn.textContent = 'Authorize & Enter';
      submitBtn.disabled = false;

      if (res.ok && data.success) {
        currentUser = data.user;
        adminLoginForm.reset();
        showDashboard();
      } else {
        alertBox.textContent = data.error || 'Invalid username or password.';
        alertBox.style.display = 'block';
      }
    } catch (err) {
      submitBtn.textContent = 'Authorize & Enter';
      submitBtn.disabled = false;
      alertBox.textContent = 'Network or server error. Please ensure server is running.';
      alertBox.style.display = 'block';
    }
  });

  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn?.addEventListener('click', async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (e) {}
    currentUser = null;
    showLogin();
  });

  // ==========================================
  // NAVIGATION & TAB SWITCHING
  // ==========================================
  function initNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.getAttribute('data-tab');
        switchTab(tab);
      });
    });
  }

  window.switchTab = function (tabName) {
    activeTab = tabName;
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-tab') === tabName);
    });

    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `tab-${tabName}`);
    });

    // Update Page Title
    const titles = {
      overview: 'Consultancy Overview',
      enquiries: 'Client Enquiry Intake Hub',
      packages: 'Holiday Packages Catalog',
      destinations: 'Featured Destinations',
      quotations: 'Official Client Quotations',
      setup: 'Setup & Security Reference'
    };
    document.getElementById('pageTitle').textContent = titles[tabName] || 'Admin Dashboard';

    // Close mobile sidebar on select
    document.getElementById('adminSidebar')?.classList.remove('open');
  };

  function initMobileDrawer() {
    const toggleBtn = document.getElementById('mobileToggleBtn');
    const sidebar = document.getElementById('adminSidebar');
    toggleBtn?.addEventListener('click', () => {
      sidebar?.classList.toggle('open');
    });
  }

  // ==========================================
  // DATA LOADERS
  // ==========================================
  async function loadAgents() {
    try {
      const res = await fetch('/api/admin/agents');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          availableAgents = data.agents || [];
          populateAgentDropdowns();
        }
      }
    } catch (e) {}
  }

  function populateAgentDropdowns() {
    const select = document.getElementById('drawerAgentSelect');
    if (!select) return;
    select.innerHTML = '<option value="">Unassigned</option>';
    availableAgents.forEach(agent => {
      const opt = document.createElement('option');
      opt.value = agent.id;
      opt.textContent = `${agent.full_name} (${agent.role})`;
      select.appendChild(opt);
    });
  }

  async function loadDashboardStats() {
    try {
      const res = await fetch('/api/admin/enquiries/stats');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.stats) {
          const s = data.stats;
          document.getElementById('statNewCount').textContent = s.byStatus['New'] || 0;
          document.getElementById('statContactedCount').textContent = s.byStatus['Contacted'] || 0;
          document.getElementById('statQuotesCount').textContent = s.quotesCount || 0;
          document.getElementById('statConfirmedCount').textContent = s.byStatus['Confirmed'] || 0;

          const newBadge = document.getElementById('navNewBadge');
          if (newBadge) {
            const newCount = s.byStatus['New'] || 0;
            newBadge.textContent = newCount;
            newBadge.style.display = newCount > 0 ? 'inline-block' : 'none';
          }
        }
      }
    } catch (e) {}
  }

  // ==========================================
  // ENQUIRIES CONTROLLER
  // ==========================================
  async function loadEnquiries() {
    const q = document.getElementById('enquirySearchInput')?.value || '';
    const type = document.getElementById('enquiryTypeFilter')?.value || 'all';
    const status = document.getElementById('enquiryStatusFilter')?.value || 'all';

    const url = `/api/admin/enquiries?q=${encodeURIComponent(q)}&type=${encodeURIComponent(type)}&status=${encodeURIComponent(status)}&limit=100`;

    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          currentEnquiries = data.enquiries || [];
          document.getElementById('enquiriesTotalCount').textContent = data.total || currentEnquiries.length;
          renderEnquiriesTable(currentEnquiries);
          renderOverviewRecentTable(currentEnquiries.slice(0, 5));
        }
      }
    } catch (e) {}
  }

  function renderEnquiriesTable(enquiries) {
    const tbody = document.getElementById('enquiriesTableBody');
    if (!tbody) return;

    if (enquiries.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--admin-slate-500); padding: 32px;">No matching enquiries found.</td></tr>`;
      return;
    }

    tbody.innerHTML = enquiries.map(e => {
      const dateStr = new Date(e.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const statusClass = `status-${(e.status || 'new').toLowerCase().replace(/\s+/g, '')}`;
      const typeClass = `type-${(e.enquiry_type || 'flight').toLowerCase()}`;

      return `
        <tr>
          <td><strong style="color: var(--admin-navy-900); font-family: 'Outfit', sans-serif;">${escapeHtml(e.reference_no)}</strong></td>
          <td><span class="type-pill ${typeClass}">${escapeHtml(e.enquiry_type)}</span></td>
          <td><strong>${escapeHtml(e.full_name)}</strong></td>
          <td>${escapeHtml(e.phone)}</td>
          <td>${escapeHtml(e.destination)}</td>
          <td><span class="status-pill ${statusClass}">${escapeHtml(e.status || 'New')}</span></td>
          <td>${escapeHtml(e.assigned_to || 'Unassigned')}</td>
          <td><small style="color: var(--admin-slate-500);">${dateStr}</small></td>
          <td>
            <button type="button" class="btn-sm btn-primary" onclick="window.openEnquiryDrawer(${e.id})">
              View &amp; Manage
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderOverviewRecentTable(recent) {
    const tbody = document.getElementById('overviewRecentTable');
    if (!tbody) return;

    if (recent.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--admin-slate-500); padding: 24px;">No enquiries recorded yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = recent.map(e => {
      const dateStr = new Date(e.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      const statusClass = `status-${(e.status || 'new').toLowerCase().replace(/\s+/g, '')}`;
      return `
        <tr>
          <td><strong>${escapeHtml(e.reference_no)}</strong></td>
          <td><span class="type-pill type-${e.enquiry_type}">${escapeHtml(e.enquiry_type)}</span></td>
          <td>${escapeHtml(e.full_name)}</td>
          <td>${escapeHtml(e.destination)}</td>
          <td><span class="status-pill ${statusClass}">${escapeHtml(e.status || 'New')}</span></td>
          <td><small>${dateStr}</small></td>
          <td>
            <button type="button" class="btn-sm btn-secondary" onclick="window.openEnquiryDrawer(${e.id})">
              Open →
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Filter triggers
  document.getElementById('enquirySearchInput')?.addEventListener('input', debounce(loadEnquiries, 300));
  document.getElementById('enquiryTypeFilter')?.addEventListener('change', loadEnquiries);
  document.getElementById('enquiryStatusFilter')?.addEventListener('change', loadEnquiries);
  document.getElementById('refreshEnquiriesBtn')?.addEventListener('click', () => {
    loadEnquiries();
    loadDashboardStats();
  });

  // ==========================================
  // ENQUIRY DETAIL DRAWER
  // ==========================================
  window.openEnquiryDrawer = async function (id) {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`);
      if (!res.ok) return;

      const data = await res.json();
      if (!data.success || !data.enquiry) return;

      currentEnquiryDetail = data.enquiry;
      const e = currentEnquiryDetail;

      document.getElementById('drawerRefNo').textContent = `${e.reference_no} (${(e.enquiry_type || 'flight').toUpperCase()})`;
      document.getElementById('drawerStatusSelect').value = e.status || 'New';
      if (e.assigned_agent_id) {
        document.getElementById('drawerAgentSelect').value = e.assigned_agent_id;
      } else {
        document.getElementById('drawerAgentSelect').value = '';
      }

      // Populate details grid
      const grid = document.getElementById('drawerDetailsGrid');
      let detailsHtml = `
        <div class="detail-item">
          <div class="detail-label">Customer Full Name</div>
          <div class="detail-val">${escapeHtml(e.full_name)}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Contact Phone / WhatsApp</div>
          <div class="detail-val">${escapeHtml(e.phone)}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Customer Email</div>
          <div class="detail-val">${e.email ? escapeHtml(e.email) : '<em>Not provided</em>'}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Primary Destination</div>
          <div class="detail-val">${escapeHtml(e.destination)}</div>
        </div>
      `;

      if (e.enquiry_type === 'flight') {
        detailsHtml += `
          <div class="detail-item">
            <div class="detail-label">Route Details</div>
            <div class="detail-val">${escapeHtml(e.departure_city || 'N/A')} &rarr; ${escapeHtml(e.destination)}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Departure &amp; Return Dates</div>
            <div class="detail-val">${escapeHtml(e.departure_date || 'N/A')} ${e.return_date ? `to ${escapeHtml(e.return_date)}` : '(One-Way)'}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Party &amp; Cabin Class</div>
            <div class="detail-val">${e.adults_count || 1} Adult(s), ${e.children_count || 0} Child(ren) • ${escapeHtml(e.cabin_preference || 'Economy')}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Approximate Budget</div>
            <div class="detail-val">${escapeHtml(e.approximate_budget || 'Flexible')}</div>
          </div>
        `;
      } else if (e.enquiry_type === 'holiday') {
        detailsHtml += `
          <div class="detail-item">
            <div class="detail-label">Travel Dates &amp; Duration</div>
            <div class="detail-val">${escapeHtml(e.travel_dates || 'Flexible')} • ${e.number_of_days || 1} Days</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Party Size &amp; Holiday Style</div>
            <div class="detail-val">${e.travellers_count || 1} Traveller(s) • Type: ${escapeHtml(e.holiday_trip_type || 'other')}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Stated Holiday Budget</div>
            <div class="detail-val">${escapeHtml(e.budget || 'Flexible')}</div>
          </div>
        `;
      }

      if (e.additional_requirements) {
        detailsHtml += `
          <div class="detail-item" style="grid-column: 1 / -1;">
            <div class="detail-label">Additional Client Requirements / Notes</div>
            <div class="detail-val" style="white-space: pre-line; line-height: 1.6;">${escapeHtml(e.additional_requirements)}</div>
          </div>
        `;
      }

      grid.innerHTML = detailsHtml;

      // Render notes
      renderDrawerNotes(data.notes || []);

      openModal('enquiryDetailModal');
    } catch (err) {}
  };

  function renderDrawerNotes(notes) {
    const list = document.getElementById('drawerNotesList');
    if (!list) return;

    if (notes.length === 0) {
      list.innerHTML = `<p style="font-size: 0.85rem; color: var(--admin-slate-500); padding: 8px 0;">No internal consultation notes recorded yet.</p>`;
      return;
    }

    list.innerHTML = notes.map(n => `
      <div class="note-bubble">
        <div class="note-meta">
          <strong>${escapeHtml(n.author_name || 'Agent')}</strong>
          <span>${new Date(n.created_at).toLocaleString('en-GB')}</span>
        </div>
        <div>${escapeHtml(n.note)}</div>
      </div>
    `).join('');
  }

  // Update Status in Drawer
  document.getElementById('drawerUpdateStatusBtn')?.addEventListener('click', async () => {
    if (!currentEnquiryDetail) return;
    const newStatus = document.getElementById('drawerStatusSelect').value;

    try {
      const res = await fetch(`/api/admin/enquiries/${currentEnquiryDetail.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        currentEnquiryDetail.status = newStatus;
        loadEnquiries();
        loadDashboardStats();
        // Reload drawer notes to show audit log
        window.openEnquiryDrawer(currentEnquiryDetail.id);
      }
    } catch (e) {}
  });

  // Assign Agent in Drawer
  document.getElementById('drawerAssignBtn')?.addEventListener('click', async () => {
    if (!currentEnquiryDetail) return;
    const select = document.getElementById('drawerAgentSelect');
    const agentId = select.value;
    const agentName = select.options[select.selectedIndex]?.text || '';

    try {
      const res = await fetch(`/api/admin/enquiries/${currentEnquiryDetail.id}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: agentId || null, agentName: agentId ? agentName : null })
      });

      if (res.ok) {
        loadEnquiries();
        window.openEnquiryDrawer(currentEnquiryDetail.id);
      }
    } catch (e) {}
  });

  // Add Note in Drawer
  document.getElementById('addNoteForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentEnquiryDetail) return;
    const input = document.getElementById('newNoteInput');
    const note = input.value.trim();
    if (!note) return;

    try {
      const res = await fetch(`/api/admin/enquiries/${currentEnquiryDetail.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note })
      });

      if (res.ok) {
        input.value = '';
        window.openEnquiryDrawer(currentEnquiryDetail.id);
      }
    } catch (e) {}
  });

  // Shortcut: Generate Quotation for this Enquiry
  document.getElementById('drawerQuickQuoteBtn')?.addEventListener('click', () => {
    if (!currentEnquiryDetail) return;
    closeModal('enquiryDetailModal');

    // Pre-populate quotation form
    document.getElementById('qEnquiryId').value = currentEnquiryDetail.id;
    document.getElementById('qEnquiryRef').value = currentEnquiryDetail.reference_no;
    document.getElementById('qCustomerName').value = currentEnquiryDetail.full_name || '';
    document.getElementById('qCustomerEmail').value = currentEnquiryDetail.email || '';
    document.getElementById('qCustomerPhone').value = currentEnquiryDetail.phone || '';
    document.getElementById('qDestination').value = currentEnquiryDetail.destination || '';
    document.getElementById('qTitle').value = `Tailored Travel Itinerary for ${currentEnquiryDetail.destination}`;

    openModal('quotationModal');
  });

  // ==========================================
  // HOLIDAY PACKAGES CONTROLLER
  // ==========================================
  async function loadPackages() {
    try {
      const res = await fetch('/api/admin/packages');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          renderPackagesTable(data.packages || []);
        }
      }
    } catch (e) {}
  }

  function renderPackagesTable(packages) {
    const tbody = document.getElementById('packagesTableBody');
    if (!tbody) return;

    if (packages.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--admin-slate-500); padding: 32px;">No holiday packages created yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = packages.map(p => `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="${escapeHtml(p.hero_image)}" alt="" style="width: 52px; height: 52px; border-radius: var(--admin-radius-sm); object-fit: cover;">
            <div>
              <strong style="color: var(--admin-navy-900);">${escapeHtml(p.title)}</strong>
              <div style="font-size: 0.8rem; color: var(--admin-slate-500);">${escapeHtml(p.destination)}</div>
            </div>
          </div>
        </td>
        <td><span class="type-pill type-holiday">${escapeHtml(p.region)}</span></td>
        <td>${escapeHtml(p.duration)}</td>
        <td><strong>${escapeHtml(p.price_indicative)}</strong></td>
        <td>
          <span class="status-pill ${p.is_published ? 'status-confirmed' : 'status-completed'}">
            ${p.is_published ? 'Published' : 'Draft'}
          </span>
        </td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button type="button" class="btn-sm btn-secondary" onclick="window.editPackage('${p.id}')">Edit</button>
            <button type="button" class="btn-sm btn-danger" onclick="window.deletePackage('${p.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  document.getElementById('openNewPackageModalBtn')?.addEventListener('click', () => {
    document.getElementById('packageForm').reset();
    document.getElementById('pkgEditId').value = '';
    document.getElementById('packageModalTitle').textContent = 'Create New Holiday Package';
    openModal('packageModal');
  });

  window.editPackage = async function (id) {
    try {
      const res = await fetch(`/api/packages/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      if (!data.success || !data.package) return;

      const p = data.package;
      document.getElementById('pkgEditId').value = p.id;
      document.getElementById('pkgTitle').value = p.title;
      document.getElementById('pkgDestination').value = p.destination;
      document.getElementById('pkgRegion').value = p.region;
      document.getElementById('pkgDuration').value = p.duration;
      document.getElementById('pkgPrice').value = p.price_indicative;
      document.getElementById('pkgTag').value = p.tag || '';
      document.getElementById('pkgHeroImage').value = p.hero_image;
      document.getElementById('pkgDescription').value = p.description;

      let incs = [];
      try { incs = typeof p.inclusions_json === 'string' ? JSON.parse(p.inclusions_json) : (p.inclusions || []); } catch(e){}
      document.getElementById('pkgInclusions').value = incs.join('\n');

      let excs = [];
      try { excs = typeof p.exclusions_json === 'string' ? JSON.parse(p.exclusions_json) : (p.exclusions || []); } catch(e){}
      document.getElementById('pkgExclusions').value = excs.join('\n');

      document.getElementById('packageModalTitle').textContent = 'Edit Holiday Package';
      openModal('packageModal');
    } catch (e) {}
  };

  window.deletePackage = async function (id) {
    if (!confirm('Are you sure you want to delete this holiday package?')) return;
    try {
      const res = await fetch(`/api/admin/packages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadPackages();
      }
    } catch (e) {}
  };

  document.getElementById('packageForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const editId = document.getElementById('pkgEditId').value;
    const title = document.getElementById('pkgTitle').value.trim();
    const destination = document.getElementById('pkgDestination').value.trim();
    const region = document.getElementById('pkgRegion').value;
    const duration = document.getElementById('pkgDuration').value.trim();
    const price_indicative = document.getElementById('pkgPrice').value.trim();
    const tag = document.getElementById('pkgTag').value.trim();
    const hero_image = document.getElementById('pkgHeroImage').value.trim();
    const description = document.getElementById('pkgDescription').value.trim();
    const inclusions = document.getElementById('pkgInclusions').value.split('\n').map(s => s.trim()).filter(Boolean);
    const exclusions = document.getElementById('pkgExclusions').value.split('\n').map(s => s.trim()).filter(Boolean);

    const payload = {
      title, destination, region, duration, price_indicative,
      tag, hero_image, description, inclusions, exclusions
    };

    const url = editId ? `/api/admin/packages/${editId}` : '/api/admin/packages';
    const method = editId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        closeModal('packageModal');
        loadPackages();
      }
    } catch (e) {}
  });

  // ==========================================
  // DESTINATIONS CONTROLLER
  // ==========================================
  async function loadDestinations() {
    try {
      const res = await fetch('/api/admin/destinations');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          renderDestinationsTable(data.destinations || []);
        }
      }
    } catch (e) {}
  }

  function renderDestinationsTable(destinations) {
    const tbody = document.getElementById('destinationsTableBody');
    if (!tbody) return;

    if (destinations.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--admin-slate-500); padding: 32px;">No destinations found.</td></tr>`;
      return;
    }

    tbody.innerHTML = destinations.map(d => `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${escapeHtml(d.image_url)}" alt="" style="width: 44px; height: 44px; border-radius: var(--admin-radius-sm); object-fit: cover;">
            <div>
              <strong>${escapeHtml(d.name)}</strong>
              <div style="font-size: 0.8rem; color: var(--admin-slate-500);">${escapeHtml(d.tagline || '')}</div>
            </div>
          </div>
        </td>
        <td><span class="type-pill type-general">${escapeHtml(d.region)}</span></td>
        <td>${escapeHtml(d.flight_sample || 'POA')}</td>
        <td>${escapeHtml(d.package_sample || 'POA')}</td>
        <td><span class="status-pill status-confirmed">Active</span></td>
        <td>
          <a href="package-details.html?id=${encodeURIComponent(d.pkg_ref || 'pkg-bali-escape')}" target="_blank" class="btn-sm btn-secondary">
            View Page ↗
          </a>
        </td>
      </tr>
    `).join('');
  }

  // ==========================================
  // QUOTATIONS CONTROLLER
  // ==========================================
  async function loadQuotations() {
    try {
      const res = await fetch('/api/admin/quotations');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          renderQuotationsTable(data.quotations || []);
        }
      }
    } catch (e) {}
  }

  function renderQuotationsTable(quotes) {
    const tbody = document.getElementById('quotationsTableBody');
    if (!tbody) return;

    if (quotes.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--admin-slate-500); padding: 32px;">No official quotations generated yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = quotes.map(q => {
      const shareUrl = `${window.location.origin}/quote.html?token=${encodeURIComponent(q.share_token)}`;
      return `
        <tr>
          <td><strong style="color: var(--admin-navy-900); font-family: 'Outfit', sans-serif;">${escapeHtml(q.id)}</strong></td>
          <td>${escapeHtml(q.customer_name)}</td>
          <td>${escapeHtml(q.destination)}</td>
          <td><strong>${escapeHtml(q.total_price)}</strong></td>
          <td><small style="color: #9A3412;">${escapeHtml(q.validity_date)}</small></td>
          <td><span class="status-pill status-quotesent">${escapeHtml(q.status || 'sent')}</span></td>
          <td>
            <button type="button" class="btn-sm btn-secondary" onclick="window.copyShareLink('${shareUrl}')" style="display: inline-flex; align-items: center; gap: 4px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span>Copy Link</span>
            </button>
          </td>
          <td>
            <div style="display: flex; gap: 6px;">
              <a href="${shareUrl}" target="_blank" class="btn-sm btn-primary" style="display: inline-flex; align-items: center; gap: 4px;">
                <span>Open View</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </a>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  document.getElementById('openNewQuoteModalBtn')?.addEventListener('click', () => {
    document.getElementById('quotationForm').reset();
    document.getElementById('qEnquiryId').value = '';
    document.getElementById('qEnquiryRef').value = '';
    openModal('quotationModal');
  });

  document.getElementById('quotationForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const enquiry_id = document.getElementById('qEnquiryId').value || null;
    const enquiry_ref = document.getElementById('qEnquiryRef').value || null;
    const customer_name = document.getElementById('qCustomerName').value.trim();
    const customer_email = document.getElementById('qCustomerEmail').value.trim() || null;
    const customer_phone = document.getElementById('qCustomerPhone').value.trim() || null;
    const destination = document.getElementById('qDestination').value.trim();
    const title = document.getElementById('qTitle').value.trim();
    const travel_options = document.getElementById('qTravelOptions').value.split('\n').filter(Boolean).map((t, idx) => ({ title: `Option ${idx + 1}`, description: t }));
    const total_price = document.getElementById('qTotalPrice').value.trim();
    const price_breakdown = document.getElementById('qPriceBreakdown').value.trim();
    const validity_date = document.getElementById('qValidityDate').value.trim();
    const inclusions = document.getElementById('qInclusions').value.split('\n').map(s => s.trim()).filter(Boolean);
    const exclusions = document.getElementById('qExclusions').value.split('\n').map(s => s.trim()).filter(Boolean);
    const cancellation_conditions = document.getElementById('qConditions').value.trim();

    const payload = {
      enquiry_id, enquiry_ref, customer_name, customer_email, customer_phone,
      destination, title, travel_options, total_price, price_breakdown,
      validity_date, inclusions, exclusions, cancellation_conditions
    };

    try {
      const res = await fetch('/api/admin/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        closeModal('quotationModal');
        loadQuotations();
        loadDashboardStats();
        switchTab('quotations');
      }
    } catch (e) {}
  });

  window.copyShareLink = function (url) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        alert('Public quotation link copied to clipboard!\nYou can share this with your client via Email or WhatsApp.');
      });
    } else {
      prompt('Copy this quotation share link:', url);
    }
  };

  // ==========================================
  // MODAL UTILITIES
  // ==========================================
  window.openModal = function (modalId) {
    document.getElementById(modalId)?.classList.add('open');
  };

  window.closeModal = function (modalId) {
    document.getElementById(modalId)?.classList.remove('open');
  };

  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  });

  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
})();
