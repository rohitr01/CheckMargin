// Strict unit tests for the CheckMargin calculation engine using node:assert
import assert from 'node:assert';
import {
  calculateBatchCost,
  suggestPrices,
  solveTargetPrice,
  generateShoppingList,
  calculateWholesaleTiers,
  scaleBatch,
  convertUnit,
  type BatchInput,
} from './calculator';

console.log('Running CheckMargin Advanced Financial & Production Test Suite...\n');

// ==========================================
// Test 1: Unit Conversions & Dimension Safety
// ==========================================
console.log('--- Test 1: Unit Conversions & Incompatible Dimension Safety ---');
assert.strictEqual(convertUnit(150, 'g', 'kg'), 0.15, '150g should convert to 0.15kg');
assert.strictEqual(convertUnit(2, 'kg', 'g'), 2000, '2kg should convert to 2000g');
assert.strictEqual(convertUnit(500, 'ml', 'L'), 0.5, '500ml should convert to 0.5L');
assert.strictEqual(convertUnit(1.5, 'L', 'ml'), 1500, '1.5L should convert to 1500ml');
assert.strictEqual(convertUnit(10, 'piece', 'piece'), 10, 'Identical units must remain unchanged');
assert.strictEqual(convertUnit(5, 'pack', 'pack'), 5, 'Discrete units must remain unchanged');

// Verify that incompatible unit conversions throw explicit descriptive errors
assert.throws(
  () => convertUnit(100, 'g', 'ml'),
  /Incompatible or unsupported unit conversion/,
  'Converting mass (g) to volume (ml) without density must throw an error'
);
assert.throws(
  () => convertUnit(5, 'piece', 'kg'),
  /Incompatible or unsupported unit conversion/,
  'Converting count (piece) to mass (kg) must throw an error'
);
console.log('✅ Unit conversions and dimension rejection passed strictly.');

// ==========================================
// Test 2: Standard Production Batch Costing
// ==========================================
console.log('\n--- Test 2: Base Batch Costing & Yield Economics ---');
const sampleInput: BatchInput = {
  productName: 'Handcrafted Soy Jar Candle (200g)',
  hsnCode: '3406',
  materials: [
    { name: 'Soy Wax', packPrice: 800, packSize: 1, packUnit: 'kg', qtyUsed: 150, qtyUnit: 'g', gstRatePercent: 18, isPackPriceGSTInclusive: true },
    { name: 'Fragrance Oil', packPrice: 1200, packSize: 100, packUnit: 'ml', qtyUsed: 10, qtyUnit: 'ml', gstRatePercent: 18, isPackPriceGSTInclusive: true },
    { name: 'Wick', packPrice: 5, packSize: 1, packUnit: 'piece', qtyUsed: 1, gstRatePercent: 12, isPackPriceGSTInclusive: true },
    { name: 'Glass Jar', packPrice: 35, packSize: 1, packUnit: 'piece', qtyUsed: 1, gstRatePercent: 18, isPackPriceGSTInclusive: true },
    { name: 'Label', packPrice: 5, packSize: 1, packUnit: 'piece', qtyUsed: 1, gstRatePercent: 18, isPackPriceGSTInclusive: true },
  ],
  batchSize: 10,
  failedUnits: 1,
  labourMinutes: 90,
  labourHourlyRate: 150,
  packagingPerUnit: 20,
  shippingPerOrder: 60,
  overheadPerBatch: 50,
  sellingPrice: 599,
  platformFeePercent: 12,
  platformFeeFixed: 15,
  gstOnPlatformFeePercent: 18,
  adSpendPerUnit: 30,
  rtoRatePercent: 8,
  rtoLossPerReturn: 80,
  isGSTRegistered: true,
  claimITC: true,
  supplyType: 'intra-state',
  outputGSTRatePercent: 5, // Handcrafted candles under HSN 3406
  isPriceGSTInclusive: true,
  monthlyFixedCost: 10000,
};

const result = calculateBatchCost(sampleInput);

assert.strictEqual(result.saleableYield, 9, 'Batch size 10 with 1 failed unit must produce 9 saleable units');
assert.strictEqual(result.yieldEfficiencyPercent, 90, 'Yield efficiency must be 90%');
console.log('✅ Saleable yield verified: 9 units (90% efficiency).');

// ==========================================
// Test 3: Total Scrap Rejection (100% Failure)
// ==========================================
console.log('\n--- Test 3: Strict 100% Scrap Rate Failure Rejection ---');
assert.throws(
  () => calculateBatchCost({ ...sampleInput, failedUnits: 10 }),
  /Failed units .* cannot equal or exceed batch size/,
  'A batch where failedUnits >= batchSize must throw an explicit error'
);
assert.throws(
  () => calculateBatchCost({ ...sampleInput, failedUnits: 15 }),
  /Failed units .* cannot equal or exceed batch size/,
  'Failed units exceeding batch size must throw an explicit error'
);
console.log('✅ Total scrap rate failure correctly rejected.');

