import { useEffect, useState } from "react";
import styles from "./css/App.module.css";
import { useCube } from "./hooks/useCube";

// Components
import CubeView3d from "./components/CubeView3d";
import CubeView2d from "./components/CubeView2d";
import SettingsPanel from "./components/SettingsPanel";
import SolverPanel from "./components/SolverPanel";
import PanelLabel from "./components/ui/PanelLabel";
import Header from "./components/Header";
import ResizeHandle from "./components/ui/ResizeHandle";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { CubeType, SolverType } from "./types/types";
import Cube from "./core/cubeAPI";

function App() {
  const [size, setSize] = useState(3);
  const { cube, isReady } = useCube(size);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [cubeState, setCubeState] = useState<CubeType | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0); // Force re-render trigger

  useEffect(() => {
    if (isReady && cube) {
      setCubeState(cube.parseKociembaFormat());
    }
  }, [isReady, cube, forceUpdate]);

  function applyMoves(moves: string[]) {
    const delay = Number(localStorage.getItem("anim")) || 300;
    const currentCube = cube;
    if (!currentCube) return;

    setIsAnimating(true);

    moves.forEach((move, i) => {
      setTimeout(async () => {
        try {
          await currentCube.rotate(move);
          const newCubeState = currentCube.parseKociembaFormat();
          setCubeState(newCubeState);
          console.log("Moved", move);

          if (i === moves.length - 1) {
            setIsAnimating(false);
            setForceUpdate((prev) => prev + 1);
          }
        } catch (error) {
          console.error("Error applying move:", move, error);
          if (i === moves.length - 1) {
            setIsAnimating(false);
          }
        }
      }, delay * i);
    });
  }

  const handleReset = async () => {
    setIsAnimating(false);
    if (!cube) return;
    await cube.init(size);
    setCubeState(cube.parseKociembaFormat());
    setForceUpdate((prev) => prev + 1);
    console.log(cube.state);
  };

  const handleSizeChange = async (newSize: number) => {
    setSize(newSize);
  };

  const handleScramble = (count: number) => {
    if (!cube) return;
    const moves = cube?.generateRandomMoves(count);
    applyMoves(moves);
  };

  const handleUserMoves = (moves: string[]) => {
    if (!cube) return;
    applyMoves(moves);
  };

  const handleSolution = async (solver: SolverType) => {
    if (!cube) return;
    setIsSolving(true);

    const solverCube = await Cube.create(3, cube.state);
    const sol = await solverCube.solve(solver);
    console.log(sol);
    applyMoves(sol.solution);
    setIsSolving(false);
  };

  if (!isReady || !cubeState) {
    return <div>Backend is Not Ready for Cubing ...</div>;
  }

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
                setCubeSize={handleSizeChange}
                onReset={handleReset}
                onScramble={handleScramble}
                onUserMoves={handleUserMoves}
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
                onSolution={handleSolution}
                isWorking={isSolving || isAnimating}
                isSolved={cube.solved}
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
              <CubeView3d cubeState={cubeState} isSolved={cube.solved} />
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
              <CubeView2d cubeState={cubeState} />
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
              {/* <StatsPanel content={solver ? Content[solver] : undefined} /> */}
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
              {/* <LogsPanel moveHistory={moveHistory} /> */}
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default App;
