'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e', '#a78bfa'];

interface AllocationDonutProps {
  allocations: { name: string; ticker: string; weight: number }[];
  centerLabel?: string;
  title: string;
}

export default function AllocationDonut({
  allocations,
  centerLabel,
  title,
}: AllocationDonutProps) {
  const data = allocations.map((a) => ({
    name: a.ticker,
    value: a.weight,
    fullName: a.name,
  }));

  return (
    <div>
      <h3 className="text-sm font-medium text-text-primary mb-3">{title}</h3>
      <div className="relative">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={65}
              outerRadius={95}
              paddingAngle={2}
              strokeWidth={0}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) =>
                typeof value === 'number' ? Math.round(value * 100) + '%' : value
              }
            />
          </PieChart>
        </ResponsiveContainer>
        {centerLabel && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-xs font-medium text-text-secondary text-center px-2">
              {centerLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
