<?php
/**
 * TravelGrow Consultancy - Official Customer Quotation Viewer
 * Pomaii Theme Unified Design
 */
$token = $token ?? '';
?>
<!-- Signature Page Header Banner -->
<section class="pomaii-page-header">
  <div class="container">
    <div class="pomaii-page-hero-card">
      <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80" alt="Consultant reviewing travel proposal" class="hero-bg-photo" loading="lazy">
      <div class="hero-leaf-accent">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M11 20A7 7 0 0 1 4 13C4 7 11 3 11 3S18 7 18 13A7 7 0 0 1 11 20Z"/><path d="M11 13V20"/></svg>
      </div>
      <div class="page-breadcrumb">
        <a href="/">Home</a> <span>/</span> <span>Travel Proposal</span>
      </div>
      <div class="pomaii-eyebrow">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 20A7 7 0 0 1 4 13C4 7 11 3 11 3S18 7 18 13A7 7 0 0 1 11 20Z"/><path d="M11 13V20"/></svg>
        <span>OFFICIAL TRAVEL PROPOSAL</span>
      </div>
      <h1 class="page-title">Your Tailored Travel Quotation</h1>
      <p class="page-subtitle">
        Carefully researched and crafted by your senior travel advisor at Travel Grow Consultancy. Transparent inclusions in Indian Rupees (₹), vetted boutique stays, and clear refund conditions.
      </p>
    </div>
  </div>
</section>

