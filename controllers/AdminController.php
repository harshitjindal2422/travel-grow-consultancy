<?php
/**
 * TravelGrow Consultancy - Secure Admin Controller
 * Authentication, Enquiry Lifecycle, Package Management & Quotations in SQL
 */

namespace TravelGrow\Controllers;

use TravelGrow\Core\Request;
use TravelGrow\Core\Response;
use TravelGrow\Core\Session;
use TravelGrow\Core\View;
use TravelGrow\Database\Database;

class AdminController
{
    private Database $db;
    private array $config;

    public function __construct()
    {
        $this->db = Database::getInstance();
        $this->config = require dirname(__DIR__) . '/config/config.php';
        Session::start();
    }

    /**
     * Require Admin Authentication
     */
    private function requireAuth(): ?array
    {
        $admin = Session::getAdmin();
        if (!$admin) {
            // Check Authorization Header Bearer token if used by API
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
            if (str_starts_with($authHeader, 'Bearer ')) {
                $token = substr($authHeader, 7);
                $sessionToken = Session::get('api_token');
                if ($token === $sessionToken && Session::getAdmin()) {
                    return Session::getAdmin();
                }
            }

            Response::json(['success' => false, 'error' => 'Unauthorized. Please login.'], 401);
            return null;
        }
        return $admin;
    }

    /**
     * GET /admin/login
     */
    public function loginView(Request $request): void
    {
        if (Session::isAuthenticated()) {
            Response::redirect('/admin');
            return;
        }

        View::render('admin/login', [
            'pageTitle' => 'Admin Login | TravelGrow Consultancy',
            'error'     => null,
        ], null);
    }

    /**
     * POST /admin/login or POST /api/admin/login
     */
    public function login(Request $request): void
    {
        $body = $request->getBody();
        $email = trim($body['email'] ?? $body['username'] ?? '');
        $password = trim($body['password'] ?? '');

        if (empty($email) || empty($password)) {
            Response::error('Email and password are required.', 400);
            return;
        }

        $admin = null;

        // Query SQL Database
        if ($this->db->isConnected()) {
            $admin = $this->db->fetch("SELECT * FROM `admins` WHERE `email` = ? AND `is_active` = 1 LIMIT 1", [$email]);
        }

        $isValid = false;
        if ($admin && password_verify($password, $admin['password_hash'])) {
            $isValid = true;
        } elseif ($email === $this->config['admin_email'] && $password === $this->config['admin_password']) {
            // Demo fallback if database is not yet migrated
            $isValid = true;
            $admin = [
                'id'        => 1,
                'email'     => $this->config['admin_email'],
                'full_name' => 'Lead Travel Consultant',
                'role'      => 'superadmin',
            ];
        }

        if (!$isValid || !$admin) {
            Response::error('Invalid email or password.', 401);
            return;
        }

        // Establish session
        unset($admin['password_hash']);
        $token = bin2hex(random_bytes(24));
        Session::set('admin_user', $admin);
        Session::set('api_token', $token);

        // Update last login in SQL
        if ($this->db->isConnected() && isset($admin['id'])) {
            $this->db->query("UPDATE `admins` SET `last_login` = NOW() WHERE `id` = ?", [$admin['id']]);
        }

        Response::json([
            'success' => true,
            'token'   => $token,
            'user'    => $admin,
            'message' => 'Logged in successfully.',
        ]);
    }

    /**
     * POST /api/admin/logout or GET /admin/logout
     */
    public function logout(Request $request): void
    {
        Session::destroy();
        if ($request->isJson()) {
            Response::json(['success' => true, 'message' => 'Logged out successfully.']);
            return;
        }
        Response::redirect('/admin/login');
    }

    /**
     * GET /admin (Dashboard HTML page)
     */
    public function dashboard(Request $request): void
    {
        if (!Session::isAuthenticated()) {
            Response::redirect('/admin/login');
            return;
        }

        View::render('admin/dashboard', [
            'pageTitle' => 'Admin Dashboard | TravelGrow Consultancy',
            'adminUser' => Session::getAdmin(),
            'isDbConnected' => $this->db->isConnected(),
        ], null);
    }

    /**
     * GET /api/admin/me
     */
    public function me(Request $request): void
    {
        $admin = $this->requireAuth();
        Response::json(['success' => true, 'user' => $admin]);
    }

