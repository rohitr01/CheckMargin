'use client';

import { HSN_ALL_PRESETS, SAC_ALL_PRESETS } from '@/lib/gst-directory';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  calculateBatchCost,
  suggestPrices,
  generateShoppingList,
  calculateWholesaleTiers,
  scaleBatch,
  HSN_DIRECTORY,
  type BatchInput,
  type CalculationResult,
  type Material,
  CHANNEL_PRESETS,
} from '@/lib/calculator';
import {
  BUSINESS_CATEGORIES,
  getBusinessCategory,
  type BusinessCategory,
  type SubCategory,
  findSubCategory,
} from '@/lib/business-categories';
import {
  Calculator,
  Plus,
  Trash2,
  TrendingUp,
  AlertCircle,
  Package,
  Layers,
  Sparkles,
  ShoppingBag,
  HelpCircle,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Receipt,
  FileSpreadsheet,
  Printer,
  Save,
  ArrowRight,
  Truck,
  Store,
  DollarSign,
  Percent,
  Building2,
  Scale,
  BookOpen,
  X,
  Search,
  Zap,
  SlidersHorizontal,
  Globe,
  Laptop,
  Download,
  Upload,
  BarChart3,
  PieChart,
  Sliders,
  ArrowUpRight,
} from 'lucide-react';

const HSN_PRESETS = [
  { code: '3406', name: 'Candles & Tapers', defaultRate: 12 },
  { code: '3401', name: 'Soaps & Cleansing Bars', defaultRate: 5 },
  { code: '1905', name: 'Bakery, Cakes, Biscuits', defaultRate: 5 },
  { code: '3304', name: 'Cosmetics, Skincare, Serums', defaultRate: 18 },
  { code: '3926', name: 'Resin Art & Molded Plastic Decor', defaultRate: 18 },
  { code: '6815', name: 'Jesmonite, Cement & Plaster Decor', defaultRate: 18 },
  { code: '6204', name: 'Apparel & Handmade Garments', defaultRate: 12 },
  { code: '7117', name: 'Imitation Jewellery & Clay Earrings', defaultRate: 3 },
  { code: '9999', name: 'Other General Goods', defaultRate: 18 },
];

const SAC_PRESETS = [
  { code: '9984', name: 'Digital Downloads & OIDAR (Templates, Ebooks, Presets)', defaultRate: 18 },
  { code: '9983', name: '3D STL Files, Vector Assets, Fonts & Digital Art', defaultRate: 18 },
  { code: '998314', name: 'Custom Software, Web Apps & UI/UX Design', defaultRate: 18 },
  { code: '998361', name: 'Digital Marketing, Brand & Photography Services', defaultRate: 18 },
];

