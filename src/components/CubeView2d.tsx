import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { CubeType } from "../types";
import { FACE_COLORS } from "../types";

export default function CubeView2d({ cubeState }: { cubeState: CubeType }) {
  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      orthographic
      camera={{
        zoom: 90,
        position: [0, 0, 100],
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <CubeProjection cubeState={cubeState} />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={false}
        mouseButtons={{
          LEFT: 2, // Set LEFT click to pan (default is rotate)
          RIGHT: 0, // Disable right-click rotation
        }}
      />
    </Canvas>
  );
}

function CubeProjection({ cubeState }: { cubeState: CubeType }) {
  const { size } = cubeState;
  const cellSize = 0.3;
  const gap = 0.05;
  const faceSize = size * (cellSize + gap);
  // const yOff =
  //   cubeState.size / 2 === 0
  //     ? (cubeState.size - 1) / 2
  //     : cubeState.size / 2 - 1 + 0.5;
  const yOff = (cubeState.size - 1) / 2;
  const drawFace = (x: number, y: number, face: string[][]) => {
    return face.map((row, i) =>
      row.map((color, j) => (
        <mesh
          key={`${i}-${j}`}
          position={[
            x + j * (cellSize + gap) + (cellSize + gap) / 2,
            y - i * (cellSize + gap) + (cellSize + gap) * yOff,
            0,
          ]}
        >
          <planeGeometry args={[cellSize, cellSize]} />
          <meshBasicMaterial color={FACE_COLORS[color]} />
        </mesh>
      ))
    );
  };

  return (
    <>
      {drawFace(-faceSize, faceSize, cubeState.u)}
      {drawFace(-faceSize * 2, 0, cubeState.l)}
      {drawFace(-faceSize, 0, cubeState.f)}
      {drawFace(0, 0, cubeState.r)}
      {drawFace(-faceSize, -faceSize, cubeState.d)}
      {drawFace(faceSize, 0, cubeState.b)}
    </>
  );
}
