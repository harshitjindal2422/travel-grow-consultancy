-- ============================================================================
-- TravelGrow Consultancy - SQL Database Schema (MySQL / MariaDB)
-- Production-ready schema for Enquiries, Admin Auth, Packages & Quotations
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `travelgrow_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `travelgrow_db`;

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(150) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'consultant',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `last_login` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_admin_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Enquiries Table (Human-Assisted Flight & Holiday Proposals)
CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ref_number` VARCHAR(32) NOT NULL UNIQUE,
  `type` ENUM('flight', 'holiday', 'general') NOT NULL DEFAULT 'holiday',
  `full_name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(40) NOT NULL,
  `email` VARCHAR(191) NULL,
  `origin` VARCHAR(150) NULL,
  `destination` VARCHAR(191) NOT NULL,
  `departure_date` VARCHAR(100) NULL,
  `return_date` VARCHAR(100) NULL,
  `travelers_count` VARCHAR(50) NULL,
  `trip_type` VARCHAR(60) NULL DEFAULT 'family',
  `budget` VARCHAR(100) NULL,
  `duration_days` VARCHAR(50) NULL,
  `cabin_class` VARCHAR(50) NULL,
  `notes` TEXT NULL,
  `status` ENUM('New', 'Contacted', 'Quote Sent', 'Confirmed', 'Completed', 'Cancelled') NOT NULL DEFAULT 'New',
  `assigned_to` VARCHAR(150) NULL,
  `source_ip` VARCHAR(45) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_enquiry_type` (`type`),
  INDEX `idx_enquiry_status` (`status`),
  INDEX `idx_enquiry_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Enquiry Internal Notes Table (Agent Communications & Follow-ups)
CREATE TABLE IF NOT EXISTS `enquiry_notes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `enquiry_id` INT NOT NULL,
  `author_name` VARCHAR(150) NOT NULL DEFAULT 'Travel Consultant',
  `note_text` TEXT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_note_enquiry_id` (`enquiry_id`),
  CONSTRAINT `fk_enquiry_notes_enquiry` FOREIGN KEY (`enquiry_id`) REFERENCES `enquiries`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Holiday Packages Catalog
CREATE TABLE IF NOT EXISTS `packages` (
  `id` VARCHAR(64) PRIMARY KEY,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `title` VARCHAR(200) NOT NULL,
  `destination` VARCHAR(150) NOT NULL,
  `region` ENUM('domestic', 'international') NOT NULL DEFAULT 'domestic',
  `duration` VARCHAR(60) NOT NULL,
  `sample_price` VARCHAR(80) NOT NULL,
  `hero_image` VARCHAR(255) NOT NULL,
  `tag` VARCHAR(60) NOT NULL DEFAULT 'Featured',
  `description` TEXT NOT NULL,
  `inclusions_json` TEXT NOT NULL,
  `exclusions_json` TEXT NOT NULL,
  `itinerary_json` MEDIUMTEXT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_pkg_region` (`region`),
  INDEX `idx_pkg_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Quotations Table (Official Customer Travel Proposals)
CREATE TABLE IF NOT EXISTS `quotations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `token` VARCHAR(64) NOT NULL UNIQUE,
  `enquiry_id` INT NULL,
  `customer_name` VARCHAR(150) NOT NULL,
  `customer_phone` VARCHAR(40) NULL,
  `customer_email` VARCHAR(191) NULL,
  `destination` VARCHAR(191) NOT NULL,
  `travel_dates` VARCHAR(100) NOT NULL,
  `pax_count` VARCHAR(50) NOT NULL,
  `total_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'INR',
  `validity_date` DATE NOT NULL,
  `inclusions` TEXT NULL,
  `cancellation_terms` TEXT NULL,
  `notes` TEXT NULL,
  `status` ENUM('Draft', 'Sent', 'Accepted', 'Expired', 'Revised') NOT NULL DEFAULT 'Sent',
  `created_by` VARCHAR(150) NOT NULL DEFAULT 'TravelGrow Consultant',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_quote_token` (`token`),
  INDEX `idx_quote_enquiry` (`enquiry_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Quotation Line Items
CREATE TABLE IF NOT EXISTS `quotation_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `quotation_id` INT NOT NULL,
  `item_type` VARCHAR(50) NOT NULL DEFAULT 'component',
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NULL,
  `amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_item_quote_id` (`quotation_id`),
  CONSTRAINT `fk_quote_items_quotation` FOREIGN KEY (`quotation_id`) REFERENCES `quotations`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Agency Audit Logs
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `action` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(50) NOT NULL,
  `entity_id` VARCHAR(100) NULL,
  `details` TEXT NULL,
  `actor` VARCHAR(150) NOT NULL DEFAULT 'System',
  `ip_address` VARCHAR(45) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Seed Initial Admin User & Sample Curated Packages
-- Default Demo Admin Password: "AdminPassword123!" (BCRYPT hash)
-- ============================================================================
INSERT INTO `admins` (`id`, `email`, `password_hash`, `full_name`, `role`)
VALUES (
  1,
  'admin@travelgrowconsultancy.com',
  '$2y$12$Z0H7kRkP90c0kO6P5YgO8.Z0mG61sF9jI6qg6T4l5uJ5d4K1Y9oCe', -- AdminPassword123!
  'Lead Travel Consultant',
  'superadmin'
) ON DUPLICATE KEY UPDATE `email`=`email`;

-- Seed Curated Packages
INSERT INTO `packages` (`id`, `slug`, `title`, `destination`, `region`, `duration`, `sample_price`, `hero_image`, `tag`, `description`, `inclusions_json`, `exclusions_json`)
VALUES
(
  'pkg-kashmir-paradise',
  'kashmir-paradise-valleys',
  'Kashmir Valley, Pahalgam & Gulmarg Serenade',
  'Kashmir, India',
  'domestic',
  '6 Days / 5 Nights',
  '₹28,500 per person',
  'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
  'Most Popular',
  'Experience Srinagar Dal Lake houseboat stay, Gondola ride in Gulmarg, and lush pine valleys of Pahalgam with dedicated private cab and curated Kashmiri wazwan dinner.',
  '["1 Night Deluxe Houseboat on Dal Lake","4 Nights 4-Star Boutique Hotels","Daily Buffet Breakfast & Dinner","Dedicated Private Sedan / SUV with Chauffeur","Gondola Phase-1 Assistance","All Tolls, Parking & Driver Allowances"]',
  '["Airfare (available as add-on quote)","Pony rides / local sledging charges","Gondola Phase-2 tickets","Personal laundry and monument camera fees"]'
),
(
  'pkg-kerala-backwaters',
  'kerala-backwaters-houseboat-munnar',
  'Kerala Tranquil Backwaters, Tea Gardens & Houseboat',
  'Kerala, India',
  'domestic',
  '6 Days / 5 Nights',
  '₹22,500 per person',
  'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
  'Family Special',
  'Mist-clad tea plantations of Munnar, spice sanctuaries of Thekkady, and a private traditional houseboat cruise through Kumarakom & Alleppey backwaters.',
  '["2 Nights Munnar Hill Resort with Balcony","1 Night Thekkady Spice Garden Hotel","1 Night Private Alleppey Houseboat (All Meals)","1 Night Cochin Heritage Hotel","Private AC Vehicle for All Transfers","Daily Breakfast at all hotels"]',
  '["Flights / Rail tickets","Ayurvedic massage packages","Kathakali dance entry tickets","Items of personal nature"]'
),
(
  'pkg-rajasthan-royals',
  'rajasthan-royals-jaipur-jodhpur-udaipur',
  'Royal Rajasthan: Jaipur, Jodhpur & Udaipur Heritage',
  'Rajasthan, India',
  'domestic',
  '7 Days / 6 Nights',
  '₹32,000 per person',
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
  'Cultural Heritage',
  'Grand palaces, majestic hill forts, vibrant bazaars, and sunset boat rides across Lake Pichola. Handpicked heritage havelis with authentic Rajasthani hospitality.',
  '["2 Nights Jaipur Heritage Haveli","2 Nights Jodhpur Blue City Boutique Hotel","2 Nights Udaipur Lakeview Resort","Private AC Chauffeur Driven Vehicle","Amer Fort Elephant / Jeep ride assistance","Daily Rajasthani & Continental Breakfast"]',
  '["Airfare / Train tickets","Fort entry tickets & authorized guide fees","Lake Pichola boating charges","Personal shopping & meals not mentioned"]'
),
(
  'pkg-himachal-highlands',
  'himachal-highlands-shimla-manali',
  'Himachal Pine Valleys: Shimla, Kullu & Solang Adventure',
  'Himachal Pradesh',
  'domestic',
  '6 Days / 5 Nights',
  '₹24,500 per person',
  'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
  'Mountain Escape',
  'Crisp Himalayan pine breezes, colonial Shimla ridge, snow adventures at Solang Valley, and peaceful riverbank strolls in Old Manali.',
  '["2 Nights Shimla Valley-View Hotel","3 Nights Manali Luxury Cottage Resort","Private AC Sedan for Delhi/Chandigarh Excursion","Solang Valley Excursion with Rohtang Permit Guidance","Daily Breakfast & Gourmet Dinner"]',
  '["Flights / Volvo bus fares","Adventure sports fees (paragliding, rafting)","Heater charges at hotels if applicable","Personal tips & beverages"]'
),
(
  'pkg-dubai-emirates',
  'dubai-abu-dhabi-desert-city',
  'Dubai & Abu Dhabi Highlights: Desert Safari & Marina Cruise',
  'Dubai, UAE',
  'international',
  '5 Days / 4 Nights',
  '₹38,500 per person',
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
  'International',
  'Futuristic skylines, desert dune bashing with barbecue dinner, Dhow cruise dinner on Dubai Marina, and full-day Abu Dhabi Sheikh Zayed Grand Mosque tour.',
  '["4 Nights 4-Star City Center Hotel with Breakfast","4x4 Desert Safari with BBQ Dinner & Tanoura Show","Marina Dhow Cruise with International Buffet","Burj Khalifa 124th Floor Observation Deck Tickets","Abu Dhabi City Tour with Grand Mosque Visit","Airport Transfers on Private Basis"]',
  '["International Flights (offered with route deals)","UAE Tourist Visa & OK to Board","Tourism Dirham Fee (payable directly at hotel)","Personal travel insurance"]'
),
(
  'pkg-bali-island',
  'bali-tropical-paradise-ubud-seminyak',
  'Bali Enchanting Island: Ubud Culture & Seminyak Coast',
  'Bali, Indonesia',
  'international',
  '6 Days / 5 Nights',
  '₹36,000 per person',
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
  'Honeymoon Choice',
  'Lush Ubud rice terraces, Sacred Monkey Forest, iconic Tanah Lot sunset temple, water sports at Tanjung Benoa, and private pool villa in Seminyak.',
  '["3 Nights Ubud Rainforest Boutique Resort","2 Nights Seminyak Private Pool Villa","Daily Breakfast + 1 Romantic Candlelight Dinner","Full-Day Kintamani Volcano & Rice Terrace Tour","Tanah Lot Sunset Tour with Private Chauffeur","Water Sports at Nusa Dua (Banana boat included)"]',
  '["International Airfare","Indonesia Visa on Arrival (approx ₹2,900 at airport)","Bali Tourist Entry Levy","Water sports upgrades & personal spa treatments"]'
) ON DUPLICATE KEY UPDATE `title`=`title`;
