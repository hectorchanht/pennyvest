/**
 * Centralized sponsored-strip configuration.
 *
 * Paste a real URL into any empty string below and its button appears
 * automatically — no other code changes needed. Empty URLs render nothing.
 * The tip jar URL is always set, so the strip never renders empty.
 */

export const SPONSORED_STORAGE_KEY = 'dawn_sponsored_hidden';

/** localStorage flag set on successful tip verification — marks the user as a supporter for future feature unlocks. */
export const SUPPORTER_STORAGE_KEY = 'dawn_supporter';

/** localStorage key holding the user's own verified license key (for pre-fill + copy). */
export const TIP_LICENSE_STORAGE_KEY = 'dawn_tip_license_key';

export const TIP_JAR_URL = 'https://dawnlimited.gumroad.com/l/pennyvest-tip';

export type SponsoredKey =
  | 'wise'
  | 'coinbase'
  | 'binance'
  | 'airalo'
  | 'koinly'
  | 'airwallex';

export interface SponsoredLink {
  key: SponsoredKey;
  url: string;
  /** Button background color */
  bg: string;
  /** Button text color */
  fg: string;
}

const LINKS: Record<SponsoredKey, { url: string; bg: string; fg: string }> = {
  wise: {
    url: 'https://wise.com/invite/dic/hotungc3',
    bg: '#9FE870',
    fg: '#000000',
  },
  coinbase: {
    url: 'https://advanced.coinbase.com/join/F95MLKD?src=referral-link',
    bg: '#0052FF',
    fg: '#FFFFFF',
  },
  binance: {
    url: 'https://www.binance.com/activity/referral-entry/CPA?ref=CPA_0027L6WVRQ',
    bg: '#F0B90B',
    fg: '#000000',
  },
  // Placeholders — buttons stay hidden until Hector pastes real URLs.
  airalo: { url: '', bg: '#FF5C39', fg: '#FFFFFF' },
  koinly: { url: '', bg: '#16A34A', fg: '#FFFFFF' },
  airwallex: { url: '', bg: '#5B2EE5', fg: '#FFFFFF' },
};

/** Returns the link for a key, or null when its URL is empty. */
export function getSponsoredLink(key: SponsoredKey): SponsoredLink | null {
  const l = LINKS[key];
  if (!l || !l.url) return null;
  return { key, url: l.url, bg: l.bg, fg: l.fg };
}

/** hasXLink()-style guards — one per referral partner. */
export const hasWiseLink = () => !!LINKS.wise.url;
export const hasCoinbaseLink = () => !!LINKS.coinbase.url;
export const hasBinanceLink = () => !!LINKS.binance.url;
export const hasAiraloLink = () => !!LINKS.airalo.url;
export const hasKoinlyLink = () => !!LINKS.koinly.url;
export const hasAirwallexLink = () => !!LINKS.airwallex.url;

/** All referral links with non-empty URLs, in display order. */
export function getActiveReferralLinks(): SponsoredLink[] {
  return (Object.keys(LINKS) as SponsoredKey[])
    .map(getSponsoredLink)
    .filter((l): l is SponsoredLink => l !== null);
}

/**
 * True when this device belongs to a verified tipper (a supporter).
 * SSR-safe: false on the server and whenever storage is unavailable.
 * Nothing is gated on this yet — it exists for future feature unlocks.
 */
export function isSupporter(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    return window.localStorage.getItem(SUPPORTER_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}
