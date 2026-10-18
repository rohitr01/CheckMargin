import { createNeonAuth } from '@neondatabase/auth/next/server';

const baseUrl = process.env.NEON_AUTH_BASE_URL;
const secret = process.env.NEON_AUTH_COOKIE_SECRET || 'checkmargin_neon_auth_super_secret_cookie_key_production_2026_min32chars';

if (!baseUrl && process.env.NODE_ENV === 'production') {
  console.warn('NEON_AUTH_BASE_URL is not set.');
}

export const auth = createNeonAuth({
  baseUrl: baseUrl || 'https://ep-shiny-mouse-b3r8ssd8.neonauth.c-4.ap-southeast-1.aws.neon.tech/neondb/auth',
  cookies: {
    secret,
    sessionDataTtl: 300,
  },
});
