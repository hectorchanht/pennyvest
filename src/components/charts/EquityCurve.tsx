'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { EquityPoint } from '@/types/prices';

interface EquityCurveProps {
  data: EquityPoint[];
  simulatedLabel: string;
  title: string;
}

export default function EquityCurve({ data, simulatedLabel, title }: EquityCurveProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-text-primary mb-1">{title}</h3>
      <p className="text-xs text-text-muted mb-2">{simulatedLabel}</p>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10 }}
            tickLine={false}
            stroke="rgba(255,255,255,0.3)"
          />
          <YAxis
            tickFormatter={(v: number) => (v > 0 ? '+' : '') + v.toFixed(0) + '%'}
            tick={{ fontSize: 10 }}
            axisLine={false}
            stroke="rgba(255,255,255,0.3)"
          />
          <Tooltip
            formatter={(v) =>
              typeof v === 'number' ? [v.toFixed(1) + '%', 'Return'] : [String(v), 'Return']
            }
          />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            fill="url(#equityGradient)"
            strokeWidth={1.5}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
