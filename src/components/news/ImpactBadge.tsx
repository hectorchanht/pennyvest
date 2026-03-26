interface ImpactBadgeProps {
  impact: 'bullish' | 'neutral' | 'bearish';
  label: string;
}

export default function ImpactBadge({ impact, label }: ImpactBadgeProps) {
  const colorMap = {
    bullish: 'bg-green-500/20 text-green-400 border-green-500/30',
    neutral: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    bearish: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colorMap[impact]}`}
    >
      {label}
    </span>
  );
}
