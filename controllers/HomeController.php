<?php
/**
 * TravelGrow Consultancy - Home Controller
 */

namespace TravelGrow\Controllers;

use TravelGrow\Core\Request;
use TravelGrow\Core\View;
use TravelGrow\Database\Database;

class HomeController
{
    public function index(Request $request): void
    {
        $db = Database::getInstance();
        $packages = [];

        if ($db->isConnected()) {
            $packages = $db->fetchAll("SELECT * FROM `packages` WHERE `is_active` = 1 ORDER BY `created_at` DESC LIMIT 6");
        }

        View::render('pages/home', [
            'pageTitle' => 'TravelGrow Consultancy | Better Travel Deals, Made Personal for Indian Travellers',
            'activeNav' => 'home',
            'packages'  => $packages,
            'isDbConnected' => $db->isConnected(),
        ]);
    }
}
