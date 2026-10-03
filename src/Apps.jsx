import React, { useState } from 'react';
import BlochSphere from './components/BlochSphere';
import CircuitBoard from './components/CircuitBoard';
import MeasurementChart from './components/MeasurementChart';
import { calculateQubitState, runQuantumShots } from './utils/quantumEngine';
import { Cpu, Play, RotateCcw, HelpCircle, Layers } from 'lucide-react';

export default function App() {
  const [qubits, setQubits] = useState([
    { id: 'q1', label: 'Morning Meditation', theta: 0, phi: 0, gates: ['H'] },
    { id: 'q2', label: 'Deep Work Session', theta: 30, phi: 0, gates: ['X', 'H'] },
    { id: 'q3', label: 'Evening Workout', theta: 0, phi: 0, gates: [] },
  ]);

  const [activeGate, setActiveGate] = useState('H');
  const [isPulseActive, setIsPulseActive] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);

  // Initial qubit preparation slider handler
  const handleSliderChange = (id, field, value) => {
    setQubits(prev =>
      prev.map(q => (q.id === id ? { ...q, [field]: Number(value) } : q))
    );
  };

  const handleAddQubit = () => {
    const newId = `q_${Date.now()}`;
    const name = prompt('Enter habit name:', `Habit #${qubits.length + 1}`);
    if (!name) return;
    setQubits([...qubits, { id: newId, label: name, theta: 0, phi: 0, gates: [] }]);
  };

  const handleDeleteQubit = (id) => {
    if (qubits.length <= 1) return alert('Keep at least one qubit wire!');
    setQubits(qubits.filter(q => q.id !== id));
  };

  const handleAddGate = (qubitId, gate) => {
    setQubits(prev =>
      prev.map(q => (q.id === qubitId ? { ...q, gates: [...q.gates, gate] } : q))
    );
  };

  const handleRemoveGate = (qubitId, gateIndex) => {
    setQubits(prev =>
      prev.map(q =>
        q.id === qubitId
          ? { ...q, gates: q.gates.filter((_, idx) => idx !== gateIndex) }
          : q
      )
    );
  };

  const handleRunCircuit = () => {
    setIsPulseActive(true);
    setTimeout(() => setIsPulseActive(false), 1500);
  };

  const handleResetCircuit = () => {
    setQubits(prev => prev.map(q => ({ ...q, gates: [] })));
  };

  // Run measurement calculations
  const chartData = runQuantumShots(qubits, 1000);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="border-b border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wider text-cyan-300 flex items-center gap-3">
            <Cpu className="text-cyan-400 animate-pulse" /> QUANTUM HABIT CIRCUIT SIMULATOR
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Map behavioral habit likelihoods to Quantum Wavefunctions and Gate Operations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowGlossary(!showGlossary)}
            className="bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all"
          >
            <HelpCircle size={14} /> Behavioral Quantum Glossary
          </button>
          <button
            onClick={handleRunCircuit}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
          >
            <Play size={14} fill="currentColor" /> Pulse Circuit
          </button>
          <button
            onClick={handleResetCircuit}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all"
          >
            <RotateCcw size={14} /> Clear
          </button>
        </div>
      </header>

      {/* Educational Glossary Modal */}
      {showGlossary && (
        <div className="bg-slate-900 border border-cyan-800/80 rounded-xl p-5 space-y-3 text-xs text-slate-300 animate-fadeIn">
          <h3 className="text-sm font-bold text-cyan-300">Quantum Psychology Mapping</h3>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <li className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <strong className="text-cyan-400 block mb-1">Superposition |ψ⟩ (H Gate)</strong>
              Holding a habit in an open potential state before action or default refusal takes place.
            </li>
            <li className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <strong className="text-fuchsia-400 block mb-1">Pauli-X Gate (NOT / Flip)</strong>
              Inverting behavioral momentum—flipping resistance (|0⟩) into active completion (|1⟩).
            </li>
            <li className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <strong className="text-emerald-400 block mb-1">Measurement Collapse</strong>
              The moment of action at the end of the day when probabilities resolve into definite reality.
            </li>
          </ul>
        </div>
      )}

      {/* Gate Selector Toolbox */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Layers size={16} className="text-cyan-400" /> SELECT QUANTUM GATE TOOL:
        </div>
        <div className="flex gap-3">
          {[
            { type: 'H', name: 'Hadamard (Superposition)', color: 'border-cyan-400 text-cyan-300 bg-cyan-950/60' },
            { type: 'X', name: 'Pauli-X (Flip)', color: 'border-fuchsia-500 text-fuchsia-300 bg-fuchsia-950/60' },
            { type: 'Z', name: 'Pauli-Z (Phase Flip)', color: 'border-emerald-400 text-emerald-300 bg-emerald-950/60' },
          ].map(g => (
            <button
              key={g.type}
              onClick={() => setActiveGate(g.type)}
              className={`border px-4 py-2 rounded-lg text-xs font-bold transition-all ${g.color} ${
                activeGate === g.type ? 'ring-2 ring-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'opacity-60 hover:opacity-100'
              }`}
            >
              {g.type} - {g.name}
            </button>
          ))}
        </div>
      </section>

      {/* Main Circuit Wires View */}
      <CircuitBoard
        qubits={qubits}
        activeGate={activeGate}
        onAddQubit={handleAddQubit}
        onDeleteQubit={handleDeleteQubit}
        onAddGate={handleAddGate}
        onRemoveGate={handleRemoveGate}
        isPulseActive={isPulseActive}
      />

      {/* Bloch Spheres & Sliders Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {qubits.map(q => {
          let state = calculateQubitState(q.theta, q.phi);
          q.gates.forEach(g => {
            state = { ...state, ...calculateQubitState((state.theta * 180) / Math.PI, (state.phi * 180) / Math.PI) };
          });

          return (
            <div key={q.id} className="space-y-3">
              <BlochSphere
                thetaDeg={q.theta}
                phiDeg={q.phi}
                prob1={state.prob1}
                label={q.label}
              />
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Initial Bias Angle (θ)</span>
                    <span className="text-cyan-400">{q.theta}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    value={q.theta}
                    onChange={(e) => handleSliderChange(q.id, 'theta', e.target.value)}
                    className="w-full accent-cyan-400 bg-slate-800 h-1 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Monte Carlo Shot Spectrum Chart */}
      <MeasurementChart data={chartData} shots={1000} />
    </div>
  );
}
