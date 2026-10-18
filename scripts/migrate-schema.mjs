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
  console.log('Running non-destructive Neon PostgreSQL schema reconciliation...');

  // 1. user_profiles reconciliation
  console.log('Reconciling user_profiles table...');
  await sql`
    ALTER TABLE user_profiles
    ADD COLUMN IF NOT EXISTS neon_user_id text,
    ADD COLUMN IF NOT EXISTS email text,
    ADD COLUMN IF NOT EXISTS primary_industry text,
    ADD COLUMN IF NOT EXISTS plan text DEFAULT 'free';
  `;

  // Backfill neon_user_id from auth_user_id if null
  await sql`
    UPDATE user_profiles
    SET neon_user_id = auth_user_id
    WHERE neon_user_id IS NULL AND auth_user_id IS NOT NULL;
  `;

  // Backfill primary_industry from primary_category if null
  await sql`
    UPDATE user_profiles
    SET primary_industry = primary_category
    WHERE primary_industry IS NULL AND primary_category IS NOT NULL;
  `;

  // Ensure unique index on neon_user_id and auth_user_id
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_auth_user_id_idx ON user_profiles (auth_user_id);
  `;
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_neon_user_id_idx ON user_profiles (neon_user_id);
  `;
  console.log('✅ user_profiles reconciled.');

  // 2. products reconciliation
  console.log('Reconciling products table...');
  await sql`
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS title text,
    ADD COLUMN IF NOT EXISTS industry_group text,
    ADD COLUMN IF NOT EXISTS gst_rate numeric DEFAULT 0,
    ADD COLUMN IF NOT EXISTS is_digital boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS batch_input jsonb,
    ADD COLUMN IF NOT EXISTS calculation_result jsonb,
    ADD COLUMN IF NOT EXISTS saleable_yield_text text;
  `;

  // Backfill title from name and vice versa
  await sql`
    UPDATE products
    SET title = name
    WHERE title IS NULL AND name IS NOT NULL;
  `;
  await sql`
    UPDATE products
    SET name = title
    WHERE name IS NULL AND title IS NOT NULL;
  `;
  await sql`
    UPDATE products
    SET industry_group = category
    WHERE industry_group IS NULL AND category IS NOT NULL;
  `;
  console.log('✅ products reconciled.');

  // 3. subscriptions reconciliation
  console.log('Reconciling subscriptions table...');
  await sql`
    ALTER TABLE subscriptions
    ADD COLUMN IF NOT EXISTS plan text DEFAULT 'free';
  `;

  await sql`
    UPDATE subscriptions
    SET plan = plan_id
    WHERE plan IS NULL AND plan_id IS NOT NULL;
  `;
  console.log('✅ subscriptions reconciled.');

  console.log('\n🎉 Schema migration completed successfully!');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
