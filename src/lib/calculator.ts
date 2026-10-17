// CheckMargin Core Calculation Engine
// Pure functions — deterministic, transparent, and comprehensive

export interface Material {
  name: string;
  packPrice: number;        // price paid per pack (₹)
  packSize: number;         // size of pack
  packUnit: string;         // 'g' | 'kg' | 'ml' | 'L' | 'piece' | 'metre' | 'pack'
  qtyUsed: number;          // quantity used per batch (same unit)
  gstRatePercent?: number;  // input GST on this material (e.g. 0, 5, 12, 18)
  isPackPriceGSTInclusive?: boolean; // whether packPrice includes GST (default true)
}

export interface ChannelPreset {
  id: string;
  name: string;
  feePercent: number;
  fixedFee: number;
  shipping: number;
  gstOnFeesPercent: number; // usually 18% on marketplace commission
  notes: string;
}

export const CHANNEL_PRESETS: ChannelPreset[] = [
  {
    id: 'amazon',
    name: 'Amazon India (Easy Ship)',
    feePercent: 12,
    fixedFee: 15,
    shipping: 65,
    gstOnFeesPercent: 18,
    notes: 'Avg 12% referral + ₹15 closing + ₹65 shipping + 18% GST on services',
  },
  {
    id: 'meesho',
    name: 'Meesho (0% Commission)',
    feePercent: 0,
    fixedFee: 0,
    shipping: 60,
    gstOnFeesPercent: 18,
    notes: '0% platform fee, seller pays return & logistics charges',
  },
  {
    id: 'etsy',
    name: 'Etsy India (Domestic)',
    feePercent: 9.5, // 6.5% transaction + 3% payment
    fixedFee: 17,    // ~$0.20 listing fee
    shipping: 70,
    gstOnFeesPercent: 18,
    notes: '6.5% transaction + 3% payment + ₹17 listing + 18% GST',
  },
  {
    id: 'shopify',
    name: 'Own Website (Razorpay/Shopify)',
    feePercent: 2,   // 2% gateway fee
    fixedFee: 3,     // gateway flat fee
    shipping: 55,    // private 3PL courier
    gstOnFeesPercent: 18,
    notes: '2% PG fee + ₹3 flat + 3PL courier + 18% GST on PG fee',
  },
  {
    id: 'fleamarket',
    name: 'Offline Market / Pop-up Stall',
    feePercent: 0,
    fixedFee: 0,
    shipping: 0,
    gstOnFeesPercent: 0,
    notes: 'Direct in-person sales (no gateway/shipping)',
  },
  {
    id: 'gumroad',
    name: 'Gumroad (Digital Products / Global)',
    feePercent: 10,
    fixedFee: 0,
    shipping: 0,
    gstOnFeesPercent: 18,
    notes: '10% flat platform fee + gateway fee, instant digital download delivery',
  },
  {
    id: 'instamojo',
    name: 'Instamojo Digital (Domestic)',
    feePercent: 5,
    fixedFee: 3,
    shipping: 0,
    gstOnFeesPercent: 18,
    notes: '5% platform fee + ₹3 flat fee for digital file delivery',
  },
  {
    id: 'custom',
    name: 'Custom Channel',
    feePercent: 0,
    fixedFee: 0,
    shipping: 0,
    gstOnFeesPercent: 18,
    notes: 'User configurable rates',
  },
];

export interface BatchInput {
  productName: string;
  productType?: 'physical' | 'digital';
  hsnCode?: string;         // e.g. '3406'
  materials: Material[];
  batchSize: number;        // total units made
  failedUnits: number;      // units that didn't pass quality inspection
  labourMinutes: number;    // total batch craft labour in minutes
  labourHourlyRate: number; // ₹ per hour
  packagingPerUnit: number; // ₹ per saleable unit (boxes, inserts, labels)
  overheadPerBatch: number; // studio rent, heating, tools depreciation per batch
  
