'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'flex size-9 items-center justify-center rounded-md transition-colors',
          'hover:bg-surface text-text-secondary hover:text-text-primary'
        )}
        aria-label="Switch language"
        title="Switch language"
      >
        <Globe className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" sideOffset={8}>
        <DropdownMenuItem
          className={cn(locale === 'en' && 'font-semibold')}
          onClick={() => switchLocale('en')}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(locale === 'zh-HK' && 'font-semibold')}
          onClick={() => switchLocale('zh-HK')}
        >
          中文 (繁體)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
