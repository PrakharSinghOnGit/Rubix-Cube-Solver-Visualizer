import React, { useState } from "react";
import "./App.css";
import CubeView from "./components/CubeView";
import { CubeType } from "./types";
import { Cube } from "./core/cube";

function App() {
  const [size, setSize] = useState(1);
  const [cube, setCube] = useState(new Cube(size));

  return (
    <div className="app">
      <div className="main-view">
        <CubeView cubeState={cube.getState()} />
      </div>
    </div>
  );
}

export default App;
