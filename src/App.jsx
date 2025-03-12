import React, { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
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
      <PanelGroup direction="horizontal">
        <Panel minSize={15} maxSize={50} defaultSize={20}>
          <LeftPanel />
        </Panel>
        <PanelResizeHandle
          className={styles.mover}
          hitAreaMargins={{ fine: 10 }}
        />
        <Panel minSize={30} defaultSize={60}>
          <PanelGroup direction="vertical">
            <Panel
              minSize={25}
              defaultSize={50}
              className={styles.renderContainer}
            >
              {/* <CubeView3d cubeState={cube.getState()} /> */}
            </Panel>
            <PanelResizeHandle
              className={styles.moverH}
              hitAreaMargins={{ fine: "10" }}
            />
            <Panel
              minSize={25}
              defaultSize={50}
              className={styles.renderContainer}
            >
              {/* <CubeView2d cubeState={cube.getState()} /> */}
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle
          className={styles.mover}
          hitAreaMargins={{ fine: 10 }}
        />
        <Panel minSize={15} maxSize={50} defaultSize={20}>
          <RightPanel />
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default App;
