'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { track } from '@/lib/analytics';
import {
  SPONSORED_STORAGE_KEY,
  SUPPORTER_STORAGE_KEY,
  TIP_LICENSE_STORAGE_KEY,
} from '@/lib/sponsored';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

type Status = 'idle' | 'verifying' | 'error';

/**
 * "Supporter" settings section — tippers verify the Gumroad license key from
 * their purchase receipt email.
 *
 * Successful verification stores:
 *   - dawn_supporter=1      (supporter status for future feature unlocks)
 *   - dawn_tip_license_key  (the key itself, for pre-fill + copy)
 * The sponsored strip is NOT auto-hidden on verify. Supporters get a choice:
 * a "Hide sponsored strip" toggle (default OFF) sets/clears
 * dawn_sponsored_hidden=1, and SponsoredStrip renders nothing while it is set.
 *
 * The stored key is only ever sent to /api/verify-tip on an explicit Verify
 * click, never auto-submitted on load.
 *
 * Back-compat: verifications from the old auto-hide model set only
 * dawn_sponsored_hidden=1 — on first load we backfill dawn_supporter=1 so
 * those users keep supporter status and their existing hidden preference.
 */
export default function SponsoredVerifySection() {
  const t = useTranslations('sponsored');
  const [verified, setVerified] = useState(false);
  const [hideStrip, setHideStrip] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const ls = window.localStorage;
      if (
        ls.getItem(SPONSORED_STORAGE_KEY) === '1' &&
        ls.getItem(SUPPORTER_STORAGE_KEY) !== '1'
      ) {
        ls.setItem(SUPPORTER_STORAGE_KEY, '1');
      }
      if (ls.getItem(SUPPORTER_STORAGE_KEY) === '1') {
        setVerified(true);
      }
      if (ls.getItem(SPONSORED_STORAGE_KEY) === '1') {
        setHideStrip(true);
      }
      const storedKey = ls.getItem(TIP_LICENSE_STORAGE_KEY);
      if (storedKey) {
        setLicenseKey(storedKey);
      }
    } catch {
      // Storage unavailable — stay unverified with an empty input.
    }
    return () => {
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
    };
  }, []);

  const verify = async () => {
    const key = licenseKey.trim();
    if (!key) {
      setStatus('error');
      return;
    }
    setStatus('verifying');
    try {
      const res = await fetch('/api/verify-tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey: key }),
      });
      const data = (await res.json()) as { ok?: boolean };
      if (data?.ok === true) {
        try {
          // Choice model: verification marks the user as a supporter and
          // persists the key. It does NOT auto-hide the strip — the user
          // opts into hiding via the toggle (default OFF).
          window.localStorage.setItem(SUPPORTER_STORAGE_KEY, '1');
          window.localStorage.setItem(TIP_LICENSE_STORAGE_KEY, key);
        } catch {
          // Storage unavailable — still show verified for this session.
        }
        setLicenseKey(key);
        setVerified(true);
        setStatus('idle');
        track('tip_verified', { success: true });
        track('supporter_status_changed', { is_supporter: true });
      } else {
        track('tip_verified', { success: false });
        setStatus('error');
      }
    } catch {
      track('tip_verified', { success: false });
      setStatus('error');
    }
  };

  const setStripHidden = (hidden: boolean) => {
    try {
      if (hidden) {
        window.localStorage.setItem(SPONSORED_STORAGE_KEY, '1');
      } else {
        window.localStorage.removeItem(SPONSORED_STORAGE_KEY);
      }
    } catch {
      // Storage unavailable — the toggle only applies to this session.
    }
    setHideStrip(hidden);
  };

  const copyKey = async () => {
    const key = licenseKey.trim();
    if (!key) return;
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(key);
        ok = true;
      }
    } catch {
      ok = false;
    }
    if (!ok) {
      // Fallback for non-secure contexts: temp textarea + execCommand.
      try {
        const ta = document.createElement('textarea');
        ta.value = key;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand('copy');
        document.body.removeChild(ta);
      } catch {
        ok = false;
      }
    }
    if (ok) {
      setCopied(true);
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          {t('sectionTitle')}
          {verified && (
            <span className="inline-flex shrink-0 items-center rounded-full bg-[#F0A832]/15 px-2 py-0.5 text-[11px] font-semibold text-[#F0A832]">
              ☕ {t('supporterBadge')}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {verified ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-text-primary">
              {t('verifiedThanks')}
            </p>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5">
              <div>
                <span className="text-sm text-text-primary">
                  {t('hideStripLabel')}
                </span>
                <p className="text-xs text-text-muted">{t('hideStripNote')}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={hideStrip}
                aria-label={t('hideStripLabel')}
                onClick={() => setStripHidden(!hideStrip)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  hideStrip ? 'bg-brand-green' : 'bg-border'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                    hideStrip ? 'left-[22px]' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-text-secondary">{t('verifyPrompt')}</p>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') verify();
            }}
            placeholder={t('licensePlaceholder')}
            autoComplete="off"
            spellCheck={false}
            disabled={status === 'verifying'}
            className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none disabled:opacity-50"
          />
          <Button
            type="button"
            variant="outline"
            onClick={copyKey}
            disabled={!licenseKey.trim() || status === 'verifying'}
            aria-label={t('copyKey')}
          >
            {copied ? t('copied') : t('copyKey')}
          </Button>
        </div>
        {status === 'error' && (
          <p className="text-sm text-destructive">{t('verifyError')}</p>
        )}
        <Button
          onClick={verify}
          disabled={status === 'verifying'}
          className="w-full bg-brand-green text-black hover:bg-brand-green/90"
          size="lg"
        >
          {status === 'verifying' ? t('verifying') : t('verify')}
        </Button>
      </CardContent>
    </Card>
  );
}
