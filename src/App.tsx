import React, { useState, useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import styles from "./App.module.css";
import CubeView3d from "./components/CubeView3d";
import CubeView2d from "./components/CubeView2d";
import { Cube } from "./core/cube";
import Header from "./components/Header";
import SettingsPanel from "./components/SettingsPanel";
import SolverPanel from "./components/SolverPanel";
import PanelLabel from "./components/utils/PanelLabel";
import StatsPanel from "./components/StatsPanel";
import LogsPanel from "./components/LogsPanel";

function App() {
  const [size, setSize] = useState(3);
  const [cube, setCube] = useState(() => new Cube(size));
  useEffect(() => {
    setCube(new Cube(size));
  }, [size]);

  return (
    <div className={styles.app}>
      <PanelGroup direction="horizontal">
        <Panel minSize={15} defaultSize={20} maxSize={30}>
          <PanelGroup direction="vertical">
            <Panel
              minSize={13}
              maxSize={13}
              className={`${styles.panal} ${styles.leftPan}`}
            >
              <Header />
            </Panel>
            <PanelResizeHandle className={styles.moverH} />
            <Panel
              minSize={25}
              maxSize={65}
              defaultSize={27}
              className={`${styles.panal} ${styles.leftPan}`}
            >
              <PanelLabel title="Settings" left={true} />
              <SettingsPanel setCubeSize={setSize} />
            </Panel>
            <PanelResizeHandle className={styles.moverH} />
            <Panel className={`${styles.panal} ${styles.leftPan}`}>
              <PanelLabel title="Solver" left={true} />
              <SolverPanel />
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle className={styles.moverV} />
        <Panel minSize={40} maxSize={40}>
          <PanelGroup direction="vertical">
            <Panel
              minSize={40}
              defaultSize={40}
              maxSize={40}
              className={styles.renderContainer}
            >
              <PanelLabel title="2d Cube View" />
              <CubeView2d cubeState={cube.getState()} />
            </Panel>
            <PanelResizeHandle
              className={styles.moverH}
              hitAreaMargins={{ fine: 10, coarse: 10 }}
            />
            <Panel
              minSize={60}
              defaultSize={60}
              maxSize={60}
              className={styles.renderContainer}
            >
              <PanelLabel title="3d Cube View" />
              <CubeView3d cubeState={cube.getState()} />
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle
          className={styles.moverV}
          hitAreaMargins={{ fine: 10, coarse: 10 }}
        />
        <Panel minSize={15} defaultSize={30}>
          <PanelGroup direction="vertical">
            <Panel
              className={`${styles.panal} ${styles.rightPan}`}
              minSize={25}
              defaultSize={65}
            >
              <PanelLabel title="Algorithms" />
              <StatsPanel />
            </Panel>
            <PanelResizeHandle
              className={styles.moverH}
              hitAreaMargins={{ fine: 10, coarse: 10 }}
            />
            <Panel
              className={`${styles.panal} ${styles.rightPan}`}
              minSize={25}
            >
              <PanelLabel title="Logs" />
              <LogsPanel />
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default App;
