'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth/client';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const t = useTranslations('navigation');
  const tAuth = useTranslations('auth');
  const [scrolled, setScrolled] = useState(false);
  const session = authClient.useSession();

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 80);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-colors duration-300',
        scrolled
          ? 'bg-background/95 backdrop-blur-sm border-b border-border'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold text-text-primary hover:text-brand-green transition-colors"
          >
            <img
              src="/logo.svg"
              alt=""
              className="h-7 w-auto dark:invert"
            />
            Pennyvest
          </Link>

          {/* Desktop nav — hidden on mobile */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/fund/future-tech"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {t('futureTech')}
            </Link>
            <Link
              href="/fund/traditional"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {t('traditional')}
            </Link>
            <Link
              href="/fund/commodities"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {t('commodities')}
            </Link>
            <Link
              href="/fund/crypto"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {t('crypto')}
            </Link>
            <Link
              href="/profiles"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {t('profiles')}
            </Link>
            <Link
              href="/questionnaire"
              className="text-sm font-medium text-brand-green hover:text-brand-green/80 transition-colors"
            >
              {t('questionnaire')}
            </Link>
          </nav>

          {/* Right side: auth + language switcher */}
          <div className="flex items-center gap-3">
            {session.isPending ? null : session.data?.user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-sm text-text-secondary">
                  {session.data.user.name || session.data.user.email}
                </span>
                <button
                  onClick={async () => {
                    await authClient.signOut();
                    window.location.href = '/';
                  }}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  {tAuth('signOut')}
                </button>
              </div>
            ) : (
              <Link
                href="/auth/sign-in"
                className="text-sm font-medium text-brand-green hover:text-brand-green/80 transition-colors"
              >
                {tAuth('signIn')}
              </Link>
            )}
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