const DIGITAL_PRESETS = [
  {
    id: 'notion', emoji: '📝',
    name: 'Notion Life & Business OS Template',
    sac: '9984',
    sellingPrice: 999,
    channelId: 'gumroad',
    platformFeePercent: 10,
    platformFeeFixed: 0,
    materials: [
      { name: 'Notion Plus & AI Subscription (Monthly allocation)', packPrice: 1500, packSize: 1, packUnit: 'pack', qtyUsed: 1, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Canva Pro Graphics & Cover Mockup Assets', packPrice: 499, packSize: 1, packUnit: 'pack', qtyUsed: 1, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Loom Video Tutorial & Asset Hosting', packPrice: 850, packSize: 1, packUnit: 'pack', qtyUsed: 1, gstRatePercent: 18, isPackPriceGSTInclusive: true },
    ],
    batchSize: 50,
    labourMinutes: 240,
    labourHourlyRate: 250,
  },
  {
    id: 'stl3d', emoji: '🧊',
    name: '3D Printable STL Model & Miniature Bundle',
    sac: '9983',
    sellingPrice: 1499,
    channelId: 'gumroad',
    platformFeePercent: 10,
    platformFeeFixed: 0,
    materials: [
      { name: 'Blender & ZBrush Commercial Addons', packPrice: 2200, packSize: 1, packUnit: 'pack', qtyUsed: 1, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Cloud GPU 3D Render Farm Credits', packPrice: 1200, packSize: 1, packUnit: 'pack', qtyUsed: 1, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Slicer & Print Validation Test Resin Sample', packPrice: 450, packSize: 1, packUnit: 'pack', qtyUsed: 1, gstRatePercent: 18, isPackPriceGSTInclusive: true },
    ],
    batchSize: 40,
    labourMinutes: 360,
    labourHourlyRate: 300,
  },
  {
    id: 'lightroom', emoji: '📸',
    name: 'Cinematic Lightroom Presets Pack (Mobile & Desktop)',
    sac: '9984',
    sellingPrice: 799,
    channelId: 'instamojo',
    platformFeePercent: 5,
    platformFeeFixed: 3,
    materials: [
      { name: 'Adobe Creative Cloud Suite Subscription', packPrice: 1800, packSize: 1, packUnit: 'pack', qtyUsed: 1, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'RAW Test Photography Assets & Color Target', packPrice: 800, packSize: 1, packUnit: 'pack', qtyUsed: 1, gstRatePercent: 18, isPackPriceGSTInclusive: true },
    ],
    batchSize: 50,
    labourMinutes: 180,
    labourHourlyRate: 250,
  },
  {
    id: 'canva', emoji: '🎨',
    name: 'Canva Social Media Kit (150+ Viral Templates)',
    sac: '9984',
    sellingPrice: 699,
    channelId: 'cosmofeed',
    platformFeePercent: 10,
    platformFeeFixed: 0,
    materials: [
      { name: 'Canva Teams Commercial Subscription', packPrice: 999, packSize: 1, packUnit: 'pack', qtyUsed: 1, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Commercial Stock Photography & Vectors', packPrice: 1200, packSize: 1, packUnit: 'pack', qtyUsed: 1, gstRatePercent: 18, isPackPriceGSTInclusive: true },
    ],
    batchSize: 50,
    labourMinutes: 180,
    labourHourlyRate: 200,
  },
  {
    id: 'course', emoji: '🎥',
    name: 'Self-Paced Video Course & Masterclass',
    sac: '9984',
    sellingPrice: 2499,
    channelId: 'instamojo',
    platformFeePercent: 5,
    platformFeeFixed: 3,
    materials: [
      { name: 'Vimeo OTT / Bunny Stream Video Hosting', packPrice: 1400, packSize: 1, packUnit: 'pack', qtyUsed: 1, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Microphone & Studio Lighting Allocation', packPrice: 1500, packSize: 1, packUnit: 'pack', qtyUsed: 1, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Course PDF Workbook Design Assets', packPrice: 600, packSize: 1, packUnit: 'pack', qtyUsed: 1, gstRatePercent: 18, isPackPriceGSTInclusive: true },
    ],
    batchSize: 30,
    labourMinutes: 480,
    labourHourlyRate: 350,
  },
  {
    id: 'audio', emoji: '🎧',
    name: 'Lo-Fi Beats & Audio Sample Pack (WAV/MIDI)',
    sac: '9984',
    sellingPrice: 899,
    channelId: 'gumroad',
    platformFeePercent: 10,
    platformFeeFixed: 0,
    materials: [
      { name: 'DAW Plugin Suite Licenses (Serum, Kontakt)', packPrice: 2500, packSize: 1, packUnit: 'pack', qtyUsed: 1, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Analog Tape Machine & Pre-amp Depreciation', packPrice: 1000, packSize: 1, packUnit: 'pack', qtyUsed: 1, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Audio Mastering Service Allocation', packPrice: 1200, packSize: 1, packUnit: 'pack', qtyUsed: 1, gstRatePercent: 18, isPackPriceGSTInclusive: true },
    ],
    batchSize: 40,
    labourMinutes: 300,
    labourHourlyRate: 300,
  },
];

const COURIER_RATE_OPTIONS = [
  { id: 'custom', name: 'Custom Rate / Self-Arranged Freight', freight: 0, tag: 'Manual Entry' },
  { id: 'shiprocket', name: 'Shiprocket Multi-Courier (₹68 National / ₹38 City)', freight: 68, tag: 'Aggregator • 14+ Couriers' },
  { id: 'delhivery', name: 'Delhivery Direct (₹72 National / ₹42 City)', freight: 72, tag: 'Direct Network • 18,500+ Pincodes' },
  { id: 'bluedart', name: 'Blue Dart Air Express (₹125 National / ₹65 City)', freight: 125, tag: 'Air Priority • 4.8★ Fragile Safety' },
  { id: 'indiapost', name: 'India Post Speed Post (₹50 National / ₹30 City)', freight: 50, tag: 'National • All 19,000 Pincodes' },
  { id: 'porter', name: 'Porter Hyperlocal 2W (₹45 Intra-City)', freight: 45, tag: 'Hyperlocal • 2hr Same-day Delivery' },
  { id: 'amazon_ats', name: 'Amazon Easy Ship (₹65 National / ₹38 Local)', freight: 65, tag: 'Amazon Integrated Pickup' },
];

const INITIAL_MATERIALS = [
  { name: 'Pure Soy Wax (Flakes)', packPrice: 850, packSize: 1000, packUnit: 'g', qtyUsed: 1800, gstRatePercent: 18, isPackPriceGSTInclusive: true },
  { name: 'French Vanilla Fragrance Oil', packPrice: 1400, packSize: 100, packUnit: 'ml', qtyUsed: 120, gstRatePercent: 18, isPackPriceGSTInclusive: true },
  { name: 'Braided Cotton Wicks + Tabs', packPrice: 150, packSize: 50, packUnit: 'piece', qtyUsed: 10, gstRatePercent: 12, isPackPriceGSTInclusive: true },
  { name: 'Frosted Glass Amber Jars (250ml)', packPrice: 700, packSize: 20, packUnit: 'piece', qtyUsed: 10, gstRatePercent: 18, isPackPriceGSTInclusive: true },
  { name: 'Metallic Foiled Brand Label', packPrice: 200, packSize: 50, packUnit: 'piece', qtyUsed: 10, gstRatePercent: 18, isPackPriceGSTInclusive: true },
];

const INITIAL_FORM: BatchInput = {
  productName: 'Handcrafted 200g Vanilla Soy Candle',
  productType: 'physical',
  hsnCode: '3406',
  materials: INITIAL_MATERIALS,
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
};

const PHYSICAL_PRESETS = [
  {
    id: 'candle', emoji: '🕯️',
    industry: 'Candles & Wax Melts',
    categoryId: 'candles-fragrance',
    name: 'Handcrafted 200g Vanilla Soy Candle',
    hsnCode: '3406',
    outputGSTRatePercent: 12,
    sellingPrice: 599,
    channelId: 'amazon',
    platformFeePercent: 12,
    platformFeeFixed: 15,
    batchSize: 10,
    failedUnits: 1,
    labourMinutes: 90,
    labourHourlyRate: 150,
    packagingPerUnit: 25,
    overheadPerBatch: 50,
    shippingPerOrder: 65,
    rtoRatePercent: 8,
    rtoLossPerReturn: 90,
    materials: INITIAL_MATERIALS,
  },
  {
    id: 'soap', emoji: '🧼',
    industry: 'Cold Process Soaps',
    categoryId: 'candles-fragrance',
    name: 'Cold Process Honey & Goat Milk Soap Bar',
    hsnCode: '3401',
    outputGSTRatePercent: 5,
    sellingPrice: 280,
    channelId: 'shopify',
    platformFeePercent: 2,
    platformFeeFixed: 3,
    batchSize: 12,
    failedUnits: 1,
    labourMinutes: 75,
    labourHourlyRate: 150,
    packagingPerUnit: 14,
    overheadPerBatch: 40,
    shippingPerOrder: 55,
    rtoRatePercent: 5,
    rtoLossPerReturn: 70,
    materials: [
      { name: 'Pure Coconut Oil (Cold Pressed)', packPrice: 420, packSize: 1000, packUnit: 'ml', qtyUsed: 400, gstRatePercent: 5, isPackPriceGSTInclusive: true },
      { name: 'Extra Virgin Olive Oil', packPrice: 850, packSize: 1000, packUnit: 'ml', qtyUsed: 350, gstRatePercent: 5, isPackPriceGSTInclusive: true },
      { name: 'Raw Shea Butter (Unrefined)', packPrice: 650, packSize: 500, packUnit: 'g', qtyUsed: 150, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Pure Sodium Hydroxide (Lye)', packPrice: 220, packSize: 1000, packUnit: 'g', qtyUsed: 130, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Raw Forest Honey & Goat Milk', packPrice: 350, packSize: 500, packUnit: 'ml', qtyUsed: 200, gstRatePercent: 5, isPackPriceGSTInclusive: true },
      { name: 'Essential Oil Blend (Lavender/Oat)', packPrice: 900, packSize: 100, packUnit: 'ml', qtyUsed: 35, gstRatePercent: 18, isPackPriceGSTInclusive: true },
    ],
  },
  {
    id: 'bakery',
    emoji: '🧁',
    industry: 'Bakery & Confectionery',
    categoryId: 'food-bakery',
    name: 'Artisan Belgian Chocolate Brownie Batch',
    hsnCode: '1905',
    outputGSTRatePercent: 5,
    sellingPrice: 160,
    channelId: 'instagram_d2c',
    platformFeePercent: 1.5,
    platformFeeFixed: 0,
    batchSize: 16,
    failedUnits: 1,
    labourMinutes: 90,
    labourHourlyRate: 180,
    packagingPerUnit: 22,
    overheadPerBatch: 60,
    shippingPerOrder: 45,
    rtoRatePercent: 2,
    rtoLossPerReturn: 90,
    materials: [
      { name: '55% Belgian Dark Chocolate Couverture', packPrice: 950, packSize: 1000, packUnit: 'g', qtyUsed: 350, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Pure Dairy Butter (Unsalted)', packPrice: 310, packSize: 500, packUnit: 'g', qtyUsed: 220, gstRatePercent: 12, isPackPriceGSTInclusive: true },
      { name: 'Organic Brown Sugar & Castor Sugar', packPrice: 180, packSize: 1000, packUnit: 'g', qtyUsed: 300, gstRatePercent: 5, isPackPriceGSTInclusive: true },
      { name: 'Premium Wheat Flour Blend', packPrice: 80, packSize: 1000, packUnit: 'g', qtyUsed: 160, gstRatePercent: 5, isPackPriceGSTInclusive: true },
      { name: 'Dutch Process Cocoa Powder', packPrice: 450, packSize: 500, packUnit: 'g', qtyUsed: 60, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'California Walnuts (Chopped)', packPrice: 550, packSize: 500, packUnit: 'g', qtyUsed: 120, gstRatePercent: 5, isPackPriceGSTInclusive: true },
    ],
  },
  {
    id: 'cosmetics',
    emoji: '🧴',
    industry: 'Cosmetics & Skincare',
    categoryId: 'beauty-personal-care',
    name: 'Vitamin C Brightening Face Serum (30ml)',
    hsnCode: '3304',
    outputGSTRatePercent: 18,
    sellingPrice: 699,
    channelId: 'amazon',
    platformFeePercent: 12,
    platformFeeFixed: 15,
    batchSize: 10,
    failedUnits: 0,
    labourMinutes: 60,
    labourHourlyRate: 200,
    packagingPerUnit: 28,
    overheadPerBatch: 50,
    shippingPerOrder: 65,
    rtoRatePercent: 8,
    rtoLossPerReturn: 95,
    materials: [
      { name: 'Active Ethyl Ascorbic Acid (Vit C)', packPrice: 1200, packSize: 100, packUnit: 'g', qtyUsed: 30, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Hyaluronic Acid + Ferulic Base', packPrice: 1600, packSize: 500, packUnit: 'ml', qtyUsed: 250, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Rose Water Distillate Hydrosol', packPrice: 400, packSize: 1000, packUnit: 'ml', qtyUsed: 300, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Amber Glass Dropper Bottle (30ml)', packPrice: 550, packSize: 20, packUnit: 'piece', qtyUsed: 10, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Waterproof Foil Label + Shrink Band', packPrice: 180, packSize: 50, packUnit: 'piece', qtyUsed: 10, gstRatePercent: 18, isPackPriceGSTInclusive: true },
    ],
  },
  {
    id: 'resin', emoji: '🌊',
    industry: 'Resin & Molded Art',
    categoryId: 'handmade-crafts',
    name: 'Ocean Wave Epoxy Resin Coasters (Set of 4)',
    hsnCode: '3926',
    outputGSTRatePercent: 18,
    sellingPrice: 999,
    channelId: 'etsy',
    platformFeePercent: 9.5,
    platformFeeFixed: 17,
    batchSize: 4,
    failedUnits: 0,
    labourMinutes: 120,
    labourHourlyRate: 180,
    packagingPerUnit: 35,
    overheadPerBatch: 70,
    shippingPerOrder: 70,
    rtoRatePercent: 6,
    rtoLossPerReturn: 120,
    materials: [
      { name: '2:1 Crystal Art Epoxy Resin + Hardener', packPrice: 1400, packSize: 1500, packUnit: 'g', qtyUsed: 400, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Mica Pigments & White Wave Cell Paste', packPrice: 750, packSize: 100, packUnit: 'g', qtyUsed: 15, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Silicone Geode Coaster Mold Deprec.', packPrice: 480, packSize: 40, packUnit: 'piece', qtyUsed: 4, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Non-Slip Cork Backing Pads', packPrice: 120, packSize: 20, packUnit: 'piece', qtyUsed: 4, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Metallic Liquid Gold Edge Paint', packPrice: 320, packSize: 50, packUnit: 'ml', qtyUsed: 8, gstRatePercent: 18, isPackPriceGSTInclusive: true },
    ],
  },
  {
    id: 'jewellery',
    emoji: '💍',
    industry: 'Handmade Jewellery',
    categoryId: 'jewellery',
    name: 'Polymer Clay Floral Dangle Earrings',
    hsnCode: '7117',
    outputGSTRatePercent: 3,
    sellingPrice: 499,
    channelId: 'instagram_d2c',
    platformFeePercent: 1.5,
    platformFeeFixed: 0,
    batchSize: 10,
    failedUnits: 1,
    labourMinutes: 150,
    labourHourlyRate: 150,
    packagingPerUnit: 18,
    overheadPerBatch: 30,
    shippingPerOrder: 50,
    rtoRatePercent: 5,
    rtoLossPerReturn: 60,
    materials: [
      { name: 'Polymer Clay Blocks (Color Palette)', packPrice: 680, packSize: 250, packUnit: 'g', qtyUsed: 60, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Hypoallergenic 18K Gold Plated Studs', packPrice: 450, packSize: 50, packUnit: 'piece', qtyUsed: 10, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'UV Gloss Glaze & Resin Sealant', packPrice: 550, packSize: 100, packUnit: 'ml', qtyUsed: 10, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Foil-Stamped Earring Card & Backings', packPrice: 250, packSize: 100, packUnit: 'piece', qtyUsed: 10, gstRatePercent: 18, isPackPriceGSTInclusive: true },
    ],
  },
  {
    id: 'apparel',
    emoji: '🧵',
    industry: 'Textiles & Apparel',
    categoryId: 'clothing-accessories',
    name: 'Hand-Block Printed Cotton Tote Bag',
    hsnCode: '6204',
    outputGSTRatePercent: 12,
    sellingPrice: 650,
    channelId: 'shopify',
    platformFeePercent: 2,
    platformFeeFixed: 3,
    batchSize: 5,
    failedUnits: 0,
    labourMinutes: 180,
    labourHourlyRate: 160,
    packagingPerUnit: 20,
    overheadPerBatch: 50,
    shippingPerOrder: 55,
    rtoRatePercent: 6,
    rtoLossPerReturn: 80,
    materials: [
      { name: '10oz Heavy Cotton Canvas', packPrice: 240, packSize: 1, packUnit: 'metre', qtyUsed: 3, gstRatePercent: 5, isPackPriceGSTInclusive: true },
      { name: 'Natural Azo-Free Indigo & Earth Dye', packPrice: 380, packSize: 500, packUnit: 'g', qtyUsed: 100, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Reinforced Cotton Webbing Straps', packPrice: 150, packSize: 10, packUnit: 'metre', qtyUsed: 6, gstRatePercent: 12, isPackPriceGSTInclusive: true },
      { name: 'YKK Metal Zipper & Key Loop', packPrice: 180, packSize: 5, packUnit: 'piece', qtyUsed: 5, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Woven Organic Cotton Brand Label', packPrice: 120, packSize: 50, packUnit: 'piece', qtyUsed: 5, gstRatePercent: 18, isPackPriceGSTInclusive: true },
    ],
  },
  {
    id: 'food',
    emoji: '🍫',
    industry: 'Packaged Food & Snacks',
    categoryId: 'food-bakery',
    name: 'Roasted Peri Peri Makhana Snack Pouch (100g)',
    hsnCode: '1904',
    outputGSTRatePercent: 12,
    sellingPrice: 199,
    channelId: 'amazon',
    platformFeePercent: 12,
    platformFeeFixed: 15,
    batchSize: 10,
    failedUnits: 0,
    labourMinutes: 45,
    labourHourlyRate: 150,
    packagingPerUnit: 12,
    overheadPerBatch: 40,
    shippingPerOrder: 60,
    rtoRatePercent: 6,
    rtoLossPerReturn: 80,
    materials: [
      { name: 'Grade 6-Suta Jumbo Foxnuts (Makhana)', packPrice: 850, packSize: 1000, packUnit: 'g', qtyUsed: 1100, gstRatePercent: 5, isPackPriceGSTInclusive: true },
      { name: 'Cold Pressed Groundnut Oil', packPrice: 280, packSize: 1000, packUnit: 'ml', qtyUsed: 120, gstRatePercent: 5, isPackPriceGSTInclusive: true },
      { name: 'Gourmet Peri Peri Seasoning Mix', packPrice: 320, packSize: 500, packUnit: 'g', qtyUsed: 150, gstRatePercent: 12, isPackPriceGSTInclusive: true },
      { name: 'Nitrogen-Flushed Standup Pouch', packPrice: 180, packSize: 25, packUnit: 'piece', qtyUsed: 10, gstRatePercent: 18, isPackPriceGSTInclusive: true },
    ],
  },
  {
    id: 'jesmonite',
    emoji: '🪴',
    industry: 'Jesmonite & Plaster',
    categoryId: 'home-decor-lifestyle',
    name: 'Fluted Jesmonite Succulent Planter',
    hsnCode: '6815',
    outputGSTRatePercent: 18,
    sellingPrice: 549,
    channelId: 'etsy',
    platformFeePercent: 9.5,
    platformFeeFixed: 17,
    batchSize: 4,
    failedUnits: 0,
    labourMinutes: 90,
    labourHourlyRate: 150,
    packagingPerUnit: 25,
    overheadPerBatch: 50,
    shippingPerOrder: 68,
    rtoRatePercent: 5,
    rtoLossPerReturn: 110,
    materials: [
      { name: 'Jesmonite AC100 Base & Liquid Duo', packPrice: 2400, packSize: 3500, packUnit: 'g', qtyUsed: 1200, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Mineral Terracotta Pigment Paste', packPrice: 420, packSize: 100, packUnit: 'g', qtyUsed: 25, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Penetrating Acrylic Stone Sealer', packPrice: 600, packSize: 500, packUnit: 'ml', qtyUsed: 80, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Silicone Non-Scratch Base Bumpers', packPrice: 80, packSize: 40, packUnit: 'piece', qtyUsed: 16, gstRatePercent: 18, isPackPriceGSTInclusive: true },
    ],
  },
  {
    id: 'woodcraft',
    emoji: '🪵',
    industry: 'Woodcraft & Decor',
    categoryId: 'handmade-crafts',
    name: 'Custom Laser-Engraved Wooden Nameplate',
    hsnCode: '4421',
    outputGSTRatePercent: 12,
    sellingPrice: 1299,
    channelId: 'amazon',
    platformFeePercent: 12,
    platformFeeFixed: 15,
    batchSize: 2,
    failedUnits: 0,
    labourMinutes: 60,
    labourHourlyRate: 200,
    packagingPerUnit: 35,
    overheadPerBatch: 80,
    shippingPerOrder: 70,
    rtoRatePercent: 4,
    rtoLossPerReturn: 140,
    materials: [
      { name: 'Kiln-Dried Teakwood Plank (12x4")', packPrice: 650, packSize: 2, packUnit: 'piece', qtyUsed: 2, gstRatePercent: 12, isPackPriceGSTInclusive: true },
      { name: 'Laser Tube & Machine Run Time', packPrice: 3500, packSize: 100, packUnit: 'piece', qtyUsed: 2, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Golden Mirror Acrylic Lettering', packPrice: 380, packSize: 4, packUnit: 'piece', qtyUsed: 2, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Natural Beeswax Wood Polish', packPrice: 320, packSize: 250, packUnit: 'ml', qtyUsed: 30, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      { name: 'Heavy-Duty Brass Keyhole Hooks', packPrice: 60, packSize: 10, packUnit: 'piece', qtyUsed: 4, gstRatePercent: 18, isPackPriceGSTInclusive: true },
    ],
  },
];

const BLANK_MATERIAL = {
  name: '',
  packPrice: 0,
  packSize: 1,
  packUnit: 'g',
  qtyUsed: 0,
  gstRatePercent: 18,
  isPackPriceGSTInclusive: true,
};

const BLANK_FORM: BatchInput = {
  productName: '',
  productType: 'physical',
  hsnCode: '',
  materials: [BLANK_MATERIAL],
  batchSize: 10,
  failedUnits: 0,
  labourMinutes: 0,
  labourHourlyRate: 150,
  packagingPerUnit: 0,
  overheadPerBatch: 0,
  sellingPrice: 0,
  channelId: 'shopify',
  platformFeePercent: 2,
  platformFeeFixed: 0,
  gstOnPlatformFeePercent: 18,
  shippingPerOrder: 0,
  adSpendPerUnit: 0,
  rtoRatePercent: 0,
  rtoLossPerReturn: 0,
  isGSTRegistered: false,
  claimITC: false,
  supplyType: 'intra-state',
  outputGSTRatePercent: 18,
  isPriceGSTInclusive: true,
  monthlyFixedCost: 10000,
};

function CalculatorContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const productParam = searchParams.get('product');
  const subCategoryParam = searchParams.get('subCategory') || searchParams.get('preset');

  const [activeCategoryId, setActiveCategoryId] = useState<string>('candles-fragrance');
  const [activeSubCategoryId, setActiveSubCategoryId] = useState<string>('');
  const [productType, setProductType] = useState<'physical' | 'digital' | 'service'>('physical');
  const [activePhysicalPresetId, setActivePhysicalPresetId] = useState<string>('candle');
  const [activeDigitalPresetId, setActiveDigitalPresetId] = useState<string>('');
  const [selectedCourier, setSelectedCourier] = useState('custom');
  const [materials, setMaterials] = useState<Material[]>(INITIAL_MATERIALS);
  const [form, setForm] = useState<BatchInput>(INITIAL_FORM);
  const [targetUnits, setTargetUnits] = useState(30);
  const [wholesaleMOQ, setWholesaleMOQ] = useState(25);
  const [scaleMultiplier, setScaleMultiplier] = useState(5);
  const [isHSNModalOpen, setIsHSNModalOpen] = useState(false);
  const [hsnSearch, setHsnSearch] = useState('');
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [csvImportMode, setCsvImportMode] = useState<'replace' | 'append'>('replace');
  const [csvParseError, setCsvParseError] = useState('');
  const [simulatedUnits, setSimulatedUnits] = useState(50);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  function recalc(f: BatchInput, m: Material[]) {
    if (!f.productName.trim() || f.batchSize <= 0) return;
    const res = calculateBatchCost({ ...f, materials: m });
    setResult(res);
  }

  function loadCategoryTemplate(catId: string, customTitle?: string) {
    if (typeof window !== 'undefined' && catId !== 'blank') {
      try {
        localStorage.setItem('checkmargin_preferred_category', catId);
      } catch {
        // ignore storage errors
      }
    }

    if (catId === 'blank') {
      setActiveCategoryId('blank');
      setProductType('physical');
      setMaterials([{ ...BLANK_MATERIAL }]);
      setForm({ ...BLANK_FORM });
      setSelectedCourier('custom');
      setResult(null);
      return;
    }

    const cat = getBusinessCategory(catId);
    setActiveCategoryId(cat.id);
    setProductType(cat.defaultProductType);
    const starterMaterials = cat.starterInput.materials.map((m) => ({ ...m }));
    setMaterials(starterMaterials);
    const updatedForm: BatchInput = {
      ...cat.starterInput,
      productName: customTitle || cat.starterInput.productName,
      materials: starterMaterials,
    };
    setForm(updatedForm);
    setSelectedCourier(
      cat.starterInput.channelId === 'amazon'
        ? 'amazon_ats'
        : cat.defaultProductType === 'digital'
        ? 'custom'
        : 'shiprocket'
    );
    recalc(updatedForm, starterMaterials);
  }

  // Load from searchParams, user profile, or neutral starter (avoid silent candle default)
  useEffect(() => {
    if (categoryParam === 'blank') {
      queueMicrotask(() => loadCategoryTemplate('blank'));
      return;
    }
    if (subCategoryParam) {
      const physicalPreset = PHYSICAL_PRESETS.find((p) => p.id === subCategoryParam);
      if (physicalPreset) {
        queueMicrotask(() => {
          setActiveCategoryId(physicalPreset.categoryId || 'candles-fragrance');
          setActiveSubCategoryId(physicalPreset.id);
          loadPhysicalPreset(physicalPreset);
        });
        return;
      }
      const digitalPreset = DIGITAL_PRESETS.find((p) => p.id === subCategoryParam);
      if (digitalPreset) {
        queueMicrotask(() => {
          setActiveCategoryId('digital-products');
          setActiveSubCategoryId(digitalPreset.id);
          loadDigitalPreset(digitalPreset);
        });
        return;
      }
      const foundSub = findSubCategory(subCategoryParam);
      if (foundSub) {
        queueMicrotask(() => {
          setActiveCategoryId(foundSub.parentCategoryId);
          setActiveSubCategoryId(foundSub.id);
          handleSubCategoryClick(foundSub, foundSub.parentCategory);
        });
        return;
      }
    }
    if (categoryParam) {
      queueMicrotask(() => loadCategoryTemplate(categoryParam, productParam || undefined));
      return;
    }

    async function resolveDefaultCategory() {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.profile?.business_category_id) {
            loadCategoryTemplate(
              data.profile.business_category_id,
              data.profile.custom_category_name || undefined
            );
            return;
          }
        }
      } catch {
        // unauthenticated or offline
      }

      const savedPref = typeof window !== 'undefined' ? localStorage.getItem('checkmargin_preferred_category') : null;
      if (savedPref) {
        loadCategoryTemplate(savedPref);
        return;
      }

      // Neutral batch template if unauthenticated and no param
      loadCategoryTemplate('custom', 'My Batch Product');
    }

    resolveDefaultCategory();
  }, [categoryParam, productParam]);

  function handleSubCategoryClick(sub: SubCategory, cat: BusinessCategory) {
    setActiveSubCategoryId(sub.id);
    setActiveCategoryId(cat.id);
    if (sub.presetId) {
      const physicalPreset = PHYSICAL_PRESETS.find((p) => p.id === sub.presetId);
      if (physicalPreset && sub.productType === 'physical') {
        loadPhysicalPreset(physicalPreset);
        return;
      }
      const digitalPreset = DIGITAL_PRESETS.find((p) => p.id === sub.presetId);
      if (digitalPreset && sub.productType === 'digital') {
        loadDigitalPreset(digitalPreset);
        return;
      }
    }

    setProductType(sub.productType);
    const updated: BatchInput = {
      ...form,
      productName: sub.starterProductName,
      productType: sub.productType,
      hsnCode: sub.hsnCode,
      outputGSTRatePercent: sub.defaultRate,
    };
    setForm(updated);
    recalc(updated, materials);
  }

  function handleProductTypeSwitch(type: 'physical' | 'digital' | 'service') {
    setProductType(type);
    if (type === 'digital' || type === 'service') {
      const updated: BatchInput = {
        ...form,
        productType: type,
        hsnCode: type === 'digital' ? '9984' : (form.hsnCode && form.hsnCode !== '9984' ? form.hsnCode : '9983'),
        outputGSTRatePercent: 18,
        failedUnits: 0,
        packagingPerUnit: 0,
        shippingPerOrder: 0,
        rtoRatePercent: 0,
        rtoLossPerReturn: 0,
        channelId: type === 'digital' ? 'gumroad' : 'direct',
        platformFeePercent: type === 'digital' ? 10 : 2,
        platformFeeFixed: 0,
      };
      setSelectedCourier('custom');
      setForm(updated);
      recalc(updated, materials);
    } else {
      const updated: BatchInput = {
        ...form,
        productType: 'physical',
        hsnCode: form.hsnCode && form.hsnCode !== '9984' && form.hsnCode !== '9983' ? form.hsnCode : '',
        outputGSTRatePercent: form.outputGSTRatePercent > 0 ? form.outputGSTRatePercent : 18,
        failedUnits: form.failedUnits || 1,
        packagingPerUnit: form.packagingPerUnit || 25,
        shippingPerOrder: form.shippingPerOrder || 65,
        rtoRatePercent: form.rtoRatePercent || 8,
        rtoLossPerReturn: form.rtoLossPerReturn || 90,
        channelId: form.channelId || 'amazon',
        platformFeePercent: form.platformFeePercent || 12,
        platformFeeFixed: form.platformFeeFixed || 15,
      };
      setSelectedCourier('shiprocket');
      setForm(updated);
      recalc(updated, materials);
    }
  }

  function loadPhysicalPreset(preset: (typeof PHYSICAL_PRESETS)[0]) {
    setActivePhysicalPresetId(preset.id);
    setProductType('physical');
    setMaterials(preset.materials);
    const updated: BatchInput = {
      ...form,
      productName: preset.name,
      productType: 'physical',
      hsnCode: preset.hsnCode,
      outputGSTRatePercent: preset.outputGSTRatePercent,
      sellingPrice: preset.sellingPrice,
      channelId: preset.channelId,
      platformFeePercent: preset.platformFeePercent,
      platformFeeFixed: preset.platformFeeFixed,
      batchSize: preset.batchSize,
      failedUnits: preset.failedUnits,
      labourMinutes: preset.labourMinutes,
      labourHourlyRate: preset.labourHourlyRate,
      packagingPerUnit: preset.packagingPerUnit,
      shippingPerOrder: preset.shippingPerOrder,
      overheadPerBatch: preset.overheadPerBatch,
      rtoRatePercent: preset.rtoRatePercent,
      rtoLossPerReturn: preset.rtoLossPerReturn,
    };
    setSelectedCourier(preset.channelId === 'amazon' ? 'amazon_ats' : 'shiprocket');
    setForm(updated);
    recalc(updated, preset.materials);
  }

  function loadDigitalPreset(preset: (typeof DIGITAL_PRESETS)[0]) {
    setActiveDigitalPresetId(preset.id);
    setProductType('digital');
    setMaterials(preset.materials);
    const updated: BatchInput = {
      ...form,
      productName: preset.name,
      productType: 'digital',
      hsnCode: preset.sac,
      outputGSTRatePercent: 18,
      sellingPrice: preset.sellingPrice,
      channelId: preset.channelId,
      platformFeePercent: preset.platformFeePercent,
      platformFeeFixed: preset.platformFeeFixed,
      batchSize: preset.batchSize,
      failedUnits: 0,
      labourMinutes: preset.labourMinutes,
      labourHourlyRate: preset.labourHourlyRate,
      packagingPerUnit: 0,
      shippingPerOrder: 0,
      rtoRatePercent: 0,
      rtoLossPerReturn: 0,
    };
    setSelectedCourier('custom');
    setForm(updated);
    recalc(updated, preset.materials);
  }

  function handleImportCSVData() {
    setCsvParseError('');
    if (!csvText.trim()) {
      setCsvParseError('Please paste or type CSV lines first.');
      return;
    }
    const lines = csvText.trim().split('\n');
    const parsed: typeof materials = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      // Skip header row if it contains keywords
      if (i === 0 && (line.toLowerCase().includes('material') || line.toLowerCase().includes('pack price') || line.toLowerCase().includes('ingredient'))) {
        continue;
      }

      // Split by tab or comma
      const parts = line.includes('\t') ? line.split('\t') : line.split(',');
      if (parts.length < 3) continue;

      const name = parts[0]?.trim() || `Material ${parsed.length + 1}`;
      const packPrice = parseFloat(parts[1]?.trim()) || 0;
      const packSize = parseFloat(parts[2]?.trim()) || 1;
      const packUnit = parts[3]?.trim() || 'g';
      const gstRatePercent = parts[4] !== undefined ? parseFloat(parts[4]?.trim()) || 18 : 18;
      const qtyUsed = parts[5] !== undefined ? parseFloat(parts[5]?.trim()) || 0 : 0;

      parsed.push({
        name,
        packPrice,
        packSize,
        packUnit,
        gstRatePercent,
        isPackPriceGSTInclusive: true,
        qtyUsed,
      });
    }

    if (parsed.length === 0) {
      setCsvParseError('Could not parse any valid material rows. Check format: Name, Pack Price, Pack Size, Unit, GST%, Qty Used');
      return;
    }

    const nextMaterials = csvImportMode === 'append' ? [...materials, ...parsed] : parsed;
    setMaterials(nextMaterials);
    recalc(form, nextMaterials);
    setIsCSVModalOpen(false);
    setCsvText('');
  }

  function handleCourierSelect(courierId: string) {
    setSelectedCourier(courierId);
    const courier = COURIER_RATE_OPTIONS.find((c) => c.id === courierId);
    if (courier && courier.freight > 0) {
      const updated = { ...form, shippingPerOrder: courier.freight };
      setForm(updated);
      recalc(updated, materials);
    }
  }

  function handleChannelChange(channelId: string) {
    const preset = CHANNEL_PRESETS.find((p) => p.id === channelId);
    if (preset) {
      const updated = {
        ...form,
        channelId,
        platformFeePercent: preset.feePercent,
        platformFeeFixed: preset.fixedFee,
        shippingPerOrder: productType === 'digital' ? 0 : preset.shipping,
        gstOnPlatformFeePercent: preset.gstOnFeesPercent,
      };
      setForm(updated);
      recalc(updated, materials);
    }
  }

  function handleHSNChange(selectedVal: string) {
    let code = selectedVal;
    let rate: number | undefined;

    if (selectedVal.includes('::')) {
      const parts = selectedVal.split('::');
      code = parts[0];
      rate = parseFloat(parts[2]);
    } else {
      const found = HSN_ALL_PRESETS.find((h) => h.code === code) || SAC_ALL_PRESETS.find((s) => s.code === code);
      if (found) rate = found.defaultRate;
    }

    const updated = {
      ...form,
      hsnCode: code,
      outputGSTRatePercent: rate !== undefined ? rate : form.outputGSTRatePercent,
    };
    setForm(updated);
    recalc(updated, materials);
  }

  function updateMaterial(i: number, field: string, value: string | number | boolean) {
    const updated = materials.map((m, idx) => (idx === i ? { ...m, [field]: value } : m));
    setMaterials(updated);
    recalc(form, updated);
  }

  function addMaterial() {
    const updated = [
      ...materials,
      { name: '', packPrice: 0, packSize: 1, packUnit: 'g', qtyUsed: 0, gstRatePercent: 18, isPackPriceGSTInclusive: true },
    ];
    setMaterials(updated);
  }

  function removeMaterial(i: number) {
    const updated = materials.filter((_, idx) => idx !== i);
    setMaterials(updated);
    recalc(form, updated);
  }

  async function handleSaveProduct() {
    if (!result) return;
    setSaveMessage('Saving recipe to library...');
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.productName,
          category: form.hsnCode ? `HSN ${form.hsnCode}` : 'General',
          industryGroup: productType === 'digital' ? 'Digital & Tech' : 'Candles',
          hsnCode: form.hsnCode,
          gstRate: form.outputGSTRatePercent,
          isDigital: productType === 'digital',
          unitCost: result.totalCostPerUnit,
          sellingPrice: form.sellingPrice,
          marginPercent: result.grossMarginPercent,
          saleableYield: `${result.saleableYield} / ${form.batchSize}`,
          batchInput: form,
          calculationResult: result,
        }),
      });

      if (res.ok) {
        setSaveMessage('✅ Saved to your Neon Cloud library!');
      } else {
        const data = await res.json().catch(() => ({}));
        if (data.upgradeRequired) {
          setSaveMessage(`⚠️ ${data.error}`);
        } else {
          // Fallback to local storage if unauthenticated
          const savedList = JSON.parse(
            localStorage.getItem('checkmargin_products') ||
            localStorage.getItem('makermargin_products') ||
            '[]'
          );
          const newEntry = {
            id: Date.now().toString(),
            title: form.productName,
            category: form.hsnCode ? `HSN ${form.hsnCode}` : 'General',
            unitCost: `₹${result.totalCostPerUnit.toFixed(2)}`,
            sellingPrice: `₹${form.sellingPrice.toFixed(2)}`,
            margin: `${result.grossMarginPercent.toFixed(1)}%`,
            saleableYield: `${result.saleableYield} / ${form.batchSize}`,
            date: new Date().toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            isCustom: true,
          };
          savedList.unshift(newEntry);
          localStorage.setItem('checkmargin_products', JSON.stringify(savedList));
          setSaveMessage('Saved to local library (log in to sync to cloud)!');
        }
      }
      setTimeout(() => setSaveMessage(''), 4500);
    } catch {
      setSaveMessage('Saved in current session.');
      setTimeout(() => setSaveMessage(''), 4000);
    }
  }

  function handlePrint() {
    window.print();
  }

  function handleExportCSV() {
    if (!result) return;
    const rows = [
      ['CheckMargin - Product Costing Summary'],
      ['Product Name', form.productName],
      ['HSN Code', form.hsnCode || ''],
      ['Batch Size', form.batchSize.toString()],
      ['Saleable Yield', result.saleableYield.toString()],
      ['Yield Efficiency', `${result.yieldEfficiencyPercent.toFixed(1)}%`],
      [''],
      ['COST COMPONENT', 'AMOUNT PER UNIT (INR)'],
      ['Direct Materials (ex-tax or gross)', result.materialCostPerUnit.toFixed(2)],
      ['Direct Craft Labour', result.labourCostPerUnit.toFixed(2)],
      ['Packaging & Inserts', form.packagingPerUnit.toFixed(2)],
      ['Batch Overhead Allocation', result.overheadPerUnit.toFixed(2)],
      ['Total Direct Cost per Unit', result.totalDirectCostPerUnit.toFixed(2)],
      [''],
      ['Platform & Commission Fee', result.platformFeeRaw.toFixed(2)],
      ['18% GST on Platform Services', result.gstOnPlatformFee.toFixed(2)],
      ['Seller-Paid Shipping', result.shippingCostPerUnit.toFixed(2)],
      ['CAC / Ad Spend per Unit', result.adSpendPerUnit.toFixed(2)],
      ['RTO & Return Reserve', result.rtoAllowancePerUnit.toFixed(2)],
      ['Total Selling & Channel Costs', result.totalSellingCostPerUnit.toFixed(2)],
      [''],
      ['TRUE TOTAL COST PER UNIT', result.totalCostPerUnit.toFixed(2)],
      ['Customer Selling Price', form.sellingPrice.toFixed(2)],
      ['Taxable Value (ex-Output GST)', result.gst.taxableValue.toFixed(2)],
      ['Output GST Collected', result.gst.outputGSTTotal.toFixed(2)],
      ['Eligible Input Tax Credit (ITC)', result.gst.eligibleITC.toFixed(2)],
      ['Net GST Cash Payable to Govt', result.gst.netGSTPayable.toFixed(2)],
      ['NET PROFIT PER UNIT', result.grossProfitPerUnit.toFixed(2)],
      ['GROSS MARGIN %', `${result.grossMarginPercent.toFixed(2)}%`],
      [''],
      ['MONTHLY BREAK-EVEN'],
      ['Monthly Fixed Costs', `INR ${result.monthlyFixedCost}`],
      ['Break-even Volume Required', `${result.breakEvenUnitsPerMonth} units`],
      ['Break-even Revenue Required', `INR ${result.breakEvenRevenuePerMonth.toFixed(2)}`],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${form.productName.replace(/\s+/g, '_')}_Costing.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const activeCategory = getBusinessCategory(activeCategoryId);
  const prices = result
    ? suggestPrices(
        result.totalDirectCostPerUnit,
        [30, 50, 100],
        [25, 40, 60],
        {
          platformFeePercent: form.platformFeePercent,
          platformFeeFixed: form.platformFeeFixed,
          gstOnPlatformFeePercent: form.gstOnPlatformFeePercent ?? 18,
          shippingPerOrder: form.shippingPerOrder,
          adSpendPerUnit: form.adSpendPerUnit,
          rtoRatePercent: form.rtoRatePercent,
          rtoLossPerReturn: form.rtoLossPerReturn,
          packagingPerUnit: form.packagingPerUnit,
          isGSTRegistered: form.isGSTRegistered,
          claimITC: form.claimITC,
          outputGSTRatePercent: form.outputGSTRatePercent,
          isPriceGSTInclusive: form.isPriceGSTInclusive,
        }
      )
    : [];
  const shoppingList = result
    ? generateShoppingList(materials, targetUnits, result.saleableYield, form.batchSize)
    : [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 print:p-0 print:max-w-none">
      {/* Header and Quick Presets */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs print:border-none print:p-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
              <Calculator className="w-3.5 h-3.5" />
              <span>Advanced Batch & GST Costing Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Batch Cost & Margin Calculator
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              End-to-end unit economics: wholesale packs, scrap yield, platform commissions, RTO loss, and Indian GST Input/Output reconciliation.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <button
              onClick={handleSaveProduct}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl border border-slate-300 shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-indigo-600" />
              <span>Save to Library</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl border border-slate-300 shadow-xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {saveMessage && (
          <div className="mt-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 py-2 rounded-xl">
            {saveMessage}
          </div>
        )}
      </div>

      {/* Top Real-time Executive KPI Banner */}
      {result && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              True Unit Cost
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{result.totalCostPerUnit.toFixed(2)}
            </div>
            <span className="text-[11px] font-semibold text-slate-400 mt-1 block">
              Direct: ₹{result.totalDirectCostPerUnit.toFixed(2)} | Selling: ₹{result.totalSellingCostPerUnit.toFixed(2)}
            </span>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Customer Price
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{form.sellingPrice}
            </div>
            <span className="text-[11px] font-semibold text-indigo-600 mt-1 block">
              Taxable: ₹{result.gst.taxableValue.toFixed(2)} ({form.isPriceGSTInclusive ? 'GST Incl.' : 'GST Excl.'})
            </span>
          </div>

          <div className={`border-2 rounded-2xl p-5 shadow-xs ${result.grossProfitPerUnit >= 0 ? 'bg-emerald-50/70 border-emerald-300' : 'bg-rose-50/70 border-rose-300'}`}>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Net Profit / Unit
            </span>
            <div className={`text-2xl sm:text-3xl font-black ${result.grossProfitPerUnit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              ₹{result.grossProfitPerUnit.toFixed(2)}
            </div>
            <span className={`text-[11px] font-bold mt-1 block ${result.grossProfitPerUnit >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
              Net Margin: {result.grossMarginPercent.toFixed(1)}% | Markup: {result.markupPercent.toFixed(0)}%
            </span>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Monthly Break-Even
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {result.breakEvenUnitsPerMonth} <span className="text-base font-bold text-slate-400">units</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
              Covers ₹{result.monthlyFixedCost.toLocaleString('en-IN')}/mo fixed overhead
            </span>
          </div>
        </div>
      )}

      {/* Inputs Form */}
      <div className="space-y-6">
        {/* Section 1: Product Format, Title & Tax Classification */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
          {/* Format Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Product Type</span>
              <h2 className="font-black text-slate-900 text-lg">Choose What You Are Costing</h2>
            </div>
            
            <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleProductTypeSwitch('physical')}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  productType === 'physical'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>📦 Physical Goods</span>
              </button>
              <button
                type="button"
                onClick={() => handleProductTypeSwitch('digital')}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  productType === 'digital'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Laptop className="w-4 h-4" />
                <span>💻 Digital Downloads & Software</span>
              </button>
              <button
                type="button"
                onClick={() => handleProductTypeSwitch('service')}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  productType === 'service'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>🛠️ Craft Service / Workshop</span>
              </button>
            </div>
          </div>

          {/* Broad Business Category Bar */}
          <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Select Business Category Starter Template:
                </span>
              </div>
              <button
                type="button"
                onClick={() => loadCategoryTemplate('blank')}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeCategoryId === 'blank'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                }`}
              >
                <span>✨ Start Blank Product</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {BUSINESS_CATEGORIES.map((cat) => {
                const isActive = activeCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => loadCategoryTemplate(cat.id)}
                    className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer relative ${
                      isActive
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm ring-2 ring-indigo-500/20'
                        : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base">{cat.icon}</span>
                      {cat.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-indigo-100 text-indigo-700'
                        }`}>
                          {cat.badge}
                        </span>
                      )}
                    </div>
                    <div className={`font-bold truncate text-[11px] ${isActive ? 'text-white' : 'text-slate-900'}`}>
                      {cat.name}
                    </div>
                    <div className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>
                      {cat.defaultProductType === 'digital' ? 'Digital Asset' : 'Batch Production'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sub-Categories for Selected Business Category */}
            {activeCategoryId !== 'blank' && activeCategory && activeCategory.subCategories && activeCategory.subCategories.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      {activeCategory.name} — Main Sub-Categories:
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Select a sub-category to load its verified wholesale BOM, HSN & tax terms
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {activeCategory.subCategories.map((sub) => {
                    const isSubActive =
                      activeSubCategoryId === sub.id ||
                      (form.hsnCode === sub.hsnCode && form.productName.toLowerCase().includes(sub.shortName.toLowerCase()));
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => handleSubCategoryClick(sub, activeCategory)}
                        className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                          isSubActive
                            ? 'bg-indigo-50 border-indigo-400 text-indigo-900 shadow-xs ring-2 ring-indigo-500/20'
                            : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-base">{sub.icon}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                            HSN {sub.hsnCode}
                          </span>
                        </div>
                        <div className="font-bold truncate text-[11px] text-slate-900">{sub.name}</div>
                        <div className="text-[10px] truncate text-slate-500 mt-0.5">{sub.starterProductName}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <p className="text-[11px] text-slate-500 mt-2.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>
                Category starter templates load initial demo values. Every material, quantity, labour, platform fee, and GST rate remains 100% customizable and independent per product.
              </span>
            </p>
          </div>

          {/* Digital Presets Bar */}
          {productType === 'digital' && (
            <div className="mb-6 p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-black text-indigo-950 uppercase tracking-wider">
                    Quick-Load Digital Creator Presets:
                  </span>
                </div>
                <span className="text-[11px] text-indigo-700 font-semibold">
                  Zero freight, zero packaging, zero scrap allowance
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {DIGITAL_PRESETS.map((p) => {
                  const isActive = activeDigitalPresetId === p.id && form.productName === p.name;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => loadDigitalPreset(p)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm ring-2 ring-indigo-500/20'
                          : 'bg-white hover:bg-indigo-100 border-indigo-200 text-indigo-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-base">{p.emoji}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          SAC {p.sac}
                        </span>
                      </div>
                      <div className={`font-bold truncate text-[11px] ${isActive ? 'text-white' : 'text-slate-900'}`}>
                        {p.name.split('(')[0].trim()}
                      </div>
                      <div className={`text-[10px] font-semibold mt-0.5 ${isActive ? 'text-indigo-200' : 'text-indigo-600'}`}>
                        ₹{p.sellingPrice} MSRP
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">1</span>
            <h3 className="font-bold text-slate-900 text-base">
              {productType === 'digital' ? 'Digital Asset Identity & SAC Classification' : 'Product Identity & Tax Category (HSN)'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {productType === 'digital' ? 'Digital Product / Asset Name' : 'Physical Product Title'}
              </label>
              <input
                type="text"
                value={form.productName}
                onChange={(e) => {
                  const updated = { ...form, productName: e.target.value };
                  setForm(updated);
                  recalc(updated, materials);
                }}
                placeholder={productType === 'digital' ? 'e.g. Notion Minimalist Habit Tracker & OS' : 'e.g. 200g Lavender Soy Jar Candle'}
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-4 py-2.5 font-bold text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {productType === 'digital' ? 'Service Accounting Code (SAC)' : 'HSN Classification'}
              </label>
              <select
                value={
                  (() => {
                    const pool = productType === 'digital' ? SAC_ALL_PRESETS : HSN_ALL_PRESETS;
                    const matched = pool.find((p) => p.code === form.hsnCode && p.defaultRate === form.outputGSTRatePercent);
                    if (matched) return `${matched.code}::${matched.name}::${matched.defaultRate}`;
                    const byCode = pool.find((p) => p.code === form.hsnCode);
                    if (byCode) return `${byCode.code}::${byCode.name}::${byCode.defaultRate}`;
                    return form.hsnCode;
                  })()
                }
                onChange={(e) => handleHSNChange(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {productType === 'digital'
                  ? Object.entries(
                      SAC_ALL_PRESETS.reduce<Record<string, typeof SAC_ALL_PRESETS>>((acc, item) => {
                        (acc[item.industry] = acc[item.industry] || []).push(item);
                        return acc;
                      }, {})
                    ).map(([industry, items]) => (
                      <optgroup key={industry} label={industry}>
                        {items.map((s, idx) => (
                          <option key={`${s.code}-${idx}`} value={`${s.code}::${s.name}::${s.defaultRate}`}>
                            SAC {s.code} - {s.name} ({s.defaultRate}%)
                          </option>
                        ))}
                      </optgroup>
                    ))
                  : Object.entries(
                      HSN_ALL_PRESETS.reduce<Record<string, typeof HSN_ALL_PRESETS>>((acc, item) => {
                        (acc[item.industry] = acc[item.industry] || []).push(item);
                        return acc;
                      }, {})
                    ).map(([industry, items]) => (
                      <optgroup key={industry} label={industry}>
                        {items.map((h, idx) => (
                          <option key={`${h.code}-${idx}`} value={`${h.code}::${h.name}::${h.defaultRate}`}>
                            HSN {h.code} - {h.name} ({h.defaultRate}%)
                          </option>
                        ))}
                      </optgroup>
                    ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Recipe Materials & Input GST */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">2</span>
              <h2 className="font-bold text-slate-900 text-lg">Bill of Materials (BOM) & Input GST</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCSVModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl border border-slate-300 shadow-2xs transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-600" />
                <span>Import / Paste CSV</span>
              </button>
              <button
                type="button"
                onClick={addMaterial}
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3.5 py-2 rounded-xl border border-indigo-200 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Material Line</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-500 mb-6">
            Enter wholesale pack purchase price and size. CheckMargin extracts the exact batch fraction and isolates the Input GST paid for tax credit (ITC) reconciliation.
          </p>

          <div className="overflow-x-auto -mx-6 md:mx-0 px-6 md:px-0">
            <div className="min-w-[840px] space-y-3">
              <div className="grid grid-cols-12 gap-3 text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                <div className="col-span-3">Material / Ingredient</div>
                <div className="col-span-2">Pack Price (₹)</div>
                <div className="col-span-2">Pack Size & Unit</div>
                <div className="col-span-2">Input GST %</div>
                <div className="col-span-2">Qty in Batch</div>
                <div className="col-span-1 text-right">Delete</div>
              </div>

              {materials.map((m, i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 gap-3 items-center bg-slate-50 border border-slate-200 rounded-xl p-3 hover:border-slate-300 transition-all"
                >
                  <div className="col-span-3">
                    <input
                      type="text"
                      placeholder="e.g. Soy Wax"
                      value={m.name}
                      onChange={(e) => updateMaterial(i, 'name', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="800"
                      value={m.packPrice || ''}
                      onChange={(e) => updateMaterial(i, 'packPrice', parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2 flex gap-1.5">
                    <input
                      type="number"
                      placeholder="1000"
                      value={m.packSize || ''}
                      onChange={(e) => updateMaterial(i, 'packSize', parseFloat(e.target.value) || 1)}
                      className="w-20 bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <select
                      value={m.packUnit}
                      onChange={(e) => updateMaterial(i, 'packUnit', e.target.value)}
                      className="flex-1 bg-white border border-slate-300 rounded-lg px-1.5 py-2 text-xs font-bold text-slate-700"
                    >
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                      <option value="L">L</option>
                      <option value="piece">pcs</option>
                      <option value="metre">m</option>
                      <option value="pack">pack</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <select
                      value={m.gstRatePercent ?? 18}
                      onChange={(e) => updateMaterial(i, 'gstRatePercent', parseFloat(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2 py-2 text-xs font-bold text-slate-700"
                    >
                      <option value="0">0% (Exempt)</option>
                      <option value="5">5% Input GST</option>
                      <option value="12">12% Input GST</option>
                      <option value="18">18% Input GST</option>
                      <option value="28">28% Input GST</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="150"
                      value={m.qtyUsed || ''}
                      onChange={(e) => updateMaterial(i, 'qtyUsed', parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-black text-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-1 text-right">
                    {materials.length > 1 && (
                      <button
                        onClick={() => removeMaterial(i)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete line"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Batch Production & Usable Yield */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">3</span>
            <h2 className="font-bold text-slate-900 text-lg">Batch Production Volume & Scrap Yield</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Total Batch Size (Units Made)
              </label>
              <input
                type="number"
                value={form.batchSize || ''}
                onChange={(e) => {
                  const updated = { ...form, batchSize: parseFloat(e.target.value) || 0 };
                  setForm(updated);
                  recalc(updated, materials);
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-slate-900 text-base"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Failed / Defective Scrap Units
              </label>
              <input
                type="number"
                value={form.failedUnits}
                onChange={(e) => {
                  const updated = { ...form, failedUnits: parseFloat(e.target.value) || 0 };
                  setForm(updated);
                  recalc(updated, materials);
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-rose-700 text-base"
              />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Saleable Yield</span>
              <span className="text-2xl font-black text-indigo-700">
                {Math.max(form.batchSize - form.failedUnits, 0)} units
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                Yield Efficiency: {form.batchSize > 0 ? (((form.batchSize - form.failedUnits) / form.batchSize) * 100).toFixed(0) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Direct Labour, Packaging & Studio Overhead */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">4</span>
            <h2 className="font-bold text-slate-900 text-lg">Labour, Packaging & Studio Overhead</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Batch Labour (Minutes)
              </label>
              <input
                type="number"
                value={form.labourMinutes || ''}
                onChange={(e) => {
                  const updated = { ...form, labourMinutes: parseFloat(e.target.value) || 0 };
                  setForm(updated);
                  recalc(updated, materials);
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-slate-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Hourly Wage (₹ / Hour)
              </label>
              <input
                type="number"
                value={form.labourHourlyRate || ''}
                onChange={(e) => {
                  const updated = { ...form, labourHourlyRate: parseFloat(e.target.value) || 0 };
                  setForm(updated);
                  recalc(updated, materials);
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-slate-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Packaging / Unit (₹)
              </label>
              <input
                type="number"
                value={form.packagingPerUnit || ''}
                onChange={(e) => {
                  const updated = { ...form, packagingPerUnit: parseFloat(e.target.value) || 0 };
                  setForm(updated);
                  recalc(updated, materials);
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-slate-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Overhead / Batch (₹)
              </label>
              <input
                type="number"
                value={form.overheadPerBatch || ''}
                onChange={(e) => {
                  const updated = { ...form, overheadPerBatch: parseFloat(e.target.value) || 0 };
                  setForm(updated);
                  recalc(updated, materials);
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-slate-900 text-sm"
              />
            </div>
            <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3">
              <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wider mb-1">
                Studio Monthly Fixed (₹)
              </label>
              <input
                type="number"
                value={form.monthlyFixedCost ?? 15000}
                onChange={(e) => {
                  const updated = { ...form, monthlyFixedCost: parseFloat(e.target.value) || 0 };
                  setForm(updated);
                  recalc(updated, materials);
                }}
                className="w-full bg-white border border-indigo-300 rounded-lg px-3 py-1.5 font-bold text-indigo-900 text-sm focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[10px] text-indigo-700 block mt-1">Rent, Wi-Fi & fixed overhead</span>
            </div>
          </div>
        </div>

        {/* Section 5: Sales Channel, Logistics & RTO */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">5</span>
              <h2 className="font-bold text-slate-900 text-lg">
                {productType === 'digital' ? 'Selling Platform, Gateway Commission & CAC' : 'Sales Channel, Logistics & RTO Loss Reserve'}
              </h2>
            </div>
            {/* Channel Preset Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Channel Preset:</span>
              <select
                value={form.channelId}
                onChange={(e) => handleChannelChange(e.target.value)}
                className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-lg"
              >
                {CHANNEL_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Physical: Courier Rate Selector */}
          {productType === 'physical' ? (
            <div className="mb-5 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Verified Courier Shipping Rates:
                  </span>
                </div>
                <Link
                  href="/compare"
                  target="_blank"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                >
                  <span>Compare all courier charges & delivery zones</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                {COURIER_RATE_OPTIONS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCourierSelect(c.id)}
                    className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                      selectedCourier === c.id
                        ? 'bg-white border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span className="truncate">{c.name.split('(')[0].trim()}</span>
                      {c.freight > 0 && <span className="text-indigo-600 font-black">₹{c.freight}</span>}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">{c.tag}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-emerald-900 uppercase tracking-wider">Zero Physical Logistics & Zero RTO Loss</h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Digital templates, 3D STLs, and ebooks are delivered instantly via automated download link or email. Shipping freight is ₹0, packaging is ₹0, and customer returns do not incur reverse courier freight or damaged packaging loss.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Customer Selling Price (₹)
              </label>
              <input
                type="number"
                value={form.sellingPrice || ''}
                onChange={(e) => {
                  const updated = { ...form, sellingPrice: parseFloat(e.target.value) || 0 };
                  setForm(updated);
                  recalc(updated, materials);
                }}
                className="w-full bg-white border-2 border-indigo-500 rounded-xl px-4 py-2.5 font-black text-indigo-950 text-base"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Platform Fee (%) + Fixed (₹)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="%"
                  value={form.platformFeePercent}
                  onChange={(e) => {
                    const updated = { ...form, platformFeePercent: parseFloat(e.target.value) || 0 };
                    setForm(updated);
                    recalc(updated, materials);
                  }}
                  className="w-1/2 bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold"
                />
                <input
                  type="number"
                  placeholder="₹ fixed"
                  value={form.platformFeeFixed}
                  onChange={(e) => {
                    const updated = { ...form, platformFeeFixed: parseFloat(e.target.value) || 0 };
                    setForm(updated);
                    recalc(updated, materials);
                  }}
                  className="w-1/2 bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">+18% GST charged on platform fee</span>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {productType === 'digital' ? 'Digital Delivery Freight' : 'Seller-Paid Shipping (₹)'}
              </label>
              {productType === 'digital' ? (
                <div className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-500 text-sm">
                  ₹0 (Instant Download)
                </div>
              ) : (
                <input
                  type="number"
                  value={form.shippingPerOrder}
                  onChange={(e) => {
                    const updated = { ...form, shippingPerOrder: parseFloat(e.target.value) || 0 };
                    setForm(updated);
                    recalc(updated, materials);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-slate-900 text-sm"
                />
              )}
              <span className="text-[10px] text-slate-400 mt-1 block">
                {productType === 'digital' ? 'Delivered via web or email' : 'Logistics cost if free delivery'}
              </span>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Ad Spend / CAC (₹)
              </label>
              <input
                type="number"
                value={form.adSpendPerUnit}
                onChange={(e) => {
                  const updated = { ...form, adSpendPerUnit: parseFloat(e.target.value) || 0 };
                  setForm(updated);
                  recalc(updated, materials);
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-slate-900 text-sm"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Meta / Google ads acquisition</span>
            </div>
          </div>

          {/* RTO / Returns Protection (Physical Only) */}
          {productType === 'physical' && (
            <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Expected RTO / Customer Return Rate (%)
                </label>
                <input
                  type="number"
                  value={form.rtoRatePercent}
                  onChange={(e) => {
                    const updated = { ...form, rtoRatePercent: parseFloat(e.target.value) || 0 };
                    setForm(updated);
                    recalc(updated, materials);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Indian e-com COD average: 8%–15%</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Average Loss per RTO / Damaged Return (₹)
                </label>
                <input
                  type="number"
                  value={form.rtoLossPerReturn}
                  onChange={(e) => {
                    const updated = { ...form, rtoLossPerReturn: parseFloat(e.target.value) || 0 };
                    setForm(updated);
                    recalc(updated, materials);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Unrecoverable reverse courier + scrap pack</span>
              </div>
            </div>
          )}
        </div>

        {/* Section 6: Full GST Operating Center (Input, Output, ITC) */}
        <div className="bg-white border-2 border-indigo-200 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-slate-900 text-lg">Indian GST Operating Center & ITC Reconciliation</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsHSNModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer w-fit"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Explore Craft GST & HSN Directory</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-800">
                  <input
                    type="checkbox"
                    checked={form.isGSTRegistered}
                    onChange={(e) => {
                      const updated = { ...form, isGSTRegistered: e.target.checked };
                      setForm(updated);
                      recalc(updated, materials);
                    }}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span>GST Registered Seller</span>
                </label>
                <p className="text-[11px] text-slate-400 mt-1">If uncheck, selling price is full revenue and input tax is a sunk cost.</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-800">
                  <input
                    type="checkbox"
                    checked={form.claimITC}
                    disabled={!form.isGSTRegistered}
                    onChange={(e) => {
                      const updated = { ...form, claimITC: e.target.checked };
                      setForm(updated);
                      recalc(updated, materials);
                    }}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span>Claim Input Tax Credit (ITC)</span>
                </label>
                <p className="text-[11px] text-slate-400 mt-1">Offsets raw material GST against output tax owed.</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Output GST Rate
              </label>
              <select
                value={form.outputGSTRatePercent}
                disabled={!form.isGSTRegistered}
                onChange={(e) => {
                  const updated = { ...form, outputGSTRatePercent: parseFloat(e.target.value) || 0 };
                  setForm(updated);
                  recalc(updated, materials);
                }}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
              >
                <option value="0">0% (Nil / Exempt)</option>
                <option value="5">5% Concessional Rate</option>
                <option value="12">12% Standard Rate</option>
                <option value="18">18% Standard Rate</option>
                <option value="28">28% Luxury Rate</option>
              </select>
              <label className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPriceGSTInclusive}
                  onChange={(e) => {
                    const updated = { ...form, isPriceGSTInclusive: e.target.checked };
                    setForm(updated);
                    recalc(updated, materials);
                  }}
                  className="w-3.5 h-3.5 rounded"
                />
                <span>Price is GST-Inclusive</span>
              </label>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Supply Destination
              </label>
              <select
                value={form.supplyType}
                disabled={!form.isGSTRegistered}
                onChange={(e) => {
                  const updated = { ...form, supplyType: e.target.value as any };
                  setForm(updated);
                  recalc(updated, materials);
                }}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
              >
                <option value="intra-state">Intra-State (CGST + SGST)</option>
                <option value="inter-state">Inter-State (IGST)</option>
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {form.supplyType === 'intra-state' ? 'Split 50% Center, 50% State' : '100% IGST'}
              </span>
            </div>
          </div>

          {/* Real-time GST Statement Table */}
          {result && form.isGSTRegistered && (
            <div className="bg-slate-900 text-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Tax Reconciliation Summary (Per Unit)
                </span>
                <span className="text-xs text-slate-400">HSN: {form.hsnCode} ({form.outputGSTRatePercent}%)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Taxable Sales Value:</span>
                  <span className="text-base font-black text-white">₹{result.gst.taxableValue.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Output GST Collected:</span>
                  <span className="text-base font-black text-amber-400">₹{result.gst.outputGSTTotal.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-500 block">
                    {form.supplyType === 'intra-state'
                      ? `CGST ₹${result.gst.cgstAmount.toFixed(2)} + SGST ₹${result.gst.sgstAmount.toFixed(2)}`
                      : `IGST ₹${result.gst.igstAmount.toFixed(2)}`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Raw Material ITC Claimed:</span>
                  <span className="text-base font-black text-emerald-400">₹{result.gst.eligibleITC.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-500 block">Total Input Tax Credit</span>
                </div>
                <div className="bg-indigo-950/80 border border-indigo-700/50 p-2.5 rounded-xl">
                  <span className="text-indigo-300 block mb-0.5 font-bold">Net Cash Tax Payable:</span>
                  <span className="text-xl font-black text-white">₹{result.gst.netGSTPayable.toFixed(2)}</span>
                  <span className="text-[10px] text-indigo-300 block">Cash outflow to Govt</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comprehensive Output Section */}
      {result && (
        <div className="space-y-8 pt-4">
          {/* Detailed Cost Summary Card */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
            <h3 className="text-xl font-black text-slate-900 mb-6">
              Complete Cost & Fee Schedule per Saleable Unit
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Materials</span>
                <div className="text-base font-black text-slate-900 mt-0.5">₹{result.materialCostPerUnit.toFixed(2)}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Direct Labour</span>
                <div className="text-base font-black text-slate-900 mt-0.5">₹{result.labourCostPerUnit.toFixed(2)}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Packaging</span>
                <div className="text-base font-black text-slate-900 mt-0.5">₹{form.packagingPerUnit.toFixed(2)}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Platform + GST</span>
                <div className="text-base font-black text-slate-900 mt-0.5">₹{result.totalPlatformFeePerUnit.toFixed(2)}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Shipping + RTO</span>
                <div className="text-base font-black text-slate-900 mt-0.5">₹{(result.shippingCostPerUnit + result.rtoAllowancePerUnit).toFixed(2)}</div>
              </div>
              <div className="bg-indigo-600 text-white rounded-xl p-3">
                <span className="text-[10px] font-bold text-indigo-200 uppercase">True Cost / Unit</span>
                <div className="text-lg font-black mt-0.5">₹{result.totalCostPerUnit.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Visual Selling Price Anatomy & Margin Bar */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-xl font-black text-slate-900">Selling Price Anatomy & Margin Distribution</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visual breakdown of where every rupee of your ₹{form.sellingPrice} selling price goes:
                </p>
              </div>
              <span className={`text-xs font-black px-3 py-1 rounded-full ${
                result.grossProfitPerUnit >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {result.grossMarginPercent.toFixed(1)}% Net Margin
              </span>
            </div>

            {/* Visual Multi-Segment Bar */}
            {(() => {
              const sp = Math.max(form.sellingPrice, 1);
              const matPct = Math.min((result.materialCostPerUnit / sp) * 100, 100);
              const labPct = Math.min((result.labourCostPerUnit / sp) * 100, 100);
              const packPct = Math.min((form.packagingPerUnit / sp) * 100, 100);
              const feePct = Math.min((result.totalPlatformFeePerUnit / sp) * 100, 100);
              const shipPct = Math.min(((result.shippingCostPerUnit + result.rtoAllowancePerUnit) / sp) * 100, 100);
              const profitPct = Math.max(0, (result.grossProfitPerUnit / sp) * 100);

              return (
                <div>
                  <div className="w-full h-7 bg-slate-100 rounded-xl overflow-hidden flex shadow-inner mb-4">
                    {matPct > 0 && (
                      <div
                        style={{ width: `${matPct}%` }}
                        className="bg-amber-400 h-full flex items-center justify-center text-[10px] font-black text-amber-950 truncate px-1"
                        title={`Materials: ₹${result.materialCostPerUnit.toFixed(2)} (${matPct.toFixed(1)}%)`}
                      >
                        {matPct > 6 ? `${matPct.toFixed(0)}%` : ''}
                      </div>
                    )}
                    {labPct > 0 && (
                      <div
                        style={{ width: `${labPct}%` }}
                        className="bg-sky-400 h-full flex items-center justify-center text-[10px] font-black text-sky-950 truncate px-1"
                        title={`Labour: ₹${result.labourCostPerUnit.toFixed(2)} (${labPct.toFixed(1)}%)`}
                      >
                        {labPct > 6 ? `${labPct.toFixed(0)}%` : ''}
                      </div>
                    )}
                    {packPct > 0 && (
                      <div
                        style={{ width: `${packPct}%` }}
                        className="bg-purple-400 h-full flex items-center justify-center text-[10px] font-black text-purple-950 truncate px-1"
                        title={`Packaging: ₹${form.packagingPerUnit.toFixed(2)} (${packPct.toFixed(1)}%)`}
                      >
                        {packPct > 6 ? `${packPct.toFixed(0)}%` : ''}
                      </div>
                    )}
                    {feePct > 0 && (
                      <div
                        style={{ width: `${feePct}%` }}
                        className="bg-rose-400 h-full flex items-center justify-center text-[10px] font-black text-rose-950 truncate px-1"
                        title={`Platform & GST: ₹${result.totalPlatformFeePerUnit.toFixed(2)} (${feePct.toFixed(1)}%)`}
                      >
                        {feePct > 6 ? `${feePct.toFixed(0)}%` : ''}
                      </div>
                    )}
                    {shipPct > 0 && (
                      <div
                        style={{ width: `${shipPct}%` }}
                        className="bg-orange-400 h-full flex items-center justify-center text-[10px] font-black text-orange-950 truncate px-1"
                        title={`Shipping & RTO: ₹${(result.shippingCostPerUnit + result.rtoAllowancePerUnit).toFixed(2)} (${shipPct.toFixed(1)}%)`}
                      >
                        {shipPct > 6 ? `${shipPct.toFixed(0)}%` : ''}
                      </div>
                    )}
                    {profitPct > 0 && (
                      <div
                        style={{ width: `${profitPct}%` }}
                        className="bg-emerald-500 h-full flex items-center justify-center text-[10px] font-black text-white truncate px-1"
                        title={`Net Profit: ₹${result.grossProfitPerUnit.toFixed(2)} (${profitPct.toFixed(1)}%)`}
                      >
                        {profitPct > 6 ? `${profitPct.toFixed(0)}%` : ''}
                      </div>
                    )}
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
                      <div>
                        <span className="text-slate-500 block text-[11px]">Materials</span>
                        <strong className="text-slate-900 font-bold">₹{result.materialCostPerUnit.toFixed(1)} ({matPct.toFixed(0)}%)</strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-sky-400 shrink-0" />
                      <div>
                        <span className="text-slate-500 block text-[11px]">Labour</span>
                        <strong className="text-slate-900 font-bold">₹{result.labourCostPerUnit.toFixed(1)} ({labPct.toFixed(0)}%)</strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-purple-400 shrink-0" />
                      <div>
                        <span className="text-slate-500 block text-[11px]">Packaging</span>
                        <strong className="text-slate-900 font-bold">₹{form.packagingPerUnit.toFixed(1)} ({packPct.toFixed(0)}%)</strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-400 shrink-0" />
                      <div>
                        <span className="text-slate-500 block text-[11px]">Platform + GST</span>
                        <strong className="text-slate-900 font-bold">₹{result.totalPlatformFeePerUnit.toFixed(1)} ({feePct.toFixed(0)}%)</strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-orange-400 shrink-0" />
                      <div>
                        <span className="text-slate-500 block text-[11px]">Freight + RTO</span>
                        <strong className="text-slate-900 font-bold">₹{(result.shippingCostPerUnit + result.rtoAllowancePerUnit).toFixed(1)} ({shipPct.toFixed(0)}%)</strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                      <div>
                        <span className="text-slate-500 block text-[11px]">Net Profit</span>
                        <strong className={`font-bold ${result.grossProfitPerUnit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                          ₹{result.grossProfitPerUnit.toFixed(1)} ({profitPct.toFixed(0)}%)
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Cross-Channel Profit Comparison Hub */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-xl font-black text-slate-900">Cross-Channel Profit Comparison</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  See how selling this product at ₹{form.sellingPrice} impacts your take-home cash across different sales channels:
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                Simulated on Current Recipe
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Sales Channel</th>
                    <th className="pb-3">Commission & Fees</th>
                    <th className="pb-3">Logistics / Delivery</th>
                    <th className="pb-3">Net Profit / Unit</th>
                    <th className="pb-3">Net Margin</th>
                    <th className="pb-3 text-right">Profit on 50 Units</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { id: 'amazon', name: 'Amazon India (Easy Ship)', feePct: 12, fixed: 15, ship: 65 },
                    { id: 'flipkart', name: 'Flipkart Marketplace', feePct: 13, fixed: 15, ship: 65 },
                    { id: 'meesho', name: 'Meesho (0% Commission)', feePct: 0, fixed: 0, ship: 60 },
                    { id: 'shopify', name: 'Own Website (Shopify/Razorpay)', feePct: 2, fixed: 3, ship: 55 },
                    { id: 'instagram_d2c', name: 'Instagram Direct / WhatsApp (UPI)', feePct: 1.5, fixed: 0, ship: 50 },
                    { id: 'fleamarket', name: 'Offline Pop-up / Flea Market', feePct: 0, fixed: 0, ship: 0 },
                  ].map((ch) => {
                    const sp = form.sellingPrice;
                    const feeRaw = (sp * ch.feePct) / 100 + ch.fixed;
                    const feeGST = feeRaw * 0.18;
                    const totalChannelCost = feeRaw + feeGST;
                    const shipping = productType === 'digital' ? 0 : ch.ship;
                    const totalCost = result.totalDirectCostPerUnit + totalChannelCost + shipping + (productType === 'digital' ? 0 : result.rtoAllowancePerUnit);
                    const netRevenue = form.isGSTRegistered && form.outputGSTRatePercent > 0
                      ? form.isPriceGSTInclusive
                        ? sp / (1 + form.outputGSTRatePercent / 100)
                        : sp
                      : sp;
                    const profit = netRevenue - totalCost;
                    const margin = netRevenue > 0 ? (profit / netRevenue) * 100 : 0;
                    const profit50 = profit * 50;

                    return (
                      <tr key={ch.id} className={`hover:bg-slate-50 transition-colors ${form.channelId === ch.id ? 'bg-indigo-50/40 font-semibold' : ''}`}>
                        <td className="py-3.5">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{ch.name}</span>
                            {form.channelId === ch.id && (
                              <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">Current</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 text-slate-600">
                          ₹{totalChannelCost.toFixed(1)} <span className="text-[10px] text-slate-400">({ch.feePct}% + ₹{ch.fixed})</span>
                        </td>
                        <td className="py-3.5 text-slate-600">
                          {shipping > 0 ? `₹${shipping.toFixed(0)}` : '₹0 (Self/Digital)'}
                        </td>
                        <td className={`py-3.5 font-bold ${profit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                          ₹{profit.toFixed(2)}
                        </td>
                        <td className="py-3.5">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                            margin >= 40 ? 'bg-emerald-100 text-emerald-800' : margin >= 20 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {margin.toFixed(1)}%
                          </span>
                        </td>
                        <td className={`py-3.5 text-right font-black ${profit50 >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                          ₹{profit50.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Monthly Sales & Cash Flow Simulator */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-indigo-800/60">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full mb-2">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Interactive Monthly Business Planning</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">Monthly Sales & Take-Home Cash Simulator</h3>
                <p className="text-xs text-indigo-200 mt-0.5">
                  Drag the slider to project total monthly revenue, production outflows, studio overhead, and net founder profit:
                </p>
              </div>

              {/* Slider Input */}
              <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-2xl border border-white/15">
                <span className="text-xs text-indigo-300 font-bold">Monthly Target:</span>
                <span className="text-xl font-black text-white">{simulatedUnits}</span>
                <span className="text-xs text-indigo-300">units/mo</span>
              </div>
            </div>

            <div className="mb-8">
              <input
                type="range"
                min={5}
                max={500}
                step={5}
                value={simulatedUnits}
                onChange={(e) => setSimulatedUnits(parseInt(e.target.value) || 5)}
                className="w-full accent-indigo-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-semibold">
                <span>5 units</span>
                <span>Break-Even: {result.breakEvenUnitsPerMonth} units</span>
                <span>250 units</span>
                <span>500 units</span>
              </div>
            </div>

            {(() => {
              const grossRevenue = simulatedUnits * form.sellingPrice;
              const directCosts = simulatedUnits * result.totalDirectCostPerUnit;
              const fixedOverhead = result.monthlyFixedCost;
              const netMonthlyCash = (simulatedUnits * result.grossProfitPerUnit) - fixedOverhead;
              const isBreakEvenMet = simulatedUnits >= result.breakEvenUnitsPerMonth;

              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Gross Monthly Revenue
                    </span>
                    <span className="text-xl font-black text-white">
                      ₹{grossRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-[10px] text-indigo-300 block mt-0.5">₹{form.sellingPrice}/unit</span>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Direct Making Outflow
                    </span>
                    <span className="text-xl font-black text-slate-300">
                      ₹{directCosts.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">BOM + Labour + Packaging</span>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Fixed Studio Overhead
                    </span>
                    <span className="text-xl font-black text-slate-300">
                      ₹{fixedOverhead.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Rent & studio expenses</span>
                  </div>

                  <div className={`border rounded-2xl p-4 ${isBreakEvenMet ? 'bg-emerald-950/70 border-emerald-500/50' : 'bg-rose-950/70 border-rose-500/50'}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-slate-300">
                      Net Monthly Take-Home Cash
                    </span>
                    <span className={`text-2xl font-black ${isBreakEvenMet ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {netMonthlyCash >= 0 ? '+' : ''}₹{netMonthlyCash.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                    <span className={`text-[10px] font-bold block mt-0.5 ${isBreakEvenMet ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {isBreakEvenMet ? '✅ Profitable operation' : `⚠️ Need ${result.breakEvenUnitsPerMonth - simulatedUnits} more units`}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* GST Statutory Compliance & Action Plan Card */}
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-500/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-indigo-800/60">
              <div>
                <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full mb-2 border border-indigo-400/30">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Indian GST Statutory Compliance & Filing Roadmap</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  GST Action Plan for {form.productName || 'Your Product'}
                </h3>
                <p className="text-xs text-indigo-200 mt-1">
                  Deterministic statutory compliance roadmap based on {productType === 'digital' ? 'Digital Download / OIDAR Services' : 'Physical Goods'} regulations under CGST & IGST Acts.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/gst-guide"
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-indigo-950 hover:bg-indigo-50 px-4 py-2.5 rounded-xl shadow-md transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Open Full GST Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
              {/* Statutory Classification */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">
                  Legal Classification
                </span>
                <div className="text-base font-black text-white">
                  {productType === 'digital'
                    ? 'OIDAR Digital Service'
                    : productType === 'service'
                    ? 'Bespoke Craft / Production Service'
                    : 'Tangible Physical Goods'}
                </div>
                <span className="text-[11px] text-slate-300 block mt-1">
                  {productType === 'digital' || productType === 'service'
                    ? form.hsnCode
                      ? `SAC ${form.hsnCode} (Services Tariff)`
                      : 'SAC Unclassified (Services Tariff)'
                    : form.hsnCode
                    ? `HSN ${form.hsnCode} (Sec 2(52) CGST)`
                    : 'HSN Unclassified (Sec 2(52) CGST)'}
                </span>
              </div>

              {/* Turnover Threshold */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">
                  Turnover Threshold
                </span>
                <div className="text-base font-black text-white">
                  {productType === 'digital' ? '₹20 Lakhs / Year' : '₹40 Lakhs / Year'}
                </div>
                <span className="text-[11px] text-slate-300 block mt-1">
                  {productType === 'digital'
                    ? 'Services limit (₹10L in NE states)'
                    : 'Intra-state goods limit (Notfn 10/2019)'}
                </span>
              </div>

              {/* Inter-State / Channel Rule */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">
                  Channel & Inter-State Rule
                </span>
                <div className="text-base font-black text-amber-300">
                  {form.channelId === 'amazon' || form.channelId === 'meesho'
                    ? 'Mandatory GSTIN'
                    : form.supplyType === 'inter-state'
                    ? 'Mandatory (Inter-state)'
                    : 'Exempt Under Limit'}
                </div>
                <span className="text-[11px] text-slate-300 block mt-1">
                  {form.channelId === 'amazon'
                    ? 'Marketplace TCS requires GSTIN (Sec 52)'
                    : form.supplyType === 'inter-state'
                    ? 'Section 24(i) removes turnover exemption'
                    : 'Valid for intra-state D2C / offline sales'}
                </span>
              </div>

              {/* E-Way Bill Rule */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">
                  E-Way Bill Requirement
                </span>
                <div className="text-base font-black text-emerald-300">
                  {productType === 'digital' ? '100% Exempt' : 'Mandatory > ₹50,000'}
                </div>
                <span className="text-[11px] text-slate-300 block mt-1">
                  {productType === 'digital'
                    ? 'Rule 138(14) - zero transit paperwork'
                    : 'Rule 138 consignment threshold'}
                </span>
              </div>
            </div>

            {/* Filing Calendar & Export under LUT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-indigo-800/60 text-xs">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-indigo-300 font-bold">
                  <Receipt className="w-4 h-4 text-indigo-400" />
                  <span>Statutory Filing Calendar & Penalties</span>
                </div>
                <p className="text-slate-300">
                  • <strong className="text-white">GSTR-1 (Outward Supplies):</strong> File monthly by 11th (or quarterly by 13th under QRMP scheme).
                </p>
                <p className="text-slate-300">
                  • <strong className="text-white">GSTR-3B (Tax Payment):</strong> File monthly by 20th (or 22nd/24th of quarter under QRMP).
                </p>
                <p className="text-amber-300">
                  • <strong className="text-amber-200">Late Fee Penalties:</strong> ₹20/day (NIL returns) or ₹50/day (with tax liability) up to ₹5,000 max cap per return + 18% annual interest under Section 50.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-indigo-300 font-bold">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>{productType === 'digital' ? 'Zero-Rated Global Export via LUT' : 'Rule 46 Tax Invoice Checklist'}</span>
                </div>
                {productType === 'digital' ? (
                  <>
                    <p className="text-slate-300">
                      • <strong className="text-white">Letter of Undertaking (LUT):</strong> Export digital downloads (Gumroad/Etsy/PayPal) to international buyers at <strong className="text-emerald-300">0% GST</strong> without paying upfront IGST.
                    </p>
                    <p className="text-slate-300">
                      • <strong className="text-white">100% ITC Refund:</strong> You can claim full tax refund for input GST paid on software subscriptions (Adobe, Notion, Canva, cloud hosting).
                    </p>
                    <p className="text-slate-300">
                      • <strong className="text-white">FIRC / BRC:</strong> Maintain foreign remittance certificates from Stripe/PayPal as legal export proof.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-slate-300">
                      • <strong className="text-white">Rule 46 Tax Invoice:</strong> Must include 16-character alphanumeric sequential serial number, GSTIN, HSN Code, Customer Shipping Address, and Tax breakups (CGST+SGST or IGST).
                    </p>
                    <p className="text-slate-300">
                      • <strong className="text-white">B2C vs B2B:</strong> For B2C orders under ₹50,000, recipient state name is sufficient. For B2B, buyer GSTIN is mandatory to pass on ITC.
                    </p>
                    <p className="text-slate-300">
                      • <strong className="text-white">Delivery Challan:</strong> Use Rule 55 Delivery Challan for exhibition displays or sample transfers without sale.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Scenarios */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xl font-black text-slate-900">Recommended Selling Price Scenarios</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Direct cost per unit is ₹{result.totalDirectCostPerUnit.toFixed(2)}. Compare how different markup and target gross margin targets impact your retail price:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Pricing Formula</th>
                    <th className="pb-3">Target %</th>
                    <th className="pb-3">Suggested Price</th>
                    <th className="pb-3">Net Profit / Unit</th>
                    <th className="pb-3">Gross Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {prices.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-semibold text-slate-800">
                        {p.method === 'markup' ? '📈 Cost Markup' : '🎯 Target Gross Margin'}
                      </td>
                      <td className="py-3 font-bold text-indigo-700">{p.value}%</td>
                      <td className="py-3 text-base font-black text-slate-900">
                        {p.isAttainable !== false ? (
                          `₹${p.suggestedPrice.toFixed(0)}`
                        ) : (
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                            Unattainable
                          </span>
                        )}
                      </td>
                      <td className="py-3 font-bold text-emerald-700">
                        {p.isAttainable !== false ? `₹${p.profitPerUnit.toFixed(2)}` : '—'}
                      </td>
                      <td className="py-3 font-semibold text-slate-600">
                        {p.isAttainable !== false ? (
                          `${p.marginPercent.toFixed(1)}%`
                        ) : (
                          <span className="text-xs text-slate-400">Fees exceed margin</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Wholesale vs Retail Tier Matrix (B2B vs D2C) */}
          {result && (() => {
            const wholesale = calculateWholesaleTiers(result.totalDirectCostPerUnit, form.sellingPrice, wholesaleMOQ);
            return (
              <div className="bg-white border-2 border-indigo-100 rounded-3xl p-6 md:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-xl font-black text-slate-900">
                        Wholesale (B2B) vs Retail (D2C) Pricing Matrix
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      The craft pricing benchmark: <strong className="text-slate-700">Cost × 2 = Wholesale</strong> (50% Maker margin) and <strong className="text-slate-700">Wholesale × 2 = MSRP</strong> (50% Retailer margin).
                    </p>
                  </div>

                  {/* MOQ Controller */}
                  <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-xl px-3.5 py-2">
                    <span className="text-xs font-bold text-indigo-900">Minimum Order Qty (MOQ):</span>
                    <input
                      type="number"
                      min={1}
                      value={wholesaleMOQ}
                      onChange={(e) => setWholesaleMOQ(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 bg-white border border-indigo-300 rounded-lg px-2 py-1 text-xs font-black text-center text-indigo-700 shadow-xs"
                    />
                    <span className="text-xs font-semibold text-indigo-600">units</span>
                  </div>
                </div>

                {/* Wholesale KPI cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Direct Cost / Unit
                    </span>
                    <span className="text-xl font-black text-slate-900">
                      ₹{wholesale.directCostPerUnit.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Base floor to make</span>
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200">
                    <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                      Wholesale Price (2×)
                    </span>
                    <span className="text-xl font-black text-indigo-700">
                      ₹{wholesale.wholesalePrice.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-indigo-600 block mt-0.5 font-semibold">
                      +{wholesale.makerMarginPercent.toFixed(1)}% Maker margin
                    </span>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
                    <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block mb-1">
                      Retail MSRP (4×)
                    </span>
                    <span className="text-xl font-black text-purple-900">
                      ₹{wholesale.suggestedMSRP.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-purple-600 block mt-0.5 font-semibold">
                      +{wholesale.retailerMarginPercent.toFixed(1)}% Stockist margin
                    </span>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                      MOQ Gross Profit ({wholesale.suggestedMOQ} units)
                    </span>
                    <span className="text-xl font-black text-emerald-700">
                      ₹{wholesale.moqGrossProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-emerald-600 block mt-0.5 font-semibold">
                      Order Value: ₹{wholesale.moqOrderValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Wholesale Tiers Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <th className="pb-3">Channel / Tier</th>
                        <th className="pb-3">Multiplier</th>
                        <th className="pb-3">Unit Price</th>
                        <th className="pb-3">Your Profit / Unit</th>
                        <th className="pb-3">Your Margin %</th>
                        <th className="pb-3">Recommended For</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {wholesale.tiers.map((t, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 font-bold text-slate-900">
                            <div>{t.name}</div>
                            <div className="text-[11px] text-slate-400 font-normal">{t.description}</div>
                          </td>
                          <td className="py-3 font-bold text-indigo-600">{t.multiplier}×</td>
                          <td className="py-3 text-base font-black text-slate-900">₹{t.price.toFixed(2)}</td>
                          <td className="py-3 font-bold text-emerald-700">₹{t.profitPerUnit.toFixed(2)}</td>
                          <td className="py-3 font-semibold text-slate-700">{t.marginPercent.toFixed(1)}%</td>
                          <td className="py-3 text-xs text-slate-500">{t.recommendedFor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {/* Section: 1-Click Batch Multiplier & Scaler Tool */}
          {result && (() => {
            const scaled = scaleBatch(form, result, scaleMultiplier);
            return (
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <Scale className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-xl font-black text-slate-900">
                        1-Click Batch Multiplier & Labour Efficiency Scaler
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      See how scaling up production from {form.batchSize} units to {scaled.batchSize} units reduces direct cost per unit via economies of scale.
                    </p>
                  </div>

                  {/* Multiplier Presets */}
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                    {[1, 2, 5, 10, 25].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setScaleMultiplier(m)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          scaleMultiplier === m
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                        }`}
                      >
                        {m}×
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Scaled Batch</span>
                    <div className="text-base font-black text-slate-900 mt-0.5">{scaled.batchSize} units</div>
                    <span className="text-[10px] text-slate-500">Yield: {scaled.saleableYield} units</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Bulk Material Spend</span>
                    <div className="text-base font-black text-slate-900 mt-0.5">₹{scaled.totalMaterialCost.toFixed(0)}</div>
                    <span className="text-[10px] text-slate-500">Linear scaling</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Craft Labour</span>
                    <div className="text-base font-black text-slate-900 mt-0.5">{scaled.labourMinutes} mins</div>
                    <span className="text-[10px] text-emerald-600 font-semibold">Prep efficiency curve</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Total Run Cost</span>
                    <div className="text-base font-black text-slate-900 mt-0.5">₹{scaled.totalDirectBatchCost.toFixed(0)}</div>
                    <span className="text-[10px] text-slate-500">Direct production</span>
                  </div>

                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase">New Cost / Unit</span>
                    <div className="text-lg font-black text-indigo-700 mt-0.5">₹{scaled.costPerSaleableUnit.toFixed(2)}</div>
                    <span className="text-[10px] text-slate-400 line-through">Base: ₹{result.totalDirectCostPerUnit.toFixed(2)}</span>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase">Savings / Unit</span>
                    <div className="text-lg font-black text-emerald-700 mt-0.5">₹{scaled.savingsPerUnit.toFixed(2)}</div>
                    <span className="text-[10px] text-emerald-600 font-bold">-{scaled.savingsPercent.toFixed(1)}% reduction</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>
                      At {scaleMultiplier}× batch size, you save <strong className="text-slate-900">₹{(scaled.savingsPerUnit * scaled.saleableYield).toFixed(2)}</strong> across the production run thanks to setup consolidation.
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-600 hidden sm:inline">
                    Higher Profit Margin Unlocked
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Ready-to-Order Bulk Shopping List */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-xl font-black text-slate-900">Ready-To-Order Shopping List</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Supplier pack sizes rounded upward, incorporating your {form.failedUnits > 0 ? (((form.failedUnits) / form.batchSize) * 100).toFixed(0) : 0}% scrap rate allowance.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <span className="text-xs font-bold text-slate-600">Target Production:</span>
                <input
                  type="number"
                  value={targetUnits}
                  onChange={(e) => setTargetUnits(parseInt(e.target.value) || 1)}
                  className="w-16 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-center text-indigo-700"
                />
                <span className="text-xs font-medium text-slate-500">saleable units</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Material</th>
                    <th className="pb-3">Exact Quantity</th>
                    <th className="pb-3">Supplier Packs to Order</th>
                    <th className="pb-3 text-right">Estimated Cash Outflow</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shoppingList.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-semibold text-slate-800">{item.name}</td>
                      <td className="py-3 text-slate-600 font-medium">
                        {item.qtyNeeded} {item.packUnit}
                      </td>
                      <td className="py-3">
                        <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-md border border-indigo-200">
                          {item.packsNeeded} pack{item.packsNeeded > 1 ? 's' : ''} (₹{item.packPrice}/pack)
                        </span>
                      </td>
                      <td className="py-3 text-right font-bold text-slate-900">₹{item.estimatedCost.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-slate-200 bg-slate-50 font-black">
                    <td colSpan={3} className="py-3.5 px-3 text-slate-900">Total Upfront Material Investment Required</td>
                    <td className="py-3.5 px-3 text-right text-indigo-700 text-base">
                      ₹{shoppingList.reduce((acc, it) => acc + it.estimatedCost, 0).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Indian GST & HSN Reference Directory Modal */}
      {isHSNModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Indian Craft GST & HSN Directory</h3>
                  <p className="text-xs text-slate-500">Official classification rates and Input Tax Credit (ITC) rules for makers</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsHSNModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-slate-100 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search HSN code, product category (e.g. candle, soap, resin, bakery, apparel)..."
                  value={hsnSearch}
                  onChange={(e) => setHsnSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Modal Body List */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {HSN_DIRECTORY.filter((item) => {
                const q = hsnSearch.toLowerCase();
                return (
                  item.hsnCode.toLowerCase().includes(q) ||
                  item.productCategory.toLowerCase().includes(q) ||
                  item.applicableItems.some((it) => it.toLowerCase().includes(q))
                );
              }).map((item) => (
                <div
                  key={item.hsnCode}
                  className="border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200">
                        HSN {item.hsnCode}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{item.productCategory}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800">
                        {item.gstRatePercent}% GST
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = {
                            ...form,
                            hsnCode: item.hsnCode.split('/')[0].trim(),
                            outputGSTRatePercent: item.gstRatePercent,
                          };
                          setForm(updated);
                          recalc(updated, materials);
                          setIsHSNModalOpen(false);
                        }}
                        className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Apply to Form
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {item.applicableItems.map((sub, i) => (
                      <span key={i} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {sub}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs space-y-1 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p><strong className="text-slate-800">ITC Rule:</strong> {item.itcEligibility}</p>
                    <p className="text-slate-500 text-[11px]"><strong className="text-slate-700">2025 Notes:</strong> {item.notes2025}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>⚠️ For formal GST filing and tax advice, always consult your Chartered Accountant (CA).</span>
              <button
                type="button"
                onClick={() => setIsHSNModalOpen(false)}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl font-bold text-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV / Excel Material Import Modal */}
      {isCSVModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Import Materials from CSV / Excel</h3>
                  <p className="text-xs text-slate-500">Paste spreadsheet rows from Excel, Google Sheets, or CSV</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCSVModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600">
                <p className="font-bold text-slate-800 mb-1">Expected Format (Comma or Tab Separated):</p>
                <p className="font-mono text-[11px] text-slate-700">
                  Material Name, Pack Price, Pack Size, Unit, Input GST %, Quantity Used
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Example: <code className="bg-white px-1 rounded border">Pure Coconut Oil, 420, 1000, ml, 5, 400</code></p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Paste Spreadsheet Lines
                </label>
                <textarea
                  rows={6}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder="Paste rows copied directly from Google Sheets or Excel..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {csvParseError && (
                <div className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3">
                  {csvParseError}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-semibold">
                    <input
                      type="radio"
                      name="importMode"
                      checked={csvImportMode === 'replace'}
                      onChange={() => setCsvImportMode('replace')}
                    />
                    <span>Replace current materials</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-semibold">
                    <input
                      type="radio"
                      name="importMode"
                      checked={csvImportMode === 'append'}
                      onChange={() => setCsvImportMode('append')}
                    />
                    <span>Append to existing</span>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCsvText(
                      `Pure Coconut Oil, 420, 1000, ml, 5, 400\nExtra Virgin Olive Oil, 850, 1000, ml, 5, 350\nRaw Shea Butter, 650, 500, g, 18, 150\nLye Beads, 220, 1000, g, 18, 130`
                    );
                  }}
                  className="text-xs text-indigo-600 hover:underline font-semibold"
                >
                  Load Sample CSV
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCSVModalOpen(false)}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl font-bold text-xs text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportCSVData}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer"
              >
                Import to Recipe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CalculatorPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto py-16 text-center text-slate-500 font-medium">
          Loading Batch Cost & Pricing Calculator...
        </div>
      }
    >
      <CalculatorContent />
    </Suspense>
  );
}

