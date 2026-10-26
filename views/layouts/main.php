<?php
/**
 * TravelGrow Consultancy - Main Layout Template
 */
$pageTitle = $pageTitle ?? 'TravelGrow Consultancy | Better Travel Deals, Made Personal';
$activeNav = $activeNav ?? 'home';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  
  <title><?= htmlspecialchars($pageTitle) ?></title>
  <meta name="description" content="Personal travel consultancy for Indian travellers and families. We manually research flight routes, consolidator airfares and bespoke holiday itineraries. Review your transparent quotation before booking.">
  <meta name="keywords" content="travel consultancy India, custom holiday packages, flight deals Mumbai Delhi, Kashmir packages, Kerala houseboat, Dubai family trip, Bali honeymoon, manual travel agent">
  <link rel="canonical" href="https://travelgrowconsultancy.com/">
  
  <!-- Open Graph / Social Media -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://travelgrowconsultancy.com/">
  <meta property="og:title" content="<?= htmlspecialchars($pageTitle) ?>">
  <meta property="og:description" content="Personal travel planning for Indian families and couples. A dedicated travel consultant manually shortlists flight and holiday options tailored to your budget.">
  <meta property="og:image" content="https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80">

  <!-- Stylesheet -->
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>

  <!-- Pomaii Header Component -->
  <?php require __DIR__ . '/header.php'; ?>

  <!-- Main View Content -->
  <main id="mainContent">
    <?= $content ?>
  </main>

  <!-- Pomaii Footer Component -->
  <?php require __DIR__ . '/footer.php'; ?>

  <!-- Core Interactive Scripts -->
  <script src="/js/packages-data.js"></script>
  <script src="/js/enquiry.js"></script>
  <script src="/js/main.js"></script>
</body>
</html>