  // Selling & Marketing
  sellingPrice: number;     // customer facing price
  channelId?: string;       // preset ID
  platformFeePercent: number;
  platformFeeFixed: number;
  gstOnPlatformFeePercent: number; // 18% GST on platform service fees
  shippingPerOrder: number; // seller-paid shipping ₹
  adSpendPerUnit: number;   // Meta/Google ads CAC allocation per unit
  rtoRatePercent: number;   // return/RTO rate % (e.g. 5%)
  rtoLossPerReturn: number; // damaged packaging + reverse freight loss

  // Comprehensive GST Settings
  isGSTRegistered: boolean;
  claimITC: boolean;        // can claim Input Tax Credit on raw materials
  supplyType: 'intra-state' | 'inter-state'; // CGST+SGST vs IGST
  outputGSTRatePercent: number; // e.g. 5, 12, 18
  isPriceGSTInclusive: boolean;

  // Monthly overhead for break-even
  monthlyFixedCost?: number;
}

export interface GSTBreakdown {
  isRegistered: boolean;
  claimITC: boolean;
  supplyType: 'intra-state' | 'inter-state';
  hsnCode: string;
  outputRatePercent: number;
  grossSellingPrice: number;
  taxableValue: number;      // selling price ex-tax
  outputGSTTotal: number;
  cgstAmount: number;        // half of output GST if intra-state
  sgstAmount: number;        // half of output GST if intra-state
  igstAmount: number;        // full output GST if inter-state
  inputGSTTotal: number;     // tax paid on materials
  eligibleITC: number;       // recoverable tax
  netGSTPayable: number;     // cash tax owed to government
  itcCreditForward: number;  // excess credit carry forward
}

export interface CalculationResult {
  saleableYield: number;
  yieldEfficiencyPercent: number;
  
  // Materials
  totalMaterialCost: number;
  materialCostPerUnit: number;
  materialBreakdown: {
    name: string;
    baseCost: number;
    inputGST: number;
    totalCost: number;
    effectiveCostPerUnit: number;
  }[];

  // Direct Production
  labourCostPerBatch: number;
  labourCostPerUnit: number;
  packagingCostTotal: number;
  overheadPerUnit: number;
  totalDirectCostPerUnit: number;

  // Channel & Variable Selling Costs
  platformFeeRaw: number;
  gstOnPlatformFee: number;
  totalPlatformFeePerUnit: number;
  shippingCostPerUnit: number;
  adSpendPerUnit: number;
  rtoAllowancePerUnit: number;
  totalSellingCostPerUnit: number;

  // All-inclusive Cost
  totalCostPerUnit: number;

  // GST Reconciliation
  gst: GSTBreakdown;

  // Profitability
  realizedRevenuePerUnit: number; // after output GST
  grossProfitPerUnit: number;
  grossMarginPercent: number;
  markupPercent: number;
  contributionMarginPerUnit: number;

  // Break-even
  monthlyFixedCost: number;
  breakEvenUnitsPerMonth: number;
  breakEvenRevenuePerMonth: number;
}

export interface PriceScenario {
  method: 'markup' | 'target-margin';
  value: number; // percent
  suggestedPrice: number;
  profitPerUnit: number;
  marginPercent: number;
}

export interface ShoppingListItem {
  name: string;
  qtyNeeded: number;
  packUnit: string;
  packsNeeded: number;
  packPrice: number;
  estimatedCost: number;
}

/**
 * Core batch cost calculation with comprehensive GST, channel, and RTO modeling
 */
