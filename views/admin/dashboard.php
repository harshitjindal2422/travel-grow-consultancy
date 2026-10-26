<?php
/**
 * TravelGrow Consultancy - Comprehensive Admin Dashboard View
 * SQL Database Powered (MySQL PDO) with Central Routing
 */
$adminUser = $adminUser ?? \TravelGrow\Core\Session::getAdmin() ?? ['full_name' => 'Lead Consultant', 'role' => 'superadmin'];
$isDbConnected = $isDbConnected ?? false;
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard | TravelGrow Consultancy</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/admin.css">
  <style>
    .sql-status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .sql-status-connected {
      background: #ECFDF5;
      color: #065F46;
      border: 1px solid #A7F3D0;
    }
    .sql-status-fallback {
      background: #FFFBEB;
      color: #92400E;
      border: 1px solid #FDE68A;
    }
  </style>
</head>
<body>

  <!-- LOGIN SCREEN (Fallback if session expires) -->
  <div class="login-wrapper" id="loginWrapper" style="display: none;">
    <div class="login-card">
      <div class="login-brand">
        <div class="login-brand-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <h1 class="login-title">TravelGrow Admin Desk</h1>
        <p class="login-subtitle">Sign in to access consultancy management and quotation engine</p>
      </div>

      <div class="login-alert" id="loginAlert"></div>

      <form class="login-form" id="adminLoginForm">
        <div class="form-group">
          <label for="loginUsername">Username or Admin Email</label>
          <input type="text" id="loginUsername" name="username" required autocomplete="username" placeholder="e.g. admin@travelgrowconsultancy.com" value="admin@travelgrowconsultancy.com">
        </div>
        <div class="form-group">
          <label for="loginPassword">Master Password</label>
          <input type="password" id="loginPassword" name="password" required autocomplete="current-password" placeholder="••••••••••••">
        </div>
        <button type="submit" class="login-btn" id="loginSubmitBtn">
          Authorize &amp; Enter
        </button>
      </form>
    </div>
  </div>

  <!-- MAIN DASHBOARD APPLICATION -->
  <div class="admin-layout" id="adminDashboard" style="display: flex;">
    <!-- Sidebar Navigation -->
    <aside class="admin-sidebar" id="adminSidebar">
      <div class="sidebar-header">
        <a href="/" class="sidebar-brand" target="_blank" title="View public website">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" stroke-width="2.5"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
          <span>Travel<span style="color: var(--admin-orange-500);">Grow</span></span>
        </a>
      </div>

      <nav class="sidebar-nav">
        <a class="nav-link active" data-tab="overview">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          Overview
        </a>
        <a class="nav-link" data-tab="enquiries">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
          Enquiries <span class="badge" id="navNewBadge" style="margin-left: auto; background: var(--admin-orange-500); color: #fff; padding: 2px 7px; border-radius: 999px; font-size: 0.7rem; font-weight: 700; display: none;">0</span>
        </a>
        <a class="nav-link" data-tab="packages">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Holiday Packages
        </a>
        <a class="nav-link" data-tab="destinations">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          Destinations
        </a>
        <a class="nav-link" data-tab="quotations">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          Quotations
        </a>
        <a class="nav-link" data-tab="setup">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          SQL Database Setup
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="sidebar-user-avatar" id="sidebarAvatar"><?= strtoupper(substr($adminUser['full_name'] ?? 'A', 0, 1)) ?></div>
          <div>
            <div style="font-weight: 700; color: #ffffff;" id="sidebarUserName"><?= htmlspecialchars($adminUser['full_name'] ?? 'Admin') ?></div>
            <div style="font-size: 0.75rem; color: var(--admin-slate-400); text-transform: uppercase;" id="sidebarUserRole"><?= htmlspecialchars($adminUser['role'] ?? 'Consultant') ?></div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="admin-main">
      <header class="top-navbar">
        <div style="display: flex; align-items: center; gap: 16px;">
          <button type="button" class="mobile-toggle-btn" id="mobileToggleBtn" aria-label="Toggle menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <div class="page-title-wrap">
            <h2 class="page-title" id="pageTitle">Consultancy Overview</h2>
          </div>
          <?php if ($isDbConnected): ?>
            <span class="sql-status-badge sql-status-connected" style="display: inline-flex; align-items: center; gap: 6px;">
              <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="4"/></svg>
              <span>MySQL Database Connected</span>
            </span>
          <?php else: ?>
            <span class="sql-status-badge sql-status-fallback" style="display: inline-flex; align-items: center; gap: 6px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              <span>MySQL Offline (Fallback Active)</span>
            </span>
          <?php endif; ?>
        </div>

        <div class="top-actions">
          <a href="/" target="_blank" class="btn-sm btn-secondary" style="text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
            <span>Public Site</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
          </a>
          <button type="button" class="logout-btn" id="logoutBtn">
            Sign Out
          </button>
        </div>
      </header>

      <main class="admin-content">
        <!-- TAB 1: OVERVIEW -->
        <section class="tab-panel active" id="tab-overview">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon orange">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <div class="stat-val" id="statNewCount">0</div>
                <div class="stat-lbl">New Inquiries</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon blue">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div>
                <div class="stat-val" id="statContactedCount">0</div>
                <div class="stat-lbl">Contacted</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon purple">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              </div>
              <div>
                <div class="stat-val" id="statQuoteSentCount">0</div>
                <div class="stat-lbl">Quotes Shared</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon green">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <div>
                <div class="stat-val" id="statConfirmedCount">0</div>
                <div class="stat-lbl">Confirmed Bookings</div>
              </div>
            </div>
          </div>

          <div class="content-box">
            <div class="content-box-header">
              <h3 class="content-box-title">Recent Customer Inquiries</h3>
              <button type="button" class="btn-sm btn-secondary" id="viewAllEnquiriesBtn">
                View All Enquiries &rarr;
              </button>
            </div>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Ref No.</th>
                    <th>Type</th>
                    <th>Customer Name</th>
                    <th>Phone</th>
                    <th>Destination</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Received</th>
                    <th>Manage</th>
                  </tr>
                </thead>
                <tbody id="overviewRecentTableBody">
                  <tr><td colspan="9" style="text-align: center; color: var(--admin-slate-500); padding: 32px;">Loading recent enquiries from SQL database...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- TAB 2: ENQUIRIES -->
        <section class="tab-panel" id="tab-enquiries">
          <div class="content-box">
            <div class="content-box-header">
              <h3 class="content-box-title">Customer Enquiries Lifecycle</h3>
            </div>

            <div class="filter-bar">
              <div class="search-input-wrap">
                <input type="text" id="enquirySearchInput" placeholder="Search by name, ref, destination or phone...">
              </div>

              <select class="filter-select" id="enquiryTypeFilter">
                <option value="all">All Request Types</option>
                <option value="holiday">Holiday Package</option>
                <option value="flight">Flight Assistance</option>
                <option value="general">General Consultation</option>
              </select>

              <select class="filter-select" id="enquiryStatusFilter">
                <option value="all">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Quote Sent">Quote Sent</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <button type="button" class="btn-sm btn-secondary" id="refreshEnquiriesBtn" style="display: inline-flex; align-items: center; gap: 6px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                <span>Refresh</span>
              </button>
            </div>

            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Ref No.</th>
                    <th>Type</th>
                    <th>Customer Name</th>
                    <th>Contact Phone</th>
                    <th>Destination</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Received</th>
                    <th>Manage</th>
                  </tr>
                </thead>
                <tbody id="enquiriesTableBody">
                  <tr><td colspan="9" style="text-align: center; color: var(--admin-slate-500); padding: 32px;">Loading client enquiries from SQL database...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- TAB 3: HOLIDAY PACKAGES -->
        <section class="tab-panel" id="tab-packages">
          <div class="content-box">
            <div class="content-box-header">
              <h3 class="content-box-title">Holiday Packages Catalog</h3>
              <button type="button" class="btn-sm btn-primary" id="openNewPackageModalBtn">
                + Create New Package
              </button>
            </div>

            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Package Details</th>
                    <th>Region</th>
                    <th>Duration</th>
                    <th>Indicative Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="packagesTableBody">
                  <tr><td colspan="6" style="text-align: center; color: var(--admin-slate-500); padding: 32px;">Loading packages from database...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- TAB 4: DESTINATIONS -->
        <section class="tab-panel" id="tab-destinations">
          <div class="content-box">
            <div class="content-box-header">
              <h3 class="content-box-title">Featured Travel Destinations</h3>
              <button type="button" class="btn-sm btn-primary" id="openNewDestModalBtn">
                + Add Destination
              </button>
            </div>

            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Destination Name</th>
                    <th>Region</th>
                    <th>Indicative Flight</th>
                    <th>Indicative Package</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="destinationsTableBody">
                  <tr><td colspan="6" style="text-align: center; color: var(--admin-slate-500); padding: 32px;">Loading destinations...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- TAB 5: QUOTATIONS -->
        <section class="tab-panel" id="tab-quotations">
          <div class="content-box">
            <div class="content-box-header">
              <h3 class="content-box-title">Official Client Quotations</h3>
              <button type="button" class="btn-sm btn-primary" id="openNewQuoteModalBtn">
                + Generate Quotation
              </button>
            </div>

            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Quote Ref</th>
                    <th>Customer Name</th>
                    <th>Destination</th>
                    <th>Total Price</th>
                    <th>Validity Window</th>
                    <th>Status</th>
                    <th>Share Link</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="quotationsTableBody">
                  <tr><td colspan="8" style="text-align: center; color: var(--admin-slate-500); padding: 32px;">Loading quotations...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- TAB 6: SETUP & SECURITY -->
        <section class="tab-panel" id="tab-setup">
          <div class="content-box">
            <div class="content-box-header">
              <h3 class="content-box-title">SQL Database Architecture (MySQL / MariaDB via PDO)</h3>
            </div>
            <div style="padding: 24px; line-height: 1.7; font-size: 0.9375rem; color: var(--admin-slate-700);">
              <h4 style="font-family: 'Outfit', sans-serif; font-size: 1.15rem; color: var(--admin-navy-900); margin-bottom: 12px;">Standard SQL Database Engine (No SQLite)</h4>
              <p style="margin-bottom: 16px;">
                All customer enquiries, proposals, quotations, packages, and agent notes are structured in standard MySQL/MariaDB tables defined in <code>database/schema.sql</code>. All queries execute via PHP PDO with strict prepared statement parameterization to prevent SQL injection.
              </p>

              <div class="conditions-box" style="margin-bottom: 24px; background: #F8FAFC; border-left: 4px solid var(--admin-orange-500); padding: 16px;">
                <strong>MySQL Schema Import Command:</strong><br>
                <code>mysql -u root -p &lt; database/schema.sql</code><br><br>
                <strong>Database Settings (in <code>config/database.php</code> or <code>.env</code>):</strong><br>
                Host: <code>127.0.0.1</code> | Port: <code>3306</code> | DB: <code>travelgrow_db</code> | User: <code>root</code>
              </div>

              <h4 style="font-family: 'Outfit', sans-serif; font-size: 1.15rem; color: var(--admin-navy-900); margin-bottom: 12px;">Central Routing Engine</h4>
              <p>
                Every URL is routed through the central PHP Router in <code>index.php</code> (and <code>router.php</code> for local development), ensuring clean RESTful endpoints:
                <code>/</code>, <code>/flights</code>, <code>/holidays</code>, <code>/package-details/{id}</code>, <code>/quote/{token}</code>, <code>/admin</code>, <code>/api/enquiries/*</code>.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>

  <!-- MODAL 1: ENQUIRY DETAILS & MANAGEMENT DRAWER -->
  <div class="modal-overlay" id="enquiryDetailModal">
    <div class="modal-box" style="max-width: 780px;">
      <div class="modal-header">
        <div>
          <div style="font-size: 0.75rem; color: var(--admin-slate-500); font-weight: 700; text-transform: uppercase;">Customer Consultation Request</div>
          <div class="modal-title" id="drawerRefNo">TG-HL-XXXXXX</div>
        </div>
        <button type="button" class="modal-close-btn" onclick="closeModal('enquiryDetailModal')">&times;</button>
      </div>

      <div class="modal-body">
        <div class="detail-grid" id="drawerDetailsGrid"></div>

        <div style="background: var(--admin-slate-50); border: 1px solid var(--admin-slate-200); border-radius: var(--admin-radius-md); padding: 16px; margin-bottom: 24px;">
          <h4 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 12px; color: var(--admin-navy-900);">Consultation Status &amp; Agent Assignment</h4>
          <div class="form-row">
            <div>
              <label style="font-size: 0.8rem; font-weight: 600; color: var(--admin-slate-600); display: block; margin-bottom: 4px;">Update Status:</label>
              <div style="display: flex; gap: 8px;">
                <select id="drawerStatusSelect" class="filter-select" style="flex: 1;">
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Quote Sent">Quote Sent</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <button type="button" class="btn-sm btn-primary" id="drawerUpdateStatusBtn">Update</button>
              </div>
            </div>

            <div>
              <label style="font-size: 0.8rem; font-weight: 600; color: var(--admin-slate-600); display: block; margin-bottom: 4px;">Assign Agent:</label>
              <div style="display: flex; gap: 8px;">
                <select id="drawerAgentSelect" class="filter-select" style="flex: 1;">
                  <option value="">Unassigned</option>
                  <option value="Lead Consultant">Lead Consultant</option>
                  <option value="Flight Desk">Flight Desk</option>
                </select>
                <button type="button" class="btn-sm btn-secondary" id="drawerAssignBtn">Assign</button>
              </div>
            </div>
          </div>

          <div style="margin-top: 12px; text-align: right;">
            <button type="button" class="btn-sm btn-primary" id="drawerQuickQuoteBtn">
              + Generate Official Quotation for this Client
            </button>
          </div>
        </div>

        <div class="notes-container">
          <h4 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 12px; color: var(--admin-navy-900);">Internal Consultation Notes (Private &amp; SQL Persisted)</h4>
          <div class="notes-list" id="drawerNotesList">
            <p style="font-size: 0.85rem; color: var(--admin-slate-500);">No internal notes added yet.</p>
          </div>

          <form id="addNoteForm" style="display: flex; gap: 10px;">
            <input type="text" id="newNoteInput" style="flex: 1; padding: 10px 14px; border: 1px solid var(--admin-slate-300); border-radius: var(--admin-radius-md); font-size: 0.875rem;" placeholder="Add internal agent note..." required>
            <button type="submit" class="btn-sm btn-primary" id="submitNoteBtn">Add Note</button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL 2: PACKAGE CREATE/EDIT -->
  <div class="modal-overlay" id="packageModal">
    <div class="modal-box" style="max-width: 720px;">
      <div class="modal-header">
        <div class="modal-title" id="packageModalTitle">Create Holiday Package</div>
        <button type="button" class="modal-close-btn" onclick="closeModal('packageModal')">&times;</button>
      </div>

      <form id="packageForm">
        <input type="hidden" id="pkgEditId">
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label for="pkgTitle">Package Title *</label>
              <input type="text" id="pkgTitle" required placeholder="e.g. Bali Tropical Serenity &amp; Ubud Retreat">
            </div>
            <div class="form-group">
              <label for="pkgDestination">Destination *</label>
              <input type="text" id="pkgDestination" required placeholder="e.g. Bali, Indonesia">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="pkgRegion">Region *</label>
              <select id="pkgRegion" required>
                <option value="domestic">Domestic (India)</option>
                <option value="international">International</option>
              </select>
            </div>
            <div class="form-group">
              <label for="pkgDuration">Duration *</label>
              <input type="text" id="pkgDuration" required placeholder="e.g. 6 Days / 5 Nights">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="pkgPrice">Indicative Price *</label>
              <input type="text" id="pkgPrice" required placeholder="e.g. ₹28,500 per person">
            </div>
            <div class="form-group">
              <label for="pkgTag">Badge / Tag</label>
              <input type="text" id="pkgTag" placeholder="e.g. Most Popular">
            </div>
          </div>

          <div class="form-group">
            <label for="pkgHeroImage">Hero Image URL *</label>
            <input type="url" id="pkgHeroImage" required placeholder="https://images.unsplash.com/photo-...">
          </div>

          <div class="form-group">
            <label for="pkgDescription">Overview Description *</label>
            <textarea id="pkgDescription" required placeholder="Comprehensive description of this holiday package experience..."></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-sm btn-secondary" onclick="closeModal('packageModal')">Cancel</button>
          <button type="submit" class="btn-sm btn-primary" id="savePackageSubmitBtn">Save Package</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL 3: GENERATE QUOTATION -->
  <div class="modal-overlay" id="quotationModal">
    <div class="modal-box" style="max-width: 760px;">
      <div class="modal-header">
        <div>
          <div style="font-size: 0.75rem; color: var(--admin-slate-500); font-weight: 700; text-transform: uppercase;">Official Client Proposal</div>
          <div class="modal-title">Generate Custom Travel Quotation</div>
        </div>
        <button type="button" class="modal-close-btn" onclick="closeModal('quotationModal')">&times;</button>
      </div>

      <form id="quotationForm">
        <input type="hidden" id="qEnquiryId">
        <input type="hidden" id="qEnquiryRef">

        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label for="qCustomerName">Customer Full Name *</label>
              <input type="text" id="qCustomerName" required placeholder="e.g. Rohan Mehta">
            </div>
            <div class="form-group">
              <label for="qDestination">Destination *</label>
              <input type="text" id="qDestination" required placeholder="e.g. Kashmir Valley &amp; Gulmarg">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="qTotalPrice">Total Quoted Amount (₹ INR) *</label>
              <input type="number" id="qTotalPrice" required placeholder="e.g. 58000">
            </div>
            <div class="form-group">
              <label for="qValidityDate">Price Validity Date *</label>
              <input type="date" id="qValidityDate" required value="<?= date('Y-m-d', strtotime('+7 days')) ?>">
            </div>
          </div>

          <div class="form-group">
            <label for="qInclusions">Inclusions Breakdown</label>
            <textarea id="qInclusions" rows="3" placeholder="• 4-Star boutique hotels&#10;• Daily breakfast and dinner&#10;• Private chauffeur sedan"></textarea>
          </div>

          <div class="form-group">
            <label for="qConditions">Cancellation &amp; Refund Conditions *</label>
            <textarea id="qConditions" rows="2" placeholder="Full refund on land package if cancelled 15 days prior to departure. Flights as per airline rules."></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-sm btn-secondary" onclick="closeModal('quotationModal')">Cancel</button>
          <button type="submit" class="btn-sm btn-primary" id="saveQuotationSubmitBtn">Generate Official Proposal</button>
        </div>
      </form>
    </div>
  </div>

  <script src="/js/admin.js"></script>
</body>
</html>