// ==========================================
// Test 4: GST Reconciliation & Input Tax Credit on Platform Fees
// ==========================================
console.log('\n--- Test 4: GST Reconciliation & Statutory Service Fee ITC ---');
assert.ok(result.gst.outputGSTTotal > 0, 'Output GST must be strictly positive');
assert.ok(result.gst.eligibleITC > 0, 'Eligible ITC must be strictly positive');

// Verify that eligible ITC includes both raw material input GST AND 18% GST on marketplace commission
const expectedBaseCommission = (599 * 0.12) + 15;
const expectedGSTOnFee = expectedBaseCommission * 0.18;
assert.ok(result.gst.feeGSTTotal !== undefined, 'feeGSTTotal should be recorded in GST breakdown');
assert.ok(
  Math.abs(result.gst.feeGSTTotal! - expectedGSTOnFee) < 0.01,
  'GST on marketplace fee must match 18% of commission'
);
assert.ok(
  result.gst.eligibleITC > result.gst.inputGSTTotal,
  'Eligible ITC with claimITC=true must include marketplace fee GST in addition to material GST'
);
console.log(`✅ Eligible ITC correctly aggregates materials (₹${result.gst.inputGSTTotal.toFixed(2)}) + marketplace fee GST (₹${result.gst.feeGSTTotal!.toFixed(2)}) = ₹${result.gst.eligibleITC.toFixed(2)}.`);

// If seller does NOT claim ITC, fee GST must NOT be included in eligible ITC
const nonITCResult = calculateBatchCost({ ...sampleInput, claimITC: false });
assert.strictEqual(nonITCResult.gst.eligibleITC, 0, 'Seller not claiming ITC must have 0 eligible ITC');
assert.ok(
  nonITCResult.totalSellingCostPerUnit > result.totalSellingCostPerUnit,
  'Non-ITC seller must absorb 18% fee GST as out-of-pocket expense'
);
console.log('✅ Non-ITC scenario correctly isolates tax absorption.');

// ==========================================
// Test 5: Platform Fee & RTO Reserve
// ==========================================
console.log('\n--- Test 5: Platform Fees & RTO Reserve Calculation ---');
const expectedTotalPlatform = expectedBaseCommission + expectedGSTOnFee;
assert.ok(
  Math.abs(result.totalPlatformFeePerUnit - expectedTotalPlatform) < 0.05,
  `Platform fee gross mismatch: got ${result.totalPlatformFeePerUnit}, expected ${expectedTotalPlatform}`
);
const expectedRTO = 0.08 * 80;
assert.ok(
  Math.abs(result.rtoAllowancePerUnit - expectedRTO) < 0.01,
  'RTO reserve calculation must be exactly rtoRate * rtoLoss'
);
console.log('✅ Platform fee and RTO reserves verified.');

// ==========================================
// Test 6: Profitability & Break-Even
// ==========================================
console.log('\n--- Test 6: Profitability & Break-Even Analysis ---');
assert.ok(result.grossProfitPerUnit > 0, 'Gross profit per unit must be positive');
assert.ok(result.grossMarginPercent > 0 && result.grossMarginPercent < 100, 'Margin must be between 0 and 100%');
assert.ok(result.breakEvenUnitsPerMonth > 0, 'Monthly break-even units must be positive');
console.log(`✅ Profit / Unit: ₹${result.grossProfitPerUnit.toFixed(2)} (Margin: ${result.grossMarginPercent.toFixed(1)}%, Break-Even: ${result.breakEvenUnitsPerMonth} units/mo).`);

// ==========================================
// Test 7: Analytical Target Price Solver Accuracy
// ==========================================
console.log('\n--- Test 7: Analytical Target Price Solver ---');
const targetMargin = 40; // 40% target net margin
const solved = solveTargetPrice(
  {
    totalDirectCostPerUnit: result.totalDirectCostPerUnit,
    platformFeePercent: 12,
    platformFeeFixed: 15,
    gstOnPlatformFeePercent: 18,
    shippingPerOrder: 60,
    adSpendPerUnit: 30,
    rtoRatePercent: 8,
    rtoLossPerReturn: 80,
    packagingPerUnit: 20,
    isGSTRegistered: true,
    outputGSTRatePercent: 5,
    isPriceGSTInclusive: true,
  },
  'target-margin',
  targetMargin
);

