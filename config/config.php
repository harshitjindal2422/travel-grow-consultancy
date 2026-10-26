<?php
/**
 * TravelGrow Consultancy - Application Configuration
 */

return [
    'app_name'        => 'TravelGrow Consultancy',
    'app_env'         => getenv('APP_ENV') ?: 'production',
    'domain'          => 'https://travelgrowconsultancy.com',
    'contact_phone'   => '+91 98765 43210',
    'contact_email'   => 'enquiries@travelgrowconsultancy.com',
    'whatsapp_number' => getenv('WHATSAPP_NUMBER') ?: '919876543210',
    'honeypot_field'  => 'website_address_hp',
    'session_name'    => 'TG_ADMIN_SESSION',
    'jwt_secret'      => getenv('JWT_SECRET') ?: 'travelgrow_secure_jwt_token_key_2026',
    'admin_email'     => 'admin@travelgrowconsultancy.com',
    'admin_password'  => 'AdminPassword123!', // Demo fallback if DB not yet seeded
];
