import { createNeonAuth } from '@neondatabase/auth/next/server';

const baseUrl = process.env.NEON_AUTH_BASE_URL;
const secret = process.env.NEON_AUTH_COOKIE_SECRET;

if (!baseUrl || !secret) {
  throw new Error(
    'CRITICAL SECURITY CONFIGURATION ERROR: NEON_AUTH_BASE_URL and NEON_AUTH_COOKIE_SECRET environment variables must be defined. Hardcoded fallback secrets are forbidden.'
  );
}

if (secret.length < 32) {
  throw new Error(
    'CRITICAL SECURITY CONFIGURATION ERROR: NEON_AUTH_COOKIE_SECRET must be at least 32 characters long.'
  );
}

export const auth = createNeonAuth({
  baseUrl,
  cookies: {
    secret,
    sessionDataTtl: 300,
  },
});
