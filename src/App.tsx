import React, { useState } from "react";
import "./App.css";
import CubeView from "./components/CubeView";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import { CubeState, Move } from "./types";
import {
  createInitialCubeState,
  applyMove,
  scrambleCube,
} from "./utils/cubeLogic";

function App() {
  const [cubeSize, setCubeSize] = useState<number>(3);
  const [cubeState, setCubeState] = useState<CubeState>(
    createInitialCubeState(cubeSize)
  );
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);

  const handleSizeChange = (size: number) => {
    setCubeSize(size);
    setCubeState(createInitialCubeState(size));
    setMoveHistory([]);
  };

  const handleReset = () => {
    setCubeState(createInitialCubeState(cubeSize));
    setMoveHistory([]);
  };

  const handleScramble = () => {
    const { newState, moves } = scrambleCube(cubeState, cubeSize);
    setCubeState(newState);
    setMoveHistory(moves);
  };

  const handleMove = (move: Move) => {
    const newState = applyMove(cubeState, move);
    setCubeState(newState);
    setMoveHistory([...moveHistory, move]);
  };

  return (
    <div className="app">
      <LeftPanel
        cubeSize={cubeSize}
        onSizeChange={handleSizeChange}
        onReset={handleReset}
        onScramble={handleScramble}
      />
      <div className="main-view">
        <CubeView
          cubeState={cubeState}
          cubeSize={cubeSize}
          onMove={handleMove}
        />
      </div>
      <RightPanel moveHistory={moveHistory} />
    </div>
  );
}

export default App;
