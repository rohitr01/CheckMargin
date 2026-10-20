import { BatchInput } from './calculator';

export interface SubCategory {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  hsnCode: string;
  defaultRate: number;
  productType: 'physical' | 'digital' | 'service';
  tagline: string;
  starterProductName: string;
  presetId?: string;
  starterInput?: Partial<BatchInput>;
}

export interface BusinessCategory {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  badge?: string;
  tagline: string;
  description: string;
  defaultProductType: 'physical' | 'digital' | 'service';
  exampleProducts: string[];
  subCategories: SubCategory[];
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
    name: 'Handmade Physical Products',
    shortName: 'Handmade',
    icon: '🏭',
    badge: 'Popular',
    tagline: 'Candles, soaps, wax melts, fragrance, resin art & all handcrafted physical goods',
    description:
      'Batch costing engine for any handmade physical product — calibrated for raw material loss, wastage, labour, and packaging across all craft categories.',
    defaultProductType: 'physical',
    exampleProducts: ['Candles & Wax Melts', 'Cold-Process Soaps', 'Wax Tablets', 'Reed Diffusers'],
    subCategories: [
      {
        id: 'candle',
        name: 'Candles & Wax Melts',
        shortName: 'Candles',
        icon: '🕯️',
        hsnCode: '3406',
        defaultRate: 12,
        productType: 'physical',
        tagline: 'Handcrafted soy, beeswax, paraffin candles, tea lights & scented wax melts',
        starterProductName: 'Handcrafted 200g Vanilla Soy Candle',
        presetId: 'candle',
      },
      {
        id: 'soap',
        name: 'Cold Process Soaps',
        shortName: 'Soaps',
        icon: '🧼',
        hsnCode: '3401',
        defaultRate: 5,
        productType: 'physical',
        tagline: 'Artisan cold process, melt & pour, honey, goat milk & botanical soap bars',
        starterProductName: 'Cold Process Honey & Goat Milk Soap Bar',
        presetId: 'soap',
      },
      {
        id: 'wax-melts',
        name: 'Wax Melts & Scent Tablets',
        shortName: 'Wax Melts',
        icon: '🌸',
        hsnCode: '3307',
        defaultRate: 18,
        productType: 'physical',
        tagline: 'Botanical wax tablets, wardrobe fresheners & aromatherapy wax melts',
        starterProductName: 'Botanical Scented Soy Wax Melts (Pack of 6)',
      },
      {
        id: 'diffusers',
        name: 'Reed Diffusers & Room Mists',
        shortName: 'Diffusers',
        icon: '🌿',
        hsnCode: '3307',
        defaultRate: 18,
        productType: 'physical',
        tagline: 'Essential oil reed diffusers, room sprays & linen mists',
        starterProductName: 'Amber Glass Essential Oil Reed Diffuser (100ml)',
      },
    ],
    starterInput: {
      productName: 'Soy Fragrance Candle 200g',
      productType: 'physical',
      hsnCode: '3406',
      materials: [
        { name: 'Pure Soy Wax Flakes', packPrice: 850, packSize: 1, packUnit: 'kg', qtyUsed: 1800, qtyUnit: 'g', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Concentrated Fragrance Oil', packPrice: 1400, packSize: 100, packUnit: 'ml', qtyUsed: 140, qtyUnit: 'ml', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Frosted Glass Candle Jar (200ml)', packPrice: 700, packSize: 20, packUnit: 'piece', qtyUsed: 10, qtyUnit: 'piece', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Braided Cotton Wick + Metal Sustainer', packPrice: 150, packSize: 50, packUnit: 'piece', qtyUsed: 10, qtyUnit: 'piece', gstRatePercent: 12, isPackPriceGSTInclusive: true },
        { name: 'Waterproof Studio Label', packPrice: 200, packSize: 50, packUnit: 'piece', qtyUsed: 10, qtyUnit: 'piece', gstRatePercent: 18, isPackPriceGSTInclusive: true },
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
      outputGSTRatePercent: 12,
      isPriceGSTInclusive: true,
      monthlyFixedCost: 15000,
    },
  },
  {
    id: 'handmade-crafts',
    name: 'Crafts & Home Decor',
    shortName: 'Crafts',
    icon: '🎨',
    tagline: 'Resin art, macrame, pottery, ceramics, Jesmonite, planters & artisan home goods',
    description:
      'Designed for makers balancing high labour hours, variable resin/clay mixtures, mold depreciation, and custom artisan finishes.',
    defaultProductType: 'physical',
    exampleProducts: ['Resin & Molded Art', 'Woodcraft & Decor', 'Macrame & Fiber Art', 'Studio Ceramics'],
    subCategories: [
      {
        id: 'resin',
        name: 'Resin & Molded Art',
        shortName: 'Resin Art',
        icon: '🌊',
        hsnCode: '3926',
        defaultRate: 18,
        productType: 'physical',
        tagline: 'Epoxy resin coasters, geode wall art, bookmarks, trays & preservation pieces',
        starterProductName: 'Ocean Wave Epoxy Resin Coasters (Set of 4)',
        presetId: 'resin',
      },
      {
        id: 'woodcraft',
        name: 'Woodcraft & Decor',
        shortName: 'Woodcraft',
        icon: '🪵',
        hsnCode: '4421',
        defaultRate: 12,
        productType: 'physical',
        tagline: 'Laser-cut wood, engraved signs, handcrafted chopping boards & wooden decor',
        starterProductName: 'Custom Laser-Engraved Wooden Nameplate',
        presetId: 'woodcraft',
      },
      {
        id: 'macrame',
        name: 'Macrame & Fiber Art',
        shortName: 'Macrame',
        icon: '🧶',
        hsnCode: '5609',
        defaultRate: 12,
        productType: 'physical',
        tagline: 'Bohemian braided cotton wall hangings, plant hangers & woven decor',
        starterProductName: 'Boho Braided Cotton Cord Wall Hanging',
      },
      {
        id: 'pottery',
        name: 'Ceramics & Studio Pottery',
        shortName: 'Pottery',
        icon: '🏺',
        hsnCode: '6912',
        defaultRate: 12,
        productType: 'physical',
        tagline: 'Wheel-thrown ceramic cups, stoneware planters, vases & glazed pottery',
        starterProductName: 'Hand-Thrown Stoneware Ceramic Coffee Mug',
      },
    ],
    starterInput: {
      productName: 'Handcrafted Resin & Wood Coaster Set',
      productType: 'physical',
      hsnCode: '3926',
      materials: [
        { name: '2:1 Epoxy Resin + Hardener Kit', packPrice: 1800, packSize: 1500, packUnit: 'g', qtyUsed: 500, qtyUnit: 'g', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Metallic Pigment Paste & Mica Powder', packPrice: 450, packSize: 100, packUnit: 'g', qtyUsed: 25, qtyUnit: 'g', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Teakwood Cut-Out Bases', packPrice: 400, packSize: 10, packUnit: 'piece', qtyUsed: 5, qtyUnit: 'piece', gstRatePercent: 12, isPackPriceGSTInclusive: true },
        { name: 'Silicone Mold Depreciation Allowance', packPrice: 650, packSize: 30, packUnit: 'piece', qtyUsed: 5, qtyUnit: 'piece', gstRatePercent: 18, isPackPriceGSTInclusive: true },
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
    name: 'Home & Living Products',
    shortName: 'Home & Living',
    icon: '🏠',
    tagline: 'Home decor, ceramics, stoneware, Jesmonite, concrete, minerals & lifestyle goods',
    description:
      'Batch costing engine for home decor and lifestyle products — accounts for mineral composite weight loss, sealer costs, mold depreciation, and lifestyle retail packaging.',
    defaultProductType: 'physical',
    exampleProducts: ['Jesmonite & Plaster', 'Mineral Trays & Coasters', 'Soft Furnishings', 'Artisan Tableware'],
    subCategories: [
      {
        id: 'jesmonite',
        name: 'Jesmonite & Plaster',
        shortName: 'Jesmonite',
        icon: '🪴',
        hsnCode: '6815',
        defaultRate: 18,
        productType: 'physical',
        tagline: 'Mineral composite planters, trays, terrazzo coasters & architectural decor',
        starterProductName: 'Fluted Jesmonite Succulent Planter',
        presetId: 'jesmonite',
      },
      {
        id: 'concrete-trays',
        name: 'Concrete & Mineral Trays',
        shortName: 'Mineral Trays',
        icon: '🧱',
        hsnCode: '6815',
        defaultRate: 18,
        productType: 'physical',
        tagline: 'Jesmonite AC100 oval trays, concrete vanity dishes & terrazzo decor',
        starterProductName: 'Jesmonite Mineral Composite Oval Tray',
      },
      {
        id: 'furnishings',
        name: 'Soft Furnishings & Cushions',
        shortName: 'Furnishings',
        icon: '🛋️',
        hsnCode: '6304',
        defaultRate: 12,
        productType: 'physical',
        tagline: 'Textured cotton cushion covers, throws, table runners & linen mats',
        starterProductName: 'Handloom Textured Cotton Cushion Cover (16x16")',
      },
      {
        id: 'tableware',
        name: 'Artisan Tableware & Boards',
        shortName: 'Tableware',
        icon: '🍽️',
        hsnCode: '4419',
        defaultRate: 12,
        productType: 'physical',
        tagline: 'Acacia and neem wood platters, charcuterie boards & coaster sets',
        starterProductName: 'Acacia Wood Serving Platter & Coaster Set',
      },
    ],
    starterInput: {
      productName: 'Jesmonite Mineral Composite Oval Tray',
      productType: 'physical',
      hsnCode: '6815',
      materials: [
        { name: 'Jesmonite AC100 Base Powder & Liquid', packPrice: 2200, packSize: 3500, packUnit: 'g', qtyUsed: 1200, qtyUnit: 'g', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Terrazzo Chips & Liquid Pigment', packPrice: 500, packSize: 200, packUnit: 'g', qtyUsed: 50, qtyUnit: 'g', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Waterproof Acrylic Penetrating Sealer', packPrice: 600, packSize: 500, packUnit: 'ml', qtyUsed: 60, qtyUnit: 'ml', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Protective Self-Adhesive Cork Base', packPrice: 150, packSize: 20, packUnit: 'piece', qtyUsed: 6, qtyUnit: 'piece', gstRatePercent: 18, isPackPriceGSTInclusive: true },
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
    name: 'Food & Packaged Goods',
    shortName: 'Food',
    icon: '🍱',
    tagline: 'Bakeries, packaged snacks, confectionery, granola, tiffin & food-grade products',
    description:
      'Batch costing engine accounting for baking weight loss (evaporation), premium raw ingredients, food-grade pouch packaging, and cold-chain/fast delivery.',
    defaultProductType: 'physical',
    exampleProducts: ['Bakery & Confectionery', 'Packaged Food & Snacks', 'Artisan Sourdough', 'Granola & Cereals'],
    subCategories: [
      {
        id: 'bakery',
        name: 'Bakery & Confectionery',
        shortName: 'Bakery',
        icon: '🧁',
        hsnCode: '1905',
        defaultRate: 5,
        productType: 'physical',
        tagline: 'Artisan brownies, cookies, sourdough loaves, teacakes & pastries',
        starterProductName: 'Artisan Belgian Chocolate Brownie Batch',
        presetId: 'bakery',
      },
      {
        id: 'food',
        name: 'Packaged Food & Snacks',
        shortName: 'Snacks',
        icon: '🍫',
        hsnCode: '1904',
        defaultRate: 12,
        productType: 'physical',
        tagline: 'Roasted makhana, trail mixes, gourmet dry fruits & extruded snacks',
        starterProductName: 'Roasted Peri Peri Makhana Snack Pouch (100g)',
        presetId: 'food',
      },
      {
        id: 'sourdough',
        name: 'Artisan Sourdough & Breads',
        shortName: 'Sourdough',
        icon: '🍞',
        hsnCode: '1905',
        defaultRate: 5,
        productType: 'physical',
        tagline: 'Wild yeast sourdough boules, focaccia, baguettes & rye loaves',
        starterProductName: 'Fermented Artisan Sourdough Boule (650g)',
      },
      {
        id: 'granola',
        name: 'Gourmet Granola & Cereals',
        shortName: 'Granola',
        icon: '🥣',
        hsnCode: '1904',
        defaultRate: 5,
        productType: 'physical',
        tagline: 'Slow-baked rolled oats, toasted nut granolas, muesli & seed mixes',
        starterProductName: 'Roasted Almond Cranberry Granola Pouch (300g)',
      },
    ],
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
    name: 'Beauty & Wellness',
    shortName: 'Beauty',
    icon: '🧴',
    tagline: 'Skincare, haircare, body care, soaps, serums, lip balms & wellness products',
    description:
      'Formulation-accurate costing for active botanical extracts, essential oils, carrier bases, dropper bottles, and laboratory compliance.',
    defaultProductType: 'physical',
    exampleProducts: ['Cosmetics & Skincare', 'Bath & Body Bars', 'Body Butters & Balms', 'Herbal Hair Oils'],
    subCategories: [
      {
        id: 'cosmetics',
        name: 'Cosmetics & Skincare',
        shortName: 'Skincare',
        icon: '🧴',
        hsnCode: '3304',
        defaultRate: 18,
        productType: 'physical',
        tagline: 'Active face serums, hyaluronic hydrators, toners, moisturisers & clay masks',
        starterProductName: 'Vitamin C Brightening Face Serum (30ml)',
        presetId: 'cosmetics',
      },
      {
        id: 'soap-bars',
        name: 'Cold Process Soaps & Body Bars',
        shortName: 'Bath Bars',
        icon: '🧼',
        hsnCode: '3401',
        defaultRate: 5,
        productType: 'physical',
        tagline: 'Pure cold-process shea butter, goat milk, charcoal & botanical cleansing bars',
        starterProductName: 'Cold Process Shea Butter & Honey Soap Bar',
        presetId: 'soap',
      },
      {
        id: 'body-butter',
        name: 'Body Butters & Balms',
        shortName: 'Body Butters',
        icon: '🧈',
        hsnCode: '3304',
        defaultRate: 18,
        productType: 'physical',
        tagline: 'Whipped raw mango butter, cocoa salves, foot creams & barrier balms',
        starterProductName: 'Whipped Raw Shea & Cocoa Body Butter (150g)',
      },
      {
        id: 'hair-oils',
        name: 'Herbal Hair Oils & Tonics',
        shortName: 'Haircare',
        icon: '💆',
        hsnCode: '3305',
        defaultRate: 18,
        productType: 'physical',
        tagline: 'Infused rosemary hair oils, scalp serums, bhringraj extracts & hair mists',
        starterProductName: 'Cold-Pressed Rosemary & Bhringraj Hair Oil (100ml)',
      },
    ],
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
    name: 'Apparel & Fashion',
    shortName: 'Apparel',
    icon: '🧵',
    tagline: 'Clothing, accessories, fabric goods, bags, scarves & fashion items',
    description:
      'Fabric yardage calculations, pattern cutting waste, thread/zippers consumables, tailor labour rates, and garment polybag packaging.',
    defaultProductType: 'physical',
    exampleProducts: ['Textiles & Apparel', 'Scrunchies & Accessories', 'Scarves & Stoles', 'Embroidered Wear'],
    subCategories: [
      {
        id: 'apparel',
        name: 'Textiles & Apparel',
        shortName: 'Apparel',
        icon: '🧵',
        hsnCode: '6204',
        defaultRate: 12,
        productType: 'physical',
        tagline: 'Hand-block printed cotton tote bags, aprons, linen shirts & artisan garments',
        starterProductName: 'Hand-Block Printed Cotton Tote Bag',
        presetId: 'apparel',
      },
      {
        id: 'scrunchies',
        name: 'Scrunchies & Hair Accessories',
        shortName: 'Scrunchies',
        icon: '🎀',
        hsnCode: '6217',
        defaultRate: 12,
        productType: 'physical',
        tagline: 'Mulberry silk scrunchies, oversized linen hair ties & satin hair bows',
        starterProductName: 'Mulberry Silk Hair Scrunchie Bundle (Set of 3)',
      },
      {
        id: 'scarves',
        name: 'Scarves & Stoles',
        shortName: 'Scarves',
        icon: '🧣',
        hsnCode: '6214',
        defaultRate: 12,
        productType: 'physical',
        tagline: 'Chanderi silk stoles, modal block-print dupattas & woollen shawls',
        starterProductName: 'Handwoven Indigo Cotton Chanderi Scarf',
      },
      {
        id: 'embroidered',
        name: 'Embroidered Wear & Linen',
        shortName: 'Embroidered',
        icon: '🪡',
        hsnCode: '6109',
        defaultRate: 5,
        productType: 'physical',
        tagline: 'Minimalist hand-embroidered organic cotton t-shirts, caps & tote bags',
        starterProductName: 'Minimalist Embroidered Organic Cotton T-Shirt',
      },
    ],
    starterInput: {
      productName: 'Block-Printed Organic Cotton Tote Bag',
      productType: 'physical',
      hsnCode: '6204',
      materials: [
        { name: 'Heavy Organic Canvas Fabric (350 GSM)', packPrice: 1200, packSize: 5, packUnit: 'metre', qtyUsed: 3, qtyUnit: 'metre', gstRatePercent: 5, isPackPriceGSTInclusive: true },
        { name: 'Cotton Webbing Handles & Straps', packPrice: 250, packSize: 10, packUnit: 'metre', qtyUsed: 6, qtyUnit: 'metre', gstRatePercent: 12, isPackPriceGSTInclusive: true },
        { name: 'Natural Indigo Vegetable Printing Dye', packPrice: 400, packSize: 500, packUnit: 'g', qtyUsed: 60, qtyUnit: 'g', gstRatePercent: 12, isPackPriceGSTInclusive: true },
        { name: 'Woven Brand Label + Cotton Drawstring Pouch', packPrice: 350, packSize: 20, packUnit: 'piece', qtyUsed: 6, qtyUnit: 'piece', gstRatePercent: 12, isPackPriceGSTInclusive: true },
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
    name: 'Jewellery & Accessories',
    shortName: 'Jewellery',
    icon: '💍',
    tagline: 'Handmade jewellery, earrings, necklaces, bracelets, rings & accessories',
    description:
      'Micro-component costing for findings, ear hooks, jump rings, specialized glazes, and anti-tarnish premium jewellery gift boxes.',
    defaultProductType: 'physical',
    exampleProducts: ['Handmade Jewellery', 'Polymer Clay Earrings', 'Pearl & Beaded Chokers', 'Wire-Wrapped Rings'],
    subCategories: [
      {
        id: 'jewellery',
        name: 'Handmade Jewellery',
        shortName: 'Polymer Clay',
        icon: '💍',
        hsnCode: '7117',
        defaultRate: 3,
        productType: 'physical',
        tagline: 'Polymer clay statement earrings, floral studs & geometric dangles',
        starterProductName: 'Polymer Clay Floral Dangle Earrings',
        presetId: 'jewellery',
      },
      {
        id: 'beaded',
        name: 'Pearl & Beaded Chokers',
        shortName: 'Beaded',
        icon: '📿',
        hsnCode: '7117',
        defaultRate: 3,
        productType: 'physical',
        tagline: 'Freshwater pearl necklaces, glass seed bead chokers & bohemian bracelets',
        starterProductName: 'Freshwater Pearl & Seed Bead Layered Choker',
      },
      {
        id: 'wire-rings',
        name: 'Wire-Wrapped Crystal Rings',
        shortName: 'Wire-Wrapped',
        icon: '🪙',
        hsnCode: '7117',
        defaultRate: 3,
        productType: 'physical',
        tagline: 'Raw gemstone crystal rings, anti-tarnish wire cuffs & wire pendants',
        starterProductName: 'Non-Tarnish Raw Quartz Crystal Wire-Wrapped Ring',
      },
      {
        id: 'resin-charms',
        name: 'Botanical Resin Pendants',
        shortName: 'Resin Charms',
        icon: '💎',
        hsnCode: '7117',
        defaultRate: 3,
        productType: 'physical',
        tagline: 'Real pressed flower resin pendants, gold bezels & personalized lockets',
        starterProductName: 'Real Daisy Flower Botanical Resin Pendant Necklace',
      },
    ],
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
    name: 'Digital & Online Products',
    shortName: 'Digital',
    icon: '💻',
    tagline: 'Digital downloads, templates, courses, e-books, design kits & online products',
    description:
      'Zero shipping, zero packaging, zero batch scrap. Solves platform commissions (Gumroad, Instamojo), creator tools, and 18% GST (SAC 9984).',
    defaultProductType: 'digital',
    exampleProducts: ['Notion & Workspace OS', '3D Printable STL Models', 'Lightroom Presets', 'Canva Creator Kits'],
    subCategories: [
      {
        id: 'notion',
        name: 'Notion & Workspace Templates',
        shortName: 'Notion OS',
        icon: '📝',
        hsnCode: '9984',
        defaultRate: 18,
        productType: 'digital',
        tagline: 'All-in-one Notion workspace OS, project dashboards, habit trackers & CRM kits',
        starterProductName: 'Notion Life & Business OS Template',
        presetId: 'notion',
      },
      {
        id: 'stl3d',
        name: '3D STL & Printable Models',
        shortName: '3D STL',
        icon: '🧊',
        hsnCode: '9983',
        defaultRate: 18,
        productType: 'digital',
        tagline: 'Pre-supported 3D miniature STLs, tabletop gaming assets & functional model bundles',
        starterProductName: '3D Printable STL Model & Miniature Bundle',
        presetId: 'stl3d',
      },
      {
        id: 'lightroom',
        name: 'Lightroom Presets & Color LUTs',
        shortName: 'Photo Presets',
        icon: '📸',
        hsnCode: '9984',
        defaultRate: 18,
        productType: 'digital',
        tagline: 'Cinematic desktop & mobile Lightroom DNG/XMP presets, video LUTs & editing curves',
        starterProductName: 'Cinematic Lightroom Presets Pack (Mobile & Desktop)',
        presetId: 'lightroom',
      },
      {
        id: 'canva',
        name: 'Canva Social & Brand Kits',
        shortName: 'Canva Kits',
        icon: '🎨',
        hsnCode: '9984',
        defaultRate: 18,
        productType: 'digital',
        tagline: '150+ viral social media templates, carousel sets, client onboarding decks & kits',
        starterProductName: 'Canva Social Media Kit (150+ Viral Templates)',
        presetId: 'canva',
      },
      {
        id: 'course',
        name: 'Self-Paced Courses & Masterclasses',
        shortName: 'Video Courses',
        icon: '🎥',
        hsnCode: '9984',
        defaultRate: 18,
        productType: 'digital',
        tagline: 'Pre-recorded structured video masterclasses, downloadable worksheets & resources',
        starterProductName: 'Self-Paced Video Course & Masterclass',
        presetId: 'course',
      },
      {
        id: 'audio',
        name: 'Audio Sample Packs & Beats',
        shortName: 'Audio Packs',
        icon: '🎧',
        hsnCode: '9984',
        defaultRate: 18,
        productType: 'digital',
        tagline: 'Royalty-free WAV stems, MIDI chord progressions, synth presets & drum loops',
        starterProductName: 'Lo-Fi Beats & Audio Sample Pack (WAV/MIDI)',
        presetId: 'audio',
      },
    ],
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
    name: 'Custom / Other Business',
    shortName: 'Custom',
    icon: '✨',
    tagline: 'Any product, service or business type not listed above',
    description:
      'A flexible, neutral template allowing you to enter custom materials, quantities, direct craft labour, consumables, overhead, and tax terms.',
    defaultProductType: 'physical',
    exampleProducts: ['Custom Manufacturing', '3D-Printed Parts', 'Curated Gift Hampers', 'Studio Workshops'],
    subCategories: [
      {
        id: 'custom-batch',
        name: 'Custom Batch Manufacturing',
        shortName: 'Custom Batch',
        icon: '⚙️',
        hsnCode: '9999',
        defaultRate: 18,
        productType: 'physical',
        tagline: 'Bespoke physical products, custom chemical or material mixtures & specialized runs',
        starterProductName: 'Custom Batch Product Recipe',
      },
      {
        id: 'custom-3d',
        name: '3D Printing & Prototyping',
        shortName: '3D Prototyping',
        icon: '🖨️',
        hsnCode: '8477',
        defaultRate: 18,
        productType: 'physical',
        tagline: 'FDM/SLA rapid prototyping, custom functional parts & on-demand batch runs',
        starterProductName: 'Precision 3D-Printed Engineering Prototype Run',
      },
      {
        id: 'custom-hampers',
        name: 'Curated Gift Hampers & Boxes',
        shortName: 'Gift Hampers',
        icon: '🎁',
        hsnCode: '9999',
        defaultRate: 18,
        productType: 'physical',
        tagline: 'Hand-assembled festive gift boxes, corporate hampers & luxury artisan kits',
        starterProductName: 'Artisan Gourmet & Candle Festive Gift Hamper',
      },
      {
        id: 'custom-workshops',
        name: 'Creative Studio Workshops',
        shortName: 'Workshops',
        icon: '🛠️',
        hsnCode: '9992',
        defaultRate: 18,
        productType: 'service',
        tagline: 'In-person craft masterclasses, soap-making or painting workshop seats',
        starterProductName: 'Weekend Studio Craft Workshop (1 Seat)',
      },
    ],
    starterInput: {
      productName: 'Custom Batch Product Recipe',
      productType: 'physical',
      hsnCode: '',
      materials: [
        { name: 'Primary Raw Material', packPrice: 500, packSize: 1, packUnit: 'kg', qtyUsed: 1500, qtyUnit: 'g', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Secondary Component / Additive', packPrice: 300, packSize: 100, packUnit: 'ml', qtyUsed: 100, qtyUnit: 'ml', gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Container / Vessel / Base', packPrice: 200, packSize: 10, packUnit: 'piece', qtyUsed: 10, qtyUnit: 'piece', gstRatePercent: 18, isPackPriceGSTInclusive: true },
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
 * Retrieves a category by ID or loose name, defaulting to Handmade Physical Products if unmatched
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

  // Sub-category match
  for (const cat of BUSINESS_CATEGORIES) {
    const sub = cat.subCategories.find(
      (s) => s.id === query || s.name.toLowerCase() === query || s.shortName.toLowerCase() === query
    );
    if (sub) return cat;
  }

  // Partial match
  if (query.includes('candle') || query.includes('wax') || query.includes('physical')) return BUSINESS_CATEGORIES[0];
  if (query.includes('craft') || query.includes('handmade') || query.includes('resin')) return BUSINESS_CATEGORIES[1];
  if (query.includes('decor') || query.includes('home') || query.includes('living') || query.includes('jesmonite')) return BUSINESS_CATEGORIES[2];
  if (query.includes('bake') || query.includes('food') || query.includes('snack') || query.includes('packaged')) return BUSINESS_CATEGORIES[3];
  if (query.includes('beauty') || query.includes('soap') || query.includes('wellness') || query.includes('skin')) return BUSINESS_CATEGORIES[4];
  if (query.includes('cloth') || query.includes('apparel') || query.includes('fashion') || query.includes('textile')) return BUSINESS_CATEGORIES[5];
  if (query.includes('jewel')) return BUSINESS_CATEGORIES[6];
  if (query.includes('digital') || query.includes('online') || query.includes('template')) return BUSINESS_CATEGORIES[7];
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

/**
 * Retrieves a flat list of all sub-categories annotated with their parent category details
 */
export function getAllSubCategories(): (SubCategory & { parentCategoryId: string; parentCategoryName: string })[] {
  const result: (SubCategory & { parentCategoryId: string; parentCategoryName: string })[] = [];
  for (const cat of BUSINESS_CATEGORIES) {
    for (const sub of cat.subCategories) {
      result.push({
        ...sub,
        parentCategoryId: cat.id,
        parentCategoryName: cat.name,
      });
    }
  }
  return result;
}

/**
 * Find a specific subcategory by its ID across all categories
 */
export function findSubCategory(subId: string): (SubCategory & { parentCategoryId: string; parentCategory: BusinessCategory }) | undefined {
  for (const cat of BUSINESS_CATEGORIES) {
    const sub = cat.subCategories.find((s) => s.id === subId);
    if (sub) {
      return {
        ...sub,
        parentCategoryId: cat.id,
        parentCategory: cat,
      };
    }
  }
  return undefined;
}