export function calculateBatchCost(input: BatchInput): CalculationResult {
  // 1. Saleable yield
  const batchSize = Math.max(input.batchSize, 1);
  const failedUnits = Math.min(Math.max(input.failedUnits, 0), batchSize - 1);
  const saleableYield = Math.max(batchSize - failedUnits, 1);
  const yieldEfficiencyPercent = (saleableYield / batchSize) * 100;

  // 2. Material costs with Input GST & ITC handling
  const canClaimITC = input.isGSTRegistered && input.claimITC;
  let totalInputGSTTotal = 0;

  const materialBreakdown = input.materials.map((m) => {
    const gstRate = m.gstRatePercent ?? 18;
    const isInclusive = m.isPackPriceGSTInclusive ?? true;
    const qtyRatio = m.packSize > 0 ? m.qtyUsed / m.packSize : 0;
    
    let basePackPrice = m.packPrice;
    let packGST = 0;

    if (gstRate > 0) {
      if (isInclusive) {
        basePackPrice = m.packPrice / (1 + gstRate / 100);
        packGST = m.packPrice - basePackPrice;
      } else {
        basePackPrice = m.packPrice;
        packGST = m.packPrice * (gstRate / 100);
      }
    }

    const batchBaseCost = basePackPrice * qtyRatio;
    const batchGST = packGST * qtyRatio;
    const batchTotalPaid = batchBaseCost + batchGST;

    totalInputGSTTotal += batchGST;

    // If maker claims ITC, the input GST is recovered from the government,
    // so business cost is baseCost. If unregistered, GST paid is a sunk cost.
    const effectiveBatchCost = canClaimITC ? batchBaseCost : batchTotalPaid;
    const effectiveCostPerUnit = effectiveBatchCost / saleableYield;

    return {
      name: m.name,
      baseCost: batchBaseCost,
      inputGST: batchGST,
      totalCost: batchTotalPaid,
      effectiveCostPerUnit,
    };
  });

  const totalMaterialCost = materialBreakdown.reduce((sum, m) => sum + (canClaimITC ? m.baseCost : m.totalCost), 0);
  const materialCostPerUnit = totalMaterialCost / saleableYield;

  // 3. Direct Labour
  const labourCostPerBatch = (input.labourMinutes / 60) * input.labourHourlyRate;
  const labourCostPerUnit = labourCostPerBatch / saleableYield;

  // 4. Packaging & Overhead
  const packagingCostTotal = input.packagingPerUnit * saleableYield;
  const overheadPerUnit = input.overheadPerBatch / saleableYield;

  // Total Direct Production Cost per saleable unit
  const totalDirectCostPerUnit =
    materialCostPerUnit +
    labourCostPerUnit +
    input.packagingPerUnit +
    overheadPerUnit;

  // 5. Output GST Modeling
  let taxableValue = input.sellingPrice;
  let outputGSTTotal = 0;

  if (input.isGSTRegistered && input.outputGSTRatePercent > 0) {
    if (input.isPriceGSTInclusive) {
      taxableValue = input.sellingPrice / (1 + input.outputGSTRatePercent / 100);
      outputGSTTotal = input.sellingPrice - taxableValue;
    } else {
      taxableValue = input.sellingPrice;
      outputGSTTotal = input.sellingPrice * (input.outputGSTRatePercent / 100);
    }
  }

  const isIntraState = input.supplyType === 'intra-state';
  const cgstAmount = isIntraState ? outputGSTTotal / 2 : 0;
  const sgstAmount = isIntraState ? outputGSTTotal / 2 : 0;
  const igstAmount = !isIntraState ? outputGSTTotal : 0;

  const inputGSTPerUnit = totalInputGSTTotal / saleableYield;
  const eligibleITC = canClaimITC ? inputGSTPerUnit : 0;
  const netGSTPayable = Math.max(0, outputGSTTotal - eligibleITC);
  const itcCreditForward = Math.max(0, eligibleITC - outputGSTTotal);

  const gstBreakdown: GSTBreakdown = {
    isRegistered: input.isGSTRegistered,
    claimITC: input.claimITC,
    supplyType: input.supplyType,
    hsnCode: input.hsnCode || '3406',
    outputRatePercent: input.outputGSTRatePercent,
    grossSellingPrice: input.sellingPrice,
    taxableValue,
    outputGSTTotal,
    cgstAmount,
    sgstAmount,
    igstAmount,
    inputGSTTotal: inputGSTPerUnit,
    eligibleITC,
    netGSTPayable,
    itcCreditForward,
  };

  // 6. Platform Fees with 18% GST on services
  const baseCommission = (input.sellingPrice * input.platformFeePercent) / 100 + input.platformFeeFixed;
  const gstOnPlatformFee = baseCommission * ((input.gstOnPlatformFeePercent || 18) / 100);
  const totalPlatformFeePerUnit = baseCommission + gstOnPlatformFee;

  // 7. Shipping, Ads & RTO Reserve
  const shippingCostPerUnit = input.shippingPerOrder;
  const adSpendPerUnit = input.adSpendPerUnit || 0;
  const rtoRate = (input.rtoRatePercent || 0) / 100;
  const rtoLossPerReturn = input.rtoLossPerReturn || (shippingCostPerUnit + input.packagingPerUnit);
  const rtoAllowancePerUnit = rtoRate * rtoLossPerReturn;

  const totalSellingCostPerUnit =
    totalPlatformFeePerUnit +
    shippingCostPerUnit +
    adSpendPerUnit +
    rtoAllowancePerUnit;

  // 8. Total True Cost
  const totalCostPerUnit = totalDirectCostPerUnit + totalSellingCostPerUnit;

  // 9. Realized Revenue & Profitability
  // If GST registered, GST collected belongs to the government, so net realized revenue is taxableValue.
  // If unregistered, selling price is full revenue (no tax owed).
  const realizedRevenuePerUnit = input.isGSTRegistered ? taxableValue : input.sellingPrice;
  const grossProfitPerUnit = realizedRevenuePerUnit - totalCostPerUnit;
  const grossMarginPercent =
    realizedRevenuePerUnit > 0 ? (grossProfitPerUnit / realizedRevenuePerUnit) * 100 : 0;
  const markupPercent =
    totalDirectCostPerUnit > 0
      ? ((realizedRevenuePerUnit - totalDirectCostPerUnit) / totalDirectCostPerUnit) * 100
      : 0;
  const contributionMarginPerUnit = grossProfitPerUnit;

  // 10. Break-even analysis
  const monthlyFixedCost = input.monthlyFixedCost ?? 15000;
  const breakEvenUnitsPerMonth =
    contributionMarginPerUnit > 0 ? Math.ceil(monthlyFixedCost / contributionMarginPerUnit) : 0;
  const breakEvenRevenuePerMonth = breakEvenUnitsPerMonth * input.sellingPrice;

  return {
    saleableYield,
    yieldEfficiencyPercent,
    totalMaterialCost,
    materialCostPerUnit,
    materialBreakdown,
    labourCostPerBatch,
    labourCostPerUnit,
    packagingCostTotal,
    overheadPerUnit,
    totalDirectCostPerUnit,
    platformFeeRaw: baseCommission,
    gstOnPlatformFee,
    totalPlatformFeePerUnit,
    shippingCostPerUnit,
    adSpendPerUnit,
    rtoAllowancePerUnit,
    totalSellingCostPerUnit,
    totalCostPerUnit,
    gst: gstBreakdown,
    realizedRevenuePerUnit,
    grossProfitPerUnit,
    grossMarginPercent,
    markupPercent,
    contributionMarginPerUnit,
    monthlyFixedCost,
    breakEvenUnitsPerMonth,
    breakEvenRevenuePerMonth,
  };
}

