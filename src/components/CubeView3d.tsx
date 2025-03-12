import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import {
  FACE_COLORS,
  FACE_POSITIONS,
  FACE_ROTATIONS,
  CubeType,
} from "../types";
import { useEffect, useRef } from "react";

export default function CubeView3d({ cubeState }: { cubeState: CubeType }) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const camera = new THREE.PerspectiveCamera();

  camera.aspect = (window.innerWidth * 0.5) / (window.innerHeight * 0.6);
  camera.updateProjectionMatrix();
  let [x, y, z] = [
    cubeState.size * 1.4,
    cubeState.size * 1.4,
    cubeState.size * 1.4,
  ];
  camera.position.set(x, y, z);
  const GAP = 0.05;

  function getStickerPosition(
    i: number,
    j: number,
    n: number,
    face: keyof typeof FACE_POSITIONS,
    gap: number
  ) {
    const offset = ((n - 1) / 2) * (1 + gap);

    const { normal, xAxis, yAxis } = FACE_POSITIONS[face];
    return [
      (i - (n - 1) / 2) * (1 + gap) * xAxis[0] +
        (j - (n - 1) / 2) * (1 + gap) * yAxis[0] +
        normal[0] * (offset + 0.5),
      (i - (n - 1) / 2) * (1 + gap) * xAxis[1] +
        (j - (n - 1) / 2) * (1 + gap) * yAxis[1] +
        normal[1] * (offset + 0.5),
      (i - (n - 1) / 2) * (1 + gap) * xAxis[2] +
        (j - (n - 1) / 2) * (1 + gap) * yAxis[2] +
        normal[2] * (offset + 0.5),
    ];
  }

  function Sticker({
    pos,
    rot,
    col,
  }: {
    pos: number[];
    rot: number[];
    col: string;
  }) {
    const color = FACE_COLORS[col as keyof typeof FACE_COLORS];
    return (
      <mesh
        position={new THREE.Vector3(...pos)}
        rotation={new THREE.Euler(...rot)}
      >
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    );
  }

  function Face({
    size,
    face,
    colors,
  }: {
    size: number;
    face: "f" | "b" | "u" | "d" | "l" | "r";
    colors: string[][];
  }) {
    let stickers = [];
    const offset = (size - 1) / 2; // Center the grid

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        stickers.push(
          <Sticker
            key={`${i}-${j}`}
            col={colors[i][j]}
            pos={getStickerPosition(i, j, size, face, GAP)}
            rot={FACE_ROTATIONS[face as keyof typeof FACE_ROTATIONS]}
          />
        );
      }
    }
    return <>{stickers}</>;
  }

  return (
    <div
      ref={canvasRef}
      style={{
        width: window.innerWidth * 0.5,
        height: window.innerHeight * 0.6,
      }}
    >
      <Canvas camera={camera}>
        <Face size={cubeState.size} face={"b"} colors={cubeState.b} />
        <Face size={cubeState.size} face={"f"} colors={cubeState.f} />
        <Face size={cubeState.size} face={"u"} colors={cubeState.u} />
        <Face size={cubeState.size} face={"d"} colors={cubeState.d} />
        <Face size={cubeState.size} face={"l"} colors={cubeState.l} />
        <Face size={cubeState.size} face={"r"} colors={cubeState.r} />
        <ambientLight intensity={2} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
}
