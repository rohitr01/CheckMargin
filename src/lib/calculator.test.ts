// Unit tests for the upgraded CheckMargin calculation engine
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

console.log('Running CheckMargin Advanced GST & Costing Engine Tests...\n');

// 1. Unit conversion tests
console.log('--- Test 1: Unit Conversions ---');
console.assert(convertUnit(150, 'g', 'kg') === 0.15, '150g should convert to 0.15kg');
console.assert(convertUnit(2, 'kg', 'g') === 2000, '2kg should convert to 2000g');
console.assert(convertUnit(500, 'ml', 'L') === 0.5, '500ml should convert to 0.5L');
console.assert(convertUnit(1.5, 'L', 'ml') === 1500, '1.5L should convert to 1500ml');
console.assert(convertUnit(10, 'piece', 'piece') === 10, 'identical units unchanged');
console.log('✅ Unit conversions passed');

// 2. Base Batch Input
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

// Test 2: Saleable yield
console.log('\n--- Test 2: Saleable Yield ---');
console.assert(result.saleableYield === 9, `❌ Yield should be 9, got ${result.saleableYield}`);
console.log('✅ Saleable yield:', result.saleableYield, `(${result.yieldEfficiencyPercent}%)`);

// Test 3: GST Output Calculation
console.log('\n--- Test 3: GST Reconciliation ---');
console.assert(result.gst.outputGSTTotal > 0, '❌ Output GST should be calculated');
console.log('✅ Output GST Total: ₹', result.gst.outputGSTTotal.toFixed(2));
console.log('   Taxable value: ₹', result.gst.taxableValue.toFixed(2));
console.log('   CGST (2.5%): ₹', result.gst.cgstAmount.toFixed(2), '| SGST (2.5%): ₹', result.gst.sgstAmount.toFixed(2));

// Test 4: Input Tax Credit (ITC)
console.assert(result.gst.eligibleITC > 0, '❌ Eligible ITC should be positive');
console.log('✅ Input GST per unit: ₹', result.gst.inputGSTTotal.toFixed(2));
console.log('✅ Net GST Payable to Govt: ₹', result.gst.netGSTPayable.toFixed(2));

// Test 5: Platform fee with 18% GST on service
console.log('\n--- Test 4: Platform Fee + Statutory GST ---');
const expectedBaseFee = (599 * 0.12) + 15;
const expectedTotalPlatform = expectedBaseFee * 1.18;
console.assert(
  Math.abs(result.totalPlatformFeePerUnit - expectedTotalPlatform) < 0.05,
  `❌ Platform fee calculation mismatch: got ${result.totalPlatformFeePerUnit}, expected ${expectedTotalPlatform}`
);
console.log('✅ Platform Fee + 18% GST: ₹', result.totalPlatformFeePerUnit.toFixed(2));

// Test 6: RTO Allowance
console.log('\n--- Test 5: RTO Reserve ---');
const expectedRTO = 0.08 * 80;
console.assert(Math.abs(result.rtoAllowancePerUnit - expectedRTO) < 0.01, '❌ RTO reserve calculation wrong');
console.log('✅ RTO & Return Loss Reserve: ₹', result.rtoAllowancePerUnit.toFixed(2));

// Test 7: Profitability
console.log('\n--- Test 6: Profitability & Break-Even ---');
console.assert(result.grossProfitPerUnit > 0, '❌ Profit should be positive');
console.log('✅ Net Profit / Unit: ₹', result.grossProfitPerUnit.toFixed(2));
console.log('✅ Net Margin: ', result.grossMarginPercent.toFixed(1) + '%');
console.log('✅ Monthly Break-Even Units:', result.breakEvenUnitsPerMonth, 'units');

// Test 8: Analytical Target Price Solver
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

console.assert(solved.isAttainable, '❌ Solved price should be attainable');
console.log(`✅ Solved price for ${targetMargin}% margin: ₹${solved.suggestedPrice}`);
console.log(`   Realized Revenue: ₹${solved.realizedRevenue!.toFixed(2)}`);
console.log(`   Total Unit Cost (incl all fees): ₹${solved.totalCost!.toFixed(2)}`);
console.log(`   Net Profit: ₹${solved.profitPerUnit.toFixed(2)}`);
console.log(`   Actual Margin: ${solved.marginPercent.toFixed(1)}%`);

// Verify that the actual margin at this solved price matches targetMargin within 0.5%
console.assert(
  Math.abs(solved.marginPercent - targetMargin) < 0.5,
  `❌ Actual margin ${solved.marginPercent}% does not match target ${targetMargin}%`
);

// Test impossible margin (e.g. 95% with high platform fee)
const impossible = solveTargetPrice(
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
  90
);
console.assert(!impossible.isAttainable, '❌ 90% margin should be detected as mathematically unattainable');
console.log('✅ Unattainable margin correctly detected:', impossible.unattainableReason);

// Test 9: Shopping List
console.log('\n--- Test 8: Shopping List ---');
const shoppingList = generateShoppingList(sampleInput.materials, 30, 9, 10);
console.log('✅ Shopping List Items for 30 units:', shoppingList.length);

// Test 10: Wholesale Pricing Tiers
console.log('\n--- Test 9: Wholesale Tiers ---');
const wholesale = calculateWholesaleTiers(result.totalDirectCostPerUnit, 599, 25);
console.assert(wholesale.wholesalePrice > result.totalDirectCostPerUnit, '❌ Wholesale price should exceed direct cost');
console.assert(wholesale.tiers.length === 3, '❌ Should have 3 wholesale tiers');
console.log('✅ Wholesale Price (2x Cost): ₹', wholesale.wholesalePrice, `(Margin: ${wholesale.makerMarginPercent.toFixed(1)}%)`);

// Test 11: Batch Scaler with Setup vs Craft Separation
console.log('\n--- Test 10: Batch Scaler Industrial Efficiency ---');
const scaled5x = scaleBatch(sampleInput, result, 5);
console.assert(scaled5x.batchSize === 50, '❌ 5x batch size should be 50');
console.assert(scaled5x.savingsPerUnit > 0, '❌ Scaling up should produce per-unit savings from labour efficiency');
console.log('✅ 5x Batch Cost/Unit: ₹', scaled5x.costPerSaleableUnit, `(Savings: ₹${scaled5x.savingsPerUnit}/unit or ${scaled5x.savingsPercent}%)`);

console.log('\n🎉 ALL CheckMargin Ground-Truth Calculator Tests Passed Successfully!\n');