/**
 * Suggest selling prices using markup and target-margin methods
 */
export function suggestPrices(
  totalDirectCostPerUnit: number,
  markupPercents: number[] = [30, 50, 100],
  marginPercents: number[] = [25, 40, 60]
): PriceScenario[] {
  const markupScenarios: PriceScenario[] = markupPercents.map((pct) => {
    const price = totalDirectCostPerUnit * (1 + pct / 100);
    return {
      method: 'markup',
      value: pct,
      suggestedPrice: Math.round(price * 100) / 100,
      profitPerUnit: price - totalDirectCostPerUnit,
      marginPercent: (1 - totalDirectCostPerUnit / price) * 100,
    };
  });

  const marginScenarios: PriceScenario[] = marginPercents.map((pct) => {
    const price = totalDirectCostPerUnit / (1 - pct / 100);
    return {
      method: 'target-margin',
      value: pct,
      suggestedPrice: Math.round(price * 100) / 100,
      profitPerUnit: price - totalDirectCostPerUnit,
      marginPercent: pct,
    };
  });

  return [...markupScenarios, ...marginScenarios];
}

/**
 * Generate a shopping list for a target batch
 */
export function generateShoppingList(
  materials: Material[],
  targetSaleableUnits: number,
  currentBatchSaleableYield: number,
  currentBatchSize: number
): ShoppingListItem[] {
  const yieldRatio = Math.max(currentBatchSaleableYield / Math.max(currentBatchSize, 1), 0.1);
  const requiredBatchSize = Math.ceil(targetSaleableUnits / yieldRatio);

  return materials.map((m) => {
    const qtyNeeded = (m.qtyUsed / Math.max(currentBatchSize, 1)) * requiredBatchSize;
    const packsNeeded = Math.ceil(qtyNeeded / Math.max(m.packSize, 1));
    const estimatedCost = packsNeeded * m.packPrice;
    return {
      name: m.name,
      qtyNeeded: Math.round(qtyNeeded * 100) / 100,
      packUnit: m.packUnit,
      packsNeeded,
      packPrice: m.packPrice,
      estimatedCost,
    };
  });
}

