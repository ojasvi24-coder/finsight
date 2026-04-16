"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

interface TrendChartProps {
  data: { month: string; balance: number }[];
}

export function TrendChart({ data }: TrendChartProps) {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          onMouseLeave={() => setActiveTooltip(null)}
        >
          {/* Custom gradients for premium look */}
          <defs>
            {/* Primary gradient - emerald */}
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="50%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>

            {/* Secondary gradient for hover state - cyan accent */}
            <linearGradient id="colorBalanceHover" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>

            {/* Glow effect */}
            <filter id="shadowGlow">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
          </defs>

          <CartesianGrid 
            strokeDasharray="4 4" 
            vertical={false} 
            stroke="#1e293b" 
            opacity={0.3}
          />

          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }}
            dy={12}
          />

          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            width={50}
          />

          {/* Enhanced Tooltip with smooth animations and context */}
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
              padding: '12px 16px'
            }}
            itemStyle={{ 
              color: '#10b981',
              fontSize: '13px',
              fontWeight: 600
            }}
            labelStyle={{
              color: '#f1f5f9',
              fontSize: '13px',
              fontWeight: 700,
              marginBottom: '8px'
            }}
            formatter={(value: any) => [
              `$${value.toLocaleString()}`,
              'Projected Net Worth'
            ]}
            cursor={{ 
              strokeDasharray: '4 4',
              stroke: '#10b981',
              opacity: 0.5
            }}
          />

          {/* Smooth area with monotone curve for professional look */}
          <Area 
            type="monotone" 
            dataKey="balance" 
            stroke="#10b981" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorBalance)"
            isAnimationActive={true}
            animationDuration={800}
            activeDot={{
              r: 8,
              fill: '#10b981',
              stroke: '#020617',
              strokeWidth: 3,
              filter: 'url(#shadowGlow)'
            }}
            dot={{
              fill: '#10b981',
              strokeWidth: 2,
              stroke: '#020617',
              r: 4
            }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Info text below chart */}
      <div className="mt-6 text-sm text-slate-400">
        <p>💡 <span className="text-emerald-300">Hover over the chart</span> to see exact projections at each milestone</p>
      </div>
    </div>
  );
}

