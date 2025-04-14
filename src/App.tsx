import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./App.module.css";
import { Cube } from "./core/cube";
// import { CFOP } from "./core/CFOP.ts";
import { SolverType, MoveType, SolverStatType } from "./types";

// Componenrts
import { Content } from "./core/Content.ts";
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
  const animationRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const workerRef = useRef<Worker | null>(null);
  const [solver, setSolver] = useState<SolverType>(null);
  const moveHistoryRef = useRef<{
    addMoveSet: (moves: MoveType[], title: string) => void;
  }>(null);
  const [solverStats, setSolverStats] = useState<SolverStatType>({
    totalIterations: 0,
    moveCount: 0,
    comparisonCount: 0,
    maxDepthReached: 0,
    goalReached: false,
    nodesExplored: 0,
    searchTreeDepth: 0,
    timeTaken: 0,
    uniqueStates: 0,
    backtracks: 0,
    heuristicCost: 0,
    statesPruned: 0,
    peakMemoryUsed: 0,
    openSetSize: 0,
    closedSetSize: 0,
    totalStatesInMemory: 0,
    solvedFaces: 0,
    heuristicEstimate: 0,
    solutionPathLength: 0,
  });
  const statsIntervalRef = useRef<number | null>(null);

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

  const applySolution = useCallback(
    async (solution: MoveType[]) => {
      setIsAnimating(true);
      for (const move of solution) {
        cube.rotate(move.layer, move.axis, move.clockwise);

        // Create a new cube with the current state
        const newCube = new Cube(size);
        newCube.faces = { ...cube.faces };
        setCube(newCube);

        const anim = Number(localStorage.getItem("anim")) || 100;
        await new Promise((resolve) => setTimeout(resolve, anim));
      }
      setIsAnimating(false);
    },
    [cube, size]
  );

  const handleApplyMove = (move: MoveType) => {
    // Apply the move to the cube
    cube.rotate(move.layer, move.axis, move.clockwise);
    setCube(cube);
  };

  useEffect(() => {
    // Initialize Web Worker
    workerRef.current = new Worker(
      new URL("./core/Worker.ts", import.meta.url),
      { type: "module" }
    );

    // Handle messages from worker
    workerRef.current.onmessage = (e) => {
      const solverData = e.data;

      setSolverStats(solverData);

      // Add moves to history
      if (solverData.moves && solverData.moves.length > 0) {
        // Add moves to history
        moveHistoryRef.current?.addMoveSet(
          solverData.moves,
          `Solved by ${solver}`
        );

        // Apply the solution
        applySolution(solverData.moves);
      }

      setIsSolving(false);
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, [solver, applySolution]);

  const handleScramble = async (count: number) => {
    if (isAnimating) return;

    setIsAnimating(true);
    const newCube = new Cube(size);
    const moves = newCube.generateScrambleMoves(count);

    // Add scramble moves to history
    console.log("Scramble moves:", moves);
    moveHistoryRef.current?.addMoveSet(moves, `Scrambled - ${count} moves`);

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

  const clearStatsInterval = () => {
    if (statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current);
      statsIntervalRef.current = null;
    }
  };

  const handleSolver = async (solverType: SolverType) => {
    if (isSolving || isAnimating) return;

    setSolver(solverType);
    setIsSolving(true);
    clearStatsInterval();

    // Reset stats
    setSolverStats(solverStats);

    // For visual feedback, update stats every 500ms
    const startTime = Date.now();
    statsIntervalRef.current = window.setInterval(() => {
      setSolverStats((prev) => ({
        ...prev,
        timeTaken: Date.now() - startTime,
      }));
    }, 500);

    try {
      if (solverType === "IDDFS") {
        workerRef.current?.postMessage({
          solver: "IDDFS",
          cubeState: cube.getState(),
        });
        // The worker message handler will handle the rest
        return;
      } else if (solverType === "IDA*") {
        workerRef.current?.postMessage({
          solver: "IDA*",
          cubeState: cube.getState(),
        });
        // The worker message handler will handle the rest
        return;
      } else if (solverType === "CFOP") {
        console.log("TO be Implemented");
      } else {
        console.log("No solution found or cube already solved");
      }
      setIsSolving(false);
    } catch (error) {
      console.error("Solver error:", error);
      setIsSolving(false);
    } finally {
      clearStatsInterval();
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
                size={size}
                setCubeSize={setSize}
                onScramble={handleScramble}
                onReset={handleReset}
                onRotate={handleRotate}
                isAnimating={isAnimating}
                isSolving={isSolving}
              />
            </Panel>
            <PanelResizeHandle
              hitAreaMargins={{ coarse: 1, fine: 2 }}
              children={<ResizeHandle vertical={true} />}
              className={styles.moverH}
            />
            <Panel className={`${styles.panal} ${styles.leftPan}`}>
              <PanelLabel title="Solver" left={true} />
              <SolverPanel
                solver={solver}
                isWorking={isSolving || isAnimating}
                isSolved={cube.isSolved()}
                setSolver={(solver) => setSolver(solver)}
                onSolve={handleSolver}
              />
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
              <CubeView3d
                isSolved={cube.isSolved()}
                cubeState={cube.getState()}
              />
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
              <StatsPanel
                solverStats={solverStats}
                content={solver ? Content[solver] : undefined}
              />
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
              <PanelLabel title="Move Logs" left={true} />
              <LogsPanel onApplyMove={handleApplyMove} ref={moveHistoryRef} />
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default App;
