<?php
/**
 * TravelGrow Consultancy - Central Front Controller & Router
 * Everything is routed through this single entry point.
 */

declare(strict_types=1);

// 1. PSR-4 Autoloader
spl_autoload_register(function (string $class) {
    $prefix = 'TravelGrow\\';
    $baseDir = __DIR__ . '/';

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relativeClass = substr($class, $len);
    // Convert namespace to path: Core\Router -> core/Router.php
    $parts = explode('\\', $relativeClass);
    $className = array_pop($parts);
    $subDir = strtolower(implode('/', $parts));
    $file = $baseDir . ($subDir ? $subDir . '/' : '') . $className . '.php';

    if (file_exists($file)) {
        require_once $file;
    }
});

use TravelGrow\Core\Request;
use TravelGrow\Core\Router;
use TravelGrow\Controllers\HomeController;
use TravelGrow\Controllers\PageController;
use TravelGrow\Controllers\EnquiryController;
use TravelGrow\Controllers\AdminController;
use TravelGrow\Controllers\ApiController;

// 2. Initialize Request & Router
$request = new Request();
$router = new Router();

// ============================================================================
// Public Page Routes (All rendered through central router)
// ============================================================================
$router->get('/', [HomeController::class, 'index']);
$router->get('/flights', [PageController::class, 'flights']);
$router->get('/holidays', [PageController::class, 'holidays']);
$router->get('/package-details', [PageController::class, 'packageDetails']);
$router->get('/package-details/{id}', [PageController::class, 'packageDetails']);
$router->get('/plan-my-trip', [PageController::class, 'planMyTrip']);
$router->get('/about', [PageController::class, 'about']);
$router->get('/contact', [PageController::class, 'contact']);
$router->get('/faqs', [PageController::class, 'faqs']);
$router->get('/how-it-works', [PageController::class, 'howItWorks']);
$router->get('/privacy-policy', [PageController::class, 'privacyPolicy']);
$router->get('/terms-conditions', [PageController::class, 'termsConditions']);
$router->get('/cancellation-refund', [PageController::class, 'cancellationRefund']);
$router->get('/quote', [PageController::class, 'quote']);
$router->get('/quote/{token}', [PageController::class, 'quote']);

// Compatibility with .html extension URLs if requested
$router->get('/index.html', [HomeController::class, 'index']);
$router->get('/flights.html', [PageController::class, 'flights']);
$router->get('/holidays.html', [PageController::class, 'holidays']);
$router->get('/package-details.html', [PageController::class, 'packageDetails']);
$router->get('/plan-my-trip.html', [PageController::class, 'planMyTrip']);
$router->get('/about.html', [PageController::class, 'about']);
$router->get('/contact.html', [PageController::class, 'contact']);
$router->get('/faqs.html', [PageController::class, 'faqs']);
$router->get('/how-it-works.html', [PageController::class, 'howItWorks']);
$router->get('/privacy-policy.html', [PageController::class, 'privacyPolicy']);
$router->get('/terms-conditions.html', [PageController::class, 'termsConditions']);
$router->get('/cancellation-refund.html', [PageController::class, 'cancellationRefund']);
$router->get('/quote.html', [PageController::class, 'quote']);

// ============================================================================
// Public APIs
// ============================================================================
$router->get('/api/config', [ApiController::class, 'config']);
$router->get('/api/packages', [ApiController::class, 'packages']);
$router->get('/api/quotations/view/{token}', [ApiController::class, 'viewQuotation']);

// Customer Enquiry Submissions (Flight, Holiday, General)
$router->post('/api/enquiries/flight', [EnquiryController::class, 'flight']);
$router->post('/api/enquiries/holiday', [EnquiryController::class, 'holiday']);
$router->post('/api/enquiries/general', [EnquiryController::class, 'general']);

// ============================================================================
// Admin Dashboard & Management Routes (SQL Database Powered)
// ============================================================================
$router->get('/admin', [AdminController::class, 'dashboard']);
$router->get('/admin/login', [AdminController::class, 'loginView']);
$router->post('/admin/login', [AdminController::class, 'login']);
$router->get('/admin/logout', [AdminController::class, 'logout']);

// Admin REST APIs
$router->post('/api/admin/login', [AdminController::class, 'login']);
$router->post('/api/admin/logout', [AdminController::class, 'logout']);
$router->get('/api/admin/me', [AdminController::class, 'me']);
$router->get('/api/admin/enquiries/stats', [AdminController::class, 'stats']);
$router->get('/api/admin/enquiries', [AdminController::class, 'enquiries']);
$router->get('/api/admin/enquiries/{id}', [AdminController::class, 'enquiryDetail']);
$router->post('/api/admin/enquiries/{id}/status', [AdminController::class, 'updateStatus']);
$router->post('/api/admin/enquiries/{id}/assign', [AdminController::class, 'assignEnquiry']);
$router->post('/api/admin/enquiries/{id}/notes', [AdminController::class, 'addNote']);
$router->get('/api/admin/packages', [AdminController::class, 'packages']);
$router->post('/api/admin/packages', [AdminController::class, 'createPackage']);
$router->put('/api/admin/packages/{id}', [AdminController::class, 'updatePackage']);
$router->post('/api/admin/quotations', [AdminController::class, 'createQuotation']);

// 3. Dispatch Request
$router->dispatch($request);
