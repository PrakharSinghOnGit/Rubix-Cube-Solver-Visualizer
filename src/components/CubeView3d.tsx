/* eslint-disable react-hooks/exhaustive-deps */
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { ThreeDReset } from "./ui/icons";
import gsap from "gsap";
import * as THREE from "three";
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
  const GAP = 0.05;
  const WAIT_BETWEEN_ANIMATIONS = 0.95; // percentage
  const orbitControlsRef = useRef<OrbitControlsImpl>(null);
  const rotatingGroupRef = useRef<THREE.Group>(null);
  const [stickers, setStickers] = useState<{
    rotating: React.ReactNode[];
    static: React.ReactNode[];
  }>({ rotating: [], static: [] });
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [displayedCubeState, setDisplayedCubeState] =
    useState<CubeType>(oldCubeState);
  const effectiveSize = displayedCubeState.size * (1 + GAP);

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

  const colorMaterials = useMemo(() => {
    const materials: Record<string, THREE.MeshStandardMaterial> = {};
    Object.entries(FACE_COLORS).forEach(([key, color]) => {
      materials[key] = new THREE.MeshStandardMaterial({ color });
    });
    return materials;
  }, []);

  const faceRotations = useMemo(() => {
    const rotations: Record<string, THREE.Euler> = {};
    Object.entries(FACE_ROTATIONS).forEach(([face, rotation]) => {
      rotations[face] = new THREE.Euler(...rotation);
    });
    return rotations;
  }, []);

  useEffect(() => {
    setDisplayedCubeState(newCubeState);
  }, [newCubeState]);

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

    // Check if this is a face move (first or last layer)
    let matchesFace = false;
    if (axis && layer !== undefined) {
      const isFirstLayer = Number(layer) === 0;
      const isLastLayer = Number(layer) === displayedCubeState.size - 1;

      if (isFirstLayer || isLastLayer) {
        // Map axes to faces
        const faceMap: Record<string, string[]> = {
          x: isFirstLayer ? ["l"] : ["r"],
          y: isFirstLayer ? ["d"] : ["u"],
          z: isFirstLayer ? ["f"] : ["b"],
        };

        const facesToCheck = faceMap[axis] || [];
        matchesFace = facesToCheck.includes(face);
      }
    }

    return matchesLayer || matchesFace;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.kill(); // Kill GSAP animation
        animationRef.current = null;
      }
    };
  }, []);

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
      <Canvas
        camera={{
          position: [effectiveSize, effectiveSize, effectiveSize],
        }}
      >
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
