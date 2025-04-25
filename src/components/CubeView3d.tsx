import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import * as THREE from "three";
import { CubeType, FACE_COLORS, MoveType } from "../types/types";
import { useEffect, useRef, useState } from "react";
// import { useFrame } from "@react-three/fiber";

export default function CubeView3d({
  size,
  isSolved,
  cubeState,
}: // lastMove,
{
  size: number;
  isSolved: boolean;
  lastMove: MoveType | null;
  cubeState: CubeType;
}) {
  const transparentMat = new THREE.MeshStandardMaterial({
    transparent: true,
    opacity: 0,
  });

  const GAP = 0.075;
  const offset = (size - 1) / 2;
  const lastMoveRef = useRef<MoveType | null>(null);

  function getMaterial(x: number, y: number, z: number) {
    return [
      x === size - 1
        ? new THREE.MeshStandardMaterial({
            color: FACE_COLORS[cubeState.r[x][y]],
          })
        : transparentMat,
      x === 0
        ? new THREE.MeshStandardMaterial({
            color: FACE_COLORS[cubeState.l[x][y]],
          })
        : transparentMat,
      y === size - 1
        ? new THREE.MeshStandardMaterial({
            color: FACE_COLORS[cubeState.u[x][y]],
          })
        : transparentMat,
      y === 0
        ? new THREE.MeshStandardMaterial({
            color: FACE_COLORS[cubeState.d[x][y]],
          })
        : transparentMat,
      z === size - 1
        ? new THREE.MeshStandardMaterial({
            color: FACE_COLORS[cubeState.f[x][y]],
          })
        : transparentMat,
      z === 0
        ? new THREE.MeshStandardMaterial({
            color: FACE_COLORS[cubeState.b[x][y]],
          })
        : transparentMat,
    ];
  }
  // Render 3D cubies
  const renderCubies = () => {
    const staticCubies = [];

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        for (let z = 0; z < size; z++) {
          const isEdgeCubie =
            x === 0 ||
            x === size - 1 ||
            y === 0 ||
            y === size - 1 ||
            z === 0 ||
            z === size - 1;

          if (!isEdgeCubie) continue;
          const posX = (x - offset) * (1 + GAP);
          const posY = (y - offset) * (1 + GAP);
          const posZ = (z - offset) * (1 + GAP);

          const cubie = (
            <mesh
              key={`${x}-${y}-${z}`}
              position={[posX, posY, posZ]}
              material={getMaterial(x, y, z)}
            >
              <boxGeometry args={[1, 1, 1]} />
            </mesh>
          );

          if (
            // animating &&
            lastMoveRef.current &&
            ((lastMoveRef.current.axis === "X" &&
              lastMoveRef.current.layer === x) ||
              (lastMoveRef.current.axis === "Y" &&
                lastMoveRef.current.layer === y) ||
              (lastMoveRef.current.axis === "Z" &&
                lastMoveRef.current.layer === z))
          ) {
            continue;
          }

          staticCubies.push(cubie);
        }
      }
    }

    return staticCubies;
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <div
        className={`p-2 absolute right-0 rounded-[15px] font-bold ${
          isSolved ? "text-green-400" : "text-red-400"
        }`}
      >
        {isSolved ? "Solved" : "UnSolved"}
      </div>
      <Canvas camera={{ position: [size, size, size], fov: 50 }}>
        <Stats />
        {/* <AnimationWrapper /> */}
        {/* Static cubies that aren't being animated */}
        <group>{renderCubies()}</group>

        {/* Layer groups for animation */}
        {/* renderLayerGroups() */}

        <ambientLight intensity={2} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          target={[0, 0, 0]}
          minDistance={size * 1}
          maxDistance={size * 3}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
