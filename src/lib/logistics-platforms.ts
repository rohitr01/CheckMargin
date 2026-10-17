// CheckMargin Logistics, Courier Companies & Marketplace Platforms Comparison Engine
// Deterministic pricing models, COD remittance cycles, RTO risk, and commission structures

export interface CourierService {
  id: string;
  name: string;
  type: 'aggregator' | 'direct_courier' | 'national_post' | 'hyperlocal' | 'marketplace_integrated';
  tagline: string;
  baseRateCity500g: number;       // ₹ within city (e.g. Mumbai to Mumbai)
  baseRateRegional500g: number;   // ₹ within same state/region (e.g. Mumbai to Pune)
  baseRateNational500g: number;   // ₹ across India (e.g. Mumbai to Delhi)
  airExpressRate500g: number;     // ₹ priority air delivery
  volumetricDivisor: number;      // usually 5000 (or 4000 for air)
  codFeeFlat: number;             // fixed COD fee ₹
  codFeePercent: number;          // or % of order value
  codRemittanceDays: string;      // payout turnaround (e.g. T+2 to T+4 days)
  rtoChargeMultiplier: number;    // multiplier on forward freight for RTO returns (typically 1.0x to 1.2x)
  doorstepPickup: boolean;
  trackingQuality: 'Basic' | 'Good' | 'Real-time GPS / WhatsApp';
  fragileHandlingRating: number;  // 1-5 stars
  idealForProducts: string[];
  pros: string[];
  cons: string[];
}

