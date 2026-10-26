<?php
/**
 * TravelGrow Consultancy - PHP Built-in Server Router Script
 * Usage: php -S localhost:8000 router.php
 */

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$file = __DIR__ . $uri;

// If static file exists, serve it directly
if ($uri !== '/' && file_exists($file) && !is_dir($file)) {
    $ext = pathinfo($file, PATHINFO_EXTENSION);
    $mimes = [
        'css'  => 'text/css',
        'js'   => 'application/javascript',
        'json' => 'application/json',
        'png'  => 'image/png',
        'jpg'  => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'svg'  => 'image/svg+xml',
        'webp' => 'image/webp',
        'woff2'=> 'font/woff2',
        'woff' => 'font/woff',
        'ttf'  => 'font/ttf',
    ];

    if (isset($mimes[$ext])) {
        header('Content-Type: ' . $mimes[$ext]);
    }
    return false;
}

// Forward all requests to central router
require __DIR__ . '/index.php';
