// Complex number operations
export function complex(re, im = 0) {
  return { re, im };
}

export function multComplex(c1, c2) {
  return {
    re: c1.re * c2.re - c1.im * c2.im,
    im: c1.re * c2.im + c1.im * c2.re
  };
}

export function addComplex(c1, c2) {
  return { re: c1.re + c2.re, im: c1.im + c2.im };
}

// Compute qubit state vector based on theta (angle) and phi (phase)
export function calculateQubitState(thetaDeg, phiDeg) {
  const theta = (thetaDeg * Math.PI) / 180;
  const phi = (phiDeg * Math.PI) / 180;

  const alpha = { re: Math.cos(theta / 2), im: 0 };
  const beta = {
    re: Math.sin(theta / 2) * Math.cos(phi),
    im: Math.sin(theta / 2) * Math.sin(phi)
  };

  const prob0 = alpha.re * alpha.re + alpha.im * alpha.im;
  const prob1 = beta.re * beta.re + beta.im * beta.im;

  return { alpha, beta, prob0, prob1, theta, phi };
}

// Gate Matrix Multiplications
export function applyGateToState(gateType, state) {
  let { alpha, beta } = state;

  switch (gateType) {
    case 'X': // Pauli-X (NOT / Flip)
      return { alpha: beta, beta: alpha };

    case 'H': // Hadamard (Superposition)
      {
        const invSqrt2 = 1 / Math.sqrt(2);
        const newAlpha = multComplex({ re: invSqrt2, im: 0 }, addComplex(alpha, beta));
        const newBeta = multComplex({ re: invSqrt2, im: 0 }, addComplex(alpha, { re: -beta.re, im: -beta.im }));
        return { alpha: newAlpha, beta: newBeta };
      }

    case 'Z': // Pauli-Z (Phase Flip)
      return { alpha, beta: { re: -beta.re, im: -beta.im } };

    default:
      return { alpha, beta };
  }
}

// Run Monte Carlo Measurement Shots
export function runQuantumShots(qubits, shotsCount = 1000) {
  const numQubits = qubits.length;
  const outcomes = {};

  // Initialize outcomes map
  const numStates = Math.pow(2, numQubits);
  for (let i = 0; i < numStates; i++) {
    const bitstring = i.toString(2).padStart(numQubits, '0');
    outcomes[bitstring] = 0;
  }

  // Calculate probabilities per qubit
  const probabilities = qubits.map(q => {
    let currentState = calculateQubitState(q.theta, q.phi);
    q.gates.forEach(g => {
      currentState = applyGateToState(g, currentState);
    });
    const prob1 = currentState.beta.re * currentState.beta.re + currentState.beta.im * currentState.beta.im;
    return Math.max(0, Math.min(1, prob1));
  });

  // Perform shots
  for (let s = 0; s < shotsCount; s++) {
    let measuredBits = '';
    for (let q = 0; q < numQubits; q++) {
      const rand = Math.random();
      measuredBits += rand < probabilities[q] ? '1' : '0';
    }
    outcomes[measuredBits] = (outcomes[measuredBits] || 0) + 1;
  }

  return Object.entries(outcomes).map(([state, count]) => ({
    state: `|${state}⟩`,
    count,
    probability: Number(((count / shotsCount) * 100).toFixed(1))
  }));
}
