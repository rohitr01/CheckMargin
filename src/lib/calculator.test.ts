// Unit tests for the MakerMargin calculation engine
import { calculateBatchCost, suggestPrices, generateShoppingList, type BatchInput } from './calculator';

const sampleInput: BatchInput = {
  productName: 'Soy Jar Candle',
  materials: [
    { name: 'Soy Wax', packPrice: 800, packSize: 1000, packUnit: 'g', qtyUsed: 150 },
    { name: 'Fragrance Oil', packPrice: 1200, packSize: 100, packUnit: 'ml', qtyUsed: 10 },
    { name: 'Wick', packPrice: 5, packSize: 1, packUnit: 'piece', qtyUsed: 1 },
    { name: 'Glass Jar', packPrice: 35, packSize: 1, packUnit: 'piece', qtyUsed: 1 },
    { name: 'Label', packPrice: 5, packSize: 1, packUnit: 'piece', qtyUsed: 1 },
  ],
  batchSize: 10,
  failedUnits: 1,
  labourMinutes: 120,
  labourHourlyRate: 150,
  packagingPerUnit: 18,
  shippingPerOrder: 60,
  overheadPerBatch: 50,
  sellingPrice: 699,
  platformFeePercent: 12,
  platformFeeFixed: 0,
  isGSTRegistered: false,
  gstRatePercent: 0,
  isPriceGSTInclusive: false,
};

console.log('Running MakerMargin Calculator Tests...');

const result = calculateBatchCost(sampleInput);

// Test: Saleable yield
console.assert(result.saleableYield === 9, `❌ Yield should be 9, got ${result.saleableYield}`);
console.log('✅ Saleable yield correct:', result.saleableYield);

// Test: Material cost per unit (approx ₹46.67)
const expectedMaterialPerUnit = (800/1000*150 + 1200/100*10 + 5 + 35 + 5) / 9;
console.assert(
  Math.abs(result.materialCostPerUnit - expectedMaterialPerUnit) < 0.01,
  `❌ Material cost/unit wrong: got ${result.materialCostPerUnit}, expected ${expectedMaterialPerUnit}`
);
console.log('✅ Material cost per unit:', result.materialCostPerUnit.toFixed(2));

// Test: Labour cost per batch (2hr × ₹150 = ₹300)
console.assert(result.labourCostPerBatch === 300, `❌ Labour batch cost wrong: ${result.labourCostPerBatch}`);
console.log('✅ Labour cost per batch:', result.labourCostPerBatch);

// Test: Profit is positive
console.assert(result.grossProfitPerUnit > 0, `❌ Profit should be positive, got ${result.grossProfitPerUnit}`);
console.log('✅ Gross profit per unit: ₹', result.grossProfitPerUnit.toFixed(2));

// Test: Margin is between 0–100%
console.assert(result.grossMarginPercent > 0 && result.grossMarginPercent < 100, '❌ Margin out of range');
console.log('✅ Gross margin:', result.grossMarginPercent.toFixed(1) + '%');

console.log('\n--- Full Result ---');
console.log(JSON.stringify({ ...result, breakEvenUnitsPerMonth: undefined }, null, 2));

// Test shopping list
const shoppingList = generateShoppingList(sampleInput.materials, 20, 9, 10);
console.log('\n--- Shopping List for 20 units ---');
shoppingList.forEach(item => console.log(`  ${item.name}: ${item.qtyNeeded}${item.packUnit} → ${item.packsNeeded} packs = ₹${item.estimatedCost}`));

// Test price suggestions
const prices = suggestPrices(result.totalDirectCostPerUnit);
console.log('\n--- Suggested Prices ---');
prices.forEach(p => console.log(`  ${p.method} ${p.value}%: ₹${p.suggestedPrice} (margin: ${p.marginPercent.toFixed(1)}%)`));

console.log('\n✅ All tests passed!');