export interface WholesaleTier {
  name: string;
  description: string;
  multiplier: number; // multiplier on direct cost
  price: number;
  profitPerUnit: number;
  marginPercent: number;
  recommendedFor: string;
}

export interface WholesaleCalculation {
  directCostPerUnit: number;
  suggestedMSRP: number;
  wholesalePrice: number; // 2x direct cost
  makerGrossProfitPerUnit: number;
  makerMarginPercent: number;
  retailerMarginPercent: number; // if retailer sells at MSRP
  suggestedMOQ: number;
  moqOrderValue: number;
  moqGrossProfit: number;
  tiers: WholesaleTier[];
}

/**
 * Calculates wholesale (B2B), distributor, and retail MSRP tiers with MOQ economics
 */
export function calculateWholesaleTiers(
  directCostPerUnit: number,
  targetMSRP?: number,
  customMOQ: number = 20
): WholesaleCalculation {
  const cost = Math.max(directCostPerUnit, 0.01);
  const wholesalePrice = Math.round(cost * 2 * 100) / 100; // 50% margin to maker
  const suggestedMSRP = targetMSRP && targetMSRP > wholesalePrice 
    ? targetMSRP 
    : Math.round(wholesalePrice * 2 * 100) / 100; // 50% margin to retailer (4x cost)

  const makerGrossProfitPerUnit = wholesalePrice - cost;
  const makerMarginPercent = (makerGrossProfitPerUnit / wholesalePrice) * 100;
  const retailerMarginPercent = suggestedMSRP > 0 
    ? ((suggestedMSRP - wholesalePrice) / suggestedMSRP) * 100 
    : 0;

  const moq = Math.max(customMOQ, 1);
  const moqOrderValue = Math.round(wholesalePrice * moq * 100) / 100;
  const moqGrossProfit = Math.round(makerGrossProfitPerUnit * moq * 100) / 100;

  const tiers: WholesaleTier[] = [
    {
      name: 'Bulk Stockist / Distributor',
      description: 'High volume wholesale orders (50+ units)',
      multiplier: 1.6,
      price: Math.round(cost * 1.6 * 100) / 100,
      profitPerUnit: Math.round((cost * 1.6 - cost) * 100) / 100,
      marginPercent: Math.round(((cost * 1.6 - cost) / (cost * 1.6)) * 1000) / 10,
      recommendedFor: 'Distributors, large retail chains, corporate gifting',
    },
    {
      name: 'Standard Wholesale (B2B)',
      description: 'Standard boutique & gift shop rate (2× Direct Cost)',
      multiplier: 2.0,
      price: wholesalePrice,
      profitPerUnit: Math.round(makerGrossProfitPerUnit * 100) / 100,
      marginPercent: Math.round(makerMarginPercent * 10) / 10,
      recommendedFor: 'Independent boutiques, cafes, curated concept stores',
    },
    {
      name: 'Direct to Consumer (D2C / MSRP)',
      description: 'Standard retail price on website or marketplaces (4× Cost)',
      multiplier: Math.round((suggestedMSRP / cost) * 100) / 100,
      price: suggestedMSRP,
      profitPerUnit: Math.round((suggestedMSRP - cost) * 100) / 100,
      marginPercent: Math.round(((suggestedMSRP - cost) / suggestedMSRP) * 1000) / 10,
      recommendedFor: 'Own e-commerce site, pop-ups, flea markets, Amazon',
    },
  ];

  return {
    directCostPerUnit: cost,
    suggestedMSRP,
    wholesalePrice,
    makerGrossProfitPerUnit,
    makerMarginPercent,
    retailerMarginPercent,
    suggestedMOQ: moq,
    moqOrderValue,
    moqGrossProfit,
    tiers,
  };
}

