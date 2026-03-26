'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const t = useTranslations('navigation');
  const [scrolled, setScrolled] = useState(false);

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
              className="h-7 w-auto invert"
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
          </nav>

          {/* Right side: language switcher always visible */}
          <div className="flex items-center">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
