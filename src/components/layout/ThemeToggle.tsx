'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const t = useTranslations('theme');
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const isDark = stored === 'dark' || (!stored && document.documentElement.classList.contains('dark'));
    setDark(isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center justify-center rounded-md p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
      aria-label={dark ? t('switchToLight') : t('switchToDark')}
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