export interface ScaledBatchSummary {
  multiplier: number;
  batchSize: number;
  saleableYield: number;
  totalMaterialCost: number;
  labourMinutes: number;
  labourCost: number;
  packagingCost: number;
  overheadCost: number;
  totalDirectBatchCost: number;
  costPerSaleableUnit: number;
  savingsPerUnit: number;
  savingsPercent: number;
}

/**
 * Simulates scaling a batch up (e.g. 2x, 5x, 10x) with realistic labour efficiency curves
 */
export function scaleBatch(
  baseInput: BatchInput,
  baseResult: CalculationResult,
  multiplier: number
): ScaledBatchSummary {
  const mult = Math.max(multiplier, 1);
  const scaledBatchSize = Math.round(baseInput.batchSize * mult);
  const scrapRate = baseInput.batchSize > 0 ? baseInput.failedUnits / baseInput.batchSize : 0;
  const scaledFailedUnits = Math.round(scaledBatchSize * scrapRate);
  const scaledYield = Math.max(scaledBatchSize - scaledFailedUnits, 1);

  // Materials scale linearly
  const scaledMaterialCost = baseResult.totalMaterialCost * mult;

  // Labour exhibits economies of scale: setup and prep time are fixed,
  // so scaling by M typically takes M^0.80 time rather than M^1.0 time.
  const labourEfficiencyFactor = Math.pow(mult, 0.78);
  const scaledLabourMinutes = Math.round(baseInput.labourMinutes * labourEfficiencyFactor);
  const scaledLabourCost = (scaledLabourMinutes / 60) * baseInput.labourHourlyRate;

  // Packaging scales linearly with saleable units
  const scaledPackagingCost = baseInput.packagingPerUnit * scaledYield;

  // Overhead has both fixed and variable portions: studio rent is fixed, electricity/tools increase slightly
  const scaledOverheadCost = baseInput.overheadPerBatch * Math.pow(mult, 0.5);

  const totalDirectBatchCost =
    scaledMaterialCost + scaledLabourCost + scaledPackagingCost + scaledOverheadCost;
  const costPerSaleableUnit = totalDirectBatchCost / scaledYield;

  const baseCost = baseResult.totalDirectCostPerUnit;
  const savingsPerUnit = Math.max(0, baseCost - costPerSaleableUnit);
  const savingsPercent = baseCost > 0 ? (savingsPerUnit / baseCost) * 100 : 0;

  return {
    multiplier: mult,
    batchSize: scaledBatchSize,
    saleableYield: scaledYield,
    totalMaterialCost: Math.round(scaledMaterialCost * 100) / 100,
    labourMinutes: scaledLabourMinutes,
    labourCost: Math.round(scaledLabourCost * 100) / 100,
    packagingCost: Math.round(scaledPackagingCost * 100) / 100,
    overheadCost: Math.round(scaledOverheadCost * 100) / 100,
    totalDirectBatchCost: Math.round(totalDirectBatchCost * 100) / 100,
    costPerSaleableUnit: Math.round(costPerSaleableUnit * 100) / 100,
    savingsPerUnit: Math.round(savingsPerUnit * 100) / 100,
    savingsPercent: Math.round(savingsPercent * 10) / 10,
  };
}

export interface HSNGuideItem {
  hsnCode: string;
  productCategory: string;
  gstRatePercent: number;
  applicableItems: string[];
  itcEligibility: string;
  notes2025: string;
}

