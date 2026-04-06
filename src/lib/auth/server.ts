import { createNeonAuth } from '@neondatabase/auth/next/server';

function getAuth() {
  return createNeonAuth({
    baseUrl: process.env.NEON_AUTH_BASE_URL!,
    cookies: {
      secret: process.env.NEON_AUTH_COOKIE_SECRET!,
    },
  });
}

// Lazy singleton — only created on first access at runtime, not at build time
let _auth: ReturnType<typeof getAuth> | null = null;

export const auth = new Proxy({} as ReturnType<typeof getAuth>, {
  get(_target, prop) {
    if (!_auth) _auth = getAuth();
    return (_auth as Record<string | symbol, unknown>)[prop];
  },
});
