<?php
/**
 * Test script to verify API endpoints over HTTP on PHP server
 */

function postJson($url, $data) {
    $options = [
        'http' => [
            'header'  => "Content-type: application/json\r\n",
            'method'  => 'POST',
            'content' => json_encode($data),
            'ignore_errors' => true,
        ],
    ];
    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    return json_decode($result, true);
}

function getJson($url) {
    $options = [
        'http' => [
            'method' => 'GET',
            'ignore_errors' => true,
        ]
    ];
    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    return json_decode($result, true);
}

echo "Testing /api/config...\n";
$config = getJson('http://127.0.0.1:8000/api/config');
echo "Config app name: " . ($config['appName'] ?? 'MISSING') . "\n";

echo "Testing /api/enquiries/flight...\n";
$flightRes = postJson('http://127.0.0.1:8000/api/enquiries/flight', [
    'name' => 'Amitabh Bachchan',
    'phone' => '+91 98765 43210',
    'origin' => 'Mumbai',
    'destination' => 'London',
    'departureDate' => date('Y-m-d', strtotime('+10 days')),
    'consent' => true,
]);
print_r($flightRes);

echo "Testing /api/enquiries/holiday...\n";
$holidayRes = postJson('http://127.0.0.1:8000/api/enquiries/holiday', [
    'name' => 'Deepika Padukone',
    'phone' => '+91 98765 11111',
    'destination' => 'Kashmir',
    'travelDates' => 'Nov 2026',
    'travelers' => '2 Adults',
    'tripType' => 'honeymoon',
    'consent' => true,
]);
print_r($holidayRes);

echo "Testing /api/admin/login...\n";
$loginRes = postJson('http://127.0.0.1:8000/api/admin/login', [
    'email' => 'admin@travelgrowconsultancy.com',
    'password' => 'AdminPassword123!',
]);
print_r($loginRes);