    /**
     * GET /api/admin/enquiries/stats
     */
    public function stats(Request $request): void
    {
        $this->requireAuth();

        $stats = [
            'total'     => 0,
            'new'       => 0,
            'contacted' => 0,
            'quoteSent' => 0,
            'confirmed' => 0,
            'completed' => 0,
            'cancelled' => 0,
        ];

        if ($this->db->isConnected()) {
            $rows = $this->db->fetchAll("SELECT `status`, COUNT(*) as count FROM `enquiries` GROUP BY `status`");
            $total = 0;
            foreach ($rows as $row) {
                $status = $row['status'];
                $cnt = (int)$row['count'];
                $total += $cnt;
                if ($status === 'New') $stats['new'] = $cnt;
                if ($status === 'Contacted') $stats['contacted'] = $cnt;
                if ($status === 'Quote Sent') $stats['quoteSent'] = $cnt;
                if ($status === 'Confirmed') $stats['confirmed'] = $cnt;
                if ($status === 'Completed') $stats['completed'] = $cnt;
                if ($status === 'Cancelled') $stats['cancelled'] = $cnt;
            }
            $stats['total'] = $total;
        } else {
            $records = $this->db->getFallbackRecords('enquiries');
            $stats['total'] = count($records);
            foreach ($records as $r) {
                $st = $r['status'] ?? 'New';
                if ($st === 'New') $stats['new']++;
                elseif ($st === 'Contacted') $stats['contacted']++;
                elseif ($st === 'Quote Sent') $stats['quoteSent']++;
                elseif ($st === 'Confirmed') $stats['confirmed']++;
                elseif ($st === 'Completed') $stats['completed']++;
                elseif ($st === 'Cancelled') $stats['cancelled']++;
            }
        }

        Response::json(['success' => true, 'stats' => $stats]);
    }

    /**
     * GET /api/admin/enquiries
     */
    public function enquiries(Request $request): void
    {
        $this->requireAuth();

        $type = $request->getQuery('type');
        $status = $request->getQuery('status');
        $query = trim($request->getQuery('q', ''));
        $page = max(1, (int)$request->getQuery('page', 1));
        $limit = min(50, max(1, (int)$request->getQuery('limit', 20)));
        $offset = ($page - 1) * $limit;

        $conditions = [];
        $params = [];

        if (!empty($type) && $type !== 'all') {
            $conditions[] = "`type` = ?";
            $params[] = $type;
        }
        if (!empty($status) && $status !== 'all') {
            $conditions[] = "`status` = ?";
            $params[] = $status;
        }
        if (!empty($query)) {
            $conditions[] = "(`ref_number` LIKE ? OR `full_name` LIKE ? OR `phone` LIKE ? OR `destination` LIKE ?)";
            $qLike = "%{$query}%";
            $params[] = $qLike;
            $params[] = $qLike;
            $params[] = $qLike;
            $params[] = $qLike;
        }

        $whereSql = !empty($conditions) ? ('WHERE ' . implode(' AND ', $conditions)) : '';

        $enquiries = [];
        $total = 0;

        if ($this->db->isConnected()) {
            $countRow = $this->db->fetch("SELECT COUNT(*) as count FROM `enquiries` {$whereSql}", $params);
            $total = (int)($countRow['count'] ?? 0);

            $sql = "SELECT * FROM `enquiries` {$whereSql} ORDER BY `created_at` DESC LIMIT {$limit} OFFSET {$offset}";
            $enquiries = $this->db->fetchAll($sql, $params);
        } else {
            $records = $this->db->getFallbackRecords('enquiries');
            $filtered = array_filter($records, function($item) use ($type, $status, $query) {
                if (!empty($type) && $type !== 'all' && ($item['type'] ?? '') !== $type) return false;
                if (!empty($status) && $status !== 'all' && ($item['status'] ?? '') !== $status) return false;
                if (!empty($query)) {
                    $qL = strtolower($query);
                    $matches = str_contains(strtolower($item['ref_number'] ?? ''), $qL)
                        || str_contains(strtolower($item['full_name'] ?? ''), $qL)
                        || str_contains(strtolower($item['destination'] ?? ''), $qL);
                    if (!$matches) return false;
                }
                return true;
            });
            $total = count($filtered);
            $enquiries = array_slice(array_reverse(array_values($filtered)), $offset, $limit);
        }

        Response::json([
            'success'   => true,
            'enquiries' => $enquiries,
            'total'     => $total,
            'page'      => $page,
            'totalPages'=> ceil($total / $limit) ?: 1,
        ]);
    }

