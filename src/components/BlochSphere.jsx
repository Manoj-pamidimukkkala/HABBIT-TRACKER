import React from 'react';

export default function BlochSphere({ thetaDeg, phiDeg, prob1, label }) {
  const theta = (thetaDeg * Math.PI) / 180;
  const phi = (phiDeg * Math.PI) / 180;

  // Sphere parameters
  const r = 60;
  const cx = 100;
  const cy = 100;

  // State vector tip on 3D sphere projected to 2D
  const x = cx + r * Math.sin(theta) * Math.cos(phi);
  const y = cy - r * Math.cos(theta);
  const zOffset = r * Math.sin(theta) * Math.sin(phi) * 0.3;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center">
      <div className="flex justify-between w-full mb-2">
        <span className="text-xs font-bold text-cyan-400 truncate max-w-[120px]">{label}</span>
        <span className="text-xs font-mono text-emerald-400">P(|1⟩): {(prob1 * 100).toFixed(1)}%</span>
      </div>

      <svg width="200" height="200" className="overflow-visible">
        {/* Outer Sphere Ellipses */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth="1.5" />
        <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.3} fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

        {/* Z-Axis */}
        <line x1={cx} y1={cy - r - 10} x2={cx} y2={cy + r + 10} stroke="#475569" strokeWidth="1" />
        <text x={cx - 12} y={cy - r - 12} className="text-[10px] fill-cyan-400 font-mono">|0⟩ (No)</text>
        <text x={cx - 12} y={cy + r + 22} className="text-[10px] fill-fuchsia-400 font-mono">|1⟩ (Done)</text>

        {/* X and Y Axes */}
        <line x1={cx - r - 10} y1={cy} x2={cx + r + 10} y2={cy} stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />

        {/* Vector Line */}
        <line
          x1={cx}
          y1={cy}
          x2={x + zOffset}
          y2={y}
          stroke="#06b6d4"
          strokeWidth="2.5"
          className="transition-all duration-300"
        />

        {/* Vector Tip Point */}
        <circle
          cx={x + zOffset}
          cy={y}
          r="5"
          fill="#e0e7ff"
          className="shadow-[0_0_12px_#06b6d4] transition-all duration-300"
        />
      </svg>

      <div className="text-[11px] font-mono text-slate-400 mt-2 flex gap-4">
        <span>θ: {thetaDeg}°</span>
        <span>φ: {phiDeg}°</span>
      </div>
    </div>
  );
}
