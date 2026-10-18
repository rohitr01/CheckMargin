import { neon } from '@neondatabase/serverless';
import assert from 'node:assert';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function testIntegration() {
  console.log('Testing live Neon PostgreSQL integration with reconciled schema...');

  const testUserId = `test_audit_user_${Date.now()}`;
  const testEmail = `test_${Date.now()}@checkmargin.dev`;

  // 1. Test profile creation & retrieval
  console.log('1. Testing user profile creation...');
  const insertedProfile = await sql`
    INSERT INTO user_profiles (
      auth_user_id,
      neon_user_id,
      email,
      display_name,
      business_name,
      primary_category,
      primary_industry,
      plan
    )
    VALUES (
      ${testUserId},
      ${testUserId},
      ${testEmail},
      'Audit Test Maker',
      'Artisan Candle Studio',
      'Candles',
      'Candles',
      'free'
    )
    RETURNING id, auth_user_id, neon_user_id, email, display_name, primary_industry, plan;
  `;

  assert.strictEqual(insertedProfile.length, 1, 'Profile should be created');
  assert.strictEqual(insertedProfile[0].auth_user_id, testUserId);
  assert.strictEqual(insertedProfile[0].plan, 'free');
  console.log('✅ Profile creation verified:', insertedProfile[0]);

  // 2. Test product creation with both original and extended columns
  console.log('\n2. Testing product creation with reconciled columns...');
  const insertedProduct = await sql`
    INSERT INTO products (
      user_id,
      name,
      title,
      category,
      industry_group,
      hsn_code,
      gst_rate,
      is_digital,
      unit_cost,
      selling_price,
      margin_percent,
      saleable_yield,
      saleable_yield_text,
      batch_size,
      batch_input,
      calculation_result
    )
    VALUES (
      ${testUserId},
      'Test Soy Jar Candle',
      'Test Soy Jar Candle',
      'Candles',
      'Candles',
      '3406',
      5,
      false,
      120.50,
      499.00,
      60.5,
      9,
      '9 / 10',
      10,
      ${JSON.stringify({ batchSize: 10, failedUnits: 1 })}::jsonb,
      ${JSON.stringify({ unitCost: 120.50, profit: 300 })}::jsonb
    )
    RETURNING id, user_id, title, name, saleable_yield, saleable_yield_text, batch_size;
  `;

  assert.strictEqual(insertedProduct.length, 1, 'Product should be created');
  assert.strictEqual(insertedProduct[0].saleable_yield, 9, 'Integer saleable yield preserved');
  assert.strictEqual(insertedProduct[0].saleable_yield_text, '9 / 10', 'Formatted yield string preserved');
  console.log('✅ Product creation verified:', insertedProduct[0]);

  // 3. Test product listing query
  console.log('\n3. Testing product listing query...');
  const listRows = await sql`
    SELECT 
      id,
      user_id,
      COALESCE(title, name) as title,
      COALESCE(name, title) as name,
      unit_cost,
      selling_price,
      margin_percent,
      saleable_yield,
      saleable_yield_text,
      batch_size
    FROM products
    WHERE user_id = ${testUserId}
  `;
  assert.strictEqual(listRows.length, 1);
  assert.strictEqual(listRows[0].title, 'Test Soy Jar Candle');
  console.log('✅ Product listing verified.');

  // Clean up test records
  console.log('\n4. Cleaning up test records...');
  await sql`DELETE FROM products WHERE user_id = ${testUserId}`;
  await sql`DELETE FROM user_profiles WHERE auth_user_id = ${testUserId}`;
  console.log('✅ Cleanup complete.');

  console.log('\n🎉 ALL Live Neon Database Integration Tests Passed Successfully!');
}

testIntegration().catch((err) => {
  console.error('Integration test failed:', err);
  process.exit(1);
});
