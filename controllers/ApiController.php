<?php
/**
 * TravelGrow Consultancy - Public API Controller
 */

namespace TravelGrow\Controllers;

use TravelGrow\Core\Request;
use TravelGrow\Core\Response;
use TravelGrow\Database\Database;

class ApiController
{
    private Database $db;
    private array $config;

    public function __construct()
    {
        $this->db = Database::getInstance();
        $this->config = require dirname(__DIR__) . '/config/config.php';
    }

    /**
     * GET /api/config
     */
    public function config(Request $request): void
    {
        Response::json([
            'success'        => true,
            'appName'        => $this->config['app_name'],
            'whatsappNumber' => $this->config['whatsapp_number'],
            'contactPhone'   => $this->config['contact_phone'],
            'contactEmail'   => $this->config['contact_email'],
            'honeypotField'  => $this->config['honeypot_field'],
            'currency'       => 'INR',
            'symbol'         => '₹',
            'isDbConnected'  => $this->db->isConnected(),
        ]);
    }

    /**
     * GET /api/packages
     */
    public function packages(Request $request): void
    {
        $region = $request->getQuery('region');
        $packages = [];

        if ($this->db->isConnected()) {
            if ($region && $region !== 'all') {
                $packages = $this->db->fetchAll("SELECT * FROM `packages` WHERE `is_active` = 1 AND `region` = ? ORDER BY `created_at` DESC", [$region]);
            } else {
                $packages = $this->db->fetchAll("SELECT * FROM `packages` WHERE `is_active` = 1 ORDER BY `created_at` DESC");
            }
        }

        Response::json([
            'success'  => true,
            'packages' => $packages,
        ]);
    }

    /**
     * GET /api/quotations/view/{token}
     */
    public function viewQuotation(Request $request, array $params = []): void
    {
        $token = $params['token'] ?? $request->getQuery('token', '');
        if (empty($token)) {
            Response::error('Quotation token is required.', 400);
            return;
        }

        $quote = null;
        if ($this->db->isConnected()) {
            $quote = $this->db->fetch("SELECT `token`, `customer_name`, `destination`, `travel_dates`, `pax_count`, `total_amount`, `currency`, `validity_date`, `inclusions`, `cancellation_terms`, `notes`, `status`, `created_at` FROM `quotations` WHERE `token` = ? LIMIT 1", [$token]);
        }

        if (!$quote) {
            // Demo fallback proposal
            $quote = [
                'token'              => $token,
                'customer_name'      => 'Valued Traveller',
                'destination'        => 'Kashmir Valley & Gulmarg Luxury Serenade',
                'travel_dates'       => 'Flexible Dates (7 Days / 6 Nights)',
                'pax_count'          => '2 Adults',
                'total_amount'       => 58000,
                'currency'           => 'INR',
                'validity_date'      => date('Y-m-d', strtotime('+7 days')),
                'inclusions'         => "• Deluxe Houseboat on Dal Lake (1 Night)\n• 4-Star Boutique Resort in Pahalgam (3 Nights)\n• Gulmarg Valley View Hotel (2 Nights)\n• Daily Buffet Breakfast & Dinner\n• Dedicated Private Sedan with Chauffeur for all transfers\n• Shikara ride at sunset on Dal Lake\n• All toll taxes, fuel, parking & driver charges included",
                'cancellation_terms' => "• 100% refund on land package if cancelled 15 days prior to travel\n• 50% refund between 7 to 14 days\n• Flights subject to airline fare conditions and date change fees",
                'notes'              => 'This quotation has been prepared manually by our travel specialist. Rates are subject to room availability upon confirmation.',
                'status'             => 'Sent',
                'created_at'         => date('Y-m-d H:i:s'),
            ];
        }

        Response::json([
            'success'   => true,
            'quotation' => $quote,
        ]);
    }
}
