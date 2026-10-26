// TravelGrow Consultancy - Sample Data Store (Premium Indian Travel Brand)
// Clearly marked illustrative demonstration packages, destinations & flight consultation routes
// All prices displayed in Indian Rupees (₹) as illustrative starting estimates.

const SAMPLE_PACKAGES = [
  {
    id: "pkg-kashmir-paradise",
    title: "Kashmir Valley of Paradise: Srinagar, Gulmarg & Pahalgam",
    destination: "Kashmir, India",
    region: "domestic",
    category: "Family & Honeymoon",
    tag: "Mountain Paradise",
    duration: "6 Days / 5 Nights",
    samplePrice: "From ₹28,500",
    priceNote: "Per person illustrative starting quote based on boutique lakeview stays & heritage houseboat",
    heroImage: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Experience the eternal splendour of the Kashmir valley: private sunset Shikara cruises on Dal Lake, cedar forests of Pahalgam, snow activities in Gulmarg, and authentic cedar-wood houseboat living.",
    bestTime: "April to October (Lush blooms & pleasant weather) or Dec to Feb (Snowfall & winter skiing)",
    highlights: [
      "Private sunset Shikara ride across floating lotus gardens on Dal Lake",
      "Gulmarg Gondola cable car ride to Kongdoori and Apharwat Peak",
      "Scenic day trip to Betaab Valley, Aru Valley and Chandanwari in Pahalgam",
      "Traditional Kashmiri Wazwan multi-course dinner on a luxury cedar houseboat",
      "Dedicated private Innova Crysta chauffeur throughout the journey"
    ],
    inclusions: [
      "2 nights 4-star boutique hotel in Srinagar overlooking Dal Lake",
      "2 nights scenic alpine resort in Pahalgam near the Lidder River",
      "1 night luxury handcrafted cedar-wood houseboat on Dal Lake or Nigeen Lake",
      "Daily artisan Indian & Continental buffet breakfasts and chef-curated dinners (MAP plan)",
      "Private air-conditioned Innova Crysta for all transfers and mountain sightseeing",
      "Private Shikara ride with personal boatman on Dal Lake",
      "24/7 dedicated TravelGrow journey advisor on call & WhatsApp"
    ],
    exclusions: [
      "Domestic airfare (custom flight quotes provided from Delhi, Mumbai, Bengaluru, etc.)",
      "Gondola tickets Phase 1 & 2 (can be pre-booked upon request)",
      "Pony rides, personal winter gear rentals, and driver tips",
      "Personal travel insurance"
    ],
    sampleItinerary: [
      { day: "Day 1: Arrival in Srinagar & Dal Lake Shikara", desc: "Arrive at Srinagar Sheikh ul-Alam Airport (SXR). Meet your private chauffeur and transfer to your lakeview boutique hotel. Enjoy a serene sunset Shikara ride gliding past floating gardens and Char Chinar." },
      { day: "Day 2: Srinagar to Alpine Pahalgam (Valley of Shepherds)", desc: "Scenic drive through saffron fields of Pampore and willow bat cottage industries into Pahalgam. Check into your resort along the babbling Lidder River. Afternoon walk through pine-scented meadows." },
      { day: "Day 3: Betaab Valley, Aru & Chandanwari", desc: "Day excursion to the cinematic Betaab Valley and rustic Aru Valley. Enjoy riverside chai, pine forest walks, and trout farm vistas." },
      { day: "Day 4: Pahalgam to Gulmarg Meadows of Snow", desc: "Chauffeured drive to Gulmarg (2,650m). Board the celebrated Gulmarg Gondola cable car rising up into Apharwat snow fields. Evening transfer to Srinagar." },
      { day: "Day 5: Mughal Gardens & Luxury Houseboat Living", desc: "Morning visit to Nishat Bagh and Shalimar Bagh terraced Mughal gardens. Afternoon check-in to your carved cedar-wood houseboat. Evening Kashmiri Kehwa and Wazwan banquet." },
      { day: "Day 6: Srinagar Departure", desc: "Morning breakfast on the sun-deck watching shikaras glide by. Private airport transfer for your flight home." }
    ]
  },
  {
    id: "pkg-himachal-panoramas",
    title: "Himachal Alpine Splendour: Manali, Solang Valley & Shimla",
    destination: "Himachal Pradesh, India",
    region: "domestic",
    category: "Family & Adventure",
    tag: "Hills & Pine Forests",
    duration: "7 Days / 6 Nights",
    samplePrice: "From ₹22,999",
    priceNote: "Per person illustrative starting quote with private vehicle and valley view rooms",
    heroImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Soak in towering pine peaks, misty mountain air, apple orchards, the engineering marvel of Atal Tunnel, and the historic British colonial charm of Shimla's Mall Road.",
    bestTime: "March to June (Pleasant mountain summers) or Dec to Feb (Snow views)",
    highlights: [
      "Drive through the landmark 9km Atal Tunnel to Sissu waterfall",
      "Adventure sports & snow playtime in Solang Valley",
      "Colonial heritage walk along Shimla's vehicle-free Mall Road & Ridge",
      "Charming wooden architecture at Hadimba Temple & Vashisht Hot Springs",
      "Scenic mountain drive through Kullu valley with white-water rafting view"
    ],
    inclusions: [
      "3 nights 4-star mountain chalet resort in Manali with private balcony",
      "2 nights colonial heritage boutique hotel in Shimla",
      "1 night transit stop in Chandigarh / Parwanoo",
      "Daily hearty mountain breakfasts and multi-course dinners",
      "Dedicated air-conditioned private sedan or SUV for entire circuit",
      "Fuel, toll taxes, state road entry taxes, and driver allowances"
    ],
    exclusions: [
      "Flights or railway tickets to Chandigarh / Delhi (quoted separately upon request)",
      "Rohtang Pass NGT permits and private local taxi union fares (if required)",
      "Paragliding, river rafting, and ropeway tickets"
    ],
    sampleItinerary: [
      { day: "Day 1: Delhi / Chandigarh to Shimla", desc: "Pickup from airport or railway station. Ascend the twisting Shivalik hills to Shimla. Evening stroll along the Mall Road and The Ridge." },
      { day: "Day 2: Kufri & Shimla Colonial Heritage", desc: "Excursion to Kufri pine heights and Himalayan Nature Park. Visit the historic Viceregal Lodge and Christ Church." },
      { day: "Day 3: Shimla to Manali via Kullu Valley", desc: "Spectacular drive through mountain tunnels, Beas river valley, and apple orchards. Settle into your Manali chalet." },
      { day: "Day 4: Solang Valley, Atal Tunnel & Sissu", desc: "Day trip to Solang Valley for ropeway and alpine views. Cross the majestic Atal Tunnel into the rugged Lahaul valley to see Sissu waterfall." },
      { day: "Day 5: Manali Local Delights & Old Manali Cafes", desc: "Visit Hadimba Devi temple set in deep cedar woods, Vashisht sulphur springs, and relaxed cafes of Old Manali." },
      { day: "Day 6-7: Kullu Crafts & Return Transfer", desc: "Stop at Kullu shawl weavers village on the drive to Chandigarh for onward flights home." }
    ]
  },
  {
    id: "pkg-rajasthan-royals",
    title: "Royal Rajasthan Heritage: Jaipur, Jodhpur & Udaipur",
    destination: "Rajasthan, India",
    region: "domestic",
    category: "Heritage & Palaces",
    tag: "Royal Forts & Palaces",
    duration: "8 Days / 7 Nights",
    samplePrice: "From ₹34,500",
    priceNote: "Per person illustrative starting quote staying in restored havelis and heritage properties",
    heroImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Walk the sandstone battlements of Mehrangarh, watch pink sunsets over Lake Pichola from a royal palace, and discover the vibrant artisan bazaars of the Pink City.",
    bestTime: "October to March (Pleasant winter sunshine)",
    highlights: [
      "Exclusive sunset boat cruise on Lake Pichola facing the Lake Palace",
      "Private guided sunrise tour of Amber Fort and Jal Mahal in Jaipur",
      "Explore the majestic Mehrangarh Fort rising 400ft above Jodhpur's blue city",
      "Authentic royal Rajasthani Thali experience in a restored royal haveli",
      "Visit the intricate 1,444-pillar marble Ranakpur Jain Temple"
    ],
    inclusions: [
      "2 nights heritage boutique stay in Jaipur (Pink City)",
      "2 nights fort-view palace haveli in Jodhpur (Blue City)",
      "3 nights lakeside luxury resort in Udaipur (City of Lakes)",
      "Daily royal buffet breakfasts at all heritage properties",
      "Private air-conditioned SUV & expert chauffeur for the entire royal circuit",
      "Private sunset boat charter on Lake Pichola in Udaipur",
      "Dedicated trip coordinator on WhatsApp throughout"
    ],
    exclusions: [
      "Monument entrance tickets and camera fees (can be bundled on request)",
      "Lunch, snacks, and personal artisanal shopping expenses",
      "Domestic airfares to Jaipur / out of Udaipur"
    ],
    sampleItinerary: [
      { day: "Day 1-2: Pink City Grandeur (Jaipur)", desc: "Arrive in Jaipur. Check into your heritage haveli. Visit Amber Fort with panoramic ramparts, Hawa Mahal facade, City Palace, and Jantar Mantar." },
      { day: "Day 3-4: The Blue City & Mehrangarh (Jodhpur)", desc: "Drive to Jodhpur. Ascend the imposing Mehrangarh Fort, walk through the blue-painted lanes of Brahmpuri, and visit Jaswant Thada cenotaphs." },
      { day: "Day 5: Ranakpur Marble Temple to Udaipur", desc: "Cross the Aravalli hills stopping at the marvel of Ranakpur Jain Temple. Arrive in romantic Udaipur and check into your lakeside haven." },
      { day: "Day 6-7: Lake Pichola & Palaces (Udaipur)", desc: "Explore the City Palace complex, Saheliyon-ki-Bari fountains, and embark on a private sunset boat cruise across Lake Pichola. Evening cultural Rajasthani folk dance at Bagore Ki Haveli." },
      { day: "Day 8: Udaipur Farewell", desc: "Leisure morning by the pool. Chauffeured transfer to Maharana Pratap Airport (UDR) for your journey home." }
    ]
  },
  {
    id: "pkg-kerala-backwaters",
    title: "Kerala Emerald Serenity: Munnar Hills & Alleppey Houseboat",
    destination: "Kerala, India",
    region: "domestic",
    category: "Nature & Relaxation",
    tag: "Backwaters & Tea Hills",
    duration: "6 Days / 5 Nights",
    samplePrice: "From ₹26,500",
    priceNote: "Per person illustrative starting quote including private luxury AC houseboat",
    heroImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
    ],
    description: "From misty cardamom and tea-clad heights in Munnar to serene palm-fringed backwaters aboard your own private houseboat, experience God's Own Country in complete peace.",
    bestTime: "September to March (Crisp backwaters and hills) or July-Aug (Ayurveda monsoon season)",
    highlights: [
      "Private overnight luxury Kettuvallam houseboat cruise in Alleppey with personal chef",
      "Walk through lush rolling tea hills and spice plantations in Munnar",
      "Witness an authentic Kathakali performance and Kalaripayattu martial arts show",
      "Colonial Fort Kochi heritage walk with Chinese fishing nets",
      "Traditional Kerala Sadya meal served on freshly cut banana leaves"
    ],
    inclusions: [
      "2 nights luxury tea plantation resort in Munnar",
      "1 night scenic sanctuary stay in Thekkady (Periyar)",
      "1 night private 1-bedroom or 2-bedroom luxury AC houseboat in Alleppey",
      "1 night heritage boutique stay in Fort Kochi",
      "All meals onboard the houseboat (traditional Karimeen fry, Kerala chicken curry, rice)",
      "Daily gourmet breakfasts at hotels",
      "Private air-conditioned car and dedicated driver for the entire itinerary"
    ],
    exclusions: [
      "Flights to/from Cochin International Airport (COK)",
      "Optional Ayurvedic full-body treatments and massages",
      "Entry tickets to spice gardens and cultural shows"
    ],
    sampleItinerary: [
      { day: "Day 1: Cochin to Munnar Tea Country", desc: "Arrival at Cochin Airport. Drive through Cheeyappara waterfalls to Munnar. Check into your resort set amidst misty tea estates." },
      { day: "Day 2: Munnar Tea & Flora Exploration", desc: "Visit Eravikulam National Park (home to the Nilgiri Tahr), the Tata Tea Museum, and enjoy panoramic views from Top Station." },
      { day: "Day 3: Thekkady Wildlife & Spice Gardens", desc: "Drive to Thekkady. Take a guided walking spice plantation tour to learn about cardamom, pepper, and cinnamon. Optional bamboo rafting." },
      { day: "Day 4: Alleppey Backwaters Houseboat", desc: "Board your private traditional houseboat at noon. Cruise through tranquil canals, village shores, and paddy fields. Savor freshly prepared local seafood dinner under the stars." },
      { day: "Day 5: Fort Kochi Heritage Walk", desc: "Disembark after breakfast. Drive to Fort Kochi. Visit St. Francis Church, Jewish Synagogue, and watch fishermen operate cantilevered Chinese fishing nets." },
      { day: "Day 6: Cochin Departure", desc: "Final morning filter coffee, leisurely souvenir shopping, and private transfer to Cochin Airport." }
    ]
  },
  {
    id: "pkg-goa-coastal-villas",
    title: "Goa Coastal Bliss & Heritage Portuguese Villas",
    destination: "Goa, India",
    region: "domestic",
    category: "Weekend & Leisure",
    tag: "Beaches & Heritage",
    duration: "5 Days / 4 Nights",
    samplePrice: "From ₹18,999",
    priceNote: "Per person illustrative starting quote based on boutique South Goa resort or private villa retreat",
    heroImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Escape the crowds for tranquil white-sand South Goa beaches, pastel Portuguese villas of Fontainhas, sunset river cruises, and handcrafted Goan coastal cuisine.",
    bestTime: "October to April (Glorious beach weather)",
    highlights: [
      "Stay in an intimate South Goa beach retreat or private pool villa",
      "Guided heritage walking tour through Fontainhas Latin Quarter in Panjim",
      "Private sunset catamaran sail with coastal refreshments",
      "Curated dining guide to the finest Goan-Portuguese artisanal restaurants"
    ],
    inclusions: [
      "4 nights boutique 4-star beach resort or shared villa in South Goa",
      "Daily gourmet coastal breakfasts with tropical fruit baskets",
      "Airport meet & greet transfers from MOPA (GOX) or Dabolim (GOI)",
      "Fontainhas heritage walking tour with local culinary expert",
      "Private chauffeured car on 2 full days for coastal exploration"
    ],
    exclusions: [
      "Flights to Goa (we search and quote net consolidator airfares on request)",
      "Watersports and nightlife admissions",
      "Personal meals and bar bills"
    ],
    sampleItinerary: [
      { day: "Day 1: Arrival & Coastal Welcome", desc: "Arrive at Goa Airport. Private chauffeured transfer to your peaceful South Goa sanctuary. Evening beachside drink as the sun sets over the Arabian Sea." },
      { day: "Day 2: Heritage Fontainhas & Panjim", desc: "Explore the colourful Portuguese lanes of Fontainhas, visit the Church of Our Lady of the Immaculate Conception, and enjoy lunch at a legendary Goan tavern." },
      { day: "Day 3: Untouched South Goa Beaches", desc: "Day exploring pristine white-sand shores of Palolem, Agonda, and Cabo de Rama cliff viewpoint." },
      { day: "Day 4: Spice Plantation & Sunset Cruise", desc: "Visit an organic spice plantation for a traditional buffet lunch, followed by a relaxed sunset boat cruise." },
      { day: "Day 5: Goa Farewell", desc: "Relaxed breakfast, final dip in the pool, and private airport transfer." }
    ]
  },
  {
    id: "pkg-andaman-islands",
    title: "Andaman Pristine Turquoise: Port Blair & Havelock Island",
    destination: "Andaman & Nicobar Islands, India",
    region: "domestic",
    category: "Honeymoon & Beaches",
    tag: "Coral Reefs & Azure Bays",
    duration: "6 Days / 5 Nights",
    samplePrice: "From ₹36,500",
    priceNote: "Per person illustrative starting quote including Makruzz premium catamaran ferry",
    heroImage: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Discover India's very own tropical marine paradise: crystal-clear waters, world-renowned Radhanagar Beach, guided coral snorkeling, and historic island heritage.",
    bestTime: "October to May (Calm seas & optimal underwater visibility)",
    highlights: [
      "Sunset at Radhanagar Beach (Beach No. 7), celebrated as one of Asia's finest shores",
      "High-speed luxury Makruzz catamaran ferry between Port Blair and Havelock",
      "Guided coral reef snorkeling and glass-bottom boat tour at Elephant Beach",
      "Sound & Light show bringing Cellular Jail's historic sacrifice to life"
    ],
    inclusions: [
      "2 nights 4-star beachfront resort in Port Blair",
      "3 nights premium seaside resort in Havelock Island",
      "Return premium class tickets on the Makruzz high-speed catamaran",
      "Daily buffet breakfasts",
      "All private airport, jetty, and sightseeing transfers in air-conditioned vehicles",
      "Complimentary snorkeling session at Elephant Beach"
    ],
    exclusions: [
      "Airfare to Port Blair (direct flights available from Delhi, Mumbai, Chennai, Kolkata)",
      "Scuba diving certifications or sea karting adventures",
      "Camera tickets at Cellular Jail"
    ],
    sampleItinerary: [
      { day: "Day 1: Port Blair & Cellular Jail", desc: "Arrival at Veer Savarkar International Airport (IXZ). Visit historic Cellular Jail and witness the poignant evening Sound & Light show." },
      { day: "Day 2: Cruise to Havelock & Radhanagar Sunset", desc: "Board the luxury Makruzz catamaran to Havelock Island. Afternoon leisure on the powdery sands of Radhanagar Beach as the sky turns gold." },
      { day: "Day 3: Elephant Beach Coral Reefs", desc: "Speedboat ride to Elephant Beach. Explore vibrant coral formations and tropical reef fish with a certified snorkeling instructor." },
      { day: "Day 4: Kalapathar Beach & Island Rhythms", desc: "Visit scenic Kalapathar Beach with its turquoise contrasts against black shoreline rocks. Relax at seaside cafes." },
      { day: "Day 5: Havelock to Port Blair & Chidiya Tapu", desc: "Catamaran back to Port Blair. Evening trip to Chidiya Tapu (Bird Island) for sweeping coastal panoramic sunset views." },
      { day: "Day 6: Port Blair Farewell", desc: "Breakfast, souvenir pearl shopping in Aberdeen Bazaar, and private airport drop." }
    ]
  },
  {
    id: "pkg-uttarakhand-retreats",
    title: "Uttarakhand Ganges & Foothills: Rishikesh, Mussoorie & Jim Corbett",
    destination: "Uttarakhand, India",
    region: "domestic",
    category: "Wellness & Wilderness",
    tag: "Himalayan Foothills",
    duration: "6 Days / 5 Nights",
    samplePrice: "From ₹24,500",
    priceNote: "Per person illustrative starting quote including jungle safari and riverfront stay",
    heroImage: "https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Connect with nature along the sacred banks of the Ganges in Rishikesh, enjoy misty colonial heights in Mussoorie, and track Bengal tigers in Jim Corbett National Park.",
    bestTime: "October to June (Pleasant weather & tiger safari season)",
    highlights: [
      "VIP riverside seating for the soul-stirring Parmarth Niketan Ganga Aarti in Rishikesh",
      "Exclusive open-top 4x4 Gypsy jungle safari inside Jim Corbett National Park",
      "Scenic ridge walk along Mussoorie's Camel's Back Road with Himalayan snow views",
      "Stay in riverfront wellness resorts surrounded by sal forests"
    ],
    inclusions: [
      "2 nights Ganges riverfront boutique resort in Rishikesh",
      "2 nights jungle wildlife lodge in Jim Corbett",
      "1 night alpine hill resort in Mussoorie",
      "1 exclusive open-jeep Corbett safari with registered forest naturalist",
      "Daily breakfast and dinner (MAP plan)",
      "Private SUV chauffeur for the entire circuit from Dehradun or Delhi"
    ],
    exclusions: [
      "White-water rafting and bungee jumping fees in Rishikesh",
      "Forest camera permits outside safari vehicle standard allowance"
    ],
    sampleItinerary: [
      { day: "Day 1-2: Spiritual Rishikesh & Ganges", desc: "Arrive via Dehradun Airport or Delhi. Attend the sacred evening Ganga Aarti. Enjoy sunrise yoga by the river and walk across Ram Jhula." },
      { day: "Day 3: Mussoorie Queen of the Hills", desc: "Ascend to Mussoorie. Visit Kempty Falls and enjoy sunset views across the Doon Valley from Mall Road." },
      { day: "Day 4-5: Jim Corbett Wilderness & Safari", desc: "Drive to Corbett National Park. Embark on an early morning open-top safari tracking wild elephants, deer, and the elusive Royal Bengal Tiger." },
      { day: "Day 6: Delhi / Dehradun Departure", desc: "Morning nature walk along the Kosi riverbed, breakfast, and private chauffeured transfer for onward journey." }
    ]
  },
  {
    id: "pkg-dubai-luxe",
    title: "Dubai Glamour & Desert Safari: Marina, Burj Khalifa & Theme Parks",
    destination: "Dubai & Abu Dhabi, UAE",
    region: "international",
    category: "Family & Shopping",
    tag: "Skyline & Desert Oasis",
    duration: "5 Days / 4 Nights",
    samplePrice: "From ₹46,000",
    priceNote: "Per person illustrative starting quote based on 4-star/5-star city hotel and desert camp",
    heroImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=800&q=80"
    ],
    description: "The favorite international escape for Indian families and couples: soaring Burj Khalifa views, dune bashing in red desert sands, luxury Marina yacht dining, and world-class shopping.",
    bestTime: "October to April (Pleasant warm sunshine and shopping festivals)",
    highlights: [
      "Burj Khalifa observation deck timed entry on the 124th & 125th floors",
      "4x4 red dune desert safari with BBQ buffet dinner and live Tanoura performance",
      "Private luxury dhow dinner cruise glitz along Dubai Marina",
      "Day excursion to Abu Dhabi: Sheikh Zayed Grand Mosque & Louvre"
    ],
    inclusions: [
      "4 nights at a 4-star or 5-star hotel in Dubai Marina or Downtown",
      "Daily international and Indian breakfast buffet",
      "Desert safari with dune bashing, camel rides, and starlit BBQ banquet",
      "Burj Khalifa 124th floor ticket",
      "Marina dhow dinner cruise",
      "Return airport transfers in private chauffeured vehicle",
      "Assistance with Dubai tourist e-visa processing"
    ],
    exclusions: [
      "Flights (custom net consolidator airfares quoted via Emirates, Air India, IndiGo)",
      "Dubai Tourism Dirham fee (payable directly to the hotel)",
      "UAE tourist visa fee (billed at actuals)"
    ],
    sampleItinerary: [
      { day: "Day 1: Arrival & Dubai Marina Walk", desc: "Touchdown at DXB. Private transfer to your hotel. Evening luxury Dhow cruise along the illuminated skyscrapers of Dubai Marina." },
      { day: "Day 2: Modern Icons & Burj Khalifa", desc: "Visit Dubai Frame, Dubai Mall, and ascend the Burj Khalifa for breathtaking 360-degree desert and sea vistas." },
      { day: "Day 3: Arabian Desert Conservation Safari", desc: "Afternoon 4x4 drive into golden desert dunes. Enjoy sandboarding, camel rides, and a starlit barbecue dinner." },
      { day: "Day 4: Abu Dhabi Sheikh Zayed Mosque Excursion", desc: "Day trip to Abu Dhabi to witness the gleaming white marble domes of the Sheikh Zayed Grand Mosque." },
      { day: "Day 5: Gold Souk Shopping & Departure", desc: "Visit the traditional Deira Gold & Spice souks. Private airport drop for your flight back to India." }
    ]
  },
  {
    id: "pkg-thailand-getaway",
    title: "Thailand Tropical Escape: Bangkok City & Phuket Coastal Retreat",
    destination: "Phuket & Bangkok, Thailand",
    region: "international",
    category: "Beaches & City",
    tag: "Islands & Street Culture",
    duration: "6 Days / 5 Nights",
    samplePrice: "From ₹38,500",
    priceNote: "Per person illustrative starting quote with internal island connections",
    heroImage: "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Golden Buddhist temples and vibrant street markets in Bangkok, paired with crystal azure waters and dramatic limestone sea cliffs in Phuket.",
    bestTime: "November to April (Dry tropical sunshine)",
    highlights: [
      "Speedboat excursion to Phi Phi Islands, Maya Bay & Pileh Lagoon",
      "Chao Phraya Princess luxury evening dinner cruise in Bangkok",
      "Grand Palace & Wat Pho (Reclining Buddha) cultural tour",
      "Beachfront resort in Phuket with private ocean terrace"
    ],
    inclusions: [
      "3 nights beachfront resort in Phuket (Patong / Kata)",
      "2 nights 4-star central Bangkok hotel (Sukhumvit / Pratunam)",
      "Phi Phi Island day tour with lunch and snorkeling gear",
      "Bangkok city temple tour and Chao Phraya river dinner cruise",
      "All airport and inter-resort transfers in private air-conditioned vehicles"
    ],
    exclusions: [
      "International and domestic Bangkok-Phuket flights (quoted upon request)",
      "National park fees for Phi Phi Islands (payable locally)",
      "Personal shopping and water sports"
    ],
    sampleItinerary: [
      { day: "Day 1: Arrival in Phuket", desc: "Touchdown at Phuket Airport. Transfer to your beach resort. Unwind on the golden sands and enjoy fresh seafood." },
      { day: "Day 2: Phi Phi Islands Speedboat Cruise", desc: "Sail to Maya Bay, snorkel among colorful reef fish in Pileh Lagoon, and visit Monkey Beach." },
      { day: "Day 3: Phuket Coastline & Big Buddha", desc: "Visit the towering white marble Big Buddha and Promthep Cape viewpoint." },
      { day: "Day 4: Fly to Bangkok & River Dinner Cruise", desc: "Short flight to Bangkok. Evening luxury cruise along the Chao Phraya river past illuminated temples." },
      { day: "Day 5: Temples & Vibrant Shopping", desc: "Tour the Grand Palace, Wat Pho, and explore Pratunam wholesale markets or ICONSIAM." },
      { day: "Day 6: Bangkok Departure", desc: "Breakfast, final souvenir shopping, and private transfer to Suvarnabhumi Airport (BKK)." }
    ]
  },
  {
    id: "pkg-bali-escape",
    title: "Bali Tropical Serenity & Ubud Cultural Retreat",
    destination: "Bali, Indonesia",
    region: "international",
    category: "Honeymoon & Nature",
    tag: "Rainforest Villas & Beaches",
    duration: "7 Days / 6 Nights",
    samplePrice: "From ₹44,000",
    priceNote: "Per person illustrative starting quote based on private pool villa and beach resort",
    heroImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Immerse yourself in lush emerald rice terraces, sacred water temples, private pool villas in Ubud, and breathtaking cliffside sunsets at Uluwatu.",
    bestTime: "April to October (Dry season with pleasant sea breezes)",
    highlights: [
      "Private pool villa in the Ubud rainforest canopy",
      "Sunset seafood dinner right on the sand at Jimbaran Bay",
      "Tegalalang emerald rice terraces & Bali jungle swing",
      "Cliffside Uluwatu Temple perched 70 meters above the Indian Ocean with Kecak fire dance"
    ],
    inclusions: [
      "3 nights private pool villa in Ubud",
      "3 nights 4-star beach resort in Seminyak or Kuta",
      "Daily gourmet breakfasts served in your villa",
      "Private air-conditioned car & dedicated driver for all sightseeing and transfers",
      "Curated Jimbaran sunset seafood dinner",
      "24/7 dedicated TravelGrow itinerary concierge"
    ],
    exclusions: [
      "International flights (quoted separately via Singapore Airlines, Malaysia Airlines, etc.)",
      "Indonesia Visa on Arrival (approx ₹2,900)",
      "Personal travel insurance"
    ],
    sampleItinerary: [
      { day: "Day 1-2: Touchdown & Ubud Rainforest Haven", desc: "Arrival at Denpasar (DPS). Private chauffeur transfer to your Ubud pool villa. Enjoy floating breakfast and walk along Campuhan Ridge." },
      { day: "Day 3: Tegalalang Rice Terraces & Water Temples", desc: "Visit the iconic Tegalalang terraces, Bali swing, and Tirta Empul holy spring temple." },
      { day: "Day 4-5: Coastal Seminyak & Beach Clubs", desc: "Chauffeured transfer to Seminyak. Relax on sandy beaches and explore chic boutiques." },
      { day: "Day 6: Uluwatu Cliff Temple & Kecak Dance", desc: "Visit dramatic Uluwatu cliff temple followed by the hypnotic Kecak dance and Jimbaran seafood dinner." },
      { day: "Day 7: Bali Farewell", desc: "Final dip in the pool, artisan coffee tasting, and private airport drop." }
    ]
  },
  {
    id: "pkg-singapore-delight",
    title: "Singapore City Wonders & Sentosa Island Fantasy",
    destination: "Singapore",
    region: "international",
    category: "Family & Leisure",
    tag: "Futuristic & Family",
    duration: "5 Days / 4 Nights",
    samplePrice: "From ₹54,000",
    priceNote: "Per person illustrative starting quote including Universal Studios & Gardens pass",
    heroImage: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506351421178-63b52a2d15c2?auto=format&fit=crop&w=800&q=80"
    ],
    description: "The gold standard for Indian family vacations: Universal Studios rides, breathtaking Gardens by the Bay supertrees, Night Safari tram, and Marina Bay panoramic walks.",
    bestTime: "Year-round destination",
    highlights: [
      "Full-day Universal Studios Singapore admission pass",
      "Gardens by the Bay: Flower Dome, Cloud Forest & Supertree Grove",
      "Night Safari open-tram ride through nocturnal animal habitats",
      "Sentosa Island cable car crossing and Wings of Time light show"
    ],
    inclusions: [
      "4 nights central 4-star hotel in Singapore (Clarke Quay / Orchard / Bugis)",
      "Daily international and Indian breakfast options",
      "Universal Studios one-day pass",
      "Gardens by the Bay combo ticket",
      "Night Safari tram ticket",
      "Private airport and Sentosa transfers"
    ],
    exclusions: [
      "International flights (convenient direct options via Singapore Airlines, Air India, IndiGo)",
      "Singapore tourist visa fee",
      "Personal expenses and meals outside package"
    ],
    sampleItinerary: [
      { day: "Day 1: Arrival & Marina Bay Waterfront", desc: "Touchdown at world-famous Changi Airport. Transfer to hotel. Evening stroll around Marina Bay Sands and the Merlion statue." },
      { day: "Day 2: Gardens by the Bay & Night Safari", desc: "Explore the indoor mist waterfall at Cloud Forest and Supertree Grove. Evening tram tour inside the world's first Night Safari." },
      { day: "Day 3: Universal Studios Sentosa", desc: "Full day of thrilling movie-themed rides, roller coasters, and character encounters at Universal Studios Singapore." },
      { day: "Day 4: Little India, Chinatown & Orchard Road", desc: "Immerse in the heritage of Little India and Chinatown, followed by shopping along Orchard Road." },
      { day: "Day 5: Changi Jewel & Departure", desc: "Visit Jewel Changi and the Rain Vortex waterfall before boarding your flight home." }
    ]
  },
  {
    id: "pkg-vietnam-discovery",
    title: "Vietnam Enchantment: Ha Long Bay Cruise, Da Nang & Hoi An",
    destination: "Vietnam (Hanoi, Ha Long & Hoi An)",
    region: "international",
    category: "Culture & Cruise",
    tag: "Limestone Bays & Ancient Towns",
    duration: "7 Days / 6 Nights",
    samplePrice: "From ₹46,500",
    priceNote: "Per person illustrative starting quote including 5-star overnight luxury bay cruise",
    heroImage: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Cruise past thousands of emerald limestone karst islands in Ha Long Bay, walk through magical lantern-lit ancient streets of Hoi An, and cross the Golden Bridge held by giant stone hands.",
    bestTime: "October to April (Pleasant dry season)",
    highlights: [
      "Overnight 5-star luxury cruise on Ha Long Bay with sea kayaking and cave visits",
      "Evening wooden boat lantern release on the Thu Bon river in Hoi An Ancient Town",
      "Golden Bridge walk at Ba Na Hills held up by colossal stone hands",
      "Private guided walking street food and coffee tour in Hanoi Old Quarter"
    ],
    inclusions: [
      "2 nights 4-star boutique hotel in Hanoi French Quarter",
      "1 night 5-star luxury Ha Long Bay cruise with all meals onboard",
      "3 nights boutique riverside resort in Hoi An",
      "Internal domestic flight between Hanoi and Da Nang",
      "Ba Na Hills cable car & Golden Bridge pass",
      "Private airport transfers and inter-city limousine shuttles"
    ],
    exclusions: [
      "International flights (custom quotes via VietJet, Vietnam Airlines, Air India)",
      "Vietnam tourist e-visa fee (approx ₹2,100)",
      "Discretionary driver tips and alcoholic beverages"
    ],
    sampleItinerary: [
      { day: "Day 1: Arrival in Hanoi Old Quarter", desc: "Touchdown at Noi Bai Airport (HAN). Private transfer to hotel. Walk around Hoan Kiem Lake and try iconic Vietnamese egg coffee." },
      { day: "Day 2: Ha Long Bay 5-Star Cruise", desc: "Board your luxury cruise ship. Kayak through limestone karst sea caves and enjoy sunset canapes on the upper sundeck." },
      { day: "Day 3: Ha Long Bay to Da Nang & Hoi An", desc: "Sunrise Tai Chi session. Disembark and take a short flight to Da Nang. Transfer to the enchanting ancient town of Hoi An." },
      { day: "Day 4: Ba Na Hills & The Golden Bridge", desc: "Ride one of the world's longest cable cars to Ba Na Hills to stroll the Golden Bridge held by giant stone hands." },
      { day: "Day 5: Lantern-lit Hoi An Ancient Town", desc: "Explore Japanese covered bridge, tailor shops, and take a magical wooden boat to release illuminated candle lanterns on the river." },
      { day: "Day 6-7: Marble Mountains & Departure", desc: "Visit the sacred caves of Marble Mountains, followed by chauffeured transfer to Da Nang Airport for your return flight." }
    ]
  }
];

