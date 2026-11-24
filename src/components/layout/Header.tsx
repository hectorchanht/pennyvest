'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { Bitcoin, ClipboardList, Cpu, Factory, Gem, LogIn, LogOut, Users } from 'lucide-react';
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

          {/* Desktop nav — hidden on mobile; icon-only, names via aria-label/title */}
          <nav className="hidden md:flex items-center gap-1">
            {(
              [
                { href: '/fund/future-tech', label: t('futureTech'), Icon: Cpu },
                { href: '/fund/traditional', label: t('traditional'), Icon: Factory },
                { href: '/fund/commodities', label: t('commodities'), Icon: Gem },
                { href: '/fund/crypto', label: t('crypto'), Icon: Bitcoin },
                { href: '/profiles', label: t('profiles'), Icon: Users },
              ] as const
            ).map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                aria-label={label}
                title={label}
                className="flex size-10 items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
              >
                <Icon className="size-5" />
              </Link>
            ))}
            <Link
              href="/questionnaire"
              aria-label={t('questionnaire')}
              title={t('questionnaire')}
              className="flex size-10 items-center justify-center rounded-md text-brand-green hover:text-brand-green/80 hover:bg-surface transition-colors"
            >
              <ClipboardList className="size-5" />
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
                  aria-label={tAuth('signOut')}
                  title={tAuth('signOut')}
                  className="flex size-9 items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
                >
                  <LogOut className="size-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/auth/sign-in"
                aria-label={tAuth('signIn')}
                title={tAuth('signIn')}
                className="flex size-9 items-center justify-center rounded-md text-brand-green hover:text-brand-green/80 hover:bg-surface transition-colors"
              >
                <LogIn className="size-4" />
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
