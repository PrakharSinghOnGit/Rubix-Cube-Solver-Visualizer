import React, { useState } from "react";
import styles from "./App.module.css";
import CubeView3d from "./components/CubeView3d";
import CubeView2d from "./components/CubeView2d";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import { Cube } from "./core/cube";

function App() {
  const [size, setSize] = useState(3);
  const [cube, setCube] = useState(new Cube(size));

  return (
    <div className={styles.app}>
      <LeftPanel />
      <div className={styles.cubeContainer}>
        <CubeView3d cubeState={cube.getState()} />
        <CubeView2d cubeState={cube.getState()} />
      </div>
      <RightPanel />
    </div>
  );
}

export default App;
