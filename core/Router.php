<?php
/**
 * TravelGrow Consultancy - Central Routing Engine
 * Dispatches all application routes, parameter patterns and API endpoints
 */

namespace TravelGrow\Core;

class Router
{
    private array $routes = [];
    private array $middleware = [];

    public function get(string $path, callable|array $handler, array $middleware = []): self
    {
        return $this->addRoute('GET', $path, $handler, $middleware);
    }

    public function post(string $path, callable|array $handler, array $middleware = []): self
    {
        return $this->addRoute('POST', $path, $handler, $middleware);
    }

    public function put(string $path, callable|array $handler, array $middleware = []): self
    {
        return $this->addRoute('PUT', $path, $handler, $middleware);
    }

    public function delete(string $path, callable|array $handler, array $middleware = []): self
    {
        return $this->addRoute('DELETE', $path, $handler, $middleware);
    }

    private function addRoute(string $method, string $path, callable|array $handler, array $middleware = []): self
    {
        $normalizedPath = rtrim($path, '/') ?: '/';
        $this->routes[] = [
            'method'     => strtoupper($method),
            'path'       => $normalizedPath,
            'handler'    => $handler,
            'middleware' => $middleware,
        ];
        return $this;
    }

    public function dispatch(Request $request): void
    {
        $requestMethod = $request->getMethod();
        $requestPath = $request->getPath();

        foreach ($this->routes as $route) {
            if ($route['method'] !== $requestMethod) {
                continue;
            }

            $pattern = $this->compilePattern($route['path']);
            if (preg_match($pattern, $requestPath, $matches)) {
                $params = array_filter($matches, fn($k) => !is_int($k), ARRAY_FILTER_USE_KEY);

                // Run Route Middleware if any
                foreach ($route['middleware'] as $mw) {
                    if (is_callable($mw)) {
                        $mw($request);
                    }
                }

                $handler = $route['handler'];

                if (is_array($handler)) {
                    [$class, $method] = $handler;
                    $controller = new $class();
                    $controller->$method($request, $params);
                    return;
                }

                if (is_callable($handler)) {
                    $handler($request, $params);
                    return;
                }
            }
        }

        // No Route Matched -> 404
        $this->handleNotFound($request);
    }

    private function compilePattern(string $routePath): string
    {
        // Replace {param} with named regex group (?P<param>[^/]+)
        $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<$1>[^/]+)', $routePath);
        return '#^' . $pattern . '$#';
    }

    private function handleNotFound(Request $request): void
    {
        if (str_starts_with($request->getPath(), '/api/')) {
            Response::json([
                'success' => false,
                'error'   => 'Endpoint Not Found',
                'path'    => $request->getPath(),
            ], 404);
            return;
        }

        View::render('pages/404', [
            'title'       => 'Page Not Found | TravelGrow Consultancy',
            'missingPath' => $request->getPath(),
        ]);
    }
}
