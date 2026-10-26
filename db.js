// Persistent SQLite database module for TravelGrow Consultancy
// Utilizes Node.js v22 built-in node:sqlite (zero external dependencies)
const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const DATA_DIR = process.env.VERCEL ? path.join('/tmp', 'data') : path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'enquiries.db');
const db = new DatabaseSync(DB_PATH);

// 1. Initialize Core Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reference_no TEXT UNIQUE NOT NULL,
    enquiry_type TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    departure_city TEXT,
    destination TEXT NOT NULL,
    departure_date TEXT,
    return_date TEXT,
    trip_type TEXT,
    adults_count INTEGER DEFAULT 1,
    children_count INTEGER DEFAULT 0,
    cabin_preference TEXT,
    approximate_budget TEXT,
    travel_dates TEXT,
    travellers_count INTEGER DEFAULT 1,
    number_of_days INTEGER,
    budget TEXT,
    holiday_trip_type TEXT,
    additional_requirements TEXT,
    consent_given INTEGER NOT NULL DEFAULT 1,
    status TEXT DEFAULT 'New',
    assigned_to TEXT,
    assigned_agent_id INTEGER,
    updated_at TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS agency_notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    enquiry_id INTEGER NOT NULL,
    reference_no TEXT NOT NULL,
    channel TEXT NOT NULL,
    status TEXT NOT NULL,
    summary TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'agent',
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    last_login TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admin_sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    ip_address TEXT,
    user_agent TEXT,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS enquiry_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    enquiry_id INTEGER NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES admin_users(id),
    author_name TEXT NOT NULL,
    note TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS holiday_packages (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    region TEXT NOT NULL,
    duration TEXT NOT NULL,
    price_indicative TEXT NOT NULL,
    price_note TEXT,
    tag TEXT,
    hero_image TEXT NOT NULL,
    gallery_json TEXT,
    description TEXT NOT NULL,
    highlights_json TEXT,
    inclusions_json TEXT NOT NULL,
    exclusions_json TEXT NOT NULL,
    itinerary_json TEXT,
    is_published INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS destinations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    tagline TEXT,
    region TEXT NOT NULL,
    image_url TEXT NOT NULL,
    flight_sample TEXT,
    package_sample TEXT,
    pkg_ref TEXT,
    description TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS quotations (
    id TEXT PRIMARY KEY,
    enquiry_id INTEGER REFERENCES enquiries(id),
    enquiry_ref TEXT,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    destination TEXT NOT NULL,
    created_by_id INTEGER REFERENCES admin_users(id),
    agent_name TEXT NOT NULL,
    title TEXT NOT NULL,
    travel_options_json TEXT NOT NULL,
    total_price TEXT NOT NULL,
    price_breakdown TEXT,
    validity_date TEXT NOT NULL,
    inclusions_json TEXT NOT NULL,
    exclusions_json TEXT NOT NULL,
    cancellation_conditions TEXT NOT NULL,
    agent_notes TEXT,
    share_token TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'sent',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_enquiries_ref ON enquiries(reference_no);
  CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
  CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at);
  CREATE INDEX IF NOT EXISTS idx_sessions_user ON admin_sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_expires ON admin_sessions(expires_at);
  CREATE INDEX IF NOT EXISTS idx_notes_enquiry ON enquiry_notes(enquiry_id);
  CREATE INDEX IF NOT EXISTS idx_packages_region ON holiday_packages(region);
  CREATE INDEX IF NOT EXISTS idx_quotations_enquiry ON quotations(enquiry_id);
  CREATE INDEX IF NOT EXISTS idx_quotations_share ON quotations(share_token);
`);

// 2. Safe Schema Migration on existing database
try {
  const enquiryCols = db.prepare("PRAGMA table_info(enquiries)").all().map(c => c.name);
  if (!enquiryCols.includes('assigned_to')) {
    db.exec("ALTER TABLE enquiries ADD COLUMN assigned_to TEXT;");
  }
  if (!enquiryCols.includes('assigned_agent_id')) {
    db.exec("ALTER TABLE enquiries ADD COLUMN assigned_agent_id INTEGER;");
  }
  if (!enquiryCols.includes('updated_at')) {
    db.exec("ALTER TABLE enquiries ADD COLUMN updated_at TEXT;");
  }
  // Normalize legacy 'pending_review' to 'New'
  db.exec("UPDATE enquiries SET status = 'New' WHERE status = 'pending_review' OR status IS NULL OR status = '';");
} catch (e) {
  // Pragma or alter already applied
}

// 3. Seed initial packages and destinations if tables are empty
(function seedInitialCatalog() {
  try {
    const pkgCount = db.prepare('SELECT COUNT(*) as count FROM holiday_packages').get().count;
    if (pkgCount === 0) {
      const now = new Date().toISOString();
      const initialPackages = [
        {
          id: "pkg-bali-escape",
          title: "Bali Tropical Serenity & Ubud Cultural Retreat",
          destination: "Bali, Indonesia",
          region: "asia",
          tag: "Relaxation & Culture",
          duration: "8 Days / 7 Nights",
          price_indicative: "From ₹48,500pp",
          price_note: "Per person sample quote based on 4-star boutique villas",
          hero_image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
          gallery_json: JSON.stringify([
            "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1573790387438-4da905039392?auto=format&fit=crop&w=800&q=80"
          ]),
          description: "Immerse yourself in lush emerald rice terraces, sacred water temples, private pool villas, and the coastal sunsets of Seminyak. Handcrafted with private chauffeur transfers.",
          highlights_json: JSON.stringify([
            "Private jungle infinity pool villa in Ubud",
            "Sunset seafood banquet overlooking Jimbaran Bay",
            "Chauffeured day tour to Tegalalang & Tirta Empul",
            "Tailored flight routing with optional Singapore layover"
          ]),
          inclusions_json: JSON.stringify([
            "4 nights Ubud Boutique Villa with jungle ravine view",
            "3 nights Seminyak Luxury Beach Resort",
            "Daily gourmet Balinese and international breakfasts",
            "Private air-conditioned car & dedicated driver for all transfers",
            "Curated sunset seafood dinner at Jimbaran Bay",
            "24/7 dedicated TravelGrow itinerary concierge"
          ]),
          exclusions_json: JSON.stringify([
            "International flights (available as custom quotation add-on)",
            "Comprehensive travel & medical insurance (strongly recommended)",
            "Personal discretionary spending and tipping"
          ]),
          itinerary_json: JSON.stringify([
            { day: "Day 1-2: Arrival & Ubud Tranquility", desc: "Touchdown at Denpasar (DPS). Meet your private English-speaking chauffeur and transfer to your Ubud rainforest sanctuary." },
            { day: "Day 3-4: Emerald Terraces & Artisan Villages", desc: "Sunrise walk along Campuhan Ridge, private tour of Tegalalang Rice Terraces, and sacred water temples." },
            { day: "Day 5-6: Coastal Transition to Seminyak", desc: "Chauffeured transfer to Seminyak. Settle into luxury beachfront resort. Oceanfront herbal spa treatment." },
            { day: "Day 7-8: Cliffside Uluwatu & Departure", desc: "Dramatic sunset excursion to Uluwatu Temple perched 70m above Indian Ocean waves. Private airport farewell." }
          ])
        },
        {
          id: "pkg-swiss-alps",
          title: "Swiss Alpine Grand Panorama & Scenic Express",
          destination: "Switzerland (Zurich, Zermatt & Lucerne)",
          region: "europe",
          tag: "Scenic Mountain Rail",
          duration: "7 Days / 6 Nights",
          price_indicative: "From ₹1,45,000pp",
          price_note: "Per person sample quote including 1st Class Swiss Travel Pass",
          hero_image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
          gallery_json: JSON.stringify([
            "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80"
          ]),
          description: "Experience the pinnacle of European rail travel with breathtaking vistas of the Matterhorn, glacier crossings, and serene lakeside strolls in Lucerne.",
          highlights_json: JSON.stringify([
            "1st Class Swiss Travel Pass for unlimited scenic trains & lake steamers",
            "Unobstructed views of Matterhorn from alpine terrace chalets",
            "Historic cogwheel mountain ascent up Gornergrat",
            "Private boat cruise on Lake Lucerne"
          ]),
          inclusions_json: JSON.stringify([
            "First-Class Swiss Rail Pass for scenic mountain routes",
            "3 nights 4-star historic chalet in Zermatt facing Matterhorn",
            "3 nights lakeside accommodation in Lucerne",
            "Gornergrat mountain cogwheel railway excursion",
            "Lake Lucerne panoramic steamship cruise",
            "Daily Swiss artisan buffet breakfasts"
          ]),
          exclusions_json: JSON.stringify([
            "International flights (custom airline quotes provided on request)",
            "Optional ski equipment rental or mountain lift passes",
            "Personal travel insurance"
          ]),
          itinerary_json: JSON.stringify([
            { day: "Day 1-2: Zurich to Car-Free Zermatt", desc: "Arrival in Zurich, boarding the scenic rail through the Valais Valley into car-free Zermatt. Enjoy fondue and stunning vistas of Matterhorn." },
            { day: "Day 3-4: Gornergrat Summit & Glaciers", desc: "Ascend 3,089m via historic Gornergrat cogwheel train with panoramic views of 29 peaks exceeding 4,000 meters." },
            { day: "Day 5-6: Panoramic Rail to Lucerne", desc: "Board scenic express to picturesque Lucerne. Walk the 14th-century Chapel Bridge and take a paddle steamer across Lake Lucerne." },
            { day: "Day 7: Farewell Swiss Alps", desc: "Morning lakeside promenade stroll, artisanal chocolate tasting, and direct 1st-class train connection to Zurich Airport." }
          ])
        },
        {
          id: "pkg-dubai-luxe",
          title: "Dubai Skyline Glitz & Arabian Desert Oasis",
          destination: "Dubai, United Arab Emirates",
          region: "middle-east",
          tag: "Luxury & Adventure",
          duration: "5 Days / 4 Nights",
          price_indicative: "From ₹52,000pp",
          price_note: "Per person sample quote based on 5-star marina hotel",
          hero_image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
          gallery_json: JSON.stringify([
            "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80"
          ]),
          description: "A blend of ultra-modern architectural wonder and timeless Bedouin desert luxury, perfect for couples and families seeking warmth and indulgence.",
          highlights_json: JSON.stringify([
            "Private 4x4 desert conservation safari with falconry demonstration",
            "VIP timed entry to Burj Khalifa Sky Lounge on the 148th floor",
            "Chauffeured luxury transfers and Marina yacht cruise"
          ]),
          inclusions_json: JSON.stringify([
            "4 nights at 5-star Dubai Marina or Downtown hotel",
            "Exclusive private 4x4 desert safari with luxury dune dinner",
            "At The Top Burj Khalifa Sky Lounge timed entry",
            "Private luxury marina yacht cruise with refreshments",
            "Chauffeured airport meet & greet transfers"
          ]),
          exclusions_json: JSON.stringify([
            "International flights (quoted separately via Emirates, BA, etc.)",
            "Tourism Dirham hotel tax payable directly at check-in",
            "Personal shopping and travel insurance"
          ]),
          itinerary_json: JSON.stringify([
            { day: "Day 1: VIP Arrival & Marina Walk", desc: "Private chauffeured airport arrival directly to your 5-star marina hotel. Evening walk along the illuminated marina promenade." },
            { day: "Day 2: Architectural Icons & Heritage Souks", desc: "Morning ascent of Burj Khalifa 148th floor observatory. Afternoon private wooden Abra boat crossing." },
            { day: "Day 3: Arabian Conservation Desert Safari", desc: "Afternoon 4x4 drive into pristine dunes. Sunset falconry show and private starlit barbecue dinner." },
            { day: "Day 4-5: Private Yacht Charter & Departure", desc: "Catamaran sail past Palm Jumeirah. Leisure morning and private airport transfer." }
          ])
        },
        {
          id: "pkg-maldives-bliss",
          title: "Maldives Overwater Sanctuary & Coral Atoll",
          destination: "North Malé Atoll, Maldives",
          region: "islands",
          tag: "Honeymoon & Luxury",
          duration: "6 Days / 5 Nights",
          price_indicative: "From ₹1,85,000pp",
          price_note: "Per person sample quote including speedboat transfers & half-board",
          hero_image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
          gallery_json: JSON.stringify([
            "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80"
          ]),
          description: "Float above crystal turquoise lagoons in an authentic overwater villa with direct ladder access to private coral gardens and vibrant marine life.",
          highlights_json: JSON.stringify([
            "Overwater villa with glass floor viewing panels & sundeck hammock",
            "Guided marine biologist snorkeling safari with sea turtles & rays",
            "Romantic sunset dolphin cruise with champagne"
          ]),
          inclusions_json: JSON.stringify([
            "5 nights Overwater Sunset Villa with private sundeck",
            "Return scenic speedboat or seaplane transfers",
            "Daily gourmet half-board (breakfast & multi-course dinners)",
            "Guided turtle & manta ray snorkeling safari",
            "Couples signature restorative ocean-breeze massage"
          ]),
          exclusions_json: JSON.stringify([
            "International flights (custom routing via Doha, Dubai, or Colombo)",
            "Premium imported alcoholic beverages outside meal plan",
            "Diving certifications and motorized watersports"
          ]),
          itinerary_json: JSON.stringify([
            { day: "Day 1: Arrival into Paradise", desc: "Scenic speedboat cruise across turquoise atolls to your private overwater haven." },
            { day: "Day 2-3: Coral House Reef & Sea Turtles", desc: "Guided house-reef snorkeling alongside turtles. Sunset dolphin spotting sail." },
            { day: "Day 4-5: Overwater Relaxation & Private Dining", desc: "Signature couples massage. Evening private candlelit dinner on secluded white sandbank." },
            { day: "Day 6: Lagoon Farewell", desc: "Floating breakfast delivered to villa pool. Marine transfer back to Malé for international flight." }
          ])
        },
        {
          id: "pkg-japan-cherry",
          title: "Japan Golden Route: Tokyo, Kyoto & Mt. Fuji",
          destination: "Tokyo, Hakone & Kyoto, Japan",
          region: "asia",
          tag: "Heritage & Modernity",
          duration: "10 Days / 9 Nights",
          price_indicative: "From ₹1,95,000pp",
          price_note: "Per person sample quote with 7-day Shinkansen Bullet Train pass",
          hero_image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
          gallery_json: JSON.stringify([
            "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"
          ]),
          description: "Traverse high-speed bullet trains from Tokyo's neon districts to Hakone's steaming thermal ryokans and Kyoto's bamboo groves and serene shrines.",
          highlights_json: JSON.stringify([
            "7-Day Japan Rail Pass for high-speed Shinkansen bullet trains",
            "Authentic Hakone Ryokan stay with private thermal onsen bath",
            "Traditional tea ceremony with tea master in Kyoto"
          ]),
          inclusions_json: JSON.stringify([
            "4 nights central Tokyo 4-star hotel (Shinjuku / Ginza)",
            "1 night authentic traditional Ryokan with onsen in Hakone",
            "4 nights boutique hotel in historic Gion, Kyoto",
            "High-speed Shinkansen Bullet Train tickets",
            "Private tea ceremony & Geisha district walking guide",
            "Pocket Wi-Fi device for unlimited navigation"
          ]),
          exclusions_json: JSON.stringify([
            "International flights (open-jaw into Tokyo and out of Osaka available)",
            "Personal temple admission fees outside guided itinerary",
            "Travel insurance"
          ]),
          itinerary_json: JSON.stringify([
            { day: "Day 1-4: Tokyo Dynamic Contrasts", desc: "Explore Shibuya Crossing, Meiji Shrine, Tsukiji outer fish market, and digital art museums." },
            { day: "Day 5: Hakone Thermal Springs & Mt. Fuji", desc: "Cable car over volcanic valleys with views of Mt. Fuji. Natural hot springs and 8-course Kaiseki dinner." },
            { day: "Day 6-9: Imperial Kyoto & Ancient Shrines", desc: "Walk through 10,000 crimson torii gates at Fushimi Inari and golden Kinkaku-ji temple." },
            { day: "Day 10: Farewell Japan", desc: "Express transfer to Osaka Kansai (KIX) or Tokyo Haneda (HND) for departure." }
          ])
        },
        {
          id: "pkg-santorini-amalfi",
          title: "Mediterranean Elegance: Amalfi Coast & Santorini",
          destination: "Italy & Greece",
          region: "europe",
          tag: "Romantic Getaway",
          duration: "9 Days / 8 Nights",
          price_indicative: "From ₹1,65,000pp",
          price_note: "Per person sample quote including cliffside boutique suites & ferries",
          hero_image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
          gallery_json: JSON.stringify([
            "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80"
          ]),
          description: "Sun-drenched whitewashed cliffs, sapphire Mediterranean seas, lemon groves, and cliffside dinners watching the world's most celebrated sunsets.",
          highlights_json: JSON.stringify([
            "Cliff-perched boutique suite overlooking Santorini caldera",
            "Private Capri island wooden boat charter with swim stops",
            "Sunset catamaran cruise around Santorini volcanic caldera"
          ]),
          inclusions_json: JSON.stringify([
            "4 nights Positano / Amalfi cliff-perched boutique hotel",
            "4 nights Oia Santorini caldera-view cave suite",
            "Private Capri island wooden gozzo boat tour with Blue Grotto",
            "Santorini volcanic catamaran cruise with BBQ and Greek wines",
            "All inter-island hydrofoils and private port transfers"
          ]),
          exclusions_json: JSON.stringify([
            "International flights (open-jaw Naples in / Athens out quoted upon request)",
            "Local tourist city occupancy taxes",
            "Personal travel insurance"
          ]),
          itinerary_json: JSON.stringify([
            { day: "Day 1-4: Amalfi Coast, Ravello & Capri", desc: "Private transfer along the Amalfi drive. Wooden boat cruise to Isle of Capri." },
            { day: "Day 5: Flight Across to Santorini", desc: "Check into caldera cave suite in Oia overlooking Aegean Sea." },
            { day: "Day 6-8: Volcanic Caldera & Wine Trails", desc: "Catamaran cruise to volcanic hot springs with lunch. World-famous Oia sunsets." },
            { day: "Day 9: Mediterranean Farewell", desc: "Caldera cliffside breakfast, followed by private airport transfer." }
          ])
        }
      ];

      const stmt = db.prepare(`
        INSERT INTO holiday_packages (
          id, title, destination, region, duration, price_indicative,
          price_note, tag, hero_image, gallery_json, description,
          highlights_json, inclusions_json, exclusions_json,
          itinerary_json, is_published, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?,
          ?, 1, ?, ?
        )
      `);

      for (const p of initialPackages) {
        stmt.run(
          p.id, p.title, p.destination, p.region, p.duration, p.price_indicative,
          p.price_note, p.tag, p.hero_image, p.gallery_json, p.description,
          p.highlights_json, p.inclusions_json, p.exclusions_json,
          p.itinerary_json, now, now
        );
      }
    }

    const destCount = db.prepare('SELECT COUNT(*) as count FROM destinations').get().count;
    if (destCount === 0) {
      const now = new Date().toISOString();
      const initialDestinations = [
        { name: "Bali & Indonesia", tagline: "Tropical Rain Forests, Private Villas & Coral Beaches", region: "asia", image_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80", flight_sample: "Typical return quotes from ₹38,000", package_sample: "Custom itineraries from ₹48,500", pkg_ref: "pkg-bali-escape" },
        { name: "Switzerland & The Alps", tagline: "First-Class Scenic Rail, Glaciers & Iconic Peaks", region: "europe", image_url: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80", flight_sample: "Typical return quotes from ₹42,000", package_sample: "Rail journeys from ₹1,45,000", pkg_ref: "pkg-swiss-alps" },
        { name: "Dubai & Arabia", tagline: "Architectural Marvels, Desert Safaris & 5-Star Opulence", region: "middle-east", image_url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80", flight_sample: "Typical return quotes from ₹22,000", package_sample: "Luxury packages from ₹52,000", pkg_ref: "pkg-dubai-luxe" },
        { name: "Maldives Atolls", tagline: "Overwater Bungalows, Azure Lagoons & Marine Life", region: "islands", image_url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80", flight_sample: "Typical return quotes from ₹45,000", package_sample: "Overwater suites from ₹1,85,000", pkg_ref: "pkg-maldives-bliss" },
        { name: "Japan (Tokyo & Kyoto)", tagline: "Bullet Trains, Geisha Quarters & High-Tech Cities", region: "asia", image_url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80", flight_sample: "Typical return quotes from ₹55,000", package_sample: "Golden route from ₹1,95,000", pkg_ref: "pkg-japan-cherry" },
        { name: "Amalfi & Greek Islands", tagline: "Cliffside Suites, Mediterranean Cuisine & Sunset Charters", region: "europe", image_url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80", flight_sample: "Typical return quotes from ₹46,000", package_sample: "Romantic retreats from ₹1,65,000", pkg_ref: "pkg-santorini-amalfi" }
      ];

      const destStmt = db.prepare(`
        INSERT INTO destinations (
          name, tagline, region, image_url, flight_sample, package_sample, pkg_ref, is_active, created_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, 1, ?
        )
      `);

      for (const d of initialDestinations) {
        destStmt.run(d.name, d.tagline, d.region, d.image_url, d.flight_sample, d.package_sample, d.pkg_ref, now);
      }
    }
  } catch (err) {
    console.warn('[DB Seed Warning]', err.message);
  }
})();

// 3b. Sync Indian Travel Brand catalog into SQLite
(function syncIndianCatalog() {
  try {
    const kashmir = db.prepare("SELECT COUNT(*) as count FROM holiday_packages WHERE id = 'pkg-kashmir-paradise'").get().count;
    if (kashmir === 0) {
      const now = new Date().toISOString();
      const indianPackages = [
        {
          id: "pkg-kashmir-paradise",
          title: "Kashmir Valley of Paradise: Srinagar, Gulmarg & Pahalgam",
          destination: "Kashmir, India",
          region: "domestic",
          tag: "Mountain Paradise",
          duration: "6 Days / 5 Nights",
          price_indicative: "From ₹28,500pp",
          price_note: "Per person illustrative starting quote based on boutique lakeview stays & heritage houseboat",
          hero_image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80",
          gallery_json: JSON.stringify([
            "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80"
          ]),
          description: "Experience the eternal splendour of the Kashmir valley: private sunset Shikara cruises on Dal Lake, cedar forests of Pahalgam, snow activities in Gulmarg, and authentic cedar-wood houseboat living.",
          highlights_json: JSON.stringify([
            "Private sunset Shikara ride across floating lotus gardens on Dal Lake",
            "Gulmarg Gondola cable car ride to Kongdoori and Apharwat Peak"
          ]),
          inclusions_json: JSON.stringify([
            "2 nights 4-star boutique hotel in Srinagar overlooking Dal Lake",
            "2 nights scenic alpine resort in Pahalgam near the Lidder River",
            "1 night luxury handcrafted cedar-wood houseboat on Dal Lake",
            "Daily artisan Indian & Continental buffet breakfasts and chef-curated dinners (MAP plan)",
            "Private air-conditioned Innova Crysta for all transfers and mountain sightseeing"
          ]),
          exclusions_json: JSON.stringify([
            "Domestic airfare (custom flight quotes provided from Delhi, Mumbai, Bengaluru, etc.)",
            "Gondola tickets Phase 1 & 2 (can be pre-booked upon request)"
          ]),
          itinerary_json: JSON.stringify([
            { day: "Day 1: Arrival in Srinagar & Dal Lake Shikara", desc: "Arrive at Srinagar Airport (SXR). Private transfer to hotel and sunset Shikara ride." },
            { day: "Day 2-3: Alpine Pahalgam", desc: "Scenic drive through saffron fields to Pahalgam. Day trip to Betaab Valley and Aru Valley." },
            { day: "Day 4: Gulmarg Meadows of Snow", desc: "Chauffeured drive to Gulmarg. Cable car Gondola to snow fields." },
            { day: "Day 5-6: Houseboat Living & Departure", desc: "Stay on luxury cedar-wood houseboat. Airport drop." }
          ])
        },
        {
          id: "pkg-himachal-panoramas",
          title: "Himachal Alpine Splendour: Manali, Solang Valley & Shimla",
          destination: "Himachal Pradesh, India",
          region: "domestic",
          tag: "Hills & Pine Forests",
          duration: "7 Days / 6 Nights",
          price_indicative: "From ₹22,999pp",
          price_note: "Per person illustrative starting quote with private vehicle and valley view rooms",
          hero_image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
          gallery_json: JSON.stringify(["https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80"]),
          description: "Soak in towering pine peaks, misty mountain air, apple orchards, the engineering marvel of Atal Tunnel, and the historic British colonial charm of Shimla's Mall Road.",
          highlights_json: JSON.stringify(["Drive through landmark 9km Atal Tunnel", "Solang Valley adventure activities"]),
          inclusions_json: JSON.stringify(["3 nights Manali chalet", "2 nights Shimla heritage hotel", "1 night transit", "Private AC sedan / SUV"]),
          exclusions_json: JSON.stringify(["Airfare or rail tickets to Chandigarh / Delhi"]),
          itinerary_json: JSON.stringify([{ day: "Day 1-2: Shimla", desc: "Ascend hills to Shimla Mall Road and Kufri." }, { day: "Day 3-5: Manali & Atal Tunnel", desc: "Solang snow valley and Atal Tunnel excursion." }, { day: "Day 6-7: Departure", desc: "Return to Chandigarh." }])
        },
        {
          id: "pkg-rajasthan-royals",
          title: "Royal Rajasthan Heritage: Jaipur, Jodhpur & Udaipur",
          destination: "Rajasthan, India",
          region: "domestic",
          tag: "Royal Forts & Palaces",
          duration: "8 Days / 7 Nights",
          price_indicative: "From ₹34,500pp",
          price_note: "Per person illustrative starting quote staying in restored havelis and heritage properties",
          hero_image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
          gallery_json: JSON.stringify(["https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"]),
          description: "Walk the sandstone battlements of Mehrangarh, watch pink sunsets over Lake Pichola from a royal palace, and discover the vibrant artisan bazaars of the Pink City.",
          highlights_json: JSON.stringify(["Lake Pichola sunset boat cruise", "Mehrangarh Fort tour", "Amber Fort guided excursion"]),
          inclusions_json: JSON.stringify(["2 nights Jaipur haveli", "2 nights Jodhpur palace", "3 nights Udaipur lakeside resort", "Private SUV chauffeur"]),
          exclusions_json: JSON.stringify(["Monument tickets", "Domestic flights"]),
          itinerary_json: JSON.stringify([{ day: "Day 1-2: Jaipur", desc: "Amber Fort & City Palace." }, { day: "Day 3-4: Jodhpur", desc: "Mehrangarh Fort & Blue City." }, { day: "Day 5-8: Udaipur", desc: "Lake Pichola boat cruise & palaces." }])
        },
        {
          id: "pkg-kerala-backwaters",
          title: "Kerala Emerald Serenity: Munnar Hills & Alleppey Houseboat",
          destination: "Kerala, India",
          region: "domestic",
          tag: "Backwaters & Tea Hills",
          duration: "6 Days / 5 Nights",
          price_indicative: "From ₹26,500pp",
          price_note: "Per person illustrative starting quote including private luxury AC houseboat",
          hero_image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
          gallery_json: JSON.stringify(["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80"]),
          description: "From misty cardamom and tea-clad heights in Munnar to serene palm-fringed backwaters aboard your own private houseboat, experience God's Own Country in complete peace.",
          highlights_json: JSON.stringify(["Private Alleppey houseboat with chef", "Munnar tea estate walks"]),
          inclusions_json: JSON.stringify(["2 nights Munnar tea resort", "1 night Thekkady", "1 night private luxury houseboat", "1 night Fort Kochi"]),
          exclusions_json: JSON.stringify(["Flights to/from Cochin"]),
          itinerary_json: JSON.stringify([{ day: "Day 1-2: Munnar", desc: "Tea country & Eravikulam." }, { day: "Day 3: Thekkady", desc: "Spices & wildlife." }, { day: "Day 4: Alleppey", desc: "Houseboat cruise." }, { day: "Day 5-6: Fort Kochi", desc: "Heritage & departure." }])
        },
        {
          id: "pkg-goa-coastal-villas",
          title: "Goa Coastal Bliss & Heritage Portuguese Villas",
          destination: "Goa, India",
          region: "domestic",
          tag: "Beaches & Heritage",
          duration: "5 Days / 4 Nights",
          price_indicative: "From ₹18,999pp",
          price_note: "Per person illustrative starting quote based on boutique South Goa resort or private villa retreat",
          hero_image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
          gallery_json: JSON.stringify(["https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"]),
          description: "Escape the crowds for tranquil white-sand South Goa beaches, pastel Portuguese villas of Fontainhas, sunset river cruises, and handcrafted Goan coastal cuisine.",
          highlights_json: JSON.stringify(["Fontainhas Latin Quarter heritage tour", "South Goa peaceful beach resort"]),
          inclusions_json: JSON.stringify(["4 nights South Goa boutique resort", "Daily coastal breakfast", "Private airport transfers"]),
          exclusions_json: JSON.stringify(["Flights", "Personal expenses"]),
          itinerary_json: JSON.stringify([{ day: "Day 1: Arrival", desc: "Transfer to South Goa retreat." }, { day: "Day 2: Fontainhas", desc: "Portuguese Latin Quarter." }, { day: "Day 3-5: Beaches & Departure", desc: "Palolem, Agonda and departure." }])
        },
        {
          id: "pkg-andaman-islands",
          title: "Andaman Pristine Turquoise: Port Blair & Havelock Island",
          destination: "Andaman & Nicobar Islands, India",
          region: "domestic",
          tag: "Coral Reefs & Azure Bays",
          duration: "6 Days / 5 Nights",
          price_indicative: "From ₹36,500pp",
          price_note: "Per person illustrative starting quote including Makruzz premium catamaran ferry",
          hero_image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80",
          gallery_json: JSON.stringify(["https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80"]),
          description: "Discover India's very own tropical marine paradise: crystal-clear waters, world-renowned Radhanagar Beach, guided coral snorkeling, and historic island heritage.",
          highlights_json: JSON.stringify(["Radhanagar Beach sunset", "Makruzz catamaran tickets", "Elephant Beach snorkeling"]),
          inclusions_json: JSON.stringify(["2 nights Port Blair", "3 nights Havelock Island", "Makruzz catamaran tickets", "Breakfasts & transfers"]),
          exclusions_json: JSON.stringify(["Flights to Port Blair", "Scuba diving certs"]),
          itinerary_json: JSON.stringify([{ day: "Day 1: Cellular Jail", desc: "Port Blair arrival & Sound/Light show." }, { day: "Day 2-4: Havelock Island", desc: "Radhanagar Beach & coral snorkeling." }, { day: "Day 5-6: Return & Departure", desc: "Catamaran return and airport drop." }])
        }
      ];

      const pStmt = db.prepare(`
        INSERT OR REPLACE INTO holiday_packages (
          id, title, destination, region, duration, price_indicative,
          price_note, tag, hero_image, gallery_json, description,
          highlights_json, inclusions_json, exclusions_json,
          itinerary_json, is_published, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?,
          ?, 1, ?, ?
        )
      `);

      for (const p of indianPackages) {
        pStmt.run(
          p.id, p.title, p.destination, p.region, p.duration, p.price_indicative,
          p.price_note, p.tag, p.hero_image, p.gallery_json, p.description,
          p.highlights_json, p.inclusions_json, p.exclusions_json,
          p.itinerary_json, now, now
        );
      }

      // Update existing international packages with INR price estimates
      db.prepare("UPDATE holiday_packages SET price_indicative = 'From ₹46,000pp', price_note = 'Per person sample quote based on 4-star city stay' WHERE id = 'pkg-dubai-luxe'").run();
      db.prepare("UPDATE holiday_packages SET price_indicative = 'From ₹44,000pp', price_note = 'Per person sample quote based on Ubud pool villa' WHERE id = 'pkg-bali-escape'").run();

      // Update destinations in INR
      const indianDestinations = [
        { name: "Kashmir Valley", tagline: "Dal Lake Shikaras, Pine Forests & Snow Peaks of Gulmarg", region: "domestic", image_url: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=600&q=80", flight_sample: "Flights from ₹6,500 return", package_sample: "Custom itineraries from ₹28,500", pkg_ref: "pkg-kashmir-paradise" },
        { name: "Himachal Pradesh", tagline: "Manali Chalets, Solang Snow Valley & Shimla Colonial Ridge", region: "domestic", image_url: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80", flight_sample: "Flights to IXC from ₹4,200 return", package_sample: "Circuit packages from ₹22,999", pkg_ref: "pkg-himachal-panoramas" },
        { name: "Royal Rajasthan", tagline: "Mehrangarh Forts, Lake Pichola Palaces & Desert Havelis", region: "domestic", image_url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80", flight_sample: "Flights from ₹5,800 return", package_sample: "Heritage havelis from ₹34,500", pkg_ref: "pkg-rajasthan-royals" },
        { name: "Kerala Backwaters", tagline: "Private Houseboat Cruises, Tea Hills & Ayurvedic Retreats", region: "domestic", image_url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80", flight_sample: "Flights from ₹6,200 return", package_sample: "Houseboat stays from ₹26,500", pkg_ref: "pkg-kerala-backwaters" },
        { name: "Goa Coastal Escapes", tagline: "Serene South Goa Beaches & Pastel Fontainhas Heritage Villas", region: "domestic", image_url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80", flight_sample: "Flights from ₹4,500 return", package_sample: "Resort retreats from ₹18,999", pkg_ref: "pkg-goa-coastal-villas" },
        { name: "Andaman Islands", tagline: "Azure Bays, Radhanagar Sunset & Coral Snorkeling Safaris", region: "domestic", image_url: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80", flight_sample: "Flights from ₹9,800 return", package_sample: "Island packages from ₹36,500", pkg_ref: "pkg-andaman-islands" },
        { name: "Dubai & Abu Dhabi", tagline: "Burj Khalifa Glitz, Desert Conservation Dunes & Marina Dining", region: "international", image_url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80", flight_sample: "Direct flights from ₹18,500 return", package_sample: "Luxury 5-day packages from ₹46,000", pkg_ref: "pkg-dubai-luxe" },
        { name: "Bali & Indonesia", tagline: "Ubud Rainforest Pool Villas & Dramatic Uluwatu Cliff Temples", region: "international", image_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80", flight_sample: "1-stop flights from ₹24,500 return", package_sample: "Villa retreats from ₹44,000", pkg_ref: "pkg-bali-escape" }
      ];

      const dStmt = db.prepare(`
        INSERT OR REPLACE INTO destinations (
          name, tagline, region, image_url, flight_sample, package_sample, pkg_ref, is_active, created_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, 1, ?
        )
      `);

      for (const d of indianDestinations) {
        dStmt.run(d.name, d.tagline, d.region, d.image_url, d.flight_sample, d.package_sample, d.pkg_ref, now);
      }
    }
  } catch (err) {
    console.warn('[DB Indian Sync Warning]', err.message);
  }
})();

// ==========================================
// REFERENCE GENERATORS
// ==========================================
function generateReferenceNumber(prefix = 'FLT') {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `TGC-${prefix.toUpperCase()}-${year}-${randomDigits}`;
}

function generateQuotationReference() {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `TGC-QTE-${year}-${randomDigits}`;
}

// ==========================================
// ENQUIRY STORAGE (PUBLIC TOUCHPOINTS)
// ==========================================
function saveFlightEnquiry(enquiry, meta = {}) {
  let refCode;
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    attempts++;
    refCode = generateReferenceNumber('FLT');
    const existing = db.prepare('SELECT id FROM enquiries WHERE reference_no = ?').get(refCode);
    if (!existing) isUnique = true;
  }

  const now = new Date().toISOString();

  const insertStmt = db.prepare(`
    INSERT INTO enquiries (
      reference_no, enquiry_type, full_name, phone, email,
      departure_city, destination, departure_date, return_date,
      trip_type, adults_count, children_count, cabin_preference,
      approximate_budget, additional_requirements, consent_given,
      status, ip_address, user_agent, created_at
    ) VALUES (
      ?, 'flight', ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?,
      'New', ?, ?, ?
    )
  `);

  insertStmt.run(
    refCode,
    enquiry.fullName || enquiry.name,
    enquiry.phone,
    enquiry.email || null,
    enquiry.departureCity,
    enquiry.destination,
    enquiry.departureDate,
    enquiry.returnDate || null,
    enquiry.tripType || 'return',
    parseInt(enquiry.adults || enquiry.adultsCount, 10) || 1,
    parseInt(enquiry.children || enquiry.childrenCount, 10) || 0,
    enquiry.cabinPreference || 'Economy',
    enquiry.approximateBudget || null,
    enquiry.additionalRequirements || null,
    enquiry.consent ? 1 : 0,
    meta.ip || null,
    meta.userAgent || null,
    now
  );

  const row = db.prepare('SELECT * FROM enquiries WHERE reference_no = ?').get(refCode);
  notifyAgency(row, 'Flight Consultation Request');
  return row;
}

function saveHolidayEnquiry(enquiry, meta = {}) {
  let refCode;
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    attempts++;
    refCode = generateReferenceNumber('HOL');
    const existing = db.prepare('SELECT id FROM enquiries WHERE reference_no = ?').get(refCode);
    if (!existing) isUnique = true;
  }

  const now = new Date().toISOString();

  const insertStmt = db.prepare(`
    INSERT INTO enquiries (
      reference_no, enquiry_type, full_name, phone, email,
      destination, travel_dates, travellers_count, number_of_days,
      budget, holiday_trip_type, additional_requirements, consent_given,
      status, ip_address, user_agent, created_at
    ) VALUES (
      ?, 'holiday', ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      'New', ?, ?, ?
    )
  `);

  insertStmt.run(
    refCode,
    enquiry.name || enquiry.fullName,
    enquiry.phone,
    enquiry.email || null,
    enquiry.destination,
    enquiry.travelDates,
    parseInt(enquiry.numberOfTravellers || enquiry.travellers, 10) || 1,
    parseInt(enquiry.numberOfDays || enquiry.days, 10) || 1,
    enquiry.budget,
    enquiry.tripType || 'other',
    enquiry.additionalRequirements || null,
    enquiry.consent ? 1 : 0,
    meta.ip || null,
    meta.userAgent || null,
    now
  );

  const row = db.prepare('SELECT * FROM enquiries WHERE reference_no = ?').get(refCode);
  notifyAgency(row, 'Custom Holiday Package Request');
  return row;
}

function saveGeneralEnquiry(enquiry, meta = {}) {
  let refCode;
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    attempts++;
    refCode = generateReferenceNumber('GEN');
    const existing = db.prepare('SELECT id FROM enquiries WHERE reference_no = ?').get(refCode);
    if (!existing) isUnique = true;
  }

  const now = new Date().toISOString();

  const insertStmt = db.prepare(`
    INSERT INTO enquiries (
      reference_no, enquiry_type, full_name, phone, email,
      destination, departure_date, travellers_count, budget,
      additional_requirements, consent_given, status,
      ip_address, user_agent, created_at
    ) VALUES (
      ?, 'general', ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, 'New',
      ?, ?, ?
    )
  `);

  insertStmt.run(
    refCode,
    enquiry.fullName || enquiry.name,
    enquiry.phone,
    enquiry.email || null,
    enquiry.destination || 'Unspecified',
    enquiry.departureDate || enquiry.travelDates || null,
    parseInt(enquiry.travellersCount || enquiry.numberOfTravellers, 10) || 1,
    enquiry.budget || null,
    enquiry.additionalRequirements || enquiry.notes || null,
    enquiry.consent ? 1 : 0,
    meta.ip || null,
    meta.userAgent || null,
    now
  );

  const row = db.prepare('SELECT * FROM enquiries WHERE reference_no = ?').get(refCode);
  notifyAgency(row, 'General Travel Advisory / Callback');
  return row;
}

function notifyAgency(enquiryRecord, categoryName) {
  const now = new Date().toISOString();
  let summary = `[${categoryName.toUpperCase()}] Ref: ${enquiryRecord.reference_no} | Client: ${enquiryRecord.full_name} | Tel: ${enquiryRecord.phone}`;
  if (enquiryRecord.email) summary += ` | Email: ${enquiryRecord.email}`;
  if (enquiryRecord.destination) summary += ` | Dest: ${enquiryRecord.destination}`;
  if (enquiryRecord.enquiry_type === 'flight') {
    summary += ` | Route: ${enquiryRecord.departure_city || 'N/A'} -> ${enquiryRecord.destination} | Cabin: ${enquiryRecord.cabin_preference || 'Economy'} | Pax: ${enquiryRecord.adults_count} Adult(s), ${enquiryRecord.children_count} Child(ren) | Budget: ${enquiryRecord.approximate_budget || 'N/A'}`;
  } else if (enquiryRecord.enquiry_type === 'holiday') {
    summary += ` | Travel Dates: ${enquiryRecord.travel_dates || 'N/A'} | Days: ${enquiryRecord.number_of_days || 'N/A'} | Pax: ${enquiryRecord.travellers_count} | Type: ${enquiryRecord.holiday_trip_type || 'N/A'} | Budget: ${enquiryRecord.budget || 'N/A'}`;
  }
  if (enquiryRecord.additional_requirements) {
    summary += ` | Notes: ${enquiryRecord.additional_requirements.substring(0, 100)}`;
  }

  try {
    const notifyStmt = db.prepare(`
      INSERT INTO agency_notifications (
        enquiry_id, reference_no, channel, status, summary, created_at
      ) VALUES (?, ?, 'agency_inbox', 'delivered', ?, ?)
    `);
    notifyStmt.run(enquiryRecord.id, enquiryRecord.reference_no, summary, now);
  } catch (err) {
    console.error('[DB Notify Error]', err.message);
  }

  try {
    const logFilePath = path.join(DATA_DIR, 'agency_inbox.log');
    const logLine = `[${now}] ${summary}\n`;
    fs.appendFileSync(logFilePath, logLine, 'utf8');
  } catch (err) {
    console.error('[File Log Error]', err.message);
  }

  console.log(`[AGENCY INBOX NOTIFICATION] New enquiry saved: ${enquiryRecord.reference_no} (${categoryName})`);
}

function getEnquiryByRef(refCode) {
  return db.prepare('SELECT * FROM enquiries WHERE reference_no = ?').get(refCode);
}

function getEnquiryById(id) {
  return db.prepare('SELECT * FROM enquiries WHERE id = ?').get(id);
}

function getAllEnquiries(limit = 100) {
  return db.prepare('SELECT * FROM enquiries ORDER BY id DESC LIMIT ?').all(limit);
}

function getAllNotifications(limit = 100) {
  return db.prepare('SELECT * FROM agency_notifications ORDER BY id DESC LIMIT ?').all(limit);
}

// ==========================================
// ADMIN USER MANAGEMENT
// ==========================================
function createAdminUser({ username, email, fullName, role = 'agent', passwordHash, passwordSalt }) {
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO admin_users (
      username, email, full_name, role, password_hash, password_salt, is_active, created_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, 1, ?
    )
  `);
  stmt.run(username.trim().toLowerCase(), email.trim().toLowerCase(), fullName.trim(), role, passwordHash, passwordSalt, now);
  return getAdminUserByUsername(username);
}

