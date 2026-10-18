import { neon, Pool } from '@neondatabase/serverless';

// Ensure DATABASE_URL is set
const connectionString = process.env.DATABASE_URL;

if (!connectionString && process.env.NODE_ENV === 'production') {
  console.warn('DATABASE_URL environment variable is not set.');
}

/**
 * Serverless HTTP query runner for Neon PostgreSQL.
 * Best for stateless queries, fast cold starts, and connection-pooler scaling.
 */
export const sql = neon(connectionString || '');

/**
 * Standard PostgreSQL connection pool for multi-statement transactions.
 */
export const pool = new Pool({
  connectionString: connectionString || '',
});

/**
 * Helper to run parameterized SQL queries safely with typed results.
 */
export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured');
  }
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows as T[];
  } finally {
    client.release();
  }
}

/**
 * Health check to verify Neon PostgreSQL connectivity.
 */
export async function checkDatabaseHealth(): Promise<{ healthy: boolean; timestamp?: string; error?: string }> {
  try {
    const result = await sql`SELECT NOW() as current_time`;
    return {
      healthy: true,
      timestamp: String(result[0]?.current_time),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      healthy: false,
      error: message,
    };
  }
}
