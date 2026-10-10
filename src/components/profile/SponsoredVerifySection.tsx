'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { SPONSORED_STORAGE_KEY, TIP_LICENSE_STORAGE_KEY } from '@/lib/sponsored';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

type Status = 'idle' | 'verifying' | 'error';

/**
 * "Sponsored strip" settings section — lets tippers hide the sponsored strip
 * by verifying the Gumroad license key from their purchase receipt email.
 *
 * Verified → localStorage dawn_sponsored_hidden=1 → SponsoredStrip renders
 * nothing. The key itself is also persisted (dawn_tip_license_key) so the
 * input comes pre-filled on return visits — including after "Show again",
 * which clears only the hidden flag — and the copy button lets the user reuse
 * the key on another device or app. The stored key is only ever sent to
 * /api/verify-tip on an explicit Verify click, never auto-submitted on load.
 */
export default function SponsoredVerifySection() {
  const t = useTranslations('sponsored');
  const [verified, setVerified] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(SPONSORED_STORAGE_KEY) === '1') {
        setVerified(true);
      }
      const storedKey = window.localStorage.getItem(TIP_LICENSE_STORAGE_KEY);
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
          window.localStorage.setItem(SPONSORED_STORAGE_KEY, '1');
          window.localStorage.setItem(TIP_LICENSE_STORAGE_KEY, key);
        } catch {
          // Storage unavailable — still show verified for this session.
        }
        setLicenseKey(key);
        setVerified(true);
        setStatus('idle');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const showAgain = () => {
    // Clears only the hidden flag — the stored key stays for pre-fill/copy.
    try {
      window.localStorage.removeItem(SPONSORED_STORAGE_KEY);
    } catch {
      // ignore
    }
    setVerified(false);
    setStatus('idle');
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
        <CardTitle className="text-base">{t('sectionTitle')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {verified ? (
          <div className="space-y-3">
            <p className="text-sm text-text-secondary">{t('verifiedThanks')}</p>
            <button
              type="button"
              onClick={showAgain}
              className="text-sm font-medium text-brand-green hover:underline"
            >
              {t('showAgain')}
            </button>
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