const POPULAR_DESTINATIONS = [
  {
    name: "Kashmir Valley",
    tagline: "Dal Lake Shikaras, Pine Forests & Snow Peaks of Gulmarg",
    region: "domestic",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=700&q=80",
    flightSample: "Flights from ₹6,500 return",
    packageSample: "Custom itineraries from ₹28,500",
    pkgRef: "pkg-kashmir-paradise"
  },
  {
    name: "Himachal Pradesh",
    tagline: "Manali Chalets, Solang Snow Valley & Shimla Colonial Ridge",
    region: "domestic",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=700&q=80",
    flightSample: "Flights to IXC from ₹4,200 return",
    packageSample: "Circuit packages from ₹22,999",
    pkgRef: "pkg-himachal-panoramas"
  },
  {
    name: "Royal Rajasthan",
    tagline: "Mehrangarh Forts, Lake Pichola Palaces & Desert Havelis",
    region: "domestic",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=700&q=80",
    flightSample: "Flights from ₹5,800 return",
    packageSample: "Heritage havelis from ₹34,500",
    pkgRef: "pkg-rajasthan-royals"
  },
  {
    name: "Kerala Backwaters",
    tagline: "Private Houseboat Cruises, Tea Hills & Ayurvedic Retreats",
    region: "domestic",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=700&q=80",
    flightSample: "Flights from ₹6,200 return",
    packageSample: "Houseboat stays from ₹26,500",
    pkgRef: "pkg-kerala-backwaters"
  },
  {
    name: "Goa Coastal Escapes",
    tagline: "Serene South Goa Beaches & Pastel Fontainhas Heritage Villas",
    region: "domestic",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=700&q=80",
    flightSample: "Flights from ₹4,500 return",
    packageSample: "Resort retreats from ₹18,999",
    pkgRef: "pkg-goa-coastal-villas"
  },
  {
    name: "Andaman Islands",
    tagline: "Azure Bays, Radhanagar Sunset & Coral Snorkeling Safaris",
    region: "domestic",
    image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=700&q=80",
    flightSample: "Flights from ₹9,800 return",
    packageSample: "Island packages from ₹36,500",
    pkgRef: "pkg-andaman-islands"
  },
  {
    name: "Dubai & Abu Dhabi",
    tagline: "Burj Khalifa Glitz, Desert Conservation Dunes & Marina Dining",
    region: "international",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=700&q=80",
    flightSample: "Direct flights from ₹18,500 return",
    packageSample: "Luxury 5-day packages from ₹46,000",
    pkgRef: "pkg-dubai-luxe"
  },
  {
    name: "Thailand (Phuket & Bangkok)",
    tagline: "Phi Phi Island Speedboats, Grand Palace & Street Gastronomy",
    region: "international",
    image: "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=700&q=80",
    flightSample: "Direct flights from ₹16,800 return",
    packageSample: "Island combos from ₹38,500",
    pkgRef: "pkg-thailand-getaway"
  },
  {
    name: "Bali & Nusa Penida",
    tagline: "Ubud Rainforest Pool Villas & Dramatic Uluwatu Cliff Temples",
    region: "international",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=700&q=80",
    flightSample: "1-stop flights from ₹24,500 return",
    packageSample: "Villa retreats from ₹44,000",
    pkgRef: "pkg-bali-escape"
  },
  {
    name: "Singapore",
    tagline: "Universal Studios Thrills, Supertrees & Family Leisure",
    region: "international",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=700&q=80",
    flightSample: "Direct flights from ₹21,000 return",
    packageSample: "Family itineraries from ₹54,000",
    pkgRef: "pkg-singapore-delight"
  },
  {
    name: "Vietnam",
    tagline: "Ha Long Bay 5-Star Junk Cruises & Lantern-Lit Hoi An Alleys",
    region: "international",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=700&q=80",
    flightSample: "Direct flights from ₹17,500 return",
    packageSample: "Cruise & heritage tours from ₹46,500",
    pkgRef: "pkg-vietnam-discovery"
  },
  {
    name: "Uttarakhand",
    tagline: "Ganges Sunset Aarti in Rishikesh & Jim Corbett Tiger Safaris",
    region: "domestic",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=700&q=80",
    flightSample: "Flights to DED from ₹4,800 return",
    packageSample: "Wilderness retreats from ₹24,500",
    pkgRef: "pkg-uttarakhand-retreats"
  }
];

