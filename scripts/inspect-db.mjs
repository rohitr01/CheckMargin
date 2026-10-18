import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function inspect() {
  const targetTables = ['user_profiles', 'subscriptions'];
  for (const t of targetTables) {
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = ${t}
      ORDER BY ordinal_position;
    `;
    console.log(`\n=== Table: ${t} ===`);
    console.table(columns);
  }
}

inspect().catch(console.error);
