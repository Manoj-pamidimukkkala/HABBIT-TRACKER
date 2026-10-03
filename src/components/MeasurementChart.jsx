import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity } from 'lucide-react';

export default function MeasurementChart({ data, shots }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
          <Activity size={16} /> MEASUREMENT SPECTRUM ({shots} SHOTS)
        </h3>
        <span className="text-xs text-slate-400 font-mono">1000 Monte Carlo Simulations</span>
      </div>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="state" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', color: '#f8fafc' }}
              itemStyle={{ color: '#06b6d4' }}
              formatter={(value) => [`${value} shots (${((value / shots) * 100).toFixed(1)}%)`, 'Count']}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index % 2 === 0 ? '#06b6d4' : '#d946ef'}
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
