import { NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'node:crypto';

/**
 * POST /api/verify-tip — verifies a tip-jar license key so tippers can hide
 * the sponsored strip.
 *
 * Body: { licenseKey: string }
 * Returns: { ok: boolean, admin?: true }
 *
 * Two paths to ok:true:
 *  1. Admin key — the SHA-256 hex of the trimmed input matches the hardcoded
 *     hash (Hector's master key, delivered to him in chat; plaintext is never
 *     stored). Checked first, without touching Gumroad.
 *  2. Gumroad — the key verifies against the pennyvest-tip product permalink
 *     and the purchase is not refunded/chargebacked.
 *
 * Fails closed: empty/oversize input, any transport/upstream/shape problem
 * answers { ok: false }. The input is never logged.
 */
const ADMIN_KEY_SHA256 =
  '67d2d8519b0160af28a8d8f6c3cc97d810fda37161d2b10b1359d480c4ecad77';

const GUMROAD_VERIFY_URL = 'https://api.gumroad.com/v2/licenses/verify';
const PRODUCT_PERMALINK = 'pennyvest-tip';

type GumroadVerify = {
  success?: boolean;
  purchase?: {
    refunded?: boolean;
    chargebacked?: boolean;
  };
};

export async function POST(request: Request) {
  let licenseKey: unknown;
  try {
    const body = (await request.json()) as { licenseKey?: unknown };
    licenseKey = body?.licenseKey;
  } catch {
    return NextResponse.json({ ok: false });
  }

  if (typeof licenseKey !== 'string') {
    return NextResponse.json({ ok: false });
  }
  const key = licenseKey.trim();
  if (!key || key.length > 200) {
    return NextResponse.json({ ok: false });
  }

  // Admin key: SHA-256 of the input matches the hardcoded hash. No Gumroad
  // call, so Hector's unlock never depends on Gumroad's availability.
  const digest = createHash('sha256').update(key, 'utf8').digest();
  const expected = Buffer.from(ADMIN_KEY_SHA256, 'hex');
  if (digest.length === expected.length && timingSafeEqual(digest, expected)) {
    return NextResponse.json({ ok: true, admin: true });
  }

  // Gumroad license verification — fail closed on any error.
  try {
    const res = await fetch(GUMROAD_VERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        product_permalink: PRODUCT_PERMALINK,
        license_key: key,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false });
    }
    const data = (await res.json()) as GumroadVerify;
    // Shape guard: never treat a weird upstream reply as a verified key.
    if (!data || data.success !== true) {
      return NextResponse.json({ ok: false });
    }
    // A refunded / chargebacked purchase must NOT hide the strip.
    if (data.purchase?.refunded === true || data.purchase?.chargebacked === true) {
      return NextResponse.json({ ok: false });
    }
    return NextResponse.json({ ok: true });
  } catch {
    // Network/API error — fail closed.
    return NextResponse.json({ ok: false });
  }
}
