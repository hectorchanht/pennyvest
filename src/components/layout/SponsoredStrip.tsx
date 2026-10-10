'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  TIP_JAR_URL,
  SPONSORED_STORAGE_KEY,
  getActiveReferralLinks,
  type SponsoredLink,
} from '@/lib/sponsored';

const PILL =
  'shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium leading-4 transition-opacity hover:opacity-85';

/**
 * Slim sponsored strip — the first content block under the header.
 *
 * Honor-system dismiss: tippers can hide it with the × button, which stores
 * `dawn_sponsored_hidden=1` in localStorage. No license verification.
 */
export default function SponsoredStrip() {
  const t = useTranslations('sponsored');
  const [dismissed, setDismissed] = useState(false);

  // Hydration-safe: the server and the first client render both show the
  // strip, so the HTML matches. The stored preference applies in an effect.
  useEffect(() => {
    try {
      if (window.localStorage.getItem(SPONSORED_STORAGE_KEY) === '1') {
        setDismissed(true);
      }
    } catch {
      // Storage unavailable — keep the strip visible.
    }
  }, []);

  if (dismissed) return null;

  const links = getActiveReferralLinks();

  const dismiss = () => {
    try {
      window.localStorage.setItem(SPONSORED_STORAGE_KEY, '1');
    } catch {
      // Storage unavailable — still hide for this session.
    }
    setDismissed(true);
  };

  return (
    <div className="pt-16">
      <div className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
              {t('disclosure')}
            </span>
            <a
              href={TIP_JAR_URL}
              target="_blank"
              rel="noopener"
              className={PILL}
              style={{ backgroundColor: '#F0A832', color: '#000000' }}
            >
              {t('tipJar')}
            </a>
            {links.map((link: SponsoredLink) => (
              <a
                key={link.key}
                href={link.url}
                target="_blank"
                rel="noopener sponsored"
                className={PILL}
                style={{ backgroundColor: link.bg, color: link.fg }}
              >
                {t(link.key)}
              </a>
            ))}
            <button
              type="button"
              onClick={dismiss}
              title={t('dismissTitle')}
              aria-label={t('dismissTitle')}
              className="ml-auto shrink-0 px-1 text-sm leading-none text-text-muted opacity-40 transition-opacity hover:opacity-100"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