    /**
     * GET /api/admin/enquiries/{id}
     */
    public function enquiryDetail(Request $request, array $params = []): void
    {
        $this->requireAuth();
        $id = $params['id'] ?? '';

        $enquiry = null;
        $notes = [];

        if ($this->db->isConnected()) {
            $enquiry = $this->db->fetch("SELECT * FROM `enquiries` WHERE `id` = ? OR `ref_number` = ? LIMIT 1", [$id, $id]);
            if ($enquiry) {
                $notes = $this->db->fetchAll("SELECT * FROM `enquiry_notes` WHERE `enquiry_id` = ? ORDER BY `created_at` DESC", [$enquiry['id']]);
            }
        } else {
            $records = $this->db->getFallbackRecords('enquiries');
            foreach ($records as $r) {
                if (($r['id'] ?? '') == $id || ($r['ref_number'] ?? '') == $id) {
                    $enquiry = $r;
                    break;
                }
            }
        }

        if (!$enquiry) {
            Response::error('Enquiry not found.', 404);
            return;
        }

        Response::json([
            'success' => true,
            'enquiry' => $enquiry,
            'notes'   => $notes,
        ]);
    }

    /**
     * POST /api/admin/enquiries/{id}/status
     */
    public function updateStatus(Request $request, array $params = []): void
    {
        $admin = $this->requireAuth();
        $id = $params['id'] ?? '';
        $body = $request->getBody();
        $newStatus = trim($body['status'] ?? '');

        $validStatuses = ['New', 'Contacted', 'Quote Sent', 'Confirmed', 'Completed', 'Cancelled'];
        if (!in_array($newStatus, $validStatuses)) {
            Response::error('Invalid status value.', 400);
            return;
        }

        if ($this->db->isConnected()) {
            $this->db->query("UPDATE `enquiries` SET `status` = ?, `updated_at` = NOW() WHERE `id` = ? OR `ref_number` = ?", [$newStatus, $id, $id]);
            $this->db->insert('audit_logs', [
                'action'      => 'ENQUIRY_STATUS_UPDATE',
                'entity_type' => 'enquiry',
                'entity_id'   => (string)$id,
                'details'     => "Status updated to {$newStatus} by {$admin['full_name']}",
                'actor'       => $admin['full_name'],
                'ip_address'  => $request->getIp(),
            ]);
        }

        Response::json(['success' => true, 'status' => $newStatus, 'message' => "Enquiry status updated to {$newStatus}."]);
    }

    /**
     * POST /api/admin/enquiries/{id}/assign
     */
    public function assignEnquiry(Request $request, array $params = []): void
    {
        $this->requireAuth();
        $id = $params['id'] ?? '';
        $body = $request->getBody();
        $assignedTo = trim($body['assignedTo'] ?? $body['agent'] ?? '');

        if ($this->db->isConnected()) {
            $this->db->query("UPDATE `enquiries` SET `assigned_to` = ? WHERE `id` = ? OR `ref_number` = ?", [$assignedTo, $id, $id]);
        }

        Response::json(['success' => true, 'assignedTo' => $assignedTo, 'message' => "Assigned to {$assignedTo}."]);
    }

    /**
     * POST /api/admin/enquiries/{id}/notes
     */
    public function addNote(Request $request, array $params = []): void
    {
        $admin = $this->requireAuth();
        $id = $params['id'] ?? '';
        $body = $request->getBody();
        $noteText = trim($body['note'] ?? $body['note_text'] ?? '');

        if (empty($noteText)) {
            Response::error('Note text is required.', 400);
            return;
        }

        if ($this->db->isConnected()) {
            $enquiry = $this->db->fetch("SELECT `id` FROM `enquiries` WHERE `id` = ? OR `ref_number` = ? LIMIT 1", [$id, $id]);
            if ($enquiry) {
                $this->db->insert('enquiry_notes', [
                    'enquiry_id'  => $enquiry['id'],
                    'author_name' => $admin['full_name'],
                    'note_text'   => $noteText,
                ]);
            }
        }

        Response::json(['success' => true, 'message' => 'Agent note saved to SQL database.']);
    }

    /**
     * GET /api/admin/packages
     */
    public function packages(Request $request): void
    {
        $this->requireAuth();
        $packages = [];
        if ($this->db->isConnected()) {
            $packages = $this->db->fetchAll("SELECT * FROM `packages` ORDER BY `created_at` DESC");
        }
        Response::json(['success' => true, 'packages' => $packages]);
    }

