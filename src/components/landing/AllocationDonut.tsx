'use client';

interface DonutSegment {
  slug: string;
  name: string;
  weight: number;
  color: string;
}

interface AllocationDonutProps {
  segments: DonutSegment[];
  activeSlug?: string | null;
  onHover?: (slug: string | null) => void;
}

const STRATEGY_COLORS: Record<string, string> = {
  'future-tech': '#22d3ee',   // cyan-400
  'traditional': '#4ade80',   // green-400
  'commodities': '#fbbf24',   // amber-400
  'crypto':      '#a78bfa',   // violet-400
};

export function getStrategyColor(slug: string): string {
  return STRATEGY_COLORS[slug] ?? '#6b7280';
}

export default function AllocationDonut({
  segments,
  activeSlug,
  onHover,
}: AllocationDonutProps) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 90;
  const innerR = 55;
  const gap = 0.02; // radians gap between segments

  // Build arcs
  let currentAngle = -Math.PI / 2; // start at top
  const arcs = segments.map((seg) => {
    const sweep = seg.weight * 2 * Math.PI - gap;
    const startAngle = currentAngle + gap / 2;
    const endAngle = startAngle + sweep;
    currentAngle += seg.weight * 2 * Math.PI;

    const largeArc = sweep > Math.PI ? 1 : 0;

    const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
    const outerEnd = polarToCartesian(cx, cy, outerR, endAngle);
    const innerStart = polarToCartesian(cx, cy, innerR, endAngle);
    const innerEnd = polarToCartesian(cx, cy, innerR, startAngle);

    const d = [
      `M ${outerStart.x} ${outerStart.y}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
      `L ${innerStart.x} ${innerStart.y}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
      'Z',
    ].join(' ');

    // Midpoint for label
    const midAngle = (startAngle + endAngle) / 2;
    const labelR = (outerR + innerR) / 2;
    const labelPos = polarToCartesian(cx, cy, labelR, midAngle);

    return {
      ...seg,
      d,
      midAngle,
      labelPos,
    };
  });

  const isActive = (slug: string) => activeSlug === slug;
  const isDimmed = (slug: string) => activeSlug !== null && activeSlug !== undefined && activeSlug !== slug;

  return (
    <div className="relative">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-[0_0_20px_rgba(34,211,238,0.15)]"
      >
        {/* Glow filter */}
        <defs>
          <filter id="donut-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {arcs.map((arc) => (
          <path
            key={arc.slug}
            d={arc.d}
            fill={arc.color}
            opacity={isDimmed(arc.slug) ? 0.3 : 1}
            filter={isActive(arc.slug) ? 'url(#donut-glow)' : undefined}
            className="transition-all duration-300 cursor-pointer"
            style={{
              transform: isActive(arc.slug) ? `scale(1.05)` : 'scale(1)',
              transformOrigin: `${cx}px ${cy}px`,
            }}
            onMouseEnter={() => onHover?.(arc.slug)}
            onMouseLeave={() => onHover?.(null)}
          />
        ))}

        {/* Percentage labels on segments */}
        {arcs.map((arc) => (
          <text
            key={`label-${arc.slug}`}
            x={arc.labelPos.x}
            y={arc.labelPos.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="white"
            fontSize="11"
            fontWeight="600"
            className="pointer-events-none select-none"
            opacity={isDimmed(arc.slug) ? 0.3 : 1}
          >
            {Math.round(arc.weight * 100)}%
          </text>
        ))}

        {/* Center text */}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--color-text-primary)"
          fontSize="14"
          fontWeight="700"
        >
          4
        </text>
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--color-text-secondary)"
          fontSize="10"
        >
          Funds
        </text>
      </svg>
    </div>
  );
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
}
