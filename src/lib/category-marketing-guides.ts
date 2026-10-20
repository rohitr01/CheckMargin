export interface CategoryMarketingPlaybook {
  id: string;
  categoryName: string;
  icon: string;
  badge?: string;
  summary: string;
  adStrategy: {
    recommendedAdSpendPercent: number; // e.g. 20 for 20%
    targetRoas: string;
    maxHealthyCacPercent: number; // % of selling price
    budgetAllocationAdvice: string;
    bestAdFormats: string[];
    testedHooks: string[];
    adMistakesToAvoid: string[];
  };
  channelFit: {
    primaryChannel: string;
    secondaryChannels: string[];
    channelNotes: string;
    minViableAov: number; // INR
    bundlingPlaybook: string[];
  };
  rtoAndLogistics: {
    benchmarkRtoRate: string;
    codReductionTactics: string[];
    packagingRules: string[];
  };
  seasonalCalendar: {
    peakMonths: string[];
    leadTimeWeeks: number;
    actionItem: string;
  };
  marginGuardrails: {
    minMarkupMultiple: string;
    maxWholesaleDiscount: string;
    freeShippingThreshold: number;
  };
}

export const CATEGORY_MARKETING_PLAYBOOKS: Record<string, CategoryMarketingPlaybook> = {
  'candles-fragrance': {
    id: 'candles-fragrance',
    categoryName: 'Handmade Physical Products (Candles & Soaps)',
    icon: '🏭',
    badge: 'High Gifting AOV',
    summary:
      'Aesthetic and scent-driven category with high impulse buying on Instagram. Ad success relies on video ASMR, strong scent visualization, and bundling to push AOV above ₹800.',
    adStrategy: {
      recommendedAdSpendPercent: 20,
      targetRoas: '3.0x – 4.2x',
      maxHealthyCacPercent: 22,
      budgetAllocationAdvice:
        'Allocate 70% of Meta ad budget to Instagram Reels (Advantage+ Shopping Campaigns) featuring real lighting tests and pouring, and 30% to retargeting cart abandoners with a ₹100 welcome gift code.',
      bestAdFormats: [
        'ASMR candle pour & wick trimming (sound-on)',
        'Burn time-lapse & clean melt pool proof',
        'Unboxing aesthetics & luxury rigid gift box packaging',
        'Blind scent test / reaction videos from customers',
      ],
      testedHooks: [
        '"Stop buying ₹2,000 candles that give you headaches from cheap paraffin..."',
        '"The secret to making your entire living room smell like a 5-star hotel lobby for ₹599."',
        '"Watch this 4-hour clean burn test — zero black soot, 100% natural soy wax."',
        '"Why cold-process artisan soap actually hydrates your skin instead of stripping it..."',
      ],
      adMistakesToAvoid: [
        'Advertising a single candle at ₹399 alone — your CAC will be ₹180-₹220, completely wiping out profit. Always push 2-packs or discovery gift boxes.',
        'Using static white-background catalogue images on Meta — lifestyle reels convert 3.4x higher for fragrance.',
        'Not showcasing scent throw — since customers cannot smell through a phone screen, describe the exact mood (e.g., "Warm Sunday rain & Madagascar vanilla").',
      ],
    },
    channelFit: {
      primaryChannel: 'Shopify D2C via Instagram Ads & Reels',
      secondaryChannels: [
        'Amazon India (for high search intent during festive seasons)',
        'Curated Flea Markets (Lil Flea, Sunday Soul Sante for brand discovery)',
        'B2B Corporate Diwali & Wedding Favors (50-200 unit bulk orders)',
      ],
      channelNotes:
        'Instagram D2C yields maximum brand equity and customer repeat rates. Amazon is great for volume, but platform fees (12-15%) plus shipping reduce net margins.',
      minViableAov: 850,
      bundlingPlaybook: [
        'The Signature Duo: 2 Best-selling Jars + Free Brass Wick Trimmer (₹1,199)',
        'Discovery Discovery Box: 4 Mini Travel Tins (4x60g) for ₹649',
        'Seasonal Festive Hamper: Candle + Reed Diffuser + Handcrafted Matchstick Bottle (₹1,499)',
      ],
    },
    rtoAndLogistics: {
      benchmarkRtoRate: '5% - 8% on Prepaid; 24% - 35% on unverified COD',
      codReductionTactics: [
        'Offer ₹60 instant discount or a free wax tablet if the customer pays via UPI.',
        'Use automated WhatsApp verification for all Cash-on-Delivery orders before dispatching.',
        'Disable COD for orders above ₹2,000 to prevent malicious return transit losses.',
      ],
      packagingRules: [
        'Use double-wall corrugated 3-ply boxes minimum with custom foam or molded pulp inserts.',
        'In peak summer (April–June), wrap wax products in silver thermal bubble insulation to avoid melting in transit.',
        'Place "Fragile — Glass Candle" stickers on top and bottom of shipping shippers.',
      ],
    },
    seasonalCalendar: {
      peakMonths: ['October (Diwali)', 'November (Wedding Season)', 'February (Valentine’s Day)', 'December (Christmas)'],
      leadTimeWeeks: 5,
      actionItem:
        'Order wax, custom glass jars, and fragrance oils 45 days in advance before August to avoid festive supply shortages and price spikes.',
    },
    marginGuardrails: {
      minMarkupMultiple: '3.2x on direct material + packaging cost',
      maxWholesaleDiscount: '45% off retail for minimum order quantity of 30 units',
      freeShippingThreshold: 999,
    },
  },

  'handmade-crafts': {
    id: 'handmade-crafts',
    categoryName: 'Crafts & Home Decor (Resin, Woodcraft, Pottery, Macrame)',
    icon: '🎨',
    badge: 'High Emotional Value',
    summary:
      'High-margin, unique artisan items where craftsmanship and process storytelling drive conversions. Customers happily pay premium prices when they see the maker in action.',
    adStrategy: {
      recommendedAdSpendPercent: 18,
      targetRoas: '3.2x – 4.5x',
      maxHealthyCacPercent: 20,
      budgetAllocationAdvice:
        'Focus ad budget on TikTok/Instagram Reels showing the satisfying "before & after" demolding or laser engraving process. Run carousel ads highlighting custom name/design personalization.',
      bestAdFormats: [
        'Satisfying resin demolding & glossy topcoat peel (ASMR)',
        'Laser engraving nameplate personalization in real time',
        'Styling guide: How to place coasters and pottery on coffee tables',
        'Maker workshop tour & packing orders video',
      ],
      testedHooks: [
        '"Watch this ocean resin piece demold after curing for 48 hours..."',
        '"Why every couple getting a new home is buying this custom teakwood nameplate..."',
        '"Mass-produced plastic decor vs hand-thrown ceramic stoneware — the difference is obvious."',
        '"How we make these waterproof terrazzo coasters from scratch in our studio."',
      ],
      adMistakesToAvoid: [
        'Failing to show product scale — customers frequently leave negative reviews if a planter or tray is smaller than expected. Always show items with mugs, keys, or phones.',
        'Underpricing artisan labour — treating hours of mold polishing or sanding as free labour destroys net profitability.',
      ],
    },
    channelFit: {
      primaryChannel: 'Instagram D2C + Shopify + WhatsApp Commerce',
      secondaryChannels: ['Etsy (for high-margin international export)', 'Home Decor Concept Stores (Consignment)', 'Architect & Interior Designer Partnerships'],
      channelNotes:
        'Custom engraved and personalized pieces perform exceptionally well via direct WhatsApp chats and Shopify custom input fields.',
      minViableAov: 999,
      bundlingPlaybook: [
        'Hostess Set: Set of 4 Resin Coasters + Matching Wine Stopper (₹1,299)',
        'Home Entrance Bundle: Custom Teakwood Nameplate + Matching Key Holder (₹1,899)',
        'Botanical Duo: Hand-thrown Ceramic Mug + Matching Saucer Plate (₹849)',
      ],
    },
    rtoAndLogistics: {
      benchmarkRtoRate: '4% - 7% (Personalized goods have <2% RTO because users are invested)',
      codReductionTactics: [
        'Strictly require 100% upfront prepaid payment for any custom-engraved or personalized name items.',
        'Send a quick WhatsApp photo of the finished customized piece before dispatch to delight the customer.',
      ],
      packagingRules: [
        'Wrap resin and ceramic pieces in minimum 3 layers of 10mm bubble wrap.',
        'Ensure corners of wooden boards and nameplates have plastic corner protectors.',
      ],
    },
    seasonalCalendar: {
      peakMonths: ['October–November (Diwali Gifting & New Home Move-ins)', 'January–March (Spring Renovations & Weddings)'],
      leadTimeWeeks: 4,
      actionItem: 'Stock up on epoxy resin kits and teakwood blanks well before festive home-decor purchasing peaks.',
    },
    marginGuardrails: {
      minMarkupMultiple: '3.5x on direct raw materials (to cover high manual labour)',
      maxWholesaleDiscount: '40% off retail for 25+ sets',
      freeShippingThreshold: 1199,
    },
  },

  'home-decor-lifestyle': {
    id: 'home-decor-lifestyle',
    categoryName: 'Home & Living Products (Jesmonite, Ceramics, Soft Furnishings)',
    icon: '🏠',
    badge: 'Aesthetic Trendsetter',
    summary:
      'Trend-driven lifestyle pieces where visual curation and home aesthetics convert modern urban homeowners. Clean Scandinavian and Japandi aesthetics dominate ad conversions.',
    adStrategy: {
      recommendedAdSpendPercent: 20,
      targetRoas: '3.0x – 4.0x',
      maxHealthyCacPercent: 22,
      budgetAllocationAdvice:
        'Run Meta Catalog & Collection ads showcasing curated room setups (e.g. entryways, vanity tables, bedside tables). Partner with micro-influencers for aesthetic home tours.',
      bestAdFormats: [
        'Desk & Vanity Table Makeover transformations (Before / After)',
        'Waterproof & heat resistance test demos for stone composites',
        'Aesthetic morning routine featuring your tableware or planter',
        'Customer styling user-generated content (UGC)',
      ],
      testedHooks: [
        '"The ₹649 aesthetic tray that made my cluttered bathroom vanity look like Pinterest..."',
        '"Why interior designers are ditching plastic trays for mineral composite Jesmonite."',
        '"How to style your entryway table with 3 minimalist handcrafted pieces."',
      ],
      adMistakesToAvoid: [
        'Showing the product floating on a plain white screen without furniture context.',
        'Not emphasizing stain-resistance and sealing — customers worry about turmeric/oil/water marks on mineral trays.',
      ],
    },
    channelFit: {
      primaryChannel: 'Shopify Website + Instagram Shopping',
      secondaryChannels: ['Etsy India & Global', 'Boutique Lifestyle Concept Stores', 'Corporate Welcome Kits'],
      channelNotes: 'D2C allows you to control your brand imagery, while wholesale placement in home decor stores drives steady recurring volume.',
      minViableAov: 899,
      bundlingPlaybook: [
        'Vanity Organizer Set: Oval Tray + Match Striker + Ring Dish (₹1,099)',
        'Green Corner Bundle: 2 Fluted Succulent Planters + Drainage Trays (₹999)',
        'Nordic Dining Pack: 2 Handloom Cotton Placemats + 2 Acacia Coasters (₹799)',
      ],
    },
    rtoAndLogistics: {
      benchmarkRtoRate: '6% - 9% on prepaid; 20% - 28% on COD',
      codReductionTactics: [
        'Send a WhatsApp tracking link with styling tips immediately upon dispatch.',
        'Collect a small ₹100 deposit on COD orders to verify buyer intent.',
      ],
      packagingRules: [
        'Mineral composite and plaster items are brittle in drop tests: wrap individually in honey-comb paper + bubble wrap.',
        'Fit snug into custom die-cut box compartments so items cannot slide inside the shipper.',
      ],
    },
    seasonalCalendar: {
      peakMonths: ['September–November (Diwali Home Renovations)', 'April–May (Summer Refresh)'],
      leadTimeWeeks: 3,
      actionItem: 'Prepare holiday color palettes (terracotta, sage green, speckled stone) 6 weeks before Diwali.',
    },
    marginGuardrails: {
      minMarkupMultiple: '3.0x on direct costs',
      maxWholesaleDiscount: '42% off retail',
      freeShippingThreshold: 999,
    },
  },

  'food-bakery': {
    id: 'food-bakery',
    categoryName: 'Food & Packaged Goods (Bakery, Snacks, Gourmet Jams, Granola)',
    icon: '🍱',
    badge: 'High Repeat Frequency',
    summary:
      'High repeat purchase rate and fast replenishment cycle. The key to ad profitability is turning single snack purchases into monthly subscriptions or multi-pack discovery hampers.',
    adStrategy: {
      recommendedAdSpendPercent: 22,
      targetRoas: '2.8x – 3.8x (First purchase), 5x+ on Lifetime Value',
      maxHealthyCacPercent: 24,
      budgetAllocationAdvice:
        'Focus on local/city targeting for fresh bakery and national shipping for dry snacks. Use mouth-watering macro food videography. Retarget existing buyers every 25 days with new flavor drops.',
      bestAdFormats: [
        'Slow-motion brownie crackle, gooey chocolate pull & drizzle',
        'Roasted crunch sound bite (ASMR audio of makhana or granola bite)',
        'Clean ingredient comparison: Your clean label vs standard chemical-filled supermarket snacks',
        'Customer unboxing & taste-test reactions',
      ],
      testedHooks: [
        '"Once you taste real Belgian couverture chocolate in a brownie, regular bakery cakes taste like cardboard..."',
        '"Quit snacking on fried potato chips — this peri peri roasted makhana has 12g protein and zero trans fats."',
        '"The secret sourdough loaf that people wait 3 days on our bakery waitlist for..."',
      ],
      adMistakesToAvoid: [
        'Relying on low-AOV single packets (e.g., trying to advertise a single ₹120 pouch) — your customer acquisition cost will exceed the order value! Always bundle into boxes of 4, 6, or monthly snack boxes.',
        'Forgetting FSSAI compliance display — food shoppers look for trust indicators.',
      ],
    },
    channelFit: {
      primaryChannel: 'D2C Website (City / Regional) + Quick Commerce (Blinkit/Zepto for snacks)',
      secondaryChannels: ['Amazon Gourmet Food', 'Organic Farmers Markets', 'Corporate Snack Pantries & Event Catering'],
      channelNotes: 'Dry packaged goods scale nationwide on Amazon & D2C. Fresh artisan bakery thrives on local courier (Porter/Borzo) within a 20km radius.',
      minViableAov: 650,
      bundlingPlaybook: [
        'The Weekly Snack Stash: 4 Flavors of Roasted Makhana + Nut Trail Mix (₹699)',
        'Assorted Gourmet Brownie Box (Box of 6, 3 Flavors) for ₹749',
        'Breakfast Granola Trio: Dark Chocolate, Almond Cranberry, Spiced Honey (₹899)',
      ],
    },
    rtoAndLogistics: {
      benchmarkRtoRate: '3% - 5% on prepaid; Avoid unverified COD completely on perishable food!',
      codReductionTactics: [
        'Do NOT offer COD on fresh baked items with <5 days shelf life. Unclaimed food returns cannot be re-sold.',
        'For shelf-stable snacks, require mandatory WhatsApp phone verification for COD.',
      ],
      packagingRules: [
        'Use nitrogen-flushed or zip-lock vacuum food-grade aluminum barrier pouches.',
        'Include moisture-absorbing silica food packets (safe and certified) in dry nut/seed packs.',
        'For fresh brownies/cakes, pack with corrugated inserts and tamper-proof security food seals.',
      ],
    },
    seasonalCalendar: {
      peakMonths: ['August (Raksha Bandhan Gifting)', 'October (Diwali Sweet Hampers)', 'December–January (Winter snacking & New Year)'],
      leadTimeWeeks: 2,
      actionItem: 'Launch corporate festive snack hamper pre-orders by early September to capture early B2B corporate budgets.',
    },
    marginGuardrails: {
      minMarkupMultiple: '2.8x on ingredient + packaging cost',
      maxWholesaleDiscount: '35% off retail for grocery stores & retail shelves',
      freeShippingThreshold: 699,
    },
  },

  'beauty-personal-care': {
    id: 'beauty-personal-care',
    categoryName: 'Beauty & Wellness (Skincare, Hair Oils, Soaps, Lip Balms)',
    icon: '🧴',
    badge: 'High LTV & Re-order Rate',
    summary:
      'One of the fastest-growing D2C segments in India. High gross margins (70%+) allow higher ad spend allowances, but requires exceptional ingredient transparency and customer trust proof.',
    adStrategy: {
      recommendedAdSpendPercent: 25,
      targetRoas: '2.5x – 3.5x front-end (Profits made on repeat orders & subscriptions)',
      maxHealthyCacPercent: 28,
      budgetAllocationAdvice:
        'Video UGC (User Generated Content) performs best. Show real skin texture, application routine, and 3-week before/after results without heavy filters to build genuine credibility.',
      bestAdFormats: [
        'Application routine: 3-step morning skincare with dropper texture close-ups',
        'Ingredient breakdown: Why 10% Ethyl Ascorbic Acid does not oxidize like regular Vit C',
        'Customer testimonials speaking directly to camera without script reading',
        'Dermatologist or cosmetic formulation chemist formulation walkthrough',
      ],
      testedHooks: [
        '"If your Vitamin C serum turned brown in 2 weeks, you bought the wrong formulation..."',
        '"The ancient cold-pressed rosemary scalp oil recipe that saved my thinning hairline."',
        '"Stop putting water-heavy drugstore lotions on dry skin — here is what pure unrefined shea butter does."',
      ],
      adMistakesToAvoid: [
        'Making unrealistic medical claims (e.g., "cures acne in 2 days") — Meta will ban your ad account for policy violations.',
        'Ignoring repeat marketing: An SMS/WhatsApp reminder sent 28 days after purchase to reorder can generate 20%+ of your monthly revenue with ₹0 ad spend.',
      ],
    },
    channelFit: {
      primaryChannel: 'Shopify D2C Store via Meta (Instagram) & Google Performance Max',
      secondaryChannels: ['Nykaa & Purplle Marketplace', 'Amazon India Beauty', 'Dermatologist Clinics & Salon Retail'],
      channelNotes: 'D2C allows building strong first-party customer lists for email & WhatsApp retention workflows.',
      minViableAov: 799,
      bundlingPlaybook: [
        'The Radiance AM/PM Ritual: Vitamin C Serum + Hyaluronic Hydrator (₹1,199)',
        'Lush Hair Growth Duo: Cold-Pressed Rosemary Oil + Scalp Massager Brush (₹849)',
        'Artisan Cold-Process Soap Bar Trio + Natural Sisal Soap Saver Bag (₹549)',
      ],
    },
    rtoAndLogistics: {
      benchmarkRtoRate: '6% - 9% on prepaid; 22% - 30% on COD',
      codReductionTactics: [
        'Offer a free deluxe sample mini (e.g. 5ml serum) exclusively for prepaid orders.',
        'Use pre-shipment address hygiene tools to eliminate incomplete or dummy addresses.',
      ],
      packagingRules: [
        'Use tamper-evident shrink bands around dropper caps to prevent leaks and customer rejection.',
        'Amber or UV-resistant glass dropper bottles prevent light degradation of active serums.',
      ],
    },
    seasonalCalendar: {
      peakMonths: ['October–November (Festive Glow)', 'February (Valentine Glow)', 'June–July (Monsoon Haircare)'],
      leadTimeWeeks: 4,
      actionItem: 'Run clinical efficacy or patch test verifications well before scaling ad spend beyond ₹1,000/day.',
    },
    marginGuardrails: {
      minMarkupMultiple: '4.0x on raw formulation + bottle cost',
      maxWholesaleDiscount: '45% off retail for retail stockists',
      freeShippingThreshold: 799,
    },
  },

  'clothing-accessories': {
    id: 'clothing-accessories',
    categoryName: 'Apparel & Fashion (Hand-Block Textiles, Scrunchies, Scarves, Linen)',
    icon: '🧵',
    badge: 'Visual Lifestyle Appeal',
    summary:
      'Style, craftsmanship, and fit drive conversions. Hand-block printing and sustainable cotton appeal strongly to urban conscious shoppers willing to pay a premium over fast fashion.',
    adStrategy: {
      recommendedAdSpendPercent: 22,
      targetRoas: '3.0x – 4.2x',
      maxHealthyCacPercent: 24,
      budgetAllocationAdvice:
        'Outfit-of-the-day (OOTD) styling reels and garment drape videos generate the highest click-through rates. Retarget visitors with dynamic catalogue ads showing the exact prints they viewed.',
      bestAdFormats: [
        '3 ways to style this block-printed tote bag for work, grocery, and weekend',
        'Fabric close-up and natural indigo vegetable dye printing demo',
        'Real women of different heights modeling the garment with honest size guides',
        'Scrunchie stretch test & mulberry silk anti-breakage comparison',
      ],
      testedHooks: [
        '"Fast fashion canvas totes tear in 2 months — our 350 GSM organic cotton tote lasts years..."',
        '"Why swapping regular elastic hair bands for 100% mulberry silk scrunchies stopped my hair breakage."',
        '"Every single block on this linen scarf was hand-stamped in Bagru, Rajasthan."',
      ],
      adMistakesToAvoid: [
        'Inaccurate or confusing sizing charts — the #1 cause of customer returns in fashion.',
        'Not showing the interior pockets, zippers, and lining of bags.',
      ],
    },
    channelFit: {
      primaryChannel: 'Shopify D2C via Instagram Ads',
      secondaryChannels: ['Etsy Global (High demand for hand-block & natural indigo print)', 'Curated Pop-up Exhibitions', 'Myntra / Ajio (Once monthly volume exceeds 500 units)'],
      channelNotes: 'D2C allows preserving sustainable artisan margins without discounting.',
      minViableAov: 899,
      bundlingPlaybook: [
        'Workday Essentials: Block-printed Tote Bag + Matching Laptop Sleeve (₹1,299)',
        'Mulberry Silk Hair Care Bundle: Set of 3 Scrunchies + Silk Eye Mask (₹799)',
        'Artisan Gift Set: Handwoven Indigo Stole + Matching Cotton Pouch (₹999)',
      ],
    },
    rtoAndLogistics: {
      benchmarkRtoRate: '8% - 14% on prepaid; 28% - 42% on COD (Apparel has naturally higher RTO due to sizing doubts)',
      codReductionTactics: [
        'Provide a clear size guide with exact tape measurements (bust, length, sleeve).',
        'Offer seamless size exchanges on WhatsApp rather than refunds to protect the revenue.',
      ],
      packagingRules: [
        'Ship in reusable cotton drawstring bags instead of single-use plastic polybags to reinforce eco-friendly positioning.',
        'Include a care guide card explaining how to wash natural vegetable-dyed fabrics.',
      ],
    },
    seasonalCalendar: {
      peakMonths: ['August (Rakhi Gifting)', 'October (Festive Kurtas & Bags)', 'March–April (Spring/Summer Linen Drops)'],
      leadTimeWeeks: 4,
      actionItem: 'Book tailor and artisan printing capacity 30 days ahead of major festival collections.',
    },
    marginGuardrails: {
      minMarkupMultiple: '3.0x on fabric yardage + tailor labour',
      maxWholesaleDiscount: '40% off retail for boutique orders',
      freeShippingThreshold: 999,
    },
  },

  'jewellery': {
    id: 'jewellery',
    categoryName: 'Jewellery & Accessories (Polymer Clay, Pearl Chokers, Wire-Wrapped Rings)',
    icon: '💍',
    badge: 'Lightweight & Low Shipping Cost',
    summary:
      'Ultra-lightweight products resulting in minimal shipping freight (₹40-₹50 national). High impulse visual appeal where video close-ups showing light reflection and ear styling drive immediate buys.',
    adStrategy: {
      recommendedAdSpendPercent: 24,
      targetRoas: '3.2x – 4.8x',
      maxHealthyCacPercent: 25,
      budgetAllocationAdvice:
        'Reels showing the jewelry styled on ears/neck with natural sunlight convert exceptionally well. Offer an irresistible "Buy 2 Get 1 Free" or bundle pricing to elevate AOV from ₹400 to ₹900+.',
      bestAdFormats: [
        'Close-up earrings try-on with clean hair updos in natural golden-hour lighting',
        'Waterproof & anti-tarnish test: submerging in water/perfume without fading',
        'Behind-the-scenes sculpting of polymer clay florals or wire wrapping',
        'Luxury unboxing: Slide box, velvet pouch, polishing cloth, thank-you note',
      ],
      testedHooks: [
        '"Heavy metal earrings hurt your earlobes by 4 PM — watch how weightless polymer clay feels..."',
        '"Stop spending ₹3,000 on high-street jewelry that turns your skin green in 2 weeks."',
        '"Every single tiny petal on these earrings was sculpted petal-by-petal by hand."',
      ],
      adMistakesToAvoid: [
        'Advertising a single ₹299 pair of studs alone — ad spend and logistics make single-piece sales unprofitable. Use bundle offers: "Pick any 3 for ₹999".',
        'Not highlighting hypoallergenic metals (e.g. 18K gold plated, nickel-free, surgical steel stud posts) — sensitive skin is the #1 objection.',
      ],
    },
    channelFit: {
      primaryChannel: 'Instagram D2C + Shopify Website',
      secondaryChannels: ['Etsy Global (Massive market for handmade polymer clay & crystal rings)', 'Boutique Exhibitions & College Fleas', 'Bridal Party & Bridesmaid Gift Boxes'],
      channelNotes: 'Very low parcel weight allows affordable air courier delivery with fast transit times.',
      minViableAov: 750,
      bundlingPlaybook: [
        'Earring Wardrobe: Pick Any 3 Statement Dangles for ₹999 (Saves ₹350)',
        'Goddess Set: Raw Quartz Wire Ring + Matching Minimalist Pendant (₹799)',
        'Bridesmaid Gifting Box: 4 Matching Floral Stud Boxes with personalized name tags (₹1,599)',
      ],
    },
    rtoAndLogistics: {
      benchmarkRtoRate: '5% - 8% on prepaid; 20% - 28% on COD',
      codReductionTactics: [
        'Add a ₹75 COD convenience fee at checkout — this immediately converts 65%+ buyers to instant UPI prepaid.',
        'Highlight "Fast 3-Day Air Shipping" for all prepaid orders.',
      ],
      packagingRules: [
        'Never ship jewelry in soft padded envelopes alone: earring posts will bend! Always use hard rigid slide boxes or sturdy tin containers.',
        'Include an anti-tarnish micro-film strip inside the box.',
      ],
    },
    seasonalCalendar: {
      peakMonths: ['October–November (Diwali Parties)', 'February (Valentine Gifting)', 'May–July & November–December (Wedding Season)'],
      leadTimeWeeks: 2,
      actionItem: 'Design festive bridal and holiday jewelry collections by late August.',
    },
    marginGuardrails: {
      minMarkupMultiple: '4.5x on micro-components & clay cost',
      maxWholesaleDiscount: '50% off retail for 50+ pieces',
      freeShippingThreshold: 799,
    },
  },

  'digital-products': {
    id: 'digital-products',
    categoryName: 'Digital & Online Products (Notion OS, 3D STL, Presets, Canva Kits)',
    icon: '💻',
    badge: 'Zero Shipping & Infinite Margin',
    summary:
      'Zero manufacturing scrap, zero warehouse rent, and zero physical shipping costs. 100% of the customer price flows to gross margin after payment gateway fees. Scalable globally.',
    adStrategy: {
      recommendedAdSpendPercent: 30,
      targetRoas: '2.5x – 4.0x',
      maxHealthyCacPercent: 35,
      budgetAllocationAdvice:
        'Screen recordings showcasing workflows and time-saving shortcuts perform best. Google Search ads on high-intent keywords ("Notion small business template", "Lightroom wedding presets") yield high conversion.',
      bestAdFormats: [
        'Screen-recording workflow: "How I manage my entire 6-figure business in 1 Notion dashboard"',
        'Before / After photo color grading with 1-click Lightroom preset tap',
        'Canva template carousel swipe: 30 days of viral content created in 15 minutes',
        'Timelapse 3D print of the STL miniature model on a resin printer',
      ],
      testedHooks: [
        '"If you are still running your small business on 12 messy Excel sheets, you need to see this..."',
        '"How to edit your Instagram photos like a professional photographer in literally 1 click."',
        '"Stop designing social media posts from scratch — here is 150 viral Canva templates for makers."',
      ],
      adMistakesToAvoid: [
        'Selling generic templates without a clear transformation or problem solved.',
        'Not providing an instant video onboarding walkthrough on how to duplicate and customize the digital asset.',
      ],
    },
    channelFit: {
      primaryChannel: 'Gumroad / LemonSqueezy / Cosmofeed / Instamojo / Own Shopify Store',
      secondaryChannels: ['Etsy Digital Downloads', 'Product Hunt Launches', 'Twitter/X & LinkedIn Creator Audiences'],
      channelNotes: 'Instant digital delivery via email means zero delivery friction and zero RTO returns.',
      minViableAov: 499,
      bundlingPlaybook: [
        'Complete Creator Bundle: Notion OS + 150 Canva Templates + Content Calendar (₹1,299)',
        'Photographer Master Kit: Desktop & Mobile Presets + Video LUTs + Client Contract (₹1,499)',
        '3D Maker Pass: Complete 10-Model STL Miniature Bundle for ₹999',
      ],
    },
    rtoAndLogistics: {
      benchmarkRtoRate: '0% (Non-physical goods have zero RTO transit return loss)',
      codReductionTactics: [
        'COD does not apply to digital downloads — 100% prepaid transactions via UPI, Cards, and Netbanking.',
        'Offer a 7-day satisfaction guarantee or video support to minimize chargebacks.',
      ],
      packagingRules: [
        'Automate instant delivery email with direct Notion duplicate link and Google Drive download folder.',
        'Ensure 3D STL files are validated in Cura/PrusaSlicer with verified manifold geometry before publishing.',
      ],
    },
    seasonalCalendar: {
      peakMonths: ['December–January (New Year Goal Setting & Business Planning)', 'September (Q4 Business Prep)'],
      leadTimeWeeks: 1,
      actionItem: 'Update template versions annually with new features to drive paid upgrades.',
    },
    marginGuardrails: {
      minMarkupMultiple: 'Infinite (Fixed creation time once; 0 physical marginal cost)',
      maxWholesaleDiscount: '60% off for community bulk licenses',
      freeShippingThreshold: 0,
    },
  },

  'custom': {
    id: 'custom',
    categoryName: 'Custom / Other Business (Batch Manufacturing, Fabrication, Workshops)',
    icon: '✨',
    badge: 'Tailored Unit Economics',
    summary:
      'Versatile business models covering custom production, short-run fabrication, and bespoke gifting. Success hinges on clear quotation formulas, upfront deposits, and scope-creep protection.',
    adStrategy: {
      recommendedAdSpendPercent: 18,
      targetRoas: '3.5x – 5.0x',
      maxHealthyCacPercent: 20,
      budgetAllocationAdvice:
        'Focus on Google Search Ads and LinkedIn/Instagram B2B outreach for corporate gifting and custom manufacturing inquiries. Run lead-generation forms rather than simple website clicks.',
      bestAdFormats: [
        'Case study video: "From customer sketch to 50 finished custom parts in 5 days"',
        'Corporate gift hamper showcase featuring debossed client logo branding',
        'Behind-the-scenes precision fabrication and quality control test',
      ],
      testedHooks: [
        '"Need 50 custom branded gift hampers for your team with zero generic plastic items?"',
        '"How we helped a local brand prototype and produce their first 100 batch units in 7 days."',
      ],
      adMistakesToAvoid: [
        'Starting custom production without a non-refundable 50% advance deposit.',
        'Allowing unlimited revisions without charging design/mold iteration fees.',
      ],
    },
    channelFit: {
      primaryChannel: 'Direct WhatsApp B2B Consultations + Portfolio Website',
      secondaryChannels: ['Corporate HR & Marketing Direct Outreach', 'Event Planners & Wedding Coordinators'],
      channelNotes: 'High-ticket custom orders are closed through personal consultation and digital proposals.',
      minViableAov: 1500,
      bundlingPlaybook: [
        'Corporate Festive Hamper: Branded Box + Custom Product + Curated Treats (₹1,500 - ₹3,500/kit)',
        'Short-Run Production Tier: 25 Units MOQ with free logo tooling (₹850/unit)',
      ],
    },
    rtoAndLogistics: {
      benchmarkRtoRate: '<2% (Custom orders are almost exclusively 100% prepaid or 50% deposit)',
      codReductionTactics: [
        'Never offer COD on custom branded or personalized production runs.',
        'Require balance payment clearance prior to shipping bulk freight.',
      ],
      packagingRules: [
        'Palletize or pack in reinforced double-ply outer master cartons for heavy custom batches.',
        'Take video proof of carton sealing before handing over to commercial logistics partners.',
      ],
    },
    seasonalCalendar: {
      peakMonths: ['August–October (Corporate Diwali Gifts)', 'January–March (Financial Year-end Gifting)'],
      leadTimeWeeks: 5,
      actionItem: 'Reach out to corporate HR and marketing heads in August before budgets are committed.',
    },
    marginGuardrails: {
      minMarkupMultiple: '2.8x on all direct materials + machine time',
      maxWholesaleDiscount: '35% off for 100+ unit runs',
      freeShippingThreshold: 2500,
    },
  },
};

