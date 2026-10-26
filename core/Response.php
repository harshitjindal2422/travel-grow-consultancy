<?php
/**
 * TravelGrow Consultancy - HTTP Response Helper
 */

namespace TravelGrow\Core;

class Response
{
    public static function json(mixed $data, int $statusCode = 200, array $headers = []): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        header('X-Content-Type-Options: nosniff');
        
        foreach ($headers as $key => $value) {
            header("{$key}: {$value}");
        }

        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function html(string $html, int $statusCode = 200, array $headers = []): void
    {
        http_response_code($statusCode);
        header('Content-Type: text/html; charset=utf-8');
        
        foreach ($headers as $key => $value) {
            header("{$key}: {$value}");
        }

        echo $html;
        exit;
    }

    public static function redirect(string $url, int $statusCode = 302): void
    {
        http_response_code($statusCode);
        header("Location: {$url}");
        exit;
    }

    public static function error(string $message, int $statusCode = 400, array $errors = []): void
    {
        self::json([
            'success' => false,
            'error'   => $message,
            'errors'  => $errors,
        ], $statusCode);
    }
}