function updateAdminUser(id, { email, full_name, role, password_hash, password_salt, is_active }) {
  let query = 'UPDATE admin_users SET email = ?, full_name = ?, role = ?, is_active = ?';
  const params = [email, full_name, role, is_active ? 1 : 0];

  if (password_hash && password_salt) {
    query += ', password_hash = ?, password_salt = ?';
    params.push(password_hash, password_salt);
  }

  query += ' WHERE id = ?';
  params.push(id);

  db.prepare(query).run(...params);
  return getAdminUserById(id);
}

function getAdminUserByUsername(username) {
  return db.prepare('SELECT * FROM admin_users WHERE username = ? COLLATE NOCASE').get(username.trim());
}

function getAdminUserById(id) {
  return db.prepare('SELECT id, username, email, full_name, role, is_active, last_login, created_at FROM admin_users WHERE id = ?').get(id);
}

function getAllAdminUsers() {
  return db.prepare('SELECT id, username, email, full_name, role, is_active, last_login, created_at FROM admin_users ORDER BY id ASC').all();
}

function updateAdminLastLogin(id) {
  const now = new Date().toISOString();
  db.prepare('UPDATE admin_users SET last_login = ? WHERE id = ?').run(now, id);
}

// ==========================================
// ADMIN SESSIONS
// ==========================================
function createSession(userId, token, ip = null, userAgent = null, expiryHours = 24) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiryHours * 60 * 60 * 1000).toISOString();
  const stmt = db.prepare(`
    INSERT INTO admin_sessions (token, user_id, ip_address, user_agent, expires_at, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(token, userId, ip, userAgent, expiresAt, now.toISOString());
  return { token, expiresAt };
}

function getSessionWithUser(token) {
  if (!token) return null;
  const now = new Date().toISOString();
  const row = db.prepare(`
    SELECT s.token, s.user_id, s.expires_at, u.id as user_id, u.username, u.email, u.full_name, u.role, u.is_active
    FROM admin_sessions s
    JOIN admin_users u ON s.user_id = u.id
    WHERE s.token = ? AND s.expires_at > ? AND u.is_active = 1
  `).get(token, now);
  return row || null;
}

function deleteSession(token) {
  if (!token) return;
  db.prepare('DELETE FROM admin_sessions WHERE token = ?').run(token);
}

function cleanExpiredSessions() {
  const now = new Date().toISOString();
  db.prepare('DELETE FROM admin_sessions WHERE expires_at <= ?').run(now);
}

// ==========================================
// ENQUIRY SEARCH, STATUS, ASSIGNMENT & NOTES
// ==========================================
const VALID_ENQUIRY_STATUSES = ['New', 'Contacted', 'Quote Sent', 'Confirmed', 'Completed', 'Cancelled'];

function searchEnquiries({ query = '', type = 'all', status = 'all', limit = 100, offset = 0 } = {}) {
  let whereClauses = [];
  let params = [];

  if (query && query.trim().length > 0) {
    const q = `%${query.trim()}%`;
    whereClauses.push('(reference_no LIKE ? OR full_name LIKE ? OR phone LIKE ? OR email LIKE ? OR destination LIKE ?)');
    params.push(q, q, q, q, q);
  }

  if (type && type !== 'all') {
    whereClauses.push('enquiry_type = ?');
    params.push(type.toLowerCase());
  }

  if (status && status !== 'all') {
    whereClauses.push('status = ?');
    params.push(status);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
  const totalCount = db.prepare(`SELECT COUNT(*) as count FROM enquiries ${whereSql}`).get(...params).count;

  const dataSql = `
    SELECT e.*, 
      (SELECT COUNT(*) FROM enquiry_notes n WHERE n.enquiry_id = e.id) as notes_count,
      (SELECT COUNT(*) FROM quotations q WHERE q.enquiry_id = e.id) as quotes_count
    FROM enquiries e
    ${whereSql}
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `;

  const rows = db.prepare(dataSql).all(...params, limit, offset);

  return {
    total: totalCount,
    limit,
    offset,
    enquiries: rows
  };
}

function updateEnquiryStatus(id, newStatus) {
  if (!VALID_ENQUIRY_STATUSES.includes(newStatus)) {
    throw new Error(`Invalid status. Allowed values: ${VALID_ENQUIRY_STATUSES.join(', ')}`);
  }
  const now = new Date().toISOString();
  db.prepare('UPDATE enquiries SET status = ?, updated_at = ? WHERE id = ?').run(newStatus, now, id);
  return getEnquiryById(id);
}

function assignEnquiry(id, agentId, agentName) {
  const now = new Date().toISOString();
  db.prepare('UPDATE enquiries SET assigned_agent_id = ?, assigned_to = ?, updated_at = ? WHERE id = ?').run(
    agentId || null,
    agentName || null,
    now,
    id
  );
  return getEnquiryById(id);
}

function addEnquiryNote(enquiryId, authorId, authorName, note) {
  if (!note || note.trim().length === 0) {
    throw new Error('Note text cannot be empty');
  }
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO enquiry_notes (enquiry_id, author_id, author_name, note, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);
  const res = stmt.run(enquiryId, authorId || null, authorName || 'System', note.trim(), now);
  return db.prepare('SELECT * FROM enquiry_notes WHERE id = ?').get(res.lastInsertRowid);
}

function getEnquiryNotes(enquiryId) {
  return db.prepare('SELECT * FROM enquiry_notes WHERE enquiry_id = ? ORDER BY id DESC').all(enquiryId);
}

function getEnquiryStats() {
  const total = db.prepare('SELECT COUNT(*) as count FROM enquiries').get().count;
  const statusRows = db.prepare('SELECT status, COUNT(*) as count FROM enquiries GROUP BY status').all();
  const byStatus = {
    'New': 0,
    'Contacted': 0,
    'Quote Sent': 0,
    'Confirmed': 0,
    'Completed': 0,
    'Cancelled': 0
  };
  statusRows.forEach(r => {
    if (r.status in byStatus) {
      byStatus[r.status] = r.count;
    }
  });

  const quotesCount = db.prepare('SELECT COUNT(*) as count FROM quotations').get().count;
  const packagesCount = db.prepare('SELECT COUNT(*) as count FROM holiday_packages WHERE is_published = 1').get().count;

  return {
    total,
    byStatus,
    quotesCount,
    packagesCount
  };
}

// ==========================================
// HOLIDAY PACKAGES MANAGEMENT
// ==========================================
function getAllPackages(includeUnpublished = false) {
  const sql = includeUnpublished
    ? 'SELECT * FROM holiday_packages ORDER BY created_at DESC'
    : 'SELECT * FROM holiday_packages WHERE is_published = 1 ORDER BY created_at DESC';
  return db.prepare(sql).all();
}

function getPackageById(id) {
  return db.prepare('SELECT * FROM holiday_packages WHERE id = ?').get(id);
}

function savePackage(pkg) {
  const now = new Date().toISOString();
  const id = pkg.id || `pkg-${pkg.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now().toString(36)}`;
  const stmt = db.prepare(`
    INSERT INTO holiday_packages (
      id, title, destination, region, duration, price_indicative,
      price_note, tag, hero_image, gallery_json, description,
      highlights_json, inclusions_json, exclusions_json,
      itinerary_json, is_published, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?, ?
    )
  `);

  stmt.run(
    id,
    pkg.title.trim(),
    pkg.destination.trim(),
    (pkg.region || 'asia').toLowerCase().trim(),
    pkg.duration.trim(),
    pkg.price_indicative || pkg.priceIndicative || 'POA',
    pkg.price_note || pkg.priceNote || 'Per person sample quote',
    pkg.tag || 'Bespoke Package',
    pkg.hero_image || pkg.heroImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    typeof pkg.gallery_json === 'string' ? pkg.gallery_json : JSON.stringify(pkg.gallery || []),
    pkg.description.trim(),
    typeof pkg.highlights_json === 'string' ? pkg.highlights_json : JSON.stringify(pkg.highlights || []),
    typeof pkg.inclusions_json === 'string' ? pkg.inclusions_json : JSON.stringify(pkg.inclusions || []),
    typeof pkg.exclusions_json === 'string' ? pkg.exclusions_json : JSON.stringify(pkg.exclusions || []),
    typeof pkg.itinerary_json === 'string' ? pkg.itinerary_json : JSON.stringify(pkg.itinerary || []),
    pkg.is_published !== undefined ? (pkg.is_published ? 1 : 0) : 1,
    now,
    now
  );

  return getPackageById(id);
}

function updatePackage(id, pkg) {
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    UPDATE holiday_packages SET
      title = ?, destination = ?, region = ?, duration = ?,
      price_indicative = ?, price_note = ?, tag = ?, hero_image = ?,
      gallery_json = ?, description = ?, highlights_json = ?,
      inclusions_json = ?, exclusions_json = ?, itinerary_json = ?,
      is_published = ?, updated_at = ?
    WHERE id = ?
  `);

  stmt.run(
    pkg.title.trim(),
    pkg.destination.trim(),
    (pkg.region || 'asia').toLowerCase().trim(),
    pkg.duration.trim(),
    pkg.price_indicative || pkg.priceIndicative || 'POA',
    pkg.price_note || pkg.priceNote || 'Per person sample quote',
    pkg.tag || 'Bespoke Package',
    pkg.hero_image || pkg.heroImage,
    typeof pkg.gallery_json === 'string' ? pkg.gallery_json : JSON.stringify(pkg.gallery || []),
    pkg.description.trim(),
    typeof pkg.highlights_json === 'string' ? pkg.highlights_json : JSON.stringify(pkg.highlights || []),
    typeof pkg.inclusions_json === 'string' ? pkg.inclusions_json : JSON.stringify(pkg.inclusions || []),
    typeof pkg.exclusions_json === 'string' ? pkg.exclusions_json : JSON.stringify(pkg.exclusions || []),
    typeof pkg.itinerary_json === 'string' ? pkg.itinerary_json : JSON.stringify(pkg.itinerary || []),
    pkg.is_published !== undefined ? (pkg.is_published ? 1 : 0) : 1,
    now,
    id
  );

  return getPackageById(id);
}

