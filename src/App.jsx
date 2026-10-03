import React, { useState, useEffect } from 'react';
import { observeQuantumState, applyQuantumGate } from './firebase';
import { Activity, Cpu, Zap, Radio, RefreshCw } from 'lucide-react';

export default function QuantumHabitTracker() {
  const [qubits, setQubits] = useState([]);
  const [quantumState, setQuantumState] = useState('SUPERPOSITION'); // SUPERPOSITION | COLLAPSED | DECOHERED
  const observerId = "OBSERVER_NODE_01";

  // Entangle with Quantum Database on mount
  useEffect(() => {
    const unsubscribe = observeQuantumState(observerId, (data) => {
      if (data && data.matrix) {
        setQubits(data.matrix);
        setQuantumState('COLLAPSED');
      }
    });
    return () => unsubscribe();
  }, []);

  // Quantum Measurement: Calculate Active Entanglements (Streaks)
  const measureCoherence = (history) => {
    return history.reduce((acc, bit) => (bit === 1 ? acc + 1 : acc), 0);
  };

  // Quantum State Transformation
  const toggleQubitState = async (habitId, dayIndex) => {
    setQuantumState('SUPERPOSITION');
    const updatedQubits = qubits.map((q) => {
      if (q.id === habitId) {
        const newHistory = [...q.history];
        newHistory[dayIndex] = newHistory[dayIndex] === 1 ? 0 : 1; // Bit flip
        return { ...q, history: newHistory, coherence: measureCoherence(newHistory) };
      }
      return q;
    });

    setQubits(updatedQubits);
    await applyQuantumGate(observerId, { matrix: updatedQubits });
  };

  const addQubit = async (e) => {
    e.preventDefault();
    const name = e.target.elements.qubitName.value;
    if (!name) return;

    const newQubit = {
      id: `qubit_${Date.now()}`,
      label: name,
      history: [0, 0, 0, 0, 0, 0, 0],
      coherence: 0
    };

    const updated = [...qubits, newQubit];
    setQubits(updated);
    e.target.reset();
    await applyQuantumGate(observerId, { matrix: updated });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-cyan-400 font-mono p-8">
      {/* Quantum Header */}
      <header className="border-b border-cyan-800/50 pb-6 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-wider flex items-center gap-3 text-cyan-300">
            <Cpu className="animate-pulse text-cyan-400" />
            QUANTUM HABIT MATRIX v2.026
          </h1>
          <p className="text-xs text-slate-400 mt-1">Real-Time Wavefunction Tracking & State Entanglement</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900 border border-cyan-900 px-4 py-2 rounded-lg">
          <Radio className={quantumState === 'SUPERPOSITION' ? 'animate-spin text-amber-400' : 'text-emerald-400'} />
          <span className="text-xs">STATE: <strong className="text-white">{quantumState}</strong></span>
        </div>
      </header>

      {/* Qubit Injector Form */}
      <form onSubmit={addQubit} className="mb-8 flex gap-4">
        <input
          name="qubitName"
          type="text"
          placeholder="Inject new qubit vector (e.g., Morning Meditation)..."
          className="flex-1 bg-slate-900 border border-cyan-800/60 rounded px-4 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
        />
        <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold px-6 py-2 rounded flex items-center gap-2">
          <Zap size={16} /> Initialize Qubit
        </button>
      </form>

      {/* Qubit Matrix Viewport */}
      <div className="grid gap-4">
        {qubits.map((qubit) => (
          <div key={qubit.id} className="bg-slate-900/80 border border-slate-800 hover:border-cyan-800/80 rounded-lg p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all">
            <div>
              <h3 className="text-lg font-semibold text-slate-200">{qubit.label}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Activity size={12} /> Coherence Score: <span className="text-cyan-300">{qubit.coherence} / 7 Days</span>
              </p>
            </div>

            {/* 7-Day Quantum Grid (States: |0> or |1>) */}
            <div className="flex items-center gap-2">
              {qubit.history.map((state, dayIdx) => (
                <button
                  key={dayIdx}
                  onClick={() => toggleQubitState(qubit.id, dayIdx)}
                  className={`w-10 h-10 rounded border flex items-center justify-center font-bold text-xs transition-all ${
                    state === 1
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-950 border-slate-800 text-slate-600 hover:border-slate-700'
                  }`}
                >
                  {state === 1 ? '|1⟩' : '|0⟩'}
                </button>
              ))}
            </div>
          </div>
        ))}

        {qubits.length === 0 && (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-lg text-slate-600">
            No active qubits initialized in matrix. Add a new vector above to begin measurement.
          </div>
        )}
      </div>
    </div>
  );
}