/**
 * Helper to retrieve marketing playbook for any category ID or fallback to Handmade
 */
export function getCategoryMarketingPlaybook(categoryId?: string | null): CategoryMarketingPlaybook {
  if (!categoryId) return CATEGORY_MARKETING_PLAYBOOKS['candles-fragrance'];
  const found = CATEGORY_MARKETING_PLAYBOOKS[categoryId];
  if (found) return found;

  // Partial matching
  const key = categoryId.toLowerCase();
  if (key.includes('candle') || key.includes('wax') || key.includes('soap')) return CATEGORY_MARKETING_PLAYBOOKS['candles-fragrance'];
  if (key.includes('craft') || key.includes('resin') || key.includes('wood')) return CATEGORY_MARKETING_PLAYBOOKS['handmade-crafts'];
  if (key.includes('decor') || key.includes('home') || key.includes('living') || key.includes('jesmonite')) return CATEGORY_MARKETING_PLAYBOOKS['home-decor-lifestyle'];
  if (key.includes('food') || key.includes('bake') || key.includes('snack')) return CATEGORY_MARKETING_PLAYBOOKS['food-bakery'];
  if (key.includes('beauty') || key.includes('skin') || key.includes('cosmetic') || key.includes('wellness')) return CATEGORY_MARKETING_PLAYBOOKS['beauty-personal-care'];
  if (key.includes('cloth') || key.includes('apparel') || key.includes('fashion') || key.includes('textile')) return CATEGORY_MARKETING_PLAYBOOKS['clothing-accessories'];
  if (key.includes('jewel')) return CATEGORY_MARKETING_PLAYBOOKS['jewellery'];
  if (key.includes('digital') || key.includes('online') || key.includes('template')) return CATEGORY_MARKETING_PLAYBOOKS['digital-products'];

  return CATEGORY_MARKETING_PLAYBOOKS['custom'];
}