function deletePackage(id) {
  db.prepare('DELETE FROM holiday_packages WHERE id = ?').run(id);
  return { success: true };
}

// ==========================================
// DESTINATIONS MANAGEMENT
// ==========================================
function getAllDestinations(activeOnly = true) {
  const sql = activeOnly
    ? 'SELECT * FROM destinations WHERE is_active = 1 ORDER BY name ASC'
    : 'SELECT * FROM destinations ORDER BY name ASC';
  return db.prepare(sql).all();
}

function getDestinationById(id) {
  return db.prepare('SELECT * FROM destinations WHERE id = ?').get(id);
}

function saveDestination(dest) {
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO destinations (
      name, tagline, region, image_url, flight_sample, package_sample, pkg_ref, description, is_active, created_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, 1, ?
    )
  `);
  const res = stmt.run(
    dest.name.trim(),
    (dest.tagline || '').trim(),
    (dest.region || 'asia').toLowerCase().trim(),
    dest.image_url || dest.imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    dest.flight_sample || dest.flightSample || 'Custom flight quote',
    dest.package_sample || dest.packageSample || 'Custom package quote',
    dest.pkg_ref || dest.pkgRef || null,
    dest.description || null,
    now
  );
  return getDestinationById(res.lastInsertRowid);
}

function updateDestination(id, dest) {
  const stmt = db.prepare(`
    UPDATE destinations SET
      name = ?, tagline = ?, region = ?, image_url = ?,
      flight_sample = ?, package_sample = ?, pkg_ref = ?,
      description = ?, is_active = ?
    WHERE id = ?
  `);
  stmt.run(
    dest.name.trim(),
    (dest.tagline || '').trim(),
    (dest.region || 'asia').toLowerCase().trim(),
    dest.image_url || dest.imageUrl,
    dest.flight_sample || dest.flightSample,
    dest.package_sample || dest.packageSample,
    dest.pkg_ref || dest.pkgRef,
    dest.description || null,
    dest.is_active !== undefined ? (dest.is_active ? 1 : 0) : 1,
    id
  );
  return getDestinationById(id);
}

// ==========================================
// QUOTATIONS MANAGEMENT
// ==========================================
function createQuotation({
  enquiry_id,
  enquiry_ref,
  customer_name,
  customer_email,
  customer_phone,
  destination,
  created_by_id,
  agent_name,
  title,
  travel_options,
  total_price,
  price_breakdown,
  validity_date,
  inclusions,
  exclusions,
  cancellation_conditions,
  agent_notes
}) {
  const now = new Date().toISOString();
  const id = generateQuotationReference();
  const crypto = require('crypto');
  const shareToken = crypto.randomBytes(24).toString('hex');

  const stmt = db.prepare(`
    INSERT INTO quotations (
      id, enquiry_id, enquiry_ref, customer_name, customer_email, customer_phone,
      destination, created_by_id, agent_name, title, travel_options_json,
      total_price, price_breakdown, validity_date, inclusions_json,
      exclusions_json, cancellation_conditions, agent_notes, share_token,
      status, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      'sent', ?, ?
    )
  `);

  stmt.run(
    id,
    enquiry_id || null,
    enquiry_ref || null,
    customer_name.trim(),
    customer_email || null,
    customer_phone || null,
    destination.trim(),
    created_by_id || null,
    agent_name || 'TravelGrow Specialist',
    title.trim(),
    typeof travel_options === 'string' ? travel_options : JSON.stringify(travel_options || []),
    total_price.trim(),
    price_breakdown || null,
    validity_date.trim(),
    typeof inclusions === 'string' ? inclusions : JSON.stringify(inclusions || []),
    typeof exclusions === 'string' ? exclusions : JSON.stringify(exclusions || []),
    cancellation_conditions.trim(),
    agent_notes || null,
    shareToken,
    now,
    now
  );

  // If tied to an enquiry, update enquiry status to 'Quote Sent' and add an audit note
  if (enquiry_id) {
    try {
      updateEnquiryStatus(enquiry_id, 'Quote Sent');
      addEnquiryNote(enquiry_id, created_by_id, agent_name || 'Agent', `Generated official quotation ${id} ("${title}") valued at ${total_price}. Share token: ${shareToken}`);
    } catch (e) {
      console.warn('[Auto-update Enquiry on Quote Error]', e.message);
    }
  }

  return getQuotationById(id);
}

function getQuotationById(id) {
  return db.prepare('SELECT * FROM quotations WHERE id = ?').get(id);
}

function getQuotationByShareToken(token) {
  return db.prepare('SELECT * FROM quotations WHERE share_token = ?').get(token);
}

function getAllQuotations(limit = 100) {
  return db.prepare('SELECT * FROM quotations ORDER BY created_at DESC LIMIT ?').all(limit);
}

function updateQuotationStatus(id, newStatus) {
  const now = new Date().toISOString();
  db.prepare('UPDATE quotations SET status = ?, updated_at = ? WHERE id = ?').run(newStatus, now, id);
  return getQuotationById(id);
}

module.exports = {
  db,
  // Enquiries
  saveFlightEnquiry,
  saveHolidayEnquiry,
  saveGeneralEnquiry,
  getEnquiryByRef,
  getEnquiryById,
  getAllEnquiries,
  searchEnquiries,
  updateEnquiryStatus,
  assignEnquiry,
  addEnquiryNote,
  getEnquiryNotes,
  getEnquiryStats,
  getAllNotifications,
  VALID_ENQUIRY_STATUSES,
  // Admin Users
  createAdminUser,
  updateAdminUser,
  getAdminUserByUsername,
  getAdminUserById,
  getAllAdminUsers,
  updateAdminLastLogin,
  // Sessions
  createSession,
  getSessionWithUser,
  deleteSession,
  cleanExpiredSessions,
  // Holiday Packages
  getAllPackages,
  getPackageById,
  savePackage,
  updatePackage,
  deletePackage,
  // Destinations
  getAllDestinations,
  getDestinationById,
  saveDestination,
  updateDestination,
  // Quotations
  createQuotation,
  getQuotationById,
  getQuotationByShareToken,
  getAllQuotations,
  updateQuotationStatus
};
