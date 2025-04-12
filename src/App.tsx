import { useState, useEffect, useRef } from "react";
import styles from "./App.module.css";
import { Cube } from "./core/cube";
import { IDDFS } from "./core/IDDFS.ts";
import { CFOP } from "./core/CFOP.ts";
import { SolverType, MoveType } from "./types";

// Componenrts
import CubeView3d from "./components/CubeView3d";
import CubeView2d from "./components/CubeView2d";
import SettingsPanel from "./components/SettingsPanel";
import SolverPanel from "./components/SolverPanel";
import PanelLabel from "./components/ui/PanelLabel";
import StatsPanel from "./components/StatsPanel";
import Header from "./components/Header";
import LogsPanel from "./components/LogsPanel";
import ResizeHandle from "./components/ui/ResizeHandle";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

function App() {
  const [size, setSize] = useState(3);
  const [cube, setCube] = useState(() => new Cube(size));
  const [isAnimating, setIsAnimating] = useState(false);
  const [stats, setStats] = useState({
    comparisonCount: 0,
    timeTaken: 0,
    moveCount: 0,
  });
  const [logs, setLogs] = useState<string[]>([]);
  const animationRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [isSolving, setIsSolving] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    setCube(new Cube(size));
  }, [size]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Initialize Web Worker
    workerRef.current = new Worker(
      new URL("./core/IDDFSWorker.ts", import.meta.url),
      { type: "module" }
    );

    // Handle messages from worker
    workerRef.current.onmessage = (e) => {
      const { moves, comparisonCount, moveCount, timeTaken } = e.data;
      setStats({
        comparisonCount,
        moveCount,
        timeTaken
      });
      setLogs(moves.map((move: MoveType) => 
        `${move.layer} ${move.axis} ${move.clockwise ? 'CW' : 'CCW'}`
      ));
      setIsSolving(false);
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleScramble = async (count: number) => {
    if (isAnimating) return;

    setIsAnimating(true);
    const newCube = new Cube(size);
    const moves = newCube.generateScrambleMoves(count);

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      newCube.rotate(move.layer, move.axis, move.clockwise);

      // Create a new cube instance with the updated state
      const updatedCube = new Cube(size);
      updatedCube.faces = {
        u: newCube.faces.u,
        d: newCube.faces.d,
        l: newCube.faces.l,
        r: newCube.faces.r,
        f: newCube.faces.f,
        b: newCube.faces.b,
      };
      setCube(updatedCube);

      const anim = Number(localStorage.getItem("anim"));
      if (anim != 0) {
        await new Promise((resolve) => {
          animationRef.current = setTimeout(resolve, anim);
        });
      }
    }

    setIsAnimating(false);
  };

  const handleRotate = async (
    layerIndex: number | number[],
    axis: "X" | "Y" | "Z",
    clockwise: boolean
  ) => {
    if (isAnimating) return;

    setIsAnimating(true);

    // Rotate the specified layer
    cube.rotate(layerIndex, axis, clockwise);

    // Create a new cube instance with the updated state
    const updatedCube = new Cube(size);
    updatedCube.faces = {
      u: cube.faces.u,
      d: cube.faces.d,
      l: cube.faces.l,
      r: cube.faces.r,
      f: cube.faces.f,
      b: cube.faces.b,
    };
    setCube(updatedCube);

    // Wait for the animation speed duration
    const anim = Number(localStorage.getItem("anim"));
    if (anim != 0) {
      await new Promise((resolve) => {
        animationRef.current = setTimeout(resolve, anim);
      });
    }

    setIsAnimating(false);
  };

  const handleReset = () => {
    if (isAnimating) return;

    // Create a new cube instance with the initial state
    const resetCube = new Cube(size);
    setCube(resetCube);
  };

  const handleSolver = async (solver: SolverType) => {
    if (isSolving) return;
    
    if (solver === "IDDFS") {
      setIsSolving(true);
      workerRef.current?.postMessage({ cubeState: cube.getState() });
    } else if (solver === "CFOP") {
      const cfop = new CFOP(cube.getState());
      const solution = cfop.solve();
      const state = cfop.getState();
      
      setStats({
        comparisonCount: cfop.comparisonCount,
        moveCount: solution.length,
        timeTaken: cfop.timeTaken
      });
      setLogs(solution.map((move) => 
        `${move.layer} ${move.axis} ${move.clockwise ? 'CW' : 'CCW'}`
      ));
      
      // Apply moves with animation
      for (const move of solution) {
        await handleRotate(move.layer, move.axis, move.clockwise);
        const anim = Number(localStorage.getItem("anim"));
        await new Promise(resolve => setTimeout(resolve, anim));
      }
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-visible p-3 pr-0 pl-0">
      <PanelGroup direction="horizontal">
        <Panel minSize={16} maxSize={30} defaultSize={20}>
          <PanelGroup direction="vertical">
            <Panel
              minSize={13}
              maxSize={13}
              className={`${styles.panal} ${styles.leftPan}`}
            >
              <Header />
            </Panel>
            <PanelResizeHandle
              hitAreaMargins={{ coarse: 1, fine: 2 }}
              className={styles.moverH}
            />
            <Panel
              minSize={25}
              maxSize={65}
              defaultSize={27}
              style={{ overflow: "scroll" }}
              className={`${styles.panal} ${styles.leftPan}`}
            >
              <PanelLabel title="Settings" left={true} />
              <SettingsPanel
                onReset={handleReset}
                onRotate={handleRotate}
                setCubeSize={setSize}
                size={size}
                onScramble={handleScramble}
                isAnimating={isAnimating}
              />
            </Panel>
            <PanelResizeHandle
              hitAreaMargins={{ coarse: 1, fine: 2 }}
              children={<ResizeHandle vertical={true} />}
              className={styles.moverH}
            />
            <Panel className={`${styles.panal} ${styles.leftPan}`}>
              <PanelLabel title="Solver" left={true} />
              <SolverPanel isSolved={cube.isSolved()} setSolver={(solver) => handleSolver(solver)} />
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle
          hitAreaMargins={{ coarse: 1, fine: 2 }}
          children={<ResizeHandle />}
          className={styles.moverV}
        />

        <Panel minSize={40} maxSize={60}>
          <PanelGroup direction="vertical">
            <Panel
              minSize={30}
              defaultSize={60}
              maxSize={70}
              className={styles.renderContainer}
            >
              <PanelLabel title="3d Cube View" />
              <CubeView3d cubeState={cube.getState()} />
            </Panel>
            <PanelResizeHandle
              children={<ResizeHandle vertical={true} />}
              className={styles.moverH}
              hitAreaMargins={{ fine: 1, coarse: 2 }}
            />
            <Panel
              minSize={30}
              defaultSize={40}
              maxSize={70}
              className={styles.renderContainer}
            >
              <PanelLabel title="2d Cube View" />
              <CubeView2d cubeState={cube.getState()} />
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle
          children={<ResizeHandle />}
          className={styles.moverV}
          hitAreaMargins={{ fine: 1, coarse: 2 }}
        />
        <Panel minSize={15}>
          <PanelGroup direction="vertical">
            <Panel
              className={`${styles.panal} ${styles.rightPan}`}
              minSize={25}
              defaultSize={65}
            >
              <PanelLabel title="Algorithms" />
              <StatsPanel comparisonCount={stats.comparisonCount} timeTaken={stats.timeTaken} moveCount={stats.moveCount} />
            </Panel>
            <PanelResizeHandle
              children={<ResizeHandle vertical={true} />}
              className={styles.moverH}
              hitAreaMargins={{ fine: 1, coarse: 2 }}
            />
            <Panel
              className={`${styles.panal} ${styles.rightPan}`}
              minSize={25}
            >
              {/* <PanelLabel title="Logs" /> */}
              <LogsPanel logs={logs} />
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default App;
