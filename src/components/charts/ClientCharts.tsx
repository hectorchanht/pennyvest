'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { EquityPoint } from '@/types/prices';

const AllocationDonutDynamic = dynamic(
  () => import('@/components/charts/AllocationDonut'),
  { ssr: false, loading: () => <Skeleton className="h-[220px] w-full rounded-lg" /> }
);

const EquityCurveDynamic = dynamic(
  () => import('@/components/charts/EquityCurve'),
  { ssr: false, loading: () => <Skeleton className="h-[180px] w-full rounded-lg" /> }
);

interface AllocationDonutClientProps {
  allocations: { name: string; ticker: string; weight: number }[];
  centerLabel?: string;
  title: string;
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