assert.strictEqual(solved.isAttainable, true, 'Target margin of 40% must be attainable');
assert.ok(solved.suggestedPrice > result.totalDirectCostPerUnit, 'Solved price must exceed direct cost');
assert.ok(
  Math.abs(solved.marginPercent - targetMargin) < 0.5,
  `Actual margin ${solved.marginPercent}% must match target ${targetMargin}% within 0.5%`
);
console.log(`✅ Solved price ₹${solved.suggestedPrice} gives ${solved.marginPercent}% margin (target: ${targetMargin}%).`);

// Test mathematically unattainable target margin
const unattainable = solveTargetPrice(
  {
    totalDirectCostPerUnit: 200,
    platformFeePercent: 20,
    platformFeeFixed: 20,
    shippingPerOrder: 80,
    packagingPerUnit: 20,
    isGSTRegistered: true,
    outputGSTRatePercent: 18,
    isPriceGSTInclusive: true,
  },
  'target-margin',
  95
);
assert.strictEqual(unattainable.isAttainable, false, '95% margin under high fees must be detected as unattainable');
assert.ok(unattainable.unattainableReason?.length! > 0, 'Must provide an explanation for unattainable margin');
console.log('✅ Unattainable target margin correctly flagged with explanation.');

// ==========================================
// Test 8: Shopping List Unit Normalization (Recipe 'g' vs Supplier 'kg')
// ==========================================
console.log('\n--- Test 8: Shopping List Unit Normalization ---');
const materialsForShopping = [
  // 150g used per batch of 10. For 30 units (3 batches), 450g needed.
  // Pack is 1kg (1000g). Correct packs needed = ceil(0.45 / 1) = 1 pack.
  // Without normalization, 450 / 1 would have incorrectly returned 450 packs!
  { name: 'Soy Wax', packPrice: 800, packSize: 1, packUnit: 'kg', qtyUsed: 150, qtyUnit: 'g' },
  { name: 'Wick', packPrice: 100, packSize: 50, packUnit: 'piece', qtyUsed: 10, qtyUnit: 'piece' },
];

const shoppingList = generateShoppingList(materialsForShopping, 30, 9, 10);
const soyWaxItem = shoppingList.find((i) => i.name === 'Soy Wax')!;

assert.ok(soyWaxItem !== undefined, 'Soy wax must be in shopping list');
assert.strictEqual(
  soyWaxItem.packsNeeded,
  1,
  `Soy wax packsNeeded should be 1 (0.5kg needed in 1kg pack), but got ${soyWaxItem.packsNeeded}`
);
assert.strictEqual(soyWaxItem.estimatedCost, 800, 'Estimated cost should be 1 pack * ₹800 = ₹800');
console.log(`✅ Shopping list unit normalization verified: 450g recipe needs ${soyWaxItem.packsNeeded} pack(s) of 1kg = ₹${soyWaxItem.estimatedCost}.`);

// ==========================================
// Test 9: Wholesale & B2B Tiers
// ==========================================
console.log('\n--- Test 9: Wholesale & Multi-Tier Pricing ---');
const wholesale = calculateWholesaleTiers(result.totalDirectCostPerUnit, 599, 25);
assert.ok(wholesale.wholesalePrice > result.totalDirectCostPerUnit, 'Wholesale price must exceed direct cost');
assert.strictEqual(wholesale.tiers.length, 3, 'Must produce 3 distinct wholesale tiers');
console.log(`✅ Wholesale B2B rate (2x Cost): ₹${wholesale.wholesalePrice} with MOQ of ${wholesale.suggestedMOQ} units.`);

// ==========================================
// Test 10: Batch Scaler Industrial Efficiency & Configurable Ratios
// ==========================================
console.log('\n--- Test 10: Batch Scaler Industrial Efficiency & Configurable Ratios ---');
// Default ratios (25% setup, 75% craft)
const scaledDefault = scaleBatch(sampleInput, result, 5);
assert.strictEqual(scaledDefault.batchSize, 50, '5x batch size must be 50');
assert.ok(scaledDefault.savingsPerUnit > 0, 'Scaling must produce economies of scale savings');

// Custom ratios (40% setup, 60% craft)
const scaledCustom = scaleBatch(sampleInput, result, 5, {
  setupLabourRatio: 0.40,
  fixedOverheadRatio: 0.80,
});
assert.ok(scaledCustom.labourMinutes > 0, 'Scaled labour minutes must be positive');
assert.ok(scaledCustom.savingsPercent > 0, 'Custom scaled batch must yield positive percentage savings');
console.log(`✅ Scaled 5x batch: cost drops from ₹${result.totalDirectCostPerUnit.toFixed(2)} to ₹${scaledDefault.costPerSaleableUnit} (saving ${scaledDefault.savingsPercent}%).`);

console.log('\n🎉 ALL CheckMargin Production Financial & Engineering Tests Passed Successfully!\n');
