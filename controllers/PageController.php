<?php
/**
 * TravelGrow Consultancy - Content & Static Page Controller
 */

namespace TravelGrow\Controllers;

use TravelGrow\Core\Request;
use TravelGrow\Core\View;
use TravelGrow\Database\Database;

class PageController
{
    public function flights(Request $request): void
    {
        View::render('pages/flights', [
            'pageTitle' => 'Flight Deal Research & Routing Assistance | TravelGrow Consultancy',
            'activeNav' => 'flights',
        ]);
    }

    public function holidays(Request $request): void
    {
        $db = Database::getInstance();
        $packages = [];
        if ($db->isConnected()) {
            $packages = $db->fetchAll("SELECT * FROM `packages` WHERE `is_active` = 1 ORDER BY `created_at` DESC");
        }

        View::render('pages/holidays', [
            'pageTitle' => 'Handcrafted Holiday Packages & Sample Itineraries | TravelGrow Consultancy',
            'activeNav' => 'holidays',
            'packages'  => $packages,
        ]);
    }

    public function packageDetails(Request $request, array $params = []): void
    {
        $id = $request->getQuery('id') ?: ($params['id'] ?? '');
        $db = Database::getInstance();
        $pkg = null;

        if ($db->isConnected() && !empty($id)) {
            $pkg = $db->fetch("SELECT * FROM `packages` WHERE `id` = ? OR `slug` = ? LIMIT 1", [$id, $id]);
        }

        View::render('pages/package-detail', [
            'pageTitle' => $pkg ? ($pkg['title'] . ' | TravelGrow Consultancy') : 'Package Details | TravelGrow Consultancy',
            'activeNav' => 'holidays',
            'packageId' => $id,
            'package'   => $pkg,
        ]);
    }

    public function planMyTrip(Request $request): void
    {
        View::render('pages/plan-my-trip', [
            'pageTitle' => 'Plan My Trip - Custom Itinerary Builder | TravelGrow Consultancy',
            'activeNav' => 'plan',
        ]);
    }

    public function about(Request $request): void
    {
        View::render('pages/about', [
            'pageTitle' => 'About Us - Independent Indian Travel Consultancy | TravelGrow',
            'activeNav' => 'about',
        ]);
    }

    public function contact(Request $request): void
    {
        View::render('pages/contact', [
            'pageTitle' => 'Contact TravelGrow Consultancy - Offices & Consultation Desk',
            'activeNav' => 'contact',
        ]);
    }

    public function faqs(Request $request): void
    {
        View::render('pages/faqs', [
            'pageTitle' => 'Frequently Asked Questions & Advisory | TravelGrow Consultancy',
            'activeNav' => 'faqs',
        ]);
    }

    public function howItWorks(Request $request): void
    {
        View::render('pages/how-it-works', [
            'pageTitle' => 'How It Works - Human-Assisted Travel Planning | TravelGrow',
            'activeNav' => 'how-it-works',
        ]);
    }

    public function privacyPolicy(Request $request): void
    {
        View::render('pages/privacy-policy', [
            'pageTitle' => 'Privacy Policy & Data Protection | TravelGrow Consultancy',
            'activeNav' => '',
        ]);
    }

    public function termsConditions(Request $request): void
    {
        View::render('pages/terms-conditions', [
            'pageTitle' => 'Terms of Service & Agency Conditions | TravelGrow Consultancy',
            'activeNav' => '',
        ]);
    }

    public function cancellationRefund(Request $request): void
    {
        View::render('pages/cancellation-refund', [
            'pageTitle' => 'Cancellation & Refund Terms | TravelGrow Consultancy',
            'activeNav' => '',
        ]);
    }

    public function quote(Request $request, array $params = []): void
    {
        $token = $request->getQuery('token') ?: ($params['token'] ?? '');
        View::render('pages/quote', [
            'pageTitle' => 'Your Personalized Travel Proposal | TravelGrow Consultancy',
            'activeNav' => '',
            'token'     => $token,
        ]);
    }
}