export const COURIER_SERVICES: CourierService[] = [
  {
    id: 'shiprocket',
    name: 'Shiprocket (Courier Aggregator)',
    type: 'aggregator',
    tagline: 'Multi-courier engine (Delhivery, Bluedart, Shadowfax, DTDC in 1 portal)',
    baseRateCity500g: 38,
    baseRateRegional500g: 48,
    baseRateNational500g: 68,
    airExpressRate500g: 95,
    volumetricDivisor: 5000,
    codFeeFlat: 35,
    codFeePercent: 2.0,
    codRemittanceDays: 'T+2 days (with Early COD) or weekly',
    rtoChargeMultiplier: 1.0,
    doorstepPickup: true,
    trackingQuality: 'Real-time GPS / WhatsApp',
    fragileHandlingRating: 3.8,
    idealForProducts: ['Soy Candles', 'Handmade Soaps', 'Cosmetics', 'Apparel & Textiles', 'Stationery'],
    pros: [
      'Compare rates from 14+ courier partners dynamically on every order',
      'Automated WhatsApp shipping notifications and NDR (Non-Delivery Report) management',
      'Early COD payout option avoids founder working capital bottlenecks',
    ],
    cons: [
      'Customer support handles via tickets, not direct local station calls',
      'Aggregator layer occasionally adds delay in dispute resolutions',
    ],
  },
  {
    id: 'delhivery',
    name: 'Delhivery Direct',
    type: 'direct_courier',
    tagline: 'India’s largest independent express logistics network',
    baseRateCity500g: 42,
    baseRateRegional500g: 52,
    baseRateNational500g: 72,
    airExpressRate500g: 105,
    volumetricDivisor: 5000,
    codFeeFlat: 40,
    codFeePercent: 2.0,
    codRemittanceDays: 'T+3 to T+5 days',
    rtoChargeMultiplier: 1.0,
    doorstepPickup: true,
    trackingQuality: 'Real-time GPS / WhatsApp',
    fragileHandlingRating: 3.9,
    idealForProducts: ['Apparel', 'Jesmonite Decor', 'Art Prints', 'Food & Snacks'],
    pros: [
      'Direct carrier relationship without middleman aggregators',
      'Extensive pin-code reach across Tier 2, 3, and 4 towns (18,500+ pin codes)',
      'Automated weight dispute and reconciliation portal',
    ],
    cons: [
      'Weight discrepancy audits require careful parcel photography proof',
      'Strict minimum monthly shipment volume targets for best discounted rates',
    ],
  },
  {
    id: 'bluedart',
    name: 'Blue Dart Express (DHL Group)',
    type: 'direct_courier',
    tagline: 'Premium air express for delicate, high-value, and time-critical craft items',
    baseRateCity500g: 65,
    baseRateRegional500g: 85,
    baseRateNational500g: 125,
    airExpressRate500g: 145,
    volumetricDivisor: 5000,
    codFeeFlat: 50,
    codFeePercent: 2.5,
    codRemittanceDays: 'T+4 to T+7 days',
    rtoChargeMultiplier: 1.0,
    doorstepPickup: true,
    trackingQuality: 'Real-time GPS / WhatsApp',
    fragileHandlingRating: 4.8,
    idealForProducts: ['925 Silver Jewellery', 'Precious Stone Ornaments', 'Luxury Glass Candles', 'Fragile Resin Clocks'],
    pros: [
      'Highest delivery success rate (98%+) with lowest transit breakage',
      'Dedicated air fleet for guaranteed 24-48 hr metro-to-metro turnaround',
      'Superior brand perception when customers receive Blue Dart air parcels',
    ],
    cons: [
      'Higher base freight rates compared to surface couriers',
      'Remote pin-code surcharge applies outside primary urban lanes',
    ],
  },
  {
    id: 'indiapost',
    name: 'India Post (Speed Post / Parcel)',
    type: 'national_post',
    tagline: 'Universal coverage reaching every corner of India and international destinations',
    baseRateCity500g: 25,
    baseRateRegional500g: 35,
    baseRateNational500g: 50,
    airExpressRate500g: 65,
    volumetricDivisor: 6000, // generous volumetric allowance
    codFeeFlat: 30,
    codFeePercent: 1.5,
    codRemittanceDays: 'T+7 to T+14 days via e-Post Office',
    rtoChargeMultiplier: 0.5, // low or zero return penalty
    doorstepPickup: false, // small makers drop at post office; corporate accounts have pickup
    trackingQuality: 'Good',
    fragileHandlingRating: 3.2,
    idealForProducts: ['Handmade Stationery', 'Lightweight Books', 'Cloth Bags & Scrunchies', 'Remote Northeast/Himalayan deliveries'],
    pros: [
      '100% pin code coverage in India (1.5 Lakh post offices including rural)',
      'Lowest freight pricing in the country with no remote area surcharges',
      'Most economical option for international Air Parcel exports with customs declaration (CN22/23)',
    ],
    cons: [
      'Doorstep pickup requires high minimum volume and formal postal corporate account',
      'Manual tracking updates and slower customer grievance redressal',
    ],
  },
  {
    id: 'porter',
    name: 'Porter / Local 2-Wheeler & Mini Trucks',
    type: 'hyperlocal',
    tagline: 'On-demand same-day intra-city delivery for bakeries, cakes, and event batches',
    baseRateCity500g: 45, // starts ~₹45 for first 2 km bike
    baseRateRegional500g: 150, // truck/distance based
    baseRateNational500g: 0, // N/A
    airExpressRate500g: 0, // N/A
    volumetricDivisor: 1000, // physical space in bag/van
    codFeeFlat: 0,
    codFeePercent: 0,
    codRemittanceDays: 'Instant UPI on delivery',
    rtoChargeMultiplier: 1.0,
    doorstepPickup: true,
    trackingQuality: 'Real-time GPS / WhatsApp',
    fragileHandlingRating: 4.6,
    idealForProducts: ['Artisanal Cakes & Cupcakes', 'Perishable Breads', 'Heavy Ceramic Pots', 'Flea Market Stock Shifting'],
    pros: [
      'Zero courier sorting hub transfers — driver goes directly from your kitchen to customer door',
      'Crucial for fragile tiered cakes and glass desserts that cannot survive courier conveyor belts',
      'Immediate delivery within 60 to 120 minutes across the metro city',
    ],
    cons: [
      'Limited strictly to intra-city distances (typically up to 35 km)',
      'Surge pricing during heavy rainfall or peak festival hours',
    ],
  },
  {
    id: 'amazon_easyship',
    name: 'Amazon Easy Ship (ATS)',
    type: 'marketplace_integrated',
    tagline: 'Native Amazon India pickup & doorstep fulfillment',
    baseRateCity500g: 44,
    baseRateRegional500g: 58,
    baseRateNational500g: 78,
    airExpressRate500g: 110,
    volumetricDivisor: 5000,
    codFeeFlat: 0, // bundled in closing fee
    codFeePercent: 0,
    codRemittanceDays: 'Every 7 days via Amazon Seller Disbursement',
    rtoChargeMultiplier: 1.0,
    doorstepPickup: true,
    trackingQuality: 'Real-time GPS / WhatsApp',
    fragileHandlingRating: 3.7,
    idealForProducts: ['Any craft product listed on Amazon.in with Prime / Easy Ship badge'],
    pros: [
      'Automatic tracking integration into Amazon buyer accounts',
      'Prime badge eligibility and buyer trust increases conversion rate 3x',
      'Amazon handles customer returns and customer support directly',
    ],
    cons: [
      'Weight handling fees apply in addition to referral and fixed closing commissions',
      'High buyer return rates on e-commerce marketplaces (8%–15%) with return processing fees',
    ],
  },
];

