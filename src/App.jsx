import React, { useState, useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import styles from "./App.module.css";
import CubeView3d from "./components/CubeView3d";
import CubeView2d from "./components/CubeView2d";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import { Cube } from "./core/cube";
import Header from "./components/Header";

function App() {
  const [size, setSize] = useState(3);
  const [cube, setCube] = useState(() => new Cube(size));
  useEffect(() => {
    setCube(new Cube(size));
  }, [size]);

  return (
    <div className={styles.app}>
      <PanelGroup direction="horizontal">
        <Panel minSize={15} defaultSize={20}>
          <PanelGroup>
            <Panel className={`${styles.panal} ${styles.leftPan}`}>
              <Header />
            </Panel>
            <PanelResizeHandle className={styles.moverH} />
            <Panel
              minSize={85}
              defaultSize={85}
              maxSize={85}
              className={`${styles.panal} ${styles.leftPan}`}
            >
              <LeftPanel setCubeSize={setSize} />
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle className={styles.moverV} />
        <Panel minSize={50} defaultSize={50} maxSize={50}>
          <PanelGroup direction="vertical">
            <Panel
              minSize={40}
              defaultSize={40}
              maxSize={40}
              className={styles.renderContainer}
            >
              <div className={styles.rendererLabel}>
                <h3>2D Cube Projection</h3>
              </div>
              <CubeView2d cubeState={cube.getState()} />
            </Panel>
            <PanelResizeHandle
              className={styles.moverH}
              hitAreaMargins={{ fine: "10" }}
            />
            <Panel
              minSize={60}
              defaultSize={60}
              maxSize={60}
              className={styles.renderContainer}
            >
              <div className={styles.rendererLabel}>
                <h3>3D Cube Projection</h3>
              </div>
              <CubeView3d cubeState={cube.getState()} />
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle
          className={styles.moverV}
          hitAreaMargins={{ fine: 10 }}
        />
        <Panel minSize={15} defaultSize={30}>
          <PanelGroup direction="vertical">
            <Panel
              className={`${styles.panal} ${styles.rightPan}`}
              minSize={25}
              defaultSize={65}
            ></Panel>
            <PanelResizeHandle
              className={styles.moverH}
              hitAreaMargins={{ fine: 10 }}
            />
            <Panel
              className={`${styles.panal} ${styles.rightPan}`}
              minSize={25}
            ></Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default App;