export const HSN_DIRECTORY: HSNGuideItem[] = [
  {
    hsnCode: '3406',
    productCategory: 'Candles, Tapres & Wax Melts',
    gstRatePercent: 5,
    applicableItems: ['Soy wax jars', 'Beeswax pillar candles', 'Scented wax melts', 'Tea-light candles'],
    itcEligibility: 'Eligible (Full ITC on wax, fragrance oils, wicks, and jars)',
    notes2025: 'Concessional craft rate under 5% slab. Input raw materials often attract 18%, creating an accumulated ITC position.',
  },
  {
    hsnCode: '3401',
    productCategory: 'Soaps & Cleansing Bars',
    gstRatePercent: 5,
    applicableItems: ['Handcrafted cold process soap', 'Goat milk soap bars', 'Glycerin melt & pour', 'Shampoo bars'],
    itcEligibility: 'Eligible (Full ITC on caustic soda, plant oils, butters, and packaging)',
    notes2025: 'Bath and toilet soap bars attract 5%. Medicated or specialty soaps may fall under 18%.',
  },
  {
    hsnCode: '1905',
    productCategory: 'Artisanal Bakery & Food',
    gstRatePercent: 5,
    applicableItems: ['Breads, sourdough loaves', 'Biscuits, cookies, rusks', 'Cakes, pastries, babkas'],
    itcEligibility: 'Eligible (Requires registered supplier tax invoices on flour, dairy, chocolate)',
    notes2025: 'Plain unbranded bread is 0% exempt. Artisanal branded cookies, cakes, and loaves attract 5%.',
  },
  {
    hsnCode: '3304',
    productCategory: 'Cosmetics, Skincare & Serums',
    gstRatePercent: 18,
    applicableItems: ['Face serums, facial oils', 'Body lotions, body butters', 'Lip balms, lip tints', 'Face masks, clay scrubs'],
    itcEligibility: 'Eligible (ITC claimable on essential oils, carrier oils, glass dropper bottles)',
    notes2025: 'Standard 18% beauty and skincare slab across India.',
  },
  {
    hsnCode: '3926',
    productCategory: 'Resin Art & Cast Polymer Decor',
    gstRatePercent: 18,
    applicableItems: ['Epoxy resin coasters', 'Resin wall clocks, ocean trays', 'Polymer clay jewelry', 'Silicone molded decor'],
    itcEligibility: 'Eligible (ITC on epoxy resin, hardener, alcohol inks, mica powders)',
    notes2025: 'Classified under articles of plastics/polymers (18%).',
  },
  {
    hsnCode: '6815',
    productCategory: 'Jesmonite, Cement & Plaster Decor',
    gstRatePercent: 18,
    applicableItems: ['Jesmonite AC100 trays', 'Concrete planters', 'Plaster trinket dishes', 'Mineral casting homeware'],
    itcEligibility: 'Eligible (ITC on base mineral powder, acrylic liquids, pigments, sealers)',
    notes2025: 'Classified under articles of stone, plaster, or cement not elsewhere specified (18%).',
  },
  {
    hsnCode: '6204 / 6101',
    productCategory: 'Apparel & Handmade Textiles',
    gstRatePercent: 5,
    applicableItems: ['Handmade cotton dresses', 'Tote bags, scrunchies', 'Embroidered shirts', 'Linen kitchen aprons'],
    itcEligibility: 'Eligible (ITC on fabric, embroidery threads, buttons, packaging)',
    notes2025: '5% for garments with sale value <= ₹1,000; 12% for garments with sale value > ₹1,000.',
  },
  {
    hsnCode: '6912',
    productCategory: 'Ceramic Pottery & Tableware',
    gstRatePercent: 12,
    applicableItems: ['Wheel-thrown ceramic mugs', 'Handmade ceramic bowls', 'Stoneware plates', 'Studio pottery vases'],
    itcEligibility: 'Eligible (ITC on ceramic clay, glazes, kiln firing electricity)',
    notes2025: 'Ceramic tableware and kitchenware classified under the 12% GST slab.',
  },
];
