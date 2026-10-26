<?php
/**
 * TravelGrow Consultancy - Enquiry Processing Controller
 * Handles Flight, Holiday & General Consultation Enquiries with SQL Database Persistence
 */

namespace TravelGrow\Controllers;

use TravelGrow\Core\Request;
use TravelGrow\Core\Response;
use TravelGrow\Database\Database;

class EnquiryController
{
    private Database $db;
    private array $config;

    public function __construct()
    {
        $this->db = Database::getInstance();
        $this->config = require dirname(__DIR__) . '/config/config.php';
    }

    /**
     * POST /api/enquiries/flight
     */
    public function flight(Request $request): void
    {
        $body = $request->getBody();

        // 1. Spam Honeypot Protection
        $honeypotKey = $this->config['honeypot_field'] ?? 'website_address_hp';
        if (!empty($body[$honeypotKey])) {
            Response::json([
                'success'   => true,
                'refNumber' => 'TG-FL-' . strtoupper(bin2hex(random_bytes(3))),
                'message'   => 'Your flight enquiry has been received.',
            ]);
            return;
        }

        // 2. Extract & Sanitize
        $name = trim($body['name'] ?? $body['fullName'] ?? '');
        $phone = trim($body['phone'] ?? '');
        $email = trim($body['email'] ?? '');
        $origin = trim($body['departureCity'] ?? $body['origin'] ?? '');
        $destination = trim($body['destination'] ?? '');
        $departureDate = trim($body['departureDate'] ?? '');
        $returnDate = trim($body['returnDate'] ?? '');
        $tripType = trim($body['tripType'] ?? 'roundtrip');
        $adults = (int)($body['adults'] ?? 1);
        $children = (int)($body['children'] ?? 0);
        $cabin = trim($body['cabinPreference'] ?? $body['cabin'] ?? 'Economy');
        $budget = trim($body['budget'] ?? '');
        $consent = !empty($body['consent']);

        // 3. Validation
        $errors = [];
        if (empty($name)) $errors[] = 'Full name is required.';
        if (empty($phone) || strlen(preg_replace('/[^0-9]/', '', $phone)) < 7) {
            $errors[] = 'Please provide a valid contact number (at least 7 digits).';
        }
        if (empty($origin)) $errors[] = 'Departure city is required.';
        if (empty($destination)) $errors[] = 'Destination is required.';
        if (empty($departureDate)) $errors[] = 'Departure date is required.';
        if (!$consent) $errors[] = 'Privacy consent is required to process your flight enquiry.';

        // Date logic validation
        $today = date('Y-m-d');
        if (!empty($departureDate) && $departureDate < $today) {
            $errors[] = 'Departure date cannot be in the past.';
        }
        if (!empty($departureDate) && !empty($returnDate) && $returnDate < $departureDate) {
            $errors[] = 'Return date cannot be earlier than departure date.';
        }

        if (!empty($errors)) {
            Response::error('Validation Failed', 400, $errors);
            return;
        }

        // 4. Generate Reference Code
        $refNumber = 'TG-FL-' . strtoupper(substr(uniqid(), -6));
        $travelers = "{$adults} Adults" . ($children > 0 ? ", {$children} Children" : "");

        // 5. Save to SQL Database
        $enquiryData = [
            'ref_number'      => $refNumber,
            'type'            => 'flight',
            'full_name'       => $name,
            'phone'           => $phone,
            'email'           => $email ?: null,
            'origin'          => $origin,
            'destination'     => $destination,
            'departure_date'  => $departureDate,
            'return_date'     => $returnDate ?: null,
            'travelers_count' => $travelers,
            'trip_type'       => $tripType,
            'cabin_class'     => $cabin,
            'budget'          => $budget ?: null,
            'status'          => 'New',
            'source_ip'       => $request->getIp(),
        ];

        $enquiryId = $this->db->insert('enquiries', $enquiryData);

        // Audit log
        if ($this->db->isConnected()) {
            $this->db->insert('audit_logs', [
                'action'      => 'ENQUIRY_CREATED',
                'entity_type' => 'flight_enquiry',
                'entity_id'   => (string)$enquiryId,
                'details'     => "New flight enquiry {$refNumber} from {$name} ({$phone})",
                'actor'       => 'Public Client',
                'ip_address'  => $request->getIp(),
            ]);
        }

        Response::json([
            'success'   => true,
            'refNumber' => $refNumber,
            'message'   => 'Thank you! Your flight enquiry has been saved. A dedicated TravelGrow consultant will manually research available routing options and share transparent quotations shortly.',
            'contactAdvisory' => 'TravelGrow Consultancy is an advisory service. We manually verify flight availability with consolidators before confirming your booking.',
        ], 201);
    }