    /**
     * POST /api/admin/packages
     */
    public function createPackage(Request $request): void
    {
        $this->requireAuth();
        $body = $request->getBody();

        $title = trim($body['title'] ?? '');
        $destination = trim($body['destination'] ?? '');
        $region = trim($body['region'] ?? 'domestic');
        $duration = trim($body['duration'] ?? '');
        $price = trim($body['samplePrice'] ?? $body['sample_price'] ?? '₹25,000');
        $image = trim($body['heroImage'] ?? $body['hero_image'] ?? 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80');
        $tag = trim($body['tag'] ?? 'Curated');
        $desc = trim($body['description'] ?? '');

        if (empty($title) || empty($destination)) {
            Response::error('Title and destination are required.', 400);
            return;
        }

        $id = 'pkg-' . substr(preg_replace('/[^a-z0-9]/', '', strtolower($title)), 0, 20) . '-' . rand(100, 999);
        $slug = $id;

        $inclusions = is_array($body['inclusions'] ?? null) ? json_encode($body['inclusions']) : json_encode(["Boutique hotel stay","Daily breakfast","Private cab transfers"]);
        $exclusions = is_array($body['exclusions'] ?? null) ? json_encode($body['exclusions']) : json_encode(["Flights","Personal expenses"]);

        $data = [
            'id'              => $id,
            'slug'            => $slug,
            'title'           => $title,
            'destination'     => $destination,
            'region'          => $region,
            'duration'        => $duration,
            'sample_price'    => $price,
            'hero_image'      => $image,
            'tag'             => $tag,
            'description'     => $desc,
            'inclusions_json' => $inclusions,
            'exclusions_json' => $exclusions,
        ];

        if ($this->db->isConnected()) {
            $this->db->insert('packages', $data);
        }

        Response::json(['success' => true, 'package' => $data, 'message' => 'Holiday package created and persisted in SQL database.'], 201);
    }

    /**
     * PUT /api/admin/packages/{id}
     */
    public function updatePackage(Request $request, array $params = []): void
    {
        $this->requireAuth();
        $id = $params['id'] ?? '';
        $body = $request->getBody();

        if ($this->db->isConnected()) {
            $title = $body['title'] ?? null;
            $price = $body['samplePrice'] ?? $body['sample_price'] ?? null;
            $desc = $body['description'] ?? null;

            if ($title && $price) {
                $this->db->query("UPDATE `packages` SET `title` = ?, `sample_price` = ?, `description` = ? WHERE `id` = ?", [$title, $price, $desc, $id]);
            }
        }

        Response::json(['success' => true, 'message' => 'Package updated successfully.']);
    }

    /**
     * POST /api/admin/quotations
     */
    public function createQuotation(Request $request): void
    {
        $admin = $this->requireAuth();
        $body = $request->getBody();

        $enquiryId = (int)($body['enquiryId'] ?? $body['enquiry_id'] ?? 0);
        $customerName = trim($body['customerName'] ?? $body['customer_name'] ?? '');
        $destination = trim($body['destination'] ?? '');
        $travelDates = trim($body['travelDates'] ?? $body['travel_dates'] ?? '');
        $pax = trim($body['paxCount'] ?? $body['pax_count'] ?? '2 Adults');
        $amount = (float)($body['totalAmount'] ?? $body['total_amount'] ?? 0);
        $validity = trim($body['validityDate'] ?? $body['validity_date'] ?? date('Y-m-d', strtotime('+7 days')));
        $inclusions = trim($body['inclusions'] ?? 'Hotels, transfers, breakfast, dedicated driver');
        $cancellation = trim($body['cancellationTerms'] ?? $body['cancellation_terms'] ?? 'Full refund if cancelled 15 days before travel. Flight cancellation as per airline policy.');
        $notes = trim($body['notes'] ?? '');

        if (empty($customerName) || empty($destination)) {
            Response::error('Customer name and destination are required.', 400);
            return;
        }

        $token = 'TGQ-' . bin2hex(random_bytes(10));

        $quoteData = [
            'token'              => $token,
            'enquiry_id'         => $enquiryId ?: null,
            'customer_name'      => $customerName,
            'destination'        => $destination,
            'travel_dates'       => $travelDates,
            'pax_count'          => $pax,
            'total_amount'       => $amount,
            'currency'           => 'INR',
            'validity_date'      => $validity,
            'inclusions'         => $inclusions,
            'cancellation_terms' => $cancellation,
            'notes'              => $notes,
            'status'             => 'Sent',
            'created_by'         => $admin['full_name'],
        ];

        if ($this->db->isConnected()) {
            $quoteId = $this->db->insert('quotations', $quoteData);

            // Automatically advance linked enquiry status to "Quote Sent"
            if ($enquiryId > 0) {
                $this->db->query("UPDATE `enquiries` SET `status` = 'Quote Sent', `updated_at` = NOW() WHERE `id` = ?", [$enquiryId]);
                $this->db->insert('enquiry_notes', [
                    'enquiry_id'  => $enquiryId,
                    'author_name' => $admin['full_name'],
                    'note_text'   => "Generated official proposal #{$token} for ₹" . number_format($amount) . " valid until {$validity}.",
                ]);
            }
        }

        Response::json([
            'success'   => true,
            'token'     => $token,
            'viewUrl'   => "/quote?token={$token}",
            'message'   => 'Official travel proposal generated with transparency terms.',
            'quotation' => $quoteData,
        ], 201);
    }
}
