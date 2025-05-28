import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { ThreeDReset } from "./ui/icons";
import { gsap } from "gsap";
import {
  FACE_COLORS,
  FACE_POSITIONS,
  FACE_ROTATIONS,
  CubeType,
  MoveType,
} from "../types/types";
import { useEffect, useMemo, useRef, useState } from "react";

export default function CubeView3d({
  newCubeState,
  oldCubeState,
  isSolved,
  lastMove,
}: {
  newCubeState: CubeType;
  oldCubeState: CubeType;
  isSolved: boolean;
  lastMove: MoveType | null;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const orbitControlsRef = useRef<OrbitControlsImpl>(null);
  const GAP = 0.05;
  const effectiveSize = cubeState.size * (1 + GAP);

  const resetCameraPosition = () => {
    if (orbitControlsRef.current) {
      const controls = orbitControlsRef.current;
      const animTime = !isNaN(Number(localStorage.getItem("anim")))
        ? Number(localStorage.getItem("anim"))
        : 300;
      gsap.to(controls.object.position, {
        x: effectiveSize,
        y: effectiveSize,
        z: effectiveSize,
        duration: animTime / 1000,
        ease: "power3.inOut",
        onUpdate: () => {
          controls.update();
        },
      });
    }
  };

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

  useEffect(() => {
    if (lastMove) {
      setDisplayedCubeState(oldCubeState);
      startRotationAnimation();
    } else {
      setDisplayedCubeState(newCubeState);
      console.log("No Aimation Cube Rendered");
    }
  }, [lastMove]);

  const startRotationAnimation = () => {
    if (!rotatingGroupRef.current) return;

    // Kill previous animation if running
    if (animationRef.current) {
      gsap.killTweensOf(rotatingGroupRef.current.rotation);
      animationRef.current = null;
    }

    rotatingGroupRef.current.rotation.set(0, 0, 0);

    const axis = lastMove?.axis.toLowerCase();
    let targetAngle = lastMove?.clockwise ? -Math.PI / 2 : Math.PI / 2;
    if (axis === "y") {
      targetAngle = -targetAngle;
    }

    const animTime = !isNaN(Number(localStorage.getItem("anim")))
      ? Number(localStorage.getItem("anim"))
      : 300;
    const duration = (animTime * WAIT_BETWEEN_ANIMATIONS) / 1000; // gsap expects seconds

    if (rotatingGroupRef.current) {
      const rotationTarget = { x: 0, y: 0, z: 0 };
      if (axis === "x") rotationTarget.x = targetAngle;
      else if (axis === "y") rotationTarget.y = targetAngle;
      else if (axis === "z") rotationTarget.z = targetAngle;

      animationRef.current = gsap.to(rotatingGroupRef.current.rotation, {
        ...rotationTarget,
        duration,
        ease: "power3.inOut",
        onComplete: () => {
          if (rotatingGroupRef.current) {
            // setDisplayedCubeState(oldCubeState);
            rotatingGroupRef.current.rotation.set(0, 0, 0);
            animationRef.current = null;
          }
        },
      });
    }
  };

  useEffect(() => {
    const rotatingStickers: React.ReactNode[] = [];
    const staticStickers: React.ReactNode[] = [];

    const faces: Array<{
      face: "f" | "b" | "u" | "d" | "l" | "r";
      colors: string[][];
    }> = [
      { face: "f", colors: displayedCubeState.f },
      { face: "b", colors: displayedCubeState.b },
      { face: "u", colors: displayedCubeState.u },
      { face: "d", colors: displayedCubeState.d },
      { face: "l", colors: displayedCubeState.l },
      { face: "r", colors: displayedCubeState.r },
    ];

    faces.forEach(({ face, colors }) => {
      for (let i = 0; i < displayedCubeState.size; i++) {
        for (let j = 0; j < displayedCubeState.size; j++) {
          const pos = getStickerPosition(
            i,
            j,
            displayedCubeState.size,
            face,
            GAP
          ) as [number, number, number];
          const colorKey = colors[i][j];
          const material = colorMaterials[colorKey];
          const rotation = faceRotations[face];
          const key = `${face}-${i}-${j}`;
          const stickerMesh = (
            <mesh
              key={key}
              position={pos}
              rotation={rotation}
              material={material}
            >
              <planeGeometry args={[1, 1]} />
            </mesh>
          );

          // Determine if this sticker should rotate
          if (shouldMove(pos, face) && lastMove) {
            rotatingStickers.push(stickerMesh);
          } else {
            staticStickers.push(stickerMesh);
          }
        }
      }
    });

    setStickers({
      rotating: rotatingStickers,
      static: staticStickers,
    });
  }, [displayedCubeState]);

  const shouldMove = (pos: [number, number, number], face: string) => {
    const [x, y, z] = pos;
    const axis = lastMove?.axis.toLowerCase();
    const layer = lastMove?.layer;
    const epsilon = 0.1;
    const isOnLayer = (coord: number, target: number) =>
      Math.abs(coord - target) < epsilon;

    // Check if this is a layer move
    let matchesLayer = false;
    if (axis && layer !== undefined) {
      if (axis === "x") {
        const targetX = Number(layer) - (displayedCubeState.size - 1) / 2;
        matchesLayer = isOnLayer(x, targetX);
      } else if (axis === "y") {
        const targetY = Number(layer) - (displayedCubeState.size - 1) / 2;
        matchesLayer = isOnLayer(y, targetY);
      } else if (axis === "z") {
        const invertedLayer = displayedCubeState.size - 1 - Number(layer);
        const targetZ = invertedLayer - (displayedCubeState.size - 1) / 2;
        matchesLayer = isOnLayer(z, targetZ);
      }
    }

  if (!cubeState) return null; // Handle the case where cubeState is undefine

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
      <div
        itemType="button"
        title="Reset Camera"
        onClick={resetCameraPosition}
        className="absolute bottom-2 z-10 right-2 text-white"
      >
        <ThreeDReset />
      </div>
      <Canvas>
        <CameraSetup size={cubeState.size} />
        <Face size={cubeState.size} face={"b"} colors={cubeState.b} />
        <Face size={cubeState.size} face={"f"} colors={cubeState.f} />
        <Face size={cubeState.size} face={"u"} colors={cubeState.u} />
        <Face size={cubeState.size} face={"d"} colors={cubeState.d} />
        <Face size={cubeState.size} face={"l"} colors={cubeState.l} />
        <Face size={cubeState.size} face={"r"} colors={cubeState.r} />
        <ambientLight intensity={2} />
        <group ref={rotatingGroupRef}>{stickers.rotating}</group>
        {stickers.static}
        <OrbitControls
          ref={orbitControlsRef}
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          target={[0, 0, 0]}
          minDistance={displayedCubeState.size * 1}
          maxDistance={displayedCubeState.size * 3}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
