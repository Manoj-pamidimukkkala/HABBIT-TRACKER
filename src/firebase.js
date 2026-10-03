import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "QUANTUM_API_KEY",
  authDomain: "quantum-habit-tracker.firebaseapp.com",
  projectId: "quantum-habit-tracker",
  storageBucket: "quantum-habit-tracker.appspot.com",
  messagingSenderId: "10987654321",
  appId: "1:10987654321:web:quantum123456"
};

const app = initializeApp(firebaseConfig);
export const quantumDB = getFirestore(app);

// Quantum Entanglement Hook: Real-Time State Observer
export const observeQuantumState = (qubitId, onStateCollapse) => {
  const qubitRef = doc(quantumDB, "qubits", qubitId);
  return onSnapshot(qubitRef, (snapshot) => {
    if (snapshot.exists()) {
      onStateCollapse(snapshot.data());
    }
  });
};

// Quantum Gate Transformation: Apply Pauli-X (Toggle) Operation
export const applyQuantumGate = async (qubitId, stateMatrix) => {
  const qubitRef = doc(quantumDB, "qubits", qubitId);
  await setDoc(qubitRef, stateMatrix, { merge: true });
};
