import posthog from 'posthog-js';

/**
 * PostHog product analytics — browser only.
 *
 * All six Dawn Studio apps share one PostHog project (org "dawn studio"),
 * so EVERY event carries the `app: 'pennyvest'` super property via
 * posthog.register() below — without it the shared data is unusable.
 *
 * Key/host resolution: NEXT_PUBLIC_POSTHOG_KEY / NEXT_PUBLIC_POSTHOG_HOST
 * first, falling back to the hardcoded public client key + host (these are
 * public client keys, safe to ship in frontend bundles).
 *
 * Privacy: autocapture OFF (only manual track() calls), session replay OFF,
 * pageview + pageleave auto-captured. No PII — anonymous IDs only; never
 * call posthog.identify() with an email.
 */

const FALLBACK_KEY = 'phc_Dn2EebGR8eVrLKfQwArtfwxE4cUKQq2NPhwMRph4LqUf';
const FALLBACK_HOST = 'https://us.i.posthog.com';

const APP_TAG = 'pennyvest';
const FIRST_OPEN_KEY = 'ph_pennyvest_first_open';

let initialized = false;

function resolveKey(): string {
  return process.env.NEXT_PUBLIC_POSTHOG_KEY || FALLBACK_KEY;
}

function resolveHost(): string {
  return process.env.NEXT_PUBLIC_POSTHOG_HOST || FALLBACK_HOST;
}

/**
 * Initialize PostHog in the browser. Safe to call multiple times; no-op on
 * the server or before window exists.
 */
export function initAnalytics(): void {
  if (initialized) return;
  if (typeof window === 'undefined') return;

  posthog.init(resolveKey(), {
    api_host: resolveHost(),
    autocapture: false,
    capture_pageview: true,
    capture_pageleave: true,
    disable_session_recording: true,
  });
  // Super property: every event from this app is tagged with app='pennyvest'.
  posthog.register({ app: APP_TAG });
  initialized = true;
}

export function isAnalyticsReady(): boolean {
  return initialized;
}

/**
 * Fire a custom event. No-op if analytics hasn't initialized (e.g. SSR or
 * before the provider mounts) — never throws.
 */
export function track(event: string, props?: Record<string, unknown>): void {
  if (!initialized || typeof window === 'undefined') return;
  posthog.capture(event, props);
}

/**
 * app_first_open — fires once per user (localStorage flag).
 * Props: referrer, utm_source, locale. No PII.
 */
export function trackFirstOpen(locale: string): void {
  if (!initialized || typeof window === 'undefined') return;
  try {
    if (window.localStorage.getItem(FIRST_OPEN_KEY) === '1') return;
    window.localStorage.setItem(FIRST_OPEN_KEY, '1');
  } catch {
    // Storage unavailable — still track this visit.
  }
  let utmSource: string | undefined;
  try {
    utmSource =
      new URLSearchParams(window.location.search).get('utm_source') || undefined;
  } catch {
    utmSource = undefined;
  }
  track('app_first_open', {
    referrer: document.referrer || undefined,
    utm_source: utmSource,
    locale,
  });
}
