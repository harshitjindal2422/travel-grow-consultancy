<?php
/**
 * TravelGrow Consultancy - HTTP Request Wrapper
 */

namespace TravelGrow\Core;

class Request
{
    private string $method;
    private string $uri;
    private string $path;
    private array $query;
    private array $body;
    private array $headers;

    public function __construct()
    {
        $this->method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        $this->uri = $_SERVER['REQUEST_URI'] ?? '/';
        
        // Strip query string for route matching
        $parts = explode('?', $this->uri, 2);
        $this->path = rtrim($parts[0], '/') ?: '/';
        
        $this->query = $_GET;
        $this->headers = $this->collectHeaders();
        $this->body = $this->parseBody();
    }

    public function getMethod(): string
    {
        return $this->method;
    }

    public function getPath(): string
    {
        return $this->path;
    }

    public function getUri(): string
    {
        return $this->uri;
    }

    public function getQuery(string $key = null, mixed $default = null): mixed
    {
        if ($key === null) return $this->query;
        return $this->query[$key] ?? $default;
    }

    public function getBody(string $key = null, mixed $default = null): mixed
    {
        if ($key === null) return $this->body;
        return $this->body[$key] ?? $default;
    }

    public function getHeader(string $name, mixed $default = null): mixed
    {
        $name = strtolower($name);
        return $this->headers[$name] ?? $default;
    }

    public function getIp(): string
    {
        return $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    }

    public function isJson(): bool
    {
        $contentType = $this->getHeader('content-type', '');
        return str_contains($contentType, 'application/json');
    }

    private function parseBody(): array
    {
        if ($this->isJson()) {
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);
            return is_array($data) ? $data : [];
        }

        // Return combined $_POST and raw JSON if post is empty
        if (!empty($_POST)) {
            return $_POST;
        }

        $input = file_get_contents('php://input');
        if (!empty($input)) {
            $data = json_decode($input, true);
            if (is_array($data)) return $data;
            parse_str($input, $parsed);
            return is_array($parsed) ? $parsed : [];
        }

        return [];
    }

    private function collectHeaders(): array
    {
        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (str_starts_with($key, 'HTTP_')) {
                $name = strtolower(str_replace('_', '-', substr($key, 5)));
                $headers[$name] = $value;
            } elseif (in_array($key, ['CONTENT_TYPE', 'CONTENT_LENGTH'])) {
                $name = strtolower(str_replace('_', '-', $key));
                $headers[$name] = $value;
            }
        }
        return $headers;
    }
}
