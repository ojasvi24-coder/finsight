"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function TrendChart({ data }: { data: any[] }) {
  return (
    <div className="h-[400px] w-full"> {/* Increased height for padding */}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#64748b" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.4} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={15} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `$${val / 1000}k`} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(8px)', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc', padding: '16px' }}
            formatter={(value: any, name: any) => [`$${value.toLocaleString()}`, name === 'optimized' ? 'Optimized Target' : 'Baseline Trajectory']}
          /> {/* <--- MAKE SURE YOU HAVE THIS CLOSING /> */}
          
          <Area type="monotone" dataKey="balance" stroke="#64748b" strokeWidth={2} fill="url(#colorBalance)" />
          {/* Only show optimized line if data exists */}
          {data[0]?.optimized !== undefined && (
             <Area type="monotone" dataKey="optimized" stroke="#10b981" strokeWidth={3} fill="url(#colorOptimized)" activeDot={{ r: 6, fill: '#10b981', stroke: '#020617', strokeWidth: 4 }} />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

