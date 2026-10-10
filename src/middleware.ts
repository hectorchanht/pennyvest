import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// NOTE (Cloudflare migration): Next 16 renamed middleware.ts -> proxy.ts and
// made Proxy Node.js-only, which @opennextjs/cloudflare cannot run. The
// deprecated middleware.ts convention still compiles to Edge middleware,
// which is what Workers need. next-intl's middleware is edge-compatible.
export default createMiddleware(routing);

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
