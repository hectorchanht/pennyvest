'use client';

import { track } from '@/lib/analytics';

/**
 * Client wrapper for the footer tip-jar link so the click can be tracked.
 * Rendered inside the server Footer component.
 */
export default function TipJarLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="text-sm font-medium text-brand-green hover:underline"
      onClick={() => track('tip_jar_opened', { location: 'footer' })}
    >
      {label}
    </a>
  );
}