const SAMPLE_FLIGHT_ROUTES = [
  {
    from: "Delhi (DEL) / Mumbai (BOM)",
    to: "Dubai (DXB)",
    cabinOptions: ["Economy", "Business Class"],
    sampleFareGuide: "Quotes typically from ₹18,500 (Econ) / ₹58,000 (Biz)",
    notes: "Non-stop 3.5h flights via Emirates, Air India, or IndiGo. Flexible return dates and group fare options.",
    perks: "Generous 30kg check-in baggage allowances & complimentary date rebooking assistance"
  },
  {
    from: "Mumbai (BOM) / Bengaluru (BLR)",
    to: "Bangkok (BKK) / Phuket (HKT)",
    cabinOptions: ["Economy", "Premium Economy", "Business Class"],
    sampleFareGuide: "Quotes typically from ₹16,800 (Econ) / ₹49,000 (Biz)",
    notes: "Direct flights via Thai Airways, Air India, or connecting options. Seamless island connection ticketing.",
    perks: "Consolidator ticket pricing & tailored family seat allotments"
  },
  {
    from: "Delhi (DEL) / Chennai (MAA)",
    to: "Singapore (SIN)",
    cabinOptions: ["Economy", "Premium Economy", "Business Class"],
    sampleFareGuide: "Quotes typically from ₹21,000 (Econ) / ₹62,000 (Biz)",
    notes: "Direct flights via Singapore Airlines or Air India. Easy stopover extensions to Bali or Australia.",
    perks: "Changi airport stopover vouchers and coordinated luggage transfers"
  },
  {
    from: "Delhi (DEL) / Mumbai (BOM)",
    to: "Bali Denpasar (DPS)",
    cabinOptions: ["Economy", "Business Class"],
    sampleFareGuide: "Quotes typically from ₹24,500 (Econ) / ₹72,000 (Biz)",
    notes: "1-stop seamless routing via Kuala Lumpur or Singapore without overnight airport stays.",
    perks: "Optimized connection times avoiding grueling 8-hour layovers"
  },
  {
    from: "Delhi (DEL) / Mumbai (BOM)",
    to: "London Heathrow (LHR)",
    cabinOptions: ["Economy", "Premium Economy", "Business Class"],
    sampleFareGuide: "Quotes typically from ₹48,000 (Econ) / ₹1,65,000 (Biz)",
    notes: "Direct non-stop 9h services via British Airways, Virgin Atlantic, or Air India.",
    perks: "Consolidator corporate tariffs and student excess luggage assistance"
  },
  {
    from: "Delhi (DEL) / Mumbai (BOM)",
    to: "Srinagar (SXR) / Leh Ladakh (IXL)",
    cabinOptions: ["Economy"],
    sampleFareGuide: "Quotes typically from ₹6,500 (Srinagar) / ₹8,200 (Leh)",
    notes: "Morning non-stop scenic flights over Himalayan snow peaks. Early-bird ticket holds.",
    perks: "Weather delay priority re-accommodation and private chauffeur airport pickups"
  }
];

