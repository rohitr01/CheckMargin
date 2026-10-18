import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('DATABASE_URL is not set in .env.local');
  process.exit(1);
}

const sql = neon(dbUrl);

async function migrate() {
  console.log('Running non-destructive migration for business categories on Neon PostgreSQL...');

  await sql`
    ALTER TABLE user_profiles
    ADD COLUMN IF NOT EXISTS business_category_id text DEFAULT 'candles-fragrance',
    ADD COLUMN IF NOT EXISTS is_custom_category boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS custom_category_name text,
    ADD COLUMN IF NOT EXISTS custom_category_desc text,
    ADD COLUMN IF NOT EXISTS custom_product_or_service text,
    ADD COLUMN IF NOT EXISTS custom_product_type text DEFAULT 'physical';
  `;

  // Update business_category_id based on existing primary_industry if present
  await sql`
    UPDATE user_profiles
    SET business_category_id = CASE
      WHEN LOWER(COALESCE(primary_industry, '')) LIKE '%candle%' THEN 'candles-fragrance'
      WHEN LOWER(COALESCE(primary_industry, '')) LIKE '%soap%' THEN 'beauty-personal-care'
      WHEN LOWER(COALESCE(primary_industry, '')) LIKE '%resin%' THEN 'home-decor-lifestyle'
      WHEN LOWER(COALESCE(primary_industry, '')) LIKE '%bake%' OR LOWER(COALESCE(primary_industry, '')) LIKE '%food%' THEN 'food-bakery'
      WHEN LOWER(COALESCE(primary_industry, '')) LIKE '%cosmetic%' THEN 'beauty-personal-care'
      WHEN LOWER(COALESCE(primary_industry, '')) LIKE '%jewel%' THEN 'jewellery'
      WHEN LOWER(COALESCE(primary_industry, '')) LIKE '%apparel%' OR LOWER(COALESCE(primary_industry, '')) LIKE '%cloth%' THEN 'clothing-accessories'
      WHEN LOWER(COALESCE(primary_industry, '')) LIKE '%digital%' THEN 'digital-products'
      ELSE 'candles-fragrance'
    END
    WHERE business_category_id IS NULL;
  `;

  console.log('✅ user_profiles business category columns migrated successfully.');
}

migrate().catch((err) => {
  console.error('Migration error:', err);
  process.exit(1);
});
