<?php
/**
 * TravelGrow Consultancy - Secure Admin Login View
 */
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Consultant Login | TravelGrow Consultancy</title>
  <link rel="stylesheet" href="/css/style.css">
  <link rel="stylesheet" href="/css/admin.css">
  <style>
    body {
      background-color: var(--color-paper-warm);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
    }
    .login-card {
      background: #FFFFFF;
      border-radius: var(--radius-xl);
      padding: 40px;
      max-width: 440px;
      width: 100%;
      box-shadow: var(--shadow-modal);
      border: 1px solid var(--color-border);
    }
  </style>
</head>
<body>

  <div class="login-card">
    <div style="text-align: center; margin-bottom: 28px;">
      <div class="brand-icon-pomaii" style="margin: 0 auto 12px; width: 50px; height: 50px;">
        <svg viewBox="0 0 24 24"><path fill="#fff" d="M14 6l-3.8 5L8 8.5 2 17h20L14 6z"/></svg>
      </div>
      <h2 style="font-family: var(--font-heading); margin-bottom: 4px; font-size: 1.5rem;">TravelGrow Desk</h2>
      <p style="font-size: 0.875rem; color: var(--color-ink-soft); margin: 0;">Authorized Consultant Access</p>
    </div>

    <div id="loginErrorAlert" style="display: none; padding: 12px 16px; background: #FEF2F2; color: #991B1B; border-radius: var(--radius-sm); font-size: 0.875rem; margin-bottom: 20px; border: 1px solid #FCA5A5;"></div>

    <form id="adminLoginForm" novalidate>
      <div class="form-group">
        <label class="form-label" for="loginEmail">Consultant Email</label>
        <input type="email" id="loginEmail" name="email" class="form-control" placeholder="admin@travelgrowconsultancy.com" required value="admin@travelgrowconsultancy.com">
      </div>

      <div class="form-group" style="margin-bottom: 24px;">
        <label class="form-label" for="loginPassword">Secure Password</label>
        <input type="password" id="loginPassword" name="password" class="form-control" placeholder="••••••••••••" required>
        <div style="font-size: 0.75rem; color: var(--color-ink-muted); margin-top: 6px;">Demo credentials: admin@travelgrowconsultancy.com / AdminPassword123!</div>
      </div>

      <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;" id="loginSubmitBtn">
        Sign In to Travel Desk &rarr;
      </button>
    </form>

    <div style="margin-top: 24px; text-align: center; font-size: 0.8125rem;">
      <a href="/" style="color: var(--color-ink-muted); text-decoration: underline;">&larr; Return to Public Website</a>
    </div>
  </div>

  <script>
  document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('loginSubmitBtn');
    const alertBox = document.getElementById('loginErrorAlert');
    alertBox.style.display = 'none';

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
      alertBox.textContent = 'Please enter both email and password.';
      alertBox.style.display = 'block';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Verifying credentials...';

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        window.location.href = '/admin';
      } else {
        alertBox.textContent = data.error || 'Invalid credentials. Please verify.';
        alertBox.style.display = 'block';
      }
    } catch (err) {
      alertBox.textContent = 'Network or server error. Please try again.';
      alertBox.style.display = 'block';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Sign In to Travel Desk →';
    }
  });
  </script>
</body>
</html>
