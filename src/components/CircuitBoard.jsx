import React from 'react';
import { Plus, Trash2, Zap } from 'lucide-react';

export default function CircuitBoard({
  qubits,
  activeGate,
  onAddQubit,
  onDeleteQubit,
  onAddGate,
  onRemoveGate,
  isPulseActive
}) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
      {/* Animated Pulse Ray */}
      {isPulseActive && (
        <div className="absolute top-0 bottom-0 w-2 bg-cyan-400/80 blur-sm animate-[pulse_1.5s_infinite] left-0 transition-all duration-1000" />
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
          <Zap className="text-cyan-400" size={18} /> QUANTUM CIRCUIT WIRES
        </h2>
        <button
          onClick={onAddQubit}
          className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 px-3 py-1.5 rounded-lg flex items-center gap-1 font-mono transition-all"
        >
          <Plus size={14} /> Add Habit Wire
        </button>
      </div>

      <div className="space-y-6">
        {qubits.map((q, qIndex) => (
          <div key={q.id} className="flex items-center gap-4 group">
            {/* Qubit Info */}
            <div className="w-48 flex items-center justify-between bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg">
              <span className="text-xs font-bold text-slate-200 truncate">{q.label}</span>
              <button
                onClick={() => onDeleteQubit(q.id)}
                className="text-slate-600 hover:text-rose-400 transition-colors"
                title="Remove Habit Wire"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Wire line with gates */}
            <div className="flex-1 bg-slate-950 border border-slate-800/80 rounded-lg p-3 flex items-center gap-3 relative min-h-[56px] overflow-x-auto">
              {/* Horizontal Circuit Line */}
              <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-cyan-950/80 -z-0" />

              {/* Placed Gates */}
              {q.gates.map((gate, gIndex) => (
                <button
                  key={gIndex}
                  onClick={() => onRemoveGate(q.id, gIndex)}
                  className={`relative z-10 w-9 h-9 rounded-md font-bold text-xs flex items-center justify-center border shadow-md transition-all ${
                    gate === 'X'
                      ? 'bg-fuchsia-950/80 border-fuchsia-500 text-fuchsia-300 hover:bg-fuchsia-900'
                      : gate === 'H'
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 hover:bg-cyan-900'
                      : 'bg-emerald-950/80 border-emerald-400 text-emerald-300 hover:bg-emerald-900'
                  }`}
                  title="Click to remove gate"
                >
                  {gate}
                </button>
              ))}

              {/* Add Gate Target Button */}
              <button
                onClick={() => activeGate && onAddGate(q.id, activeGate)}
                disabled={!activeGate}
                className={`relative z-10 w-9 h-9 rounded-md border border-dashed flex items-center justify-center text-xs transition-all ${
                  activeGate
                    ? 'border-cyan-400 text-cyan-300 hover:bg-cyan-950/50 cursor-pointer'
                    : 'border-slate-800 text-slate-700 cursor-not-allowed'
                }`}
                title={activeGate ? `Add ${activeGate} Gate` : 'Select a gate from the toolbox first'}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
