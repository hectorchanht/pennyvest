import type { RiskLevel } from '@/lib/strategies/types';

interface RiskGaugeProps {
  level: RiskLevel;
  label: string; // already-translated risk label like "High Risk"
}

// Converts degrees (0=left end, 180=right end) to SVG path arc point
// Center: (100, 100), radius: 80
function polarToCartesian(angleDeg: number): { x: number; y: number } {
  // 0 degrees = left (180° in standard math), 180 degrees = right
  const angleRad = ((180 - angleDeg) * Math.PI) / 180;
  return {
    x: 100 + 80 * Math.cos(angleRad),
    y: 100 - 80 * Math.sin(angleRad),
  };
}

function arcPath(startDeg: number, endDeg: number): string {
  const start = polarToCartesian(startDeg);
  const end = polarToCartesian(endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A 80 80 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

const needleAngles: Record<RiskLevel, number> = {
  low: 30,     // pointing into green segment
  medium: 90,  // pointing straight up into amber
  high: 150,   // pointing into red segment
};

export default function RiskGauge({ level, label }: RiskGaugeProps) {
  const needleAngle = needleAngles[level];
  const needleRad = ((180 - needleAngle) * Math.PI) / 180;
  const needleTipX = 100 + 65 * Math.cos(needleRad);
  const needleTipY = 100 - 65 * Math.sin(needleRad);

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 200 120"
        className="w-full max-w-[200px] mx-auto"
        aria-label={label}
        role="img"
      >
        {/* Background track */}
        <path
          d={arcPath(0, 180)}
          fill="none"
          stroke="oklch(0.25 0.01 240)"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Low risk segment: green (0-60 degrees) */}
        <path
          d={arcPath(0, 60)}
          fill="none"
          stroke="oklch(0.72 0.17 155)"
          strokeWidth="12"
          strokeLinecap="butt"
          opacity={level === 'low' ? 1 : 0.4}
        />

        {/* Medium risk segment: amber (60-120 degrees) */}
        <path
          d={arcPath(60, 120)}
          fill="none"
          stroke="oklch(0.78 0.18 80)"
          strokeWidth="12"
          strokeLinecap="butt"
          opacity={level === 'medium' ? 1 : 0.4}
        />

        {/* High risk segment: red (120-180 degrees) */}
        <path
          d={arcPath(120, 180)}
          fill="none"
          stroke="oklch(0.62 0.22 25)"
          strokeWidth="12"
          strokeLinecap="round"
          opacity={level === 'high' ? 1 : 0.4}
        />

        {/* Needle pivot circle */}
        <circle cx="100" cy="100" r="6" fill="oklch(0.70 0.01 240)" />

        {/* Needle line */}
        <line
          x1="100"
          y1="100"
          x2={needleTipX}
          y2={needleTipY}
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Needle center dot */}
        <circle cx="100" cy="100" r="3" fill="white" />
      </svg>

      <p className="text-sm font-medium text-center mt-1">{label}</p>
    </div>
  );
}
