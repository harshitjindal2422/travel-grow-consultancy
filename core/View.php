<?php
/**
 * TravelGrow Consultancy - View Renderer
 */

namespace TravelGrow\Core;

class View
{
    public static function render(string $viewPath, array $data = [], ?string $layout = 'main'): void
    {
        $baseDir = dirname(__DIR__) . '/views';
        $viewFile = "{$baseDir}/{$viewPath}.php";

        if (!file_exists($viewFile)) {
            Response::error("View not found: {$viewPath}", 500);
            return;
        }

        // App config available in all views
        $config = require dirname(__DIR__) . '/config/config.php';
        $data['appConfig'] = $config;

        // Extract variables for view
        extract($data, EXTR_SKIP);

        // Render View Content into buffer
        ob_start();
        require $viewFile;
        $content = ob_get_clean();

        // If no layout requested, output raw view
        if ($layout === null) {
            Response::html($content);
            return;
        }

        // Render inside Layout
        $layoutFile = "{$baseDir}/layouts/{$layout}.php";
        if (file_exists($layoutFile)) {
            ob_start();
            require $layoutFile;
            $fullHtml = ob_get_clean();
            Response::html($fullHtml);
        } else {
            Response::html($content);
        }
    }
}