    /**
     * POST /api/enquiries/holiday
     */
    public function holiday(Request $request): void
    {
        $body = $request->getBody();

        // 1. Honeypot check
        $honeypotKey = $this->config['honeypot_field'] ?? 'website_address_hp';
        if (!empty($body[$honeypotKey])) {
            Response::json([
                'success'   => true,
                'refNumber' => 'TG-HL-' . strtoupper(bin2hex(random_bytes(3))),
                'message'   => 'Your holiday enquiry has been received.',
            ]);
            return;
        }

        // 2. Extract & Sanitize
        $name = trim($body['name'] ?? $body['fullName'] ?? '');
        $phone = trim($body['phone'] ?? '');
        $email = trim($body['email'] ?? '');
        $destination = trim($body['destination'] ?? '');
        $travelDates = trim($body['travelDates'] ?? $body['dates'] ?? '');
        $travelers = trim($body['travelers'] ?? $body['numberOfTravellers'] ?? '2');
        $duration = trim($body['duration'] ?? $body['numberOfDays'] ?? '');
        $budget = trim($body['budget'] ?? '');
        $tripType = strtolower(trim($body['tripType'] ?? 'family'));
        $requirements = trim($body['requirements'] ?? $body['notes'] ?? '');
        $consent = !empty($body['consent']);

        // 3. Validation
        $allowedTripTypes = ['family', 'honeymoon', 'solo', 'group', 'other'];
        $errors = [];

        if (empty($name)) $errors[] = 'Full name is required.';
        if (empty($phone) || strlen(preg_replace('/[^0-9]/', '', $phone)) < 7) {
            $errors[] = 'Please provide a valid contact number (at least 7 digits).';
        }
        if (empty($destination)) $errors[] = 'Destination is required.';
        if (!in_array($tripType, $allowedTripTypes)) {
            $errors[] = 'Invalid trip type selected. Please choose from: family, honeymoon, solo, group, other.';
        }
        if (!$consent) $errors[] = 'Privacy consent is required to process your holiday itinerary.';

        if (!empty($errors)) {
            Response::error('Validation Failed', 400, $errors);
            return;
        }

        // 4. Reference Code
        $refNumber = 'TG-HL-' . strtoupper(substr(uniqid(), -6));

        // 5. Save to SQL Database
        $enquiryData = [
            'ref_number'      => $refNumber,
            'type'            => 'holiday',
            'full_name'       => $name,
            'phone'           => $phone,
            'email'           => $email ?: null,
            'destination'     => $destination,
            'departure_date'  => $travelDates ?: null,
            'travelers_count' => $travelers,
            'trip_type'       => $tripType,
            'duration_days'   => $duration ?: null,
            'budget'          => $budget ?: null,
            'notes'           => $requirements ?: null,
            'status'          => 'New',
            'source_ip'       => $request->getIp(),
        ];

        $enquiryId = $this->db->insert('enquiries', $enquiryData);

        // Audit log
        if ($this->db->isConnected()) {
            $this->db->insert('audit_logs', [
                'action'      => 'ENQUIRY_CREATED',
                'entity_type' => 'holiday_enquiry',
                'entity_id'   => (string)$enquiryId,
                'details'     => "New holiday enquiry {$refNumber} for {$destination} by {$name}",
                'actor'       => 'Public Client',
                'ip_address'  => $request->getIp(),
            ]);
        }

        Response::json([
            'success'   => true,
            'refNumber' => $refNumber,
            'message'   => 'Thank you! Your holiday inquiry has been saved. A travel specialist will contact you with a customized quotation and day-by-day plan.',
            'contactAdvisory' => 'TravelGrow itineraries are fully customizable with hotels, sightseeing and private transfers.',
        ], 201);
    }

    /**
     * POST /api/enquiries/general
     */
    public function general(Request $request): void
    {
        $body = $request->getBody();

        $name = trim($body['name'] ?? $body['fullName'] ?? '');
        $phone = trim($body['phone'] ?? '');
        $email = trim($body['email'] ?? '');
        $message = trim($body['message'] ?? $body['notes'] ?? 'Quick Callback Request');
        $destination = trim($body['destination'] ?? 'General Consultation');

        if (empty($name) || empty($phone)) {
            Response::error('Name and phone number are required.', 400);
            return;
        }

        $refNumber = 'TG-GN-' . strtoupper(substr(uniqid(), -6));
        $enquiryData = [
            'ref_number'      => $refNumber,
            'type'            => 'general',
            'full_name'       => $name,
            'phone'           => $phone,
            'email'           => $email ?: null,
            'destination'     => $destination,
            'notes'           => $message,
            'status'          => 'New',
            'source_ip'       => $request->getIp(),
        ];

        $this->db->insert('enquiries', $enquiryData);

        Response::json([
            'success'   => true,
            'refNumber' => $refNumber,
            'message'   => 'Your callback request has been received. Our travel desk will connect with you during business hours.',
        ], 201);
    }
}
