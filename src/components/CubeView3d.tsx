import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import gsap from "gsap";
import * as THREE from "three";
import { ThreeDReset } from "./ui/icons";
import {
  FACE_COLORS,
  FACE_POSITIONS,
  FACE_ROTATIONS,
  CubeType,
} from "../types/types";
import { useRef, useEffect } from "react";

function CameraSetup({ size }: { size: number }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(size, size, size);
  }, [camera, size]);

  return null;
}

export default function CubeView3d({
  cubeState,
  isSolved,
}: {
  cubeState: CubeType;
  isSolved: boolean;
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

  function Sticker({
    pos,
    rot,
    text,
    col,
  }: {
    pos: number[];
    rot: number[];
    text: string;
    col: string;
  }) {
    const color = FACE_COLORS[col as keyof typeof FACE_COLORS];
    return (
      <group
        position={new THREE.Vector3(...pos)}
        rotation={new THREE.Euler(...rot)}
      >
        <mesh>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial color={color} />
        </mesh>

        {text && (
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.3}
            color="black"
            anchorX="center"
            anchorY="middle"
          >
            {text}
          </Text>
        )}

        <meshStandardMaterial color="black" />
      </group>
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
    const stickers = [];
    //const offset = (size - 1) / 2; // Center the grid

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        stickers.push(
          <Sticker
            key={`${i}-${j}`}
            text={""}
            col={colors[i][j]}
            pos={getStickerPosition(i, j, size, face, GAP)}
            rot={FACE_ROTATIONS[face as keyof typeof FACE_ROTATIONS]}
          />
        );
      }
    }
    return <>{stickers}</>;
  }

  if (!cubeState) return null; // Handle the case where cubeState is undefine

  return (
    <div
      ref={canvasRef}
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
        <OrbitControls
          ref={orbitControlsRef}
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          target={[0, 0, 0]}
          minDistance={cubeState.size * 1}
          maxDistance={cubeState.size * 3}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
