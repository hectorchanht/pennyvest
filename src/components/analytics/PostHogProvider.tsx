'use client';

import { useEffect } from 'react';
import { initAnalytics, trackFirstOpen } from '@/lib/analytics';

/**
 * Client root provider for PostHog. Mounts once under the locale layout;
 * initialization happens in a useEffect so it never runs on the server
 * (and never inside the Edge middleware runtime).
 */
export default function PostHogProvider({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    initAnalytics();
    trackFirstOpen(locale);
  }, [locale]);

  return <>{children}</>;
}