const FAQS_DATA = [
  {
    category: "model",
    q: "How does TravelGrow Consultancy work? Can I book instantly online?",
    a: "TravelGrow Consultancy is an agent-assisted travel consultancy, not an automated checkout site. Rather than charging your card on rigid booking engines with surprise fees, you share your travel brief with us. Our experienced consultants manually compare consolidator airfares, negotiate boutique hotel rooms, and send you a transparent, itemized quotation within 2 to 4 business hours. You only authorize booking after reviewing and approving your final proposal."
  },
  {
    category: "model",
    q: "Is requesting a quotation completely free and without obligation?",
    a: "Yes, 100%. Requesting quotes, consulting with our specialists, and adjusting itineraries is completely free with zero obligation. You are never pressured to purchase and you never provide payment details until you approve a quote."
  },
  {
    category: "flights",
    q: "What are airline consolidator fares and how do they benefit Indian flyers?",
    a: "Consolidator airfares are wholesale ticket contracts negotiated between airlines and accredited travel trade networks. Unlike public booking apps that show rigid published fares, our consultants can access private net rates, split-ticket pairings, flexible date brackets, and enhanced baggage allowances that automated search engines miss."
  },
  {
    category: "flights",
    q: "Can you arrange complex family travel, multi-city routes, and layovers?",
    a: "Yes! Multi-city routing and multi-generational family journeys are our forte. For example, flying from Mumbai to Dubai for 3 days, continuing to London, and returning directly to Delhi—all on coordinated tickets with aligned baggage rules so your family is fully protected against delays."
  },
  {
    category: "holidays",
    q: "Can I customize the sample holiday packages on your website?",
    a: "Every package shown on our website is a customizable sample framework. You can extend the duration, upgrade from 4-star hotels to private pool villas, add temple darshans or private safari jeeps, and specify pure-vegetarian or Jain meal preferences. Your personal advisor customizes every detail."
  },
  {
    category: "payments",
    q: "How do payments and booking confirmations work?",
    a: "Once you review and approve your quotation, we share an official booking summary with a secure payment link (accepting UPI, Net Banking, and major Credit/Debit Cards). Upon settlement, your agent immediately issues confirmed airline PNRs, hotel vouchers, and driver contact sheets."
  },
  {
    category: "support",
    q: "What support do you provide if a flight is delayed or rescheduled?",
    a: "Instead of waiting in frustrating 3-hour automated call-center queues, you have direct phone and WhatsApp access to your personal consultant. If an airline reschedules or cancels your flight, your agent steps in immediately to arrange complimentary rerouting or process refunds on your behalf."
  }
];

const CONSULTANCY_INFO = {
  name: "TravelGrow Consultancy",
  domain: "travelgrowconsultancy.com",
  phone: "+91 98765 43210 (Client Demo Placeholder)",
  email: "enquiries@travelgrowconsultancy.com",
  whatsapp: null, // Configurable via config.json or WHATSAPP_PHONE env variable
  address: "[OFFICIAL BUSINESS ADDRESS - Delhi / Bengaluru / Mumbai / Pune, India]",
  hours: "Monday - Saturday: 09:30 - 19:30 IST",
  serviceCommitment: "Personal human travel consultants. No automated bots. Itemized, obligation-free quotations in Indian Rupees (₹) delivered within 2-4 business hours."
};