<section class="section" style="padding-top: 30px;">
  <div class="container" style="max-width: 860px;">
    <div id="quotationLoadingState" style="text-align: center; padding: 48px; background: #FFFFFF; border-radius: var(--radius-xl); border: 1px solid var(--color-border); box-shadow: var(--shadow-card);">
      <p style="font-size: 1.1rem; color: var(--color-ink-soft);">Loading official proposal details...</p>
    </div>

    <div id="quotationContentBox" style="display: none; background: #FFFFFF; border-radius: var(--radius-xl); padding: 40px; border: 1px solid var(--color-border); box-shadow: var(--shadow-card);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--color-border); flex-wrap: wrap; gap: 16px;">
        <div>
          <span style="font-size: 0.8125rem; font-weight: 700; color: var(--color-forest); text-transform: uppercase;">Proposal Ref: <span id="qToken"><?= htmlspecialchars($token) ?></span></span>
          <h2 id="qDestination" style="font-family: var(--font-heading); margin-top: 4px; font-size: 1.75rem; font-weight: 800; color: var(--color-ink);">Loading Destination...</h2>
          <div style="font-size: 0.9375rem; color: var(--color-ink-soft);">Prepared for: <strong id="qCustomerName" style="color: var(--color-ink);">Traveller</strong></div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.8125rem; color: var(--color-ink-muted);">Total Estimated Quote</div>
          <div id="qTotalAmount" style="font-size: 2rem; font-weight: 800; font-family: var(--font-heading); color: var(--color-forest);">₹0</div>
          <div style="font-size: 0.75rem; color: var(--color-ink-muted);">Valid until: <span id="qValidity">--</span></div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px;">
        <div style="background: var(--color-paper-warm); padding: 18px 20px; border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
          <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--color-ink-muted); font-weight: 700;">Travel Dates</div>
          <div id="qTravelDates" style="font-weight: 700; color: var(--color-ink); margin-top: 4px; font-size: 1rem;">Flexible</div>
        </div>
        <div style="background: var(--color-paper-warm); padding: 18px 20px; border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
          <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--color-ink-muted); font-weight: 700;">Party Size</div>
          <div id="qPaxCount" style="font-weight: 700; color: var(--color-ink); margin-top: 4px; font-size: 1rem;">2 Adults</div>
        </div>
      </div>

      <div style="margin-bottom: 28px;">
        <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: var(--color-ink); margin-bottom: 10px;">Inclusions &amp; Services</h4>
        <div id="qInclusions" style="white-space: pre-line; line-height: 1.7; color: var(--color-ink-soft); background: var(--color-paper-warm); padding: 20px; border-radius: var(--radius-lg); border: 1px solid var(--color-border); font-size: 0.9375rem;"></div>
      </div>

      <div style="margin-bottom: 32px;">
        <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: var(--color-ink); margin-bottom: 10px;">Cancellation &amp; Refund Conditions</h4>
        <div id="qCancellation" style="white-space: pre-line; line-height: 1.7; color: var(--color-ink-soft); background: #FFFBF0; padding: 20px; border-radius: var(--radius-lg); border-left: 4px solid #F59E0B; border: 1px solid var(--color-border); font-size: 0.9375rem;"></div>
      </div>

      <div style="display: flex; gap: 14px; flex-wrap: wrap;">
        <button type="button" class="btn btn-primary" id="btnApproveQuote" style="flex: 1;">
          Approve Proposal &amp; Confirm Booking &rarr;
        </button>
        <button type="button" class="btn btn-outline-forest" id="btnDiscussQuote">
          Discuss Changes via WhatsApp
        </button>
      </div>

      <div id="quoteDecisionMessage" style="margin-top: 20px; display: none; padding: 16px; border-radius: var(--radius-md); font-weight: 600;"></div>
    </div>
  </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const token = '<?= addslashes($token) ?>';
  if (!token) return;

  fetch('/api/quotes/view?token=' + encodeURIComponent(token))
    .then(res => res.json())
    .then(data => {
      document.getElementById('quotationLoadingState').style.display = 'none';
      if (!data.success || !data.quote) {
        document.getElementById('quotationLoadingState').innerHTML = '<p style="color: #DC2626; font-weight: 700;">Quotation link not found or expired. Please contact your Travel Grow consultant.</p>';
        document.getElementById('quotationLoadingState').style.display = 'block';
        return;
      }
      const q = data.quote;
      document.getElementById('quotationContentBox').style.display = 'block';
      document.getElementById('qDestination').textContent = q.destination || 'Custom Travel Package';
      document.getElementById('qCustomerName').textContent = q.customer_name || 'Valued Traveller';
      document.getElementById('qTotalAmount').textContent = '₹' + Number(q.total_amount || 0).toLocaleString('en-IN');
      document.getElementById('qValidity').textContent = q.valid_until || 'Available upon request';
      document.getElementById('qTravelDates').textContent = q.travel_dates || 'Custom Dates';
      document.getElementById('qPaxCount').textContent = q.pax_count || '2 Travellers';
      document.getElementById('qInclusions').textContent = q.inclusions_text || 'All services as discussed with your advisor.';
      document.getElementById('qCancellation').textContent = q.cancellation_policy || 'Standard hotel and airline terms apply.';

      const btnApprove = document.getElementById('btnApproveQuote');
      const btnDiscuss = document.getElementById('btnDiscussQuote');
      const msgBox = document.getElementById('quoteDecisionMessage');

      btnApprove.addEventListener('click', () => {
        btnApprove.disabled = true;
        btnApprove.textContent = 'Confirming...';
        fetch('/api/quotes/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, action: 'accept' })
        })
        .then(r => r.json())
        .then(res => {
          msgBox.style.display = 'block';
          msgBox.style.background = '#ECFDF5';
          msgBox.style.color = '#065F46';
          msgBox.textContent = '✓ Proposal Approved! Your travel coordinator will contact you immediately to finalize ticketing & vouchers.';
          btnApprove.style.display = 'none';
        })
        .catch(() => {
          btnApprove.disabled = false;
          btnApprove.textContent = 'Approve Proposal & Confirm Booking →';
        });
      });

      btnDiscuss.addEventListener('click', () => {
        const text = encodeURIComponent(`Hi Travel Grow Consultancy, I would like to discuss adjustments on Quote Ref: ${token} for ${q.destination}`);
        window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
      });
    })
    .catch(() => {
      document.getElementById('quotationLoadingState').innerHTML = '<p style="color: #DC2626;">Failed to load quotation. Please refresh or contact your advisor.</p>';
    });
});
</script>
