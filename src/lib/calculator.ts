import { GST_CATALOG } from './gst-directory';
// CheckMargin Core Calculation Engine
// Pure functions — deterministic, transparent, and comprehensive

export interface Material {
  name: string;
  packPrice: number;        // price paid per pack (₹)
  packSize: number;         // size of pack
  packUnit: string;         // 'g' | 'kg' | 'ml' | 'L' | 'piece' | 'metre' | 'pack'
  qtyUsed: number;          // quantity used per batch
  qtyUnit?: string;         // optional unit used in recipe (if different from packUnit, e.g. recipe uses 'g' while pack is 'kg')
  gstRatePercent?: number;  // input GST on this material (e.g. 0, 5, 12, 18)
  isPackPriceGSTInclusive?: boolean; // whether packPrice includes GST (default true)
}

/**
 * Accurately converts quantities between compatible measurement units
 * (weight: g/kg/mg, volume: ml/L, length: mm/cm/m/inch)
 */
export function convertUnit(qty: number, fromUnit?: string, toUnit?: string): number {
  if (!fromUnit || !toUnit || fromUnit.toLowerCase().trim() === toUnit.toLowerCase().trim()) {
    return qty;
  }
  const from = fromUnit.toLowerCase().trim();
  const to = toUnit.toLowerCase().trim();

  const weights: Record<string, number> = {
    g: 1, gram: 1, grams: 1,
    kg: 1000, kilogram: 1000, kilograms: 1000,
    mg: 0.001, milligram: 0.001, milligrams: 0.001,
  };
  if (weights[from] && weights[to]) {
    return (qty * weights[from]) / weights[to];
  }

  const volumes: Record<string, number> = {
    ml: 1, millilitre: 1, milliliter: 1, millilitres: 1, milliliters: 1,
    l: 1000, litre: 1000, liter: 1000, litres: 1000, liters: 1000,
  };
  if (volumes[from] && volumes[to]) {
    return (qty * volumes[from]) / volumes[to];
  }

  const lengths: Record<string, number> = {
    mm: 0.1, millimeter: 0.1, millimeters: 0.1,
    cm: 1, centimeter: 1, centimeters: 1,
    m: 100, metre: 100, meter: 100, metres: 100, meters: 100,
    inch: 2.54, inches: 2.54,
  };
  if (lengths[from] && lengths[to]) {
    return (qty * lengths[from]) / lengths[to];
  }

  const discrete = ['piece', 'pcs', 'unit', 'units', 'pack', 'packs', 'box', 'boxes', 'set', 'sets'];
  if (discrete.includes(from) && discrete.includes(to)) {
    return qty;
  }

  throw new Error(
    `Incompatible or unsupported unit conversion: cannot convert from "${fromUnit}" to "${toUnit}".`
  );
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
    id: 'flipkart',
    name: 'Flipkart Marketplace',
    feePercent: 13,
    fixedFee: 15,
    shipping: 65,
    gstOnFeesPercent: 18,
    notes: 'Avg 13% commission + ₹15 fixed fee + ₹65 shipping + 18% GST',
  },
  {
    id: 'instagram_d2c',
    name: 'Instagram / WhatsApp Direct (UPI/PG)',
    feePercent: 1.5,
    fixedFee: 0,
    shipping: 50,
    gstOnFeesPercent: 18,
    notes: '1.5% UPI/gateway fee + self-arranged 3PL delivery, no platform cut',
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
    id: 'cosmofeed',
    name: 'Cosmofeed / Topmate (Digital Store)',
    feePercent: 10,
    fixedFee: 0,
    shipping: 0,
    gstOnFeesPercent: 18,
    notes: '10% all-inclusive platform fee for Indian creators selling digital downloads',
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
  productType?: 'physical' | 'digital' | 'service';
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
  feeGSTTotal?: number;      // 18% statutory GST paid on marketplace fees
  eligibleITC: number;       // recoverable tax (materials + fee GST if claiming ITC)
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
  effectivePlatformFeePerUnit: number;
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
  isAttainable: boolean;
  unattainableReason?: string;
  realizedRevenue?: number;
  totalCost?: number;
}

