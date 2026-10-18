import { BatchInput } from './calculator';

export interface BusinessCategory {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  badge?: string;
  tagline: string;
  description: string;
  defaultProductType: 'physical' | 'digital';
  exampleProducts: string[];
  starterInput: BatchInput;
}

export interface CustomCategoryDetails {
  name: string;
  description?: string;
  primaryProductOrService?: string;
  productType?: 'physical' | 'digital' | 'service';
}

export const BUSINESS_CATEGORIES: BusinessCategory[] = [
  {
    id: 'candles-fragrance',
    name: 'Candles & Fragrance',
    shortName: 'Candles',
    icon: '🕯️',
    badge: 'Popular',
    tagline: 'Scented jar candles, wax melts, pillar candles & aroma diffusers',
    description:
      'Batch costing engine calibrated for wax melting loss, fragrance oil percentages, wick sizing, curing times, and glass jar packaging.',
    defaultProductType: 'physical',
    exampleProducts: ['Soy Jar Candle (200g)', 'Beeswax Pillar Candle', 'Aroma Wax Melts (Pack of 6)', 'Reed Diffuser Set'],
    starterInput: {
      productName: 'Soy Fragrance Candle 200g',
      productType: 'physical',
      hsnCode: '3406',
      materials: [
        { name: 'Pure Soy Wax Flakes', packPrice: 850, packSize: 1, packUnit: 'kg', qtyUsed: 180, qtyUnit: 'g', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Concentrated Fragrance Oil', packPrice: 1400, packSize: 100, packUnit: 'ml', qtyUsed: 15, qtyUnit: 'ml', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Frosted Glass Candle Jar (200ml)', packPrice: 700, packSize: 20, packUnit: 'piece', qtyUsed: 1, qtyUnit: 'piece', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Braided Cotton Wick + Metal Sustainer', packPrice: 150, packSize: 50, packUnit: 'piece', qtyUsed: 1, qtyUnit: 'piece', gstRatePercent: 12, isPackPriceGSTInclusive: true },
        { name: 'Waterproof Studio Label', packPrice: 200, packSize: 50, packUnit: 'piece', qtyUsed: 1, qtyUnit: 'piece', gstRatePercent: 18, isPackPriceGSTInclusive: true },
      ],
      batchSize: 10,
      failedUnits: 1,
      labourMinutes: 90,
      labourHourlyRate: 150,
      packagingPerUnit: 25,
      overheadPerBatch: 50,
      sellingPrice: 599,
      channelId: 'amazon',
      platformFeePercent: 12,
      platformFeeFixed: 15,
      gstOnPlatformFeePercent: 18,
      shippingPerOrder: 65,
      adSpendPerUnit: 40,
      rtoRatePercent: 8,
      rtoLossPerReturn: 90,
      isGSTRegistered: true,
      claimITC: true,
      supplyType: 'intra-state',
      outputGSTRatePercent: 5,
      isPriceGSTInclusive: true,
      monthlyFixedCost: 15000,
    },
  },
  {
    id: 'handmade-crafts',
    name: 'Handmade & Crafts',
    shortName: 'Handmade',
    icon: '🎨',
    tagline: 'Artisan craft, resin art, macrame, pottery & custom gifts',
    description:
      'Designed for makers balancing high labour hours, variable resin/clay mixtures, molds depreciation, and custom artisan finishes.',
    defaultProductType: 'physical',
    exampleProducts: ['Epoxy Resin Coasters', 'Macrame Wall Hanging', 'Hand-Painted Plaster Art', 'Custom Wooden Coasters'],
    starterInput: {
      productName: 'Handcrafted Resin & Wood Coaster Set',
      productType: 'physical',
      hsnCode: '3926',
      materials: [
        { name: '2:1 Epoxy Resin + Hardener Kit', packPrice: 1800, packSize: 1500, packUnit: 'g', qtyUsed: 350, qtyUnit: 'g', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Metallic Pigment Paste & Mica Powder', packPrice: 450, packSize: 100, packUnit: 'g', qtyUsed: 20, qtyUnit: 'g', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Teakwood Cut-Out Bases', packPrice: 400, packSize: 10, packUnit: 'piece', qtyUsed: 4, qtyUnit: 'piece', gstRatePercent: 12, isPackPriceGSTInclusive: true },
        { name: 'Silicone Mold Depreciation Allowance', packPrice: 650, packSize: 30, packUnit: 'piece', qtyUsed: 1, qtyUnit: 'piece', gstRatePercent: 18, isPackPriceGSTInclusive: true },
      ],
      batchSize: 5,
      failedUnits: 0,
      labourMinutes: 120,
      labourHourlyRate: 175,
      packagingPerUnit: 35,
      overheadPerBatch: 60,
      sellingPrice: 899,
      channelId: 'etsy',
      platformFeePercent: 9.5,
      platformFeeFixed: 17,
      gstOnPlatformFeePercent: 18,
      shippingPerOrder: 70,
      adSpendPerUnit: 50,
      rtoRatePercent: 5,
      rtoLossPerReturn: 95,
      isGSTRegistered: true,
      claimITC: true,
      supplyType: 'intra-state',
      outputGSTRatePercent: 18,
      isPriceGSTInclusive: true,
      monthlyFixedCost: 15000,
    },
  },
  {
    id: 'home-decor-lifestyle',
    name: 'Home Decor & Lifestyle',
    shortName: 'Home Decor',
    icon: '🏺',
    tagline: 'Ceramics, Jesmonite trays, planters, stationery & living accents',
    description:
      'Tailored for home decor producers who need accurate material ratio calculations, demolding scrap tracking, and heavy-fragile courier logistics.',
    defaultProductType: 'physical',
    exampleProducts: ['Jesmonite Oval Vanity Tray', 'Ceramic Tabletop Planter', 'Concrete Incense Holder', 'Architectural Bookends'],
    starterInput: {
      productName: 'Jesmonite Mineral Composite Oval Tray',
      productType: 'physical',
      hsnCode: '6815',
      materials: [
        { name: 'Jesmonite AC100 Base Powder & Liquid', packPrice: 2200, packSize: 3500, packUnit: 'g', qtyUsed: 1200, qtyUnit: 'g', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Terrazzo Chips & Liquid Pigment', packPrice: 500, packSize: 200, packUnit: 'g', qtyUsed: 50, qtyUnit: 'g', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Waterproof Acrylic Penetrating Sealer', packPrice: 600, packSize: 500, packUnit: 'ml', qtyUsed: 60, qtyUnit: 'ml', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Protective Self-Adhesive Cork Base', packPrice: 150, packSize: 20, packUnit: 'piece', qtyUsed: 4, qtyUnit: 'piece', gstRatePercent: 18, isPackPriceGSTInclusive: true },
      ],
      batchSize: 6,
      failedUnits: 1,
      labourMinutes: 90,
      labourHourlyRate: 150,
      packagingPerUnit: 40,
      overheadPerBatch: 50,
      sellingPrice: 649,
      channelId: 'shopify',
      platformFeePercent: 2,
      platformFeeFixed: 3,
      gstOnPlatformFeePercent: 18,
      shippingPerOrder: 75,
      adSpendPerUnit: 45,
      rtoRatePercent: 6,
      rtoLossPerReturn: 110,
      isGSTRegistered: true,
      claimITC: true,
      supplyType: 'intra-state',
      outputGSTRatePercent: 18,
      isPriceGSTInclusive: true,
      monthlyFixedCost: 15000,
    },
  },
  {
    id: 'food-bakery',
    name: 'Food & Bakery',
    shortName: 'Food & Bakery',
    icon: '🧁',
    tagline: 'Artisan bakeries, gourmet confectionery, snacks, granola & coffee',
    description:
      'Batch costing engine accounting for baking weight loss (evaporation), premium raw ingredients, food-grade pouch packaging, and cold-chain/fast delivery.',
    defaultProductType: 'physical',
    exampleProducts: ['Artisan Sourdough Loaf', 'Belgian Chocolate Brownies', 'Gourmet Roasted Makhana', 'Granola Breakfast Pouch'],
    starterInput: {
      productName: 'Belgian Couverture Chocolate Brownies (Box of 6)',
      productType: 'physical',
      hsnCode: '1905',
      materials: [
        { name: '55% Belgian Dark Chocolate Couverture', packPrice: 950, packSize: 1, packUnit: 'kg', qtyUsed: 350, qtyUnit: 'g', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Pure Dairy Butter (Unsalted)', packPrice: 310, packSize: 500, packUnit: 'g', qtyUsed: 220, qtyUnit: 'g', gstRatePercent: 12, isPackPriceGSTInclusive: true },
        { name: 'Organic Brown Sugar & Castor Sugar', packPrice: 180, packSize: 1, packUnit: 'kg', qtyUsed: 300, qtyUnit: 'g', gstRatePercent: 5, isPackPriceGSTInclusive: true },
        { name: 'Premium Wheat Flour Blend', packPrice: 80, packSize: 1, packUnit: 'kg', qtyUsed: 160, qtyUnit: 'g', gstRatePercent: 5, isPackPriceGSTInclusive: true },
        { name: 'Dutch Process Cocoa Powder', packPrice: 450, packSize: 500, packUnit: 'g', qtyUsed: 60, qtyUnit: 'g', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'California Walnuts (Chopped)', packPrice: 550, packSize: 500, packUnit: 'g', qtyUsed: 120, qtyUnit: 'g', gstRatePercent: 5, isPackPriceGSTInclusive: true },
      ],
      batchSize: 6,
      failedUnits: 0,
      labourMinutes: 60,
      labourHourlyRate: 180,
      packagingPerUnit: 35,
      overheadPerBatch: 60,
      sellingPrice: 549,
      channelId: 'shopify',
      platformFeePercent: 2,
      platformFeeFixed: 3,
      gstOnPlatformFeePercent: 18,
      shippingPerOrder: 55,
      adSpendPerUnit: 35,
      rtoRatePercent: 2,
      rtoLossPerReturn: 80,
      isGSTRegistered: false,
      claimITC: false,
      supplyType: 'intra-state',
      outputGSTRatePercent: 5,
      isPriceGSTInclusive: true,
      monthlyFixedCost: 15000,
    },
  },
  {
    id: 'beauty-personal-care',
    name: 'Beauty & Personal Care',
    shortName: 'Beauty & Body',
    icon: '🧴',
    tagline: 'Cold-process soaps, face serums, body butters, lip balms & hair oils',
    description:
      'Formulation-accurate costing for active botanical extracts, essential oils, carrier bases, dropper bottles, and laboratory compliance.',
    defaultProductType: 'physical',
    exampleProducts: ['Cold Process Shea Butter Soap', 'Vitamin C Brightening Serum', 'Whipped Body Butter (100g)', 'Natural Tinted Lip Balm'],
    starterInput: {
      productName: 'Cold Process Shea Butter & Honey Soap Bar',
      productType: 'physical',
      hsnCode: '3401',
      materials: [
        { name: 'Cold-Pressed Virgin Coconut & Olive Oil', packPrice: 650, packSize: 1, packUnit: 'L', qtyUsed: 750, qtyUnit: 'ml', gstRatePercent: 5, isPackPriceGSTInclusive: true },
        { name: 'Raw Unrefined Ghana Shea Butter', packPrice: 850, packSize: 500, packUnit: 'g', qtyUsed: 200, qtyUnit: 'g', gstRatePercent: 5, isPackPriceGSTInclusive: true },
        { name: 'Sodium Hydroxide (Lye)', packPrice: 180, packSize: 500, packUnit: 'g', qtyUsed: 110, qtyUnit: 'g', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Lavender & Sweet Orange Essential Oil', packPrice: 900, packSize: 100, packUnit: 'ml', qtyUsed: 35, qtyUnit: 'ml', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Recycled Kraft Soap Box & Label', packPrice: 300, packSize: 20, packUnit: 'piece', qtyUsed: 10, qtyUnit: 'piece', gstRatePercent: 18, isPackPriceGSTInclusive: true },
      ],
      batchSize: 10,
      failedUnits: 1,
      labourMinutes: 100,
      labourHourlyRate: 160,
      packagingPerUnit: 18,
      overheadPerBatch: 40,
      sellingPrice: 320,
      channelId: 'shopify',
      platformFeePercent: 2,
      platformFeeFixed: 3,
      gstOnPlatformFeePercent: 18,
      shippingPerOrder: 50,
      adSpendPerUnit: 30,
      rtoRatePercent: 4,
      rtoLossPerReturn: 70,
      isGSTRegistered: true,
      claimITC: true,
      supplyType: 'intra-state',
      outputGSTRatePercent: 5,
      isPriceGSTInclusive: true,
      monthlyFixedCost: 12000,
    },
  },
  {
    id: 'clothing-accessories',
    name: 'Clothing & Accessories',
    shortName: 'Apparel',
    icon: '🧵',
    tagline: 'Handmade apparel, scrunchies, tote bags, embroidered wear & scarves',
    description:
      'Fabric yardage calculations, pattern cutting waste, thread/zippers consumables, tailor labour rates, and garment polybag packaging.',
    defaultProductType: 'physical',
    exampleProducts: ['Block-Printed Cotton Tote Bag', 'Silk Hair Scrunchie Set', 'Hand-Embroidered Linen Shirt', 'Canvas Everyday Apron'],
    starterInput: {
      productName: 'Block-Printed Organic Cotton Tote Bag',
      productType: 'physical',
      hsnCode: '6204',
      materials: [
        { name: 'Heavy Organic Canvas Fabric (350 GSM)', packPrice: 1200, packSize: 5, packUnit: 'metre', qtyUsed: 1.5, qtyUnit: 'metre', gstRatePercent: 5, isPackPriceGSTInclusive: true },
        { name: 'Cotton Webbing Handles & Straps', packPrice: 250, packSize: 10, packUnit: 'metre', qtyUsed: 2.2, qtyUnit: 'metre', gstRatePercent: 12, isPackPriceGSTInclusive: true },
        { name: 'Natural Indigo Vegetable Printing Dye', packPrice: 400, packSize: 500, packUnit: 'g', qtyUsed: 50, qtyUnit: 'g', gstRatePercent: 12, isPackPriceGSTInclusive: true },
        { name: 'Woven Brand Label + Cotton Drawstring Pouch', packPrice: 350, packSize: 20, packUnit: 'piece', qtyUsed: 2, qtyUnit: 'piece', gstRatePercent: 12, isPackPriceGSTInclusive: true },
      ],
      batchSize: 6,
      failedUnits: 0,
      labourMinutes: 90,
      labourHourlyRate: 150,
      packagingPerUnit: 20,
      overheadPerBatch: 40,
      sellingPrice: 599,
      channelId: 'instagram_d2c',
      platformFeePercent: 1.5,
      platformFeeFixed: 0,
      gstOnPlatformFeePercent: 18,
      shippingPerOrder: 50,
      adSpendPerUnit: 40,
      rtoRatePercent: 7,
      rtoLossPerReturn: 80,
      isGSTRegistered: true,
      claimITC: true,
      supplyType: 'intra-state',
      outputGSTRatePercent: 12,
      isPriceGSTInclusive: true,
      monthlyFixedCost: 15000,
    },
  },
  {
    id: 'jewellery',
    name: 'Jewellery',
    shortName: 'Jewellery',
    icon: '💍',
    tagline: 'Handmade earrings, polymer clay, beaded necklaces, wire wrap & resin charms',
    description:
      'Micro-component costing for findings, ear hooks, jump rings, specialized glazes, and anti-tarnish premium jewellery gift boxes.',
    defaultProductType: 'physical',
    exampleProducts: ['Polymer Clay Statement Earrings', 'Natural Pearl Beaded Choker', 'Wire-Wrapped Crystal Ring', 'Brass Pendant Necklace'],
    starterInput: {
      productName: 'Sculpted Polymer Clay Dangle Earrings',
      productType: 'physical',
      hsnCode: '7117',
      materials: [
        { name: 'Polymer Clay Bars (Sculpey Premo)', packPrice: 650, packSize: 250, packUnit: 'g', qtyUsed: 40, qtyUnit: 'g', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Hypoallergenic 18K Gold Plated Stud Posts', packPrice: 450, packSize: 50, packUnit: 'piece', qtyUsed: 10, qtyUnit: 'piece', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Stainless Steel Jump Rings & Connectors', packPrice: 180, packSize: 100, packUnit: 'piece', qtyUsed: 20, qtyUnit: 'piece', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'UV Resin Clear Topcoat & Glaze', packPrice: 550, packSize: 100, packUnit: 'ml', qtyUsed: 10, qtyUnit: 'ml', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Debossed Jewellery Slide Box + Microfibre Pouch', packPrice: 500, packSize: 10, packUnit: 'piece', qtyUsed: 5, qtyUnit: 'piece', gstRatePercent: 18, isPackPriceGSTInclusive: true },
      ],
      batchSize: 5,
      failedUnits: 0,
      labourMinutes: 75,
      labourHourlyRate: 200,
      packagingPerUnit: 35,
      overheadPerBatch: 30,
      sellingPrice: 749,
      channelId: 'shopify',
      platformFeePercent: 2,
      platformFeeFixed: 3,
      gstOnPlatformFeePercent: 18,
      shippingPerOrder: 45,
      adSpendPerUnit: 60,
      rtoRatePercent: 3,
      rtoLossPerReturn: 70,
      isGSTRegistered: true,
      claimITC: true,
      supplyType: 'intra-state',
      outputGSTRatePercent: 3,
      isPriceGSTInclusive: true,
      monthlyFixedCost: 12000,
    },
  },
  {
    id: 'digital-products',
    name: 'Digital Products',
    shortName: 'Digital',
    icon: '💻',
    tagline: 'Notion templates, 3D printing STLs, design kits, digital guides & spreadsheets',
    description:
      'Zero shipping, zero packaging, zero batch scrap. Solves platform commissions (Gumroad, Instamojo), creator tools, and 18% GST (SAC 9984).',
    defaultProductType: 'digital',
    exampleProducts: ['Notion Small Business OS', 'Canva Social Media Brand Kit', '3D Printing STL Model Pack', 'Procreate Brush & Texture Kit'],
    starterInput: {
      productName: 'All-In-One Small Business Notion OS',
      productType: 'digital',
      hsnCode: '9984',
      materials: [
        { name: 'Notion Pro Workspace Hosting Allocation', packPrice: 800, packSize: 30, packUnit: 'piece', qtyUsed: 1, qtyUnit: 'piece', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Figma Component & Icon License Allocation', packPrice: 1200, packSize: 50, packUnit: 'piece', qtyUsed: 1, qtyUnit: 'piece', gstRatePercent: 18, isPackPriceGSTInclusive: true },
      ],
      batchSize: 1,
      failedUnits: 0,
      labourMinutes: 120,
      labourHourlyRate: 350,
      packagingPerUnit: 0,
      overheadPerBatch: 50,
      sellingPrice: 499,
      channelId: 'gumroad',
      platformFeePercent: 10,
      platformFeeFixed: 0,
      gstOnPlatformFeePercent: 18,
      shippingPerOrder: 0,
      adSpendPerUnit: 75,
      rtoRatePercent: 0,
      rtoLossPerReturn: 0,
      isGSTRegistered: true,
      claimITC: true,
      supplyType: 'inter-state',
      outputGSTRatePercent: 18,
      isPriceGSTInclusive: true,
      monthlyFixedCost: 8000,
    },
  },
  {
    id: 'custom',
    name: 'Other Business / Custom Category',
    shortName: 'Custom Business',
    icon: '✨',
    tagline: 'Any custom physical or digital product, service or specialized workshop',
    description:
      'A flexible, neutral template allowing you to enter custom materials, quantities, direct craft labour, consumables, overhead, and tax terms.',
    defaultProductType: 'physical',
    exampleProducts: ['Custom Manufacturing', '3D-Printed Parts', 'Stationery & Printing', 'Specialized Decor'],
    starterInput: {
      productName: 'Custom Batch Product Recipe',
      productType: 'physical',
      hsnCode: '',
      materials: [
        { name: 'Primary Raw Material', packPrice: 500, packSize: 1, packUnit: 'kg', qtyUsed: 200, qtyUnit: 'g', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Secondary Component / Additive', packPrice: 300, packSize: 100, packUnit: 'ml', qtyUsed: 15, qtyUnit: 'ml', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Container / Vessel / Base', packPrice: 200, packSize: 10, packUnit: 'piece', qtyUsed: 1, qtyUnit: 'piece', gstRatePercent: 18, isPackPriceGSTInclusive: true },
      ],
      batchSize: 10,
      failedUnits: 1,
      labourMinutes: 60,
      labourHourlyRate: 150,
      packagingPerUnit: 20,
      overheadPerBatch: 50,
      sellingPrice: 450,
      channelId: 'shopify',
      platformFeePercent: 2,
      platformFeeFixed: 3,
      gstOnPlatformFeePercent: 18,
      shippingPerOrder: 55,
      adSpendPerUnit: 30,
      rtoRatePercent: 5,
      rtoLossPerReturn: 80,
      isGSTRegistered: false,
      claimITC: false,
      supplyType: 'intra-state',
      outputGSTRatePercent: 18,
      isPriceGSTInclusive: true,
      monthlyFixedCost: 10000,
    },
  },
];

/**
 * Retrieves a category by ID or loose name, defaulting to Candles & Fragrance if unmatched
 */
export function getBusinessCategory(idOrName?: string | null): BusinessCategory {
  if (!idOrName) return BUSINESS_CATEGORIES[0];
  const query = idOrName.toLowerCase().trim();

  // Exact ID match
  const byId = BUSINESS_CATEGORIES.find((c) => c.id === query);
  if (byId) return byId;

  // Name match
  const byName = BUSINESS_CATEGORIES.find(
    (c) => c.name.toLowerCase() === query || c.shortName.toLowerCase() === query
  );
  if (byName) return byName;

  // Partial match
  if (query.includes('candle') || query.includes('wax')) return BUSINESS_CATEGORIES[0];
  if (query.includes('craft') || query.includes('handmade') || query.includes('resin')) return BUSINESS_CATEGORIES[1];
  if (query.includes('decor') || query.includes('home') || query.includes('ceramic') || query.includes('jesmonite')) return BUSINESS_CATEGORIES[2];
  if (query.includes('bake') || query.includes('food') || query.includes('choc') || query.includes('snack')) return BUSINESS_CATEGORIES[3];
  if (query.includes('beauty') || query.includes('soap') || query.includes('cosmetic') || query.includes('skin')) return BUSINESS_CATEGORIES[4];
  if (query.includes('cloth') || query.includes('apparel') || query.includes('textile') || query.includes('tote')) return BUSINESS_CATEGORIES[5];
  if (query.includes('jewel')) return BUSINESS_CATEGORIES[6];
  if (query.includes('digital') || query.includes('tech') || query.includes('template')) return BUSINESS_CATEGORIES[7];
  if (query.includes('custom') || query.includes('other')) return BUSINESS_CATEGORIES[8];

  return BUSINESS_CATEGORIES[0];
}

/**
 * Returns formatted display name for a category, respecting user's custom name if set
 */
export function getCategoryDisplayName(
  categoryId: string,
  customName?: string | null,
  isCustom?: boolean
): string {
  if (isCustom && customName?.trim()) {
    return customName.trim();
  }
  const category = getBusinessCategory(categoryId);
  return category.name;
}
