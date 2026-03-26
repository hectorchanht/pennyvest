'use client';

import { useRef } from 'react';
import { useRouter } from '@/i18n/navigation';

interface SwipeNavigatorProps {
  children: React.ReactNode;
  prevSlug: string | null;
  nextSlug: string | null;
}

export default function SwipeNavigator({ children, prevSlug, nextSlug }: SwipeNavigatorProps) {
  const router = useRouter();
  const touchStartX = useRef<number>(0);

  function onTouchStart(e: React.TouchEvent) {
    const touch = e.touches[0];
    if (touch) touchStartX.current = touch.clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    const touch = e.changedTouches[0];
    if (!touch) return;
    const delta = touch.clientX - touchStartX.current;
    if (delta < -50 && nextSlug) {
      router.push(`/fund/${nextSlug}`);
    } else if (delta > 50 && prevSlug) {
      router.push(`/fund/${prevSlug}`);
    }
  }

  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {children}
    </div>
  );
}
