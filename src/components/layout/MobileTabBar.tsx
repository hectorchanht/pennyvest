'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { Cpu, Factory, User, Gem, Bitcoin } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = {
  href: string;
  labelKey: string;
  icon: React.ElementType;
  match: string;
};

const tabs: Tab[] = [
  { href: '/fund/future-tech', labelKey: 'futureTech', icon: Cpu, match: '/fund/future-tech' },
  { href: '/fund/traditional', labelKey: 'traditional', icon: Factory, match: '/fund/traditional' },
  { href: '/profile', labelKey: 'profile', icon: User, match: '/profile' },
  { href: '/fund/commodities', labelKey: 'commodities', icon: Gem, match: '/fund/commodities' },
  { href: '/fund/crypto', labelKey: 'crypto', icon: Bitcoin, match: '/fund/crypto' },
];

export default function MobileTabBar() {
  const t = useTranslations('navigation');
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.match || pathname.startsWith(tab.match + '/');

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs transition-colors',
                isActive
                  ? 'text-brand-green'
                  : 'text-text-muted hover:text-text-secondary'
              )}
            >
              <Icon className="size-5" />
              <span className="truncate max-w-full px-1">{t(tab.labelKey as Parameters<typeof t>[0])}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
