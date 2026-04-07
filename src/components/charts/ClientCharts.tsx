'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { EquityPoint } from '@/types/prices';

const AllocationDonutDynamic = dynamic(
  () => import('@/components/landing/AllocationDonut'),
  { ssr: false, loading: () => <Skeleton className="h-[220px] w-[220px] rounded-full mx-auto" /> }
);

const EquityCurveDynamic = dynamic(
  () => import('@/components/charts/EquityCurve'),
  { ssr: false, loading: () => <Skeleton className="h-[180px] w-full rounded-lg" /> }
);

interface DonutSegment {
  slug: string;
  name: string;
  weight: number;
  color: string;
}

interface AllocationDonutClientProps {
  segments: DonutSegment[];
  activeSlug?: string | null;
  onHover?: (slug: string | null) => void;
}

export function AllocationDonutClient(props: AllocationDonutClientProps) {
  return <AllocationDonutDynamic {...props} />;
}

interface EquityCurveClientProps {
  data: EquityPoint[];
  simulatedLabel: string;
  title: string;
}

export function EquityCurveClient(props: EquityCurveClientProps) {
  return <EquityCurveDynamic {...props} />;
}