export interface ShoppingListItem {
  name: string;
  qtyNeeded: number;
  recipeUnit?: string;
  qtyInPackUnit?: number;
  packUnit: string;
  packsNeeded: number;
  packPrice: number;
  estimatedCost: number;
}

/**
 * Core batch cost calculation with comprehensive GST, channel, and RTO modeling
 */
export function calculateBatchCost(input: BatchInput): CalculationResult {
  // 1. Saleable yield with strict scrap validation
  const batchSize = Math.max(input.batchSize, 1);
  if (input.failedUnits >= batchSize) {
    throw new Error(
      `Failed units (${input.failedUnits}) cannot equal or exceed batch size (${batchSize}). A 100% scrap rate produces zero saleable yield.`
    );
  }
  const failedUnits = Math.max(input.failedUnits, 0);
  const saleableYield = batchSize - failedUnits;
  const yieldEfficiencyPercent = (saleableYield / batchSize) * 100;

  // 2. Material costs with Input GST & ITC handling
  const canClaimITC = input.isGSTRegistered && input.claimITC;
  let totalInputGSTTotal = 0;

  const materialBreakdown = input.materials.map((m) => {
    const gstRate = m.gstRatePercent ?? 18;
    const isInclusive = m.isPackPriceGSTInclusive ?? true;
    const effectiveQtyUsed = m.qtyUnit ? convertUnit(m.qtyUsed, m.qtyUnit, m.packUnit) : m.qtyUsed;
    const qtyRatio = m.packSize > 0 ? effectiveQtyUsed / m.packSize : 0;
    
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

  // 5. Platform Fees with 18% GST on services
  const baseCommission = (input.sellingPrice * input.platformFeePercent) / 100 + input.platformFeeFixed;
  const gstOnPlatformFee = baseCommission * ((input.gstOnPlatformFeePercent || 18) / 100);
  const totalPlatformFeePerUnit = baseCommission + gstOnPlatformFee;
  // If registered maker claims ITC, the 18% GST on platform services is recoverable via ITC
  const effectivePlatformFeePerUnit = canClaimITC ? baseCommission : totalPlatformFeePerUnit;

  // 6. Output GST Modeling & Full GST Reconciliation
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
  const eligibleFeeITC = canClaimITC ? gstOnPlatformFee : 0;
  const eligibleITC = canClaimITC ? (inputGSTPerUnit + eligibleFeeITC) : 0;
  const netGSTPayable = Math.max(0, outputGSTTotal - eligibleITC);
  const itcCreditForward = Math.max(0, eligibleITC - outputGSTTotal);

  const gstBreakdown: GSTBreakdown = {
    isRegistered: input.isGSTRegistered,
    claimITC: input.claimITC,
    supplyType: input.supplyType,
    hsnCode: input.hsnCode || 'Unclassified',
    outputRatePercent: input.outputGSTRatePercent,
    grossSellingPrice: input.sellingPrice,
    taxableValue,
    outputGSTTotal,
    cgstAmount,
    sgstAmount,
    igstAmount,
    inputGSTTotal: inputGSTPerUnit,
    feeGSTTotal: gstOnPlatformFee,
    eligibleITC,
    netGSTPayable,
    itcCreditForward,
  };

  // 7. Shipping, Ads & RTO Reserve
  const shippingCostPerUnit = input.shippingPerOrder;
  const adSpendPerUnit = input.adSpendPerUnit || 0;
  const rtoRate = (input.rtoRatePercent || 0) / 100;
  const rtoLossPerReturn = input.rtoLossPerReturn || (shippingCostPerUnit + input.packagingPerUnit);
  const rtoAllowancePerUnit = rtoRate * rtoLossPerReturn;

  const totalSellingCostPerUnit =
    effectivePlatformFeePerUnit +
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
    effectivePlatformFeePerUnit,
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

export interface TargetPriceInput {
  totalDirectCostPerUnit: number;
  platformFeePercent: number;
  platformFeeFixed: number;
  gstOnPlatformFeePercent?: number;
  shippingPerOrder: number;
  adSpendPerUnit?: number;
  rtoRatePercent?: number;
  rtoLossPerReturn?: number;
  packagingPerUnit?: number;
  isGSTRegistered: boolean;
  claimITC?: boolean;
  outputGSTRatePercent: number;
  isPriceGSTInclusive: boolean;
}

/**
 * Analytical target price solver.
 * Solves for gross price P where Realized Revenue - Total Cost achieves the exact target margin or markup.
 * Mathematically accounts for:
 *   - Direct manufacturing & craft labour cost
 *   - Marketplace referral/commission %
 *   - Fixed platform closing fees
 *   - 18% statutory GST on marketplace services (offset via ITC if registered maker claims ITC)
 *   - Outbound logistics / shipping
 *   - Customer Acquisition Cost (CAC / Ad Spend)
 *   - Customer returns & RTO loss reserve
 *   - Output GST on selling price (inclusive vs exclusive)
 */
export function solveTargetPrice(
  input: TargetPriceInput,
  method: 'target-margin' | 'markup',
  targetPercent: number
): PriceScenario {
  const g = input.isGSTRegistered && input.isPriceGSTInclusive ? input.outputGSTRatePercent / 100 : 0;
  const fPct = input.platformFeePercent / 100;
  // If registered maker claims ITC, 18% GST on marketplace services is recovered as credit,
  // so the effective cost burden to the maker is only the base fee.
  const canClaimITC = input.isGSTRegistered && (input.claimITC ?? true);
  const gs = canClaimITC ? 0 : (input.gstOnPlatformFeePercent ?? 18) / 100;
  const feeMultiplier = fPct * (1 + gs);
  const fixedFeeWithGST = input.platformFeeFixed * (1 + gs);

  const rtoRate = (input.rtoRatePercent ?? 0) / 100;
  const defaultRtoLoss = input.shippingPerOrder + (input.packagingPerUnit ?? 0);
  const rtoLoss = input.rtoLossPerReturn ?? defaultRtoLoss;
  const rtoAllowance = rtoRate * rtoLoss;

  const fixedCosts =
    input.totalDirectCostPerUnit +
    input.shippingPerOrder +
    (input.adSpendPerUnit ?? 0) +
    rtoAllowance +
    fixedFeeWithGST;

  const revMultiplier = 1 / (1 + g);

  if (method === 'target-margin') {
    const m = targetPercent / 100;
    // Condition: P * [revMultiplier * (1 - m) - feeMultiplier] = fixedCosts
    const denominator = revMultiplier * (1 - m) - feeMultiplier;

    if (denominator <= 0.001) {
      return {
        method: 'target-margin',
        value: targetPercent,
        suggestedPrice: 0,
        profitPerUnit: 0,
        marginPercent: 0,
        isAttainable: false,
        unattainableReason: `Target margin of ${targetPercent}% is mathematically unattainable with ${input.platformFeePercent}% channel fee and ${input.outputGSTRatePercent}% tax.`,
      };
    }

    const price = Math.round((fixedCosts / denominator) * 100) / 100;
    const realizedRev = price * revMultiplier;
    const totalSellingCost =
      (price * fPct + input.platformFeeFixed) * (1 + gs) +
      input.shippingPerOrder +
      (input.adSpendPerUnit ?? 0) +
      rtoAllowance;
    const totalCost = input.totalDirectCostPerUnit + totalSellingCost;
    const profit = Math.round((realizedRev - totalCost) * 100) / 100;
    const margin = realizedRev > 0 ? (profit / realizedRev) * 100 : 0;

    return {
      method: 'target-margin',
      value: targetPercent,
      suggestedPrice: price,
      profitPerUnit: profit,
      marginPercent: Math.round(margin * 10) / 10,
      isAttainable: true,
      realizedRevenue: realizedRev,
      totalCost,
    };
  } else {
    // markup on direct production cost
    const k = targetPercent / 100;
    const targetProfit = k * input.totalDirectCostPerUnit;
    const denominator = revMultiplier - feeMultiplier;

    if (denominator <= 0.001) {
      return {
        method: 'markup',
        value: targetPercent,
        suggestedPrice: 0,
        profitPerUnit: 0,
        marginPercent: 0,
        isAttainable: false,
        unattainableReason: `Markup of ${targetPercent}% cannot be achieved because channel fees exceed allowable price structure.`,
      };
    }

    const price = Math.round(((fixedCosts + targetProfit) / denominator) * 100) / 100;
    const realizedRev = price * revMultiplier;
    const totalSellingCost =
      (price * fPct + input.platformFeeFixed) * (1 + gs) +
      input.shippingPerOrder +
      (input.adSpendPerUnit ?? 0) +
      rtoAllowance;
    const totalCost = input.totalDirectCostPerUnit + totalSellingCost;
    const profit = Math.round((realizedRev - totalCost) * 100) / 100;
    const margin = realizedRev > 0 ? (profit / realizedRev) * 100 : 0;

    return {
      method: 'markup',
      value: targetPercent,
      suggestedPrice: price,
      profitPerUnit: profit,
      marginPercent: Math.round(margin * 10) / 10,
      isAttainable: true,
      realizedRevenue: realizedRev,
      totalCost,
    };
  }
}

/**
 * Suggest selling prices using markup and target-margin methods.
 * Accepts optional channel and tax parameters to run the full analytical solver.
 */
export function suggestPrices(
  totalDirectCostPerUnit: number,
  markupPercents: number[] = [30, 50, 100],
  marginPercents: number[] = [25, 40, 60],
  channelOptions?: Partial<TargetPriceInput>
): PriceScenario[] {
  if (channelOptions) {
    const fullInput: TargetPriceInput = {
      totalDirectCostPerUnit,
      platformFeePercent: channelOptions.platformFeePercent ?? 0,
      platformFeeFixed: channelOptions.platformFeeFixed ?? 0,
      gstOnPlatformFeePercent: channelOptions.gstOnPlatformFeePercent ?? 18,
      shippingPerOrder: channelOptions.shippingPerOrder ?? 0,
      adSpendPerUnit: channelOptions.adSpendPerUnit ?? 0,
      rtoRatePercent: channelOptions.rtoRatePercent ?? 0,
      rtoLossPerReturn: channelOptions.rtoLossPerReturn ?? 0,
      packagingPerUnit: channelOptions.packagingPerUnit ?? 0,
      isGSTRegistered: channelOptions.isGSTRegistered ?? false,
      claimITC: channelOptions.claimITC ?? true,
      outputGSTRatePercent: channelOptions.outputGSTRatePercent ?? 0,
      isPriceGSTInclusive: channelOptions.isPriceGSTInclusive ?? true,
    };

    const markupScenarios = markupPercents.map((pct) => solveTargetPrice(fullInput, 'markup', pct));
    const marginScenarios = marginPercents.map((pct) => solveTargetPrice(fullInput, 'target-margin', pct));
    return [...markupScenarios, ...marginScenarios];
  }

  // Fallback for simple direct cost scaling
  const markupScenarios: PriceScenario[] = markupPercents.map((pct) => {
    const price = totalDirectCostPerUnit * (1 + pct / 100);
    return {
      method: 'markup',
      value: pct,
      suggestedPrice: Math.round(price * 100) / 100,
      profitPerUnit: Math.round((price - totalDirectCostPerUnit) * 100) / 100,
      marginPercent: Math.round((1 - totalDirectCostPerUnit / price) * 1000) / 10,
      isAttainable: true,
    };
  });

  const marginScenarios: PriceScenario[] = marginPercents.map((pct) => {
    const price = totalDirectCostPerUnit / Math.max(1 - pct / 100, 0.001);
    return {
      method: 'target-margin',
      value: pct,
      suggestedPrice: Math.round(price * 100) / 100,
      profitPerUnit: Math.round((price - totalDirectCostPerUnit) * 100) / 100,
      marginPercent: pct,
      isAttainable: true,
    };
  });

  return [...markupScenarios, ...marginScenarios];
}

/**
 * Generate a shopping list for a target batch, normalizing recipe units to supplier pack units
 */
export function generateShoppingList(
  materials: Material[],
  targetSaleableUnits: number,
  currentBatchSaleableYield: number,
  currentBatchSize: number
): ShoppingListItem[] {
  if (currentBatchSaleableYield <= 0 || currentBatchSize <= 0) {
    throw new Error('Cannot generate shopping list: saleable yield and batch size must be greater than zero.');
  }
  const yieldRatio = currentBatchSaleableYield / currentBatchSize;
  const requiredBatchSize = Math.ceil(targetSaleableUnits / yieldRatio);

  return materials.map((m) => {
    const qtyNeeded = (m.qtyUsed / Math.max(currentBatchSize, 1)) * requiredBatchSize;
    // Normalize recipe quantity to supplier pack unit (e.g. 1500g needed -> 1.5kg if supplier pack is in kg)
    const qtyInPackUnit = m.qtyUnit
      ? convertUnit(qtyNeeded, m.qtyUnit, m.packUnit)
      : qtyNeeded;
    const packsNeeded = Math.ceil(qtyInPackUnit / Math.max(m.packSize, 1));
    const estimatedCost = packsNeeded * m.packPrice;
    return {
      name: m.name,
      qtyNeeded: Math.round(qtyNeeded * 100) / 100,
      recipeUnit: m.qtyUnit || m.packUnit,
      qtyInPackUnit: Math.round(qtyInPackUnit * 100) / 100,
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

export interface ScaleOptions {
  setupLabourRatio?: number; // e.g. 0.25 (25% setup)
  fixedOverheadRatio?: number; // e.g. 0.75 (75% fixed)
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
 * Simulates scaling a batch up (e.g. 2x, 5x, 10x) using an explicit industrial engineering model:
 * - Setup & prep time remains fixed per production run (configurable, default 25% of batch labour).
 * - Craft / pouring time scales with volume (remainder of batch labour).
 * - Materials and packaging scale linearly with units produced.
 * - Overhead is partitioned into fixed facility overhead (configurable, default 75%) and variable operating overhead (remainder).
 */
export function scaleBatch(
  baseInput: BatchInput,
  baseResult: CalculationResult,
  multiplier: number,
  options?: ScaleOptions
): ScaledBatchSummary {
  const mult = Math.max(multiplier, 1);
  const scaledBatchSize = Math.round(baseInput.batchSize * mult);
  const scrapRate = baseInput.batchSize > 0 ? baseInput.failedUnits / baseInput.batchSize : 0;
  const scaledFailedUnits = Math.round(scaledBatchSize * scrapRate);
  const scaledYield = Math.max(scaledBatchSize - scaledFailedUnits, 1);

  // Materials scale linearly
  const scaledMaterialCost = baseResult.totalMaterialCost * mult;

  // Setup time stays fixed, while craft processing time scales linearly with batch units
  const setupRatio = Math.min(Math.max(options?.setupLabourRatio ?? 0.25, 0), 1);
  const setupMinutes = Math.round(baseInput.labourMinutes * setupRatio);
  const craftMinutes = Math.max(baseInput.labourMinutes - setupMinutes, 0);
  const scaledLabourMinutes = setupMinutes + Math.round(craftMinutes * mult);
  const scaledLabourCost = (scaledLabourMinutes / 60) * baseInput.labourHourlyRate;

  // Packaging scales linearly with saleable units
  const scaledPackagingCost = baseInput.packagingPerUnit * scaledYield;

  // Overhead has fixed studio overhead and variable utility/tools consumption
  const fixedRatio = Math.min(Math.max(options?.fixedOverheadRatio ?? 0.75, 0), 1);
  const fixedOverhead = baseInput.overheadPerBatch * fixedRatio;
  const variableOverhead = baseInput.overheadPerBatch * (1 - fixedRatio) * mult;
  const scaledOverheadCost = fixedOverhead + variableOverhead;

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

export const HSN_DIRECTORY: HSNGuideItem[] = GST_CATALOG.map((item) => ({
  hsnCode: item.code,
  productCategory: `${item.name} (${item.industry})`,
  gstRatePercent: item.ratePercent,
  applicableItems: [item.name, item.category, item.subcategory, ...item.keywords],
  itcEligibility: `${item.itcEligibility === 'full' ? 'Eligible (Full ITC)' : item.itcEligibility === 'nil' ? 'Nil / Exempt' : 'Partial / Conditional'} - ${item.itcDescription}`,
  notes2025: item.notes2025,
}));
