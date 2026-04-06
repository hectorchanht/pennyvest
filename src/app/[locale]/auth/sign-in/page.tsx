'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { authClient } from '@/lib/auth/client';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

export default function SignInPage() {
  const t = useTranslations('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || t('signInFailed'));
        setLoading(false);
        return;
      }

      window.location.href = '/';
    } catch {
      setError(t('genericError'));
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary">{t('signInTitle')}</h1>
          <p className="mt-2 text-sm text-text-secondary">
            {t('signInSubtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-text-secondary">
              {t('emailLabel')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
              placeholder={t('emailPlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-text-secondary">
              {t('passwordLabel')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
              placeholder={t('passwordPlaceholder')}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-green text-black hover:bg-brand-green/90"
            size="lg"
          >
            {loading ? t('signingIn') : t('signIn')}
          </Button>
        </form>

        <p className="text-center text-sm text-text-secondary">
          {t('noAccount')}{' '}
          <Link href="/auth/sign-up" className="text-brand-green hover:underline">
            {t('signUp')}
          </Link>
        </p>
      </div>
    </div>
  );
}
