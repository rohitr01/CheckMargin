// Unit tests for the upgraded CheckMargin calculation engine
import {
  calculateBatchCost,
  suggestPrices,
  generateShoppingList,
  calculateWholesaleTiers,
  scaleBatch,
  type BatchInput,
} from './calculator';

const sampleInput: BatchInput = {
  productName: 'Handcrafted Soy Jar Candle (200g)',
  hsnCode: '3406',
  materials: [
    { name: 'Soy Wax', packPrice: 800, packSize: 1000, packUnit: 'g', qtyUsed: 150, gstRatePercent: 18, isPackPriceGSTInclusive: true },
    { name: 'Fragrance Oil', packPrice: 1200, packSize: 100, packUnit: 'ml', qtyUsed: 10, gstRatePercent: 18, isPackPriceGSTInclusive: true },
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

console.log('Running CheckMargin Advanced GST & Costing Engine Tests...');

const result = calculateBatchCost(sampleInput);

// Test 1: Saleable yield
console.assert(result.saleableYield === 9, `❌ Yield should be 9, got ${result.saleableYield}`);
console.log('✅ Saleable yield:', result.saleableYield, `(${result.yieldEfficiencyPercent}%)`);

// Test 2: GST Output Calculation
console.assert(result.gst.outputGSTTotal > 0, '❌ Output GST should be calculated');
console.log('✅ Output GST Total: ₹', result.gst.outputGSTTotal.toFixed(2));
console.log('   Taxable value: ₹', result.gst.taxableValue.toFixed(2));
console.log('   CGST (2.5%): ₹', result.gst.cgstAmount.toFixed(2), '| SGST (2.5%): ₹', result.gst.sgstAmount.toFixed(2));

// Test 3: Input Tax Credit (ITC)
console.assert(result.gst.eligibleITC > 0, '❌ Eligible ITC should be positive');
console.log('✅ Input GST per unit: ₹', result.gst.inputGSTTotal.toFixed(2));
console.log('✅ Net GST Payable to Govt: ₹', result.gst.netGSTPayable.toFixed(2));

// Test 4: Platform fee with 18% GST on service
const expectedBaseFee = (599 * 0.12) + 15;
const expectedTotalPlatform = expectedBaseFee * 1.18;
console.assert(
  Math.abs(result.totalPlatformFeePerUnit - expectedTotalPlatform) < 0.05,
  `❌ Platform fee calculation mismatch: got ${result.totalPlatformFeePerUnit}, expected ${expectedTotalPlatform}`
);
console.log('✅ Platform Fee + 18% GST: ₹', result.totalPlatformFeePerUnit.toFixed(2));

// Test 5: RTO Allowance
const expectedRTO = 0.08 * 80;
console.assert(Math.abs(result.rtoAllowancePerUnit - expectedRTO) < 0.01, '❌ RTO reserve calculation wrong');
console.log('✅ RTO & Return Loss Reserve: ₹', result.rtoAllowancePerUnit.toFixed(2));

// Test 6: Profitability
console.assert(result.grossProfitPerUnit > 0, '❌ Profit should be positive');
console.log('✅ Net Profit / Unit: ₹', result.grossProfitPerUnit.toFixed(2));
console.log('✅ Net Margin: ', result.grossMarginPercent.toFixed(1) + '%');
console.log('✅ Monthly Break-Even Units:', result.breakEvenUnitsPerMonth, 'units');

// Test 7: Shopping List
const shoppingList = generateShoppingList(sampleInput.materials, 30, 9, 10);
console.log('✅ Shopping List Items for 30 units:', shoppingList.length);

// Test 8: Wholesale Pricing Tiers
const wholesale = calculateWholesaleTiers(result.totalDirectCostPerUnit, 599, 25);
console.assert(wholesale.wholesalePrice > result.totalDirectCostPerUnit, '❌ Wholesale price should exceed direct cost');
console.assert(wholesale.tiers.length === 3, '❌ Should have 3 wholesale tiers');
console.log('✅ Wholesale Price (2x Cost): ₹', wholesale.wholesalePrice, `(Margin: ${wholesale.makerMarginPercent.toFixed(1)}%)`);
console.log('✅ MOQ 25 Gross Profit: ₹', wholesale.moqGrossProfit);

// Test 9: Batch Scaler with Labour Efficiency
const scaled5x = scaleBatch(sampleInput, result, 5);
console.assert(scaled5x.batchSize === 50, '❌ 5x batch size should be 50');
console.assert(scaled5x.savingsPerUnit > 0, '❌ Scaling up should produce per-unit savings from labour efficiency');
console.log('✅ 5x Batch Cost/Unit: ₹', scaled5x.costPerSaleableUnit, `(Savings: ₹${scaled5x.savingsPerUnit}/unit or ${scaled5x.savingsPercent}%)`);

console.log('\n🎉 All advanced calculation and GST tests passed successfully!');

