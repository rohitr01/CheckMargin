// MakerMargin Core Calculation Engine
// Pure functions — no side effects, fully testable

export interface Material {
  name: string;
  packPrice: number;   // price paid per pack (₹)
  packSize: number;    // size of pack (in unit below)
  packUnit: string;    // e.g. 'g', 'ml', 'piece', 'metre'
  qtyUsed: number;     // quantity used per batch (same unit)
}

export interface BatchInput {
  productName: string;
  materials: Material[];
  batchSize: number;        // total units made (including failed)
  failedUnits: number;      // units that didn't make it to sale
  labourMinutes: number;    // total batch labour in minutes
  labourHourlyRate: number; // ₹ per hour
  packagingPerUnit: number; // ₹ per saleable unit
  shippingPerOrder: number; // seller-paid shipping ₹ (0 if buyer pays)
  overheadPerBatch: number; // fixed overhead to allocate per batch
  sellingPrice: number;     // target/actual selling price per unit
  platformFeePercent: number; // e.g. 12 for 12%
  platformFeeFixed: number;   // fixed fee per order (₹)
  isGSTRegistered: boolean;
  gstRatePercent: number;     // e.g. 18
  isPriceGSTInclusive: boolean;
}

export interface CalculationResult {
  saleableYield: number;
  totalMaterialCost: number;
  materialCostPerUnit: number;
  labourCostPerBatch: number;
  labourCostPerUnit: number;
  packagingCostTotal: number;
  overheadPerUnit: number;
  totalDirectCostPerUnit: number;
  platformFeeAmount: number;
  shippingCostPerUnit: number;
  totalCostPerUnit: number;
  sellingPriceExGST: number;
  gstCollected: number;
  grossProfitPerUnit: number;
  grossMarginPercent: number;
  markupPercent: number;
  contributionMarginPerUnit: number;
  breakEvenUnitsPerMonth: (monthlyFixed: number) => number;
  // Material breakdown
  materialBreakdown: { name: string; cost: number }[];
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
  estimatedCost: number;
}

/**
 * Core batch cost calculation
 */
export function calculateBatchCost(input: BatchInput): CalculationResult {
  // Saleable yield
  const saleableYield = Math.max(input.batchSize - input.failedUnits, 1);

  // Material costs
  const materialBreakdown = input.materials.map((m) => ({
    name: m.name,
    cost: (m.packPrice / m.packSize) * m.qtyUsed,
  }));
  const totalMaterialCost = materialBreakdown.reduce((sum, m) => sum + m.cost, 0);
  const materialCostPerUnit = totalMaterialCost / saleableYield;

  // Labour
  const labourCostPerBatch = (input.labourMinutes / 60) * input.labourHourlyRate;
  const labourCostPerUnit = labourCostPerBatch / saleableYield;

  // Packaging
  const packagingCostTotal = input.packagingPerUnit * saleableYield;

  // Overhead
  const overheadPerUnit = input.overheadPerBatch / saleableYield;

  // Shipping (seller-paid, split across units in batch — simplified: per order = per unit)
  const shippingCostPerUnit = input.shippingPerOrder;

  // Total direct cost per saleable unit
  const totalDirectCostPerUnit =
    materialCostPerUnit +
    labourCostPerUnit +
    input.packagingPerUnit +
    overheadPerUnit;

  // Platform fee (applied on selling price)
  const platformFeeAmount =
    (input.sellingPrice * input.platformFeePercent) / 100 + input.platformFeeFixed;

  // Total cost per unit (everything including selling costs)
  const totalCostPerUnit = totalDirectCostPerUnit + platformFeeAmount + shippingCostPerUnit;

  // GST handling
  let sellingPriceExGST = input.sellingPrice;
  let gstCollected = 0;
  if (input.isGSTRegistered && input.gstRatePercent > 0) {
    if (input.isPriceGSTInclusive) {
      sellingPriceExGST = input.sellingPrice / (1 + input.gstRatePercent / 100);
      gstCollected = input.sellingPrice - sellingPriceExGST;
    } else {
      sellingPriceExGST = input.sellingPrice;
      gstCollected = input.sellingPrice * (input.gstRatePercent / 100);
    }
  }

  // Profit & margins (based on ex-GST selling price)
  const grossProfitPerUnit = sellingPriceExGST - totalCostPerUnit;
  const grossMarginPercent =
    sellingPriceExGST > 0 ? (grossProfitPerUnit / sellingPriceExGST) * 100 : 0;
  const markupPercent =
    totalDirectCostPerUnit > 0
      ? ((sellingPriceExGST - totalDirectCostPerUnit) / totalDirectCostPerUnit) * 100
      : 0;
  const contributionMarginPerUnit = sellingPriceExGST - totalCostPerUnit;

  return {
    saleableYield,
    totalMaterialCost,
    materialCostPerUnit,
    labourCostPerBatch,
    labourCostPerUnit,
    packagingCostTotal,
    overheadPerUnit,
    totalDirectCostPerUnit,
    platformFeeAmount,
    shippingCostPerUnit,
    totalCostPerUnit,
    sellingPriceExGST,
    gstCollected,
    grossProfitPerUnit,
    grossMarginPercent,
    markupPercent,
    contributionMarginPerUnit,
    breakEvenUnitsPerMonth: (monthlyFixed: number) =>
      contributionMarginPerUnit > 0 ? Math.ceil(monthlyFixed / contributionMarginPerUnit) : Infinity,
    materialBreakdown,
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
  const yieldRatio = currentBatchSaleableYield / currentBatchSize; // e.g. 0.9 if 10% waste
  const requiredBatchSize = Math.ceil(targetSaleableUnits / yieldRatio);

  return materials.map((m) => {
    const qtyNeeded = (m.qtyUsed / currentBatchSize) * requiredBatchSize;
    const packsNeeded = Math.ceil(qtyNeeded / m.packSize);
    const estimatedCost = packsNeeded * m.packPrice;
    return {
      name: m.name,
      qtyNeeded: Math.round(qtyNeeded * 100) / 100,
      packUnit: m.packUnit,
      packsNeeded,
      estimatedCost,
    };
  });
}