export interface MarketplacePlatform {
  id: string;
  name: string;
  category: 'marketplace' | 'd2c_storefront' | 'social_commerce' | 'offline_event' | 'digital_marketplace';
  tagline: string;
  commissionPercent: string;
  fixedFeePerOrder: string;
  paymentGatewayFee: string;
  isGSTMandatoryToSell: boolean;
  gstExemptionDetails: string;
  typicalAOV: string;            // Average Order Value
  customerReach: 'Mass Market' | 'Curated Artisanal' | 'Founder-Led Niche' | 'Global / Overseas';
  rtoCancellationRisk: 'High (15%–30%)' | 'High (10%–25%)' | 'Moderate (5%–10%)' | 'Low (1%–4%)' | 'Zero (0%)';
  digitalGoodsSupported: boolean;
  idealForProducts: string[];
  idealForCraftCategories?: string[];
  pros: string[];
  cons: string[];
}

export const MARKETPLACE_PLATFORMS: MarketplacePlatform[] = [
  {
    id: 'amazon',
    name: 'Amazon India (Amazon.in)',
    category: 'marketplace',
    tagline: 'India’s largest e-commerce marketplace with millions of active Prime shoppers',
    commissionPercent: '9% – 15% (depending on craft category) + 18% GST',
    fixedFeePerOrder: '₹5 – ₹25 closing fee + Easy Ship logistics',
    paymentGatewayFee: 'Included in platform commission',
    isGSTMandatoryToSell: true,
    gstExemptionDetails: 'Mandatory GSTIN registration required under Section 24(ix). No threshold exemption.',
    typicalAOV: '₹400 – ₹1,200',
    customerReach: 'Mass Market',
    rtoCancellationRisk: 'High (10%–25%)',
    digitalGoodsSupported: false,
    idealForProducts: ['Soy Candles', 'Bath Soaps', 'Essential Oils', 'Packaged Bakery', 'Home Decor'],
    pros: [
      'Huge built-in customer search traffic without spending on cold Facebook ads',
      'Fast Prime deliveries via Easy Ship or Fulfillment by Amazon (FBA)',
      'Customer trust is high with seamless one-click checkout',
    ],
    cons: [
      'High total deductions: Commission (12%) + Closing fee (₹15) + Shipping (₹65) + 18% GST on services',
      'Heavy price competition from mass factory imports; customer owns relationship with Amazon, not you',
    ],
  },
  {
    id: 'meesho',
    name: 'Meesho',
    category: 'marketplace',
    tagline: '0% commission social marketplace for mass-market value craft & apparel',
    commissionPercent: '0% Platform Commission',
    fixedFeePerOrder: '₹0 Platform Fixed Fee',
    paymentGatewayFee: '0%',
    isGSTMandatoryToSell: false,
    gstExemptionDetails: 'Notification 34/2023 allows intra-state sellers with turnover < ₹40 Lakhs to sell using an Enrolment ID without formal GSTIN.',
    typicalAOV: '₹200 – ₹550',
    customerReach: 'Mass Market',
    rtoCancellationRisk: 'High (15%–30%)',
    digitalGoodsSupported: false,
    idealForProducts: ['Value Apparels', 'Scrunchies & Hairbands', 'Affordable Jewellery', 'Printed Tote Bags'],
    pros: [
      '0% commission allows aggressive pricing with maximum retained margin',
      'Small intra-state makers under ₹40 Lakhs can sell without full GST registration',
      'Massive customer base across Tier 2, 3, and 4 towns',
    ],
    cons: [
      'High RTO (Return to Origin) rate on Cash on Delivery orders (often 20%+)',
      'Extremely price-sensitive audience where premium artisanal craft struggles against low-cost clones',
    ],
  },
  {
    id: 'etsy_india',
    name: 'Etsy (Domestic & Global Export)',
    category: 'marketplace',
    tagline: 'Global marketplace for unique handmade, vintage & artisanal creations',
    commissionPercent: '6.5% Transaction Fee + $0.20 listing fee (~₹17) per item',
    fixedFeePerOrder: '3% – 4% Payment processing fee + 18% GST',
    paymentGatewayFee: 'Etsy Payments / PayPal integrated',
    isGSTMandatoryToSell: true,
    gstExemptionDetails: 'Mandatory for domestic selling and international exports (with LUT for 0% export rate).',
    typicalAOV: '₹1,500 – ₹8,000 (Domestic & Export)',
    customerReach: 'Curated Artisanal',
    rtoCancellationRisk: 'Low (1%–4%)',
    digitalGoodsSupported: true,
    idealForProducts: ['Artisan Soy Candles', 'Jesmonite Decor', '925 Silver Jewellery', 'Digital Prints & STL Files'],
    pros: [
      'Buyers value craft story, quality, and founder labour — permits 4x to 8x markup over material costs',
      'Export potential: sell in USD, EUR, GBP to overseas buyers at 3x–5x domestic Indian retail prices',
      'Native support for both physical craft shipments and instant digital file downloads',
    ],
    cons: [
      'Listing fees apply even if item does not sell ($0.20 every 4 months per listing)',
      'Strict handmade policy enforcement and international currency conversion fees',
    ],
  },
  {
    id: 'shopify_razorpay',
    name: 'Shopify / Own Website + Razorpay / Cashfree',
    category: 'd2c_storefront',
    tagline: 'Independent brand headquarters with complete control over customer data and repeat retention',
    commissionPercent: '0% Platform Commission (Shopify subscription $25–$39/mo or ₹1,999/mo)',
    fixedFeePerOrder: '₹0 closing fee',
    paymentGatewayFee: '2% Payment Gateway fee + 18% GST on PG fee (UPI, Cards, NetBanking)',
    isGSTMandatoryToSell: false,
    gstExemptionDetails: 'Not mandatory if intra-state physical goods turnover is under ₹40 Lakhs. Mandatory once inter-state orders occur.',
    typicalAOV: '₹800 – ₹3,500',
    customerReach: 'Founder-Led Niche',
    rtoCancellationRisk: 'Moderate (5%–10%)',
    digitalGoodsSupported: true,
    idealForProducts: ['All artisan brands building brand equity, repeat subscribers, and custom gifting'],
    pros: [
      'You own 100% of your customer emails, phone numbers, and repeat buyer relationships',
      'Lowest per-order transaction cost (just 2% PG fee vs 15% marketplace commission)',
      'Higher average order value through bundles, gift wrapping upsells, and custom engraving',
    ],
    cons: [
      'Zero built-in traffic: Founder must generate traffic via Instagram, Meta ads, or influencer collaborations',
      'Monthly software subscription fee regardless of sales volume',
    ],
  },
  {
    id: 'instagram_d2c',
    name: 'Instagram D2C + WhatsApp & Direct UPI',
    category: 'social_commerce',
    tagline: 'High-touch personal selling via direct messaging, stories, and instant UPI transfers',
    commissionPercent: '0%',
    fixedFeePerOrder: '₹0',
    paymentGatewayFee: '0% (Direct QR / UPI payment to business bank account)',
    isGSTMandatoryToSell: false,
    gstExemptionDetails: 'Exempt for intra-state physical goods under ₹40 Lakhs.',
    typicalAOV: '₹500 – ₹2,500',
    customerReach: 'Founder-Led Niche',
    rtoCancellationRisk: 'Low (1%–4%)',
    digitalGoodsSupported: true,
    idealForProducts: ['Customized Candles', 'Embroidery Hoop Art', 'Pet Portraits', 'Artisan Babka & Cakes'],
    pros: [
      '0% commission, 0% gateway fee, 0% platform charges — 100% money reaches founder bank account',
      'Personal connection with buyer builds passionate, loyal brand advocates',
      '100% prepaid orders via UPI eliminates COD return (RTO) risk completely',
    ],
    cons: [
      'Manual, time-consuming process: replying to DMs, checking payment screenshots, typing addresses',
      'Hard to scale beyond 20–30 orders per day without dedicated automated catalog tools',
    ],
  },
  {
    id: 'flea_markets',
    name: 'Flea Markets, Pop-ups & Craft Bazaars',
    category: 'offline_event',
    tagline: 'In-person tactile craft sales (Lil Flea, Sunday Soul Sante, Dastkar, Local Mall Pop-ups)',
    commissionPercent: '0% (Stall rent fixed fee typically ₹5,000 – ₹25,000 per weekend)',
    fixedFeePerOrder: '₹0',
    paymentGatewayFee: '0% (Cash & direct UPI QR code)',
    isGSTMandatoryToSell: false,
    gstExemptionDetails: 'Local offline retail exempt under ₹40 Lakhs turnover limit.',
    typicalAOV: '₹600 – ₹2,800',
    customerReach: 'Curated Artisanal',
    rtoCancellationRisk: 'Zero (0%)',
    digitalGoodsSupported: false,
    idealForProducts: ['Scented Candles', 'Cold Process Soaps', 'Ceramic Mugs', 'Fashion Jewellery', 'Baked Delicacies'],
    pros: [
      'Immediate cash flow and direct face-to-face feedback on scent, feel, and packaging',
      'Zero shipping fees, zero transit breakage, zero RTO return risks',
      'High impulse purchase conversion as customers can smell candles and touch ceramics',
    ],
    cons: [
      'High fixed upfront stall fee must be recovered before making profit',
      'Physically exhausting weekend work; dependent on event footfall and weather',
    ],
  },
  {
    id: 'gumroad_instamojo',
    name: 'Gumroad / Instamojo / Topmate (Digital Products)',
    category: 'digital_marketplace',
    tagline: 'Turnkey platforms for instant digital downloads, Notion systems & design assets',
    commissionPercent: 'Gumroad 10% flat / Instamojo 2% + ₹3 / Topmate 10%',
    fixedFeePerOrder: 'Included or minimal flat fee',
    paymentGatewayFee: 'Integrated international credit cards, UPI & PayPal',
    isGSTMandatoryToSell: false,
    gstExemptionDetails: 'Service threshold applies: ₹20 Lakhs across India. Export sales to overseas buyers are zero-rated under LUT.',
    typicalAOV: '₹299 – ₹2,999 ($5 – $49)',
    customerReach: 'Global / Overseas',
    rtoCancellationRisk: 'Zero (0%)',
    digitalGoodsSupported: true,
    idealForProducts: ['Notion Templates', 'Ebooks & Guides', '3D STL Files', 'Lightroom Presets', 'Knitting / Crochet Patterns'],
    pros: [
      'Zero physical shipping, zero inventory storage, zero breakages, zero return logistics',
      'Instant automated file delivery right after customer payment',
      'Sell once, scale indefinitely with 90%+ gross margins',
    ],
    cons: [
      'Gumroad platform fee (10%) is relatively high for domestic sales',
      'Indian domestic buyers prefer UPI which requires Instamojo or Razorpay setup',
    ],
  },
];
