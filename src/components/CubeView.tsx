import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { CubeState, Move, MoveType, Face, colorMap, CubeColor } from "../types";

interface CubeViewProps {
  cubeState: CubeState;
  cubeSize: number;
  onMove: (move: Move) => void;
}

// Helper to convert cube color index to actual color
const getColorFromIndex = (colorIndex: number): string => {
  return colorMap[colorIndex as CubeColor];
};

// Individual cubie component
interface CubieProps {
  position: [number, number, number];
  colors: string[];
  size: number;
  cubeSize: number;
  onFaceClick: (faceIndex: number) => void;
}

const Cubie: React.FC<CubieProps> = ({
  position,
  colors,
  size,
  cubeSize,
  onFaceClick,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  // Calculate the size of each cubie
  const cubieSize = size / cubeSize;

  // Determine which faces of this cubie are visible (on the outside of the cube)
  const isOnFace = [
    position[1] === size / 2 - cubieSize / 2, // UP
    position[1] === -size / 2 + cubieSize / 2, // DOWN
    position[2] === size / 2 - cubieSize / 2, // FRONT
    position[2] === -size / 2 + cubieSize / 2, // BACK
    position[0] === size / 2 - cubieSize / 2, // RIGHT
    position[0] === -size / 2 + cubieSize / 2, // LEFT
  ];

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        const faceIndex = Math.floor(e.faceIndex! / 2);
        setHovered(faceIndex);
      }}
      onPointerOut={() => setHovered(null)}
      onClick={(e) => {
        e.stopPropagation();
        const faceIndex = Math.floor(e.faceIndex! / 2);
        onFaceClick(faceIndex);
      }}
    >
      <boxGeometry
        args={[cubieSize * 0.95, cubieSize * 0.95, cubieSize * 0.95]}
      />
      <meshStandardMaterial color="#111111" />

      {/* UP face */}
      {isOnFace[0] && (
        <mesh
          position={[0, (cubieSize / 2) * 0.96, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[cubieSize * 0.9, cubieSize * 0.9]} />
          <meshStandardMaterial
            color={colors[0]}
            emissive={hovered === 4 ? "#333333" : "#000000"}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* DOWN face */}
      {isOnFace[1] && (
        <mesh
          position={[0, (-cubieSize / 2) * 0.96, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[cubieSize * 0.9, cubieSize * 0.9]} />
          <meshStandardMaterial
            color={colors[1]}
            emissive={hovered === 5 ? "#333333" : "#000000"}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* FRONT face */}
      {isOnFace[2] && (
        <mesh position={[0, 0, (cubieSize / 2) * 0.96]}>
          <planeGeometry args={[cubieSize * 0.9, cubieSize * 0.9]} />
          <meshStandardMaterial
            color={colors[2]}
            emissive={hovered === 0 ? "#333333" : "#000000"}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* BACK face */}
      {isOnFace[3] && (
        <mesh
          position={[0, 0, (-cubieSize / 2) * 0.96]}
          rotation={[0, Math.PI, 0]}
        >
          <planeGeometry args={[cubieSize * 0.9, cubieSize * 0.9]} />
          <meshStandardMaterial
            color={colors[3]}
            emissive={hovered === 1 ? "#333333" : "#000000"}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* RIGHT face */}
      {isOnFace[4] && (
        <mesh
          position={[(cubieSize / 2) * 0.96, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <planeGeometry args={[cubieSize * 0.9, cubieSize * 0.9]} />
          <meshStandardMaterial
            color={colors[4]}
            emissive={hovered === 2 ? "#333333" : "#000000"}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* LEFT face */}
      {isOnFace[5] && (
        <mesh
          position={[(-cubieSize / 2) * 0.96, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <planeGeometry args={[cubieSize * 0.9, cubieSize * 0.9]} />
          <meshStandardMaterial
            color={colors[5]}
            emissive={hovered === 3 ? "#333333" : "#000000"}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </mesh>
  );
};

// Main cube component
interface RubiksCubeProps {
  cubeState: CubeState;
  cubeSize: number;
  onMove: (move: Move) => void;
}

const RubiksCube: React.FC<RubiksCubeProps> = ({
  cubeState,
  cubeSize,
  onMove,
}) => {
  const size = 5; // Overall size of the cube in the scene
  const [selectedFace, setSelectedFace] = useState<Face | null>(null);
  const [selectedCubie, setSelectedCubie] = useState<number | null>(null);

  // Handle click on a cubie face
  const handleFaceClick = (
    faceIndex: number,
    cubiePosition: [number, number, number]
  ) => {
    // Determine which face of the cube was clicked
    let face: Face;

    // Convert the local face index to the global face
    switch (faceIndex) {
      case 0:
        face = Face.FRONT;
        break;
      case 1:
        face = Face.BACK;
        break;
      case 2:
        face = Face.RIGHT;
        break;
      case 3:
        face = Face.LEFT;
        break;
      case 4:
        face = Face.UP;
        break;
      case 5:
        face = Face.DOWN;
        break;
      default:
        return;
    }

    // If we already have a selected face, make a move
    if (selectedFace !== null && selectedCubie !== null) {
      // Determine the move based on the selected face and the new click
      const move: Move = {
        type: MoveType.FACE_CLOCKWISE,
        face,
      };

      onMove(move);
      setSelectedFace(null);
      setSelectedCubie(null);
    } else {
      // Otherwise, select this face for the next click
      setSelectedFace(face);
      setSelectedCubie(faceIndex);
    }
  };

  // Generate all cubies based on the cube state
  const generateCubies = () => {
    const cubies = [];
    const cubieSize = size / cubeSize;

    // Calculate the starting position for the first cubie
    const startPos = -size / 2 + cubieSize / 2;

    // Create all cubies
    for (let x = 0; x < cubeSize; x++) {
      for (let y = 0; y < cubeSize; y++) {
        for (let z = 0; z < cubeSize; z++) {
          // Skip internal cubies (not visible)
          if (
            x > 0 &&
            x < cubeSize - 1 &&
            y > 0 &&
            y < cubeSize - 1 &&
            z > 0 &&
            z < cubeSize - 1
          ) {
            continue;
          }

          // Calculate position
          const position: [number, number, number] = [
            startPos + x * cubieSize,
            startPos + (cubeSize - 1 - y) * cubieSize, // Invert Y to match cube state
            startPos + (cubeSize - 1 - z) * cubieSize, // Invert Z to match cube state
          ];

          // Get colors for each face of this cubie
          const colors = [
            getColorFromIndex(cubeState[Face.UP][y][x]),
            getColorFromIndex(cubeState[Face.DOWN][cubeSize - 1 - y][x]),
            getColorFromIndex(cubeState[Face.FRONT][y][x]),
            getColorFromIndex(cubeState[Face.BACK][y][cubeSize - 1 - x]),
            getColorFromIndex(cubeState[Face.RIGHT][y][cubeSize - 1 - z]),
            getColorFromIndex(cubeState[Face.LEFT][y][z]),
          ];

          cubies.push(
            <Cubie
              key={`${x}-${y}-${z}`}
              position={position}
              colors={colors}
              size={size}
              cubeSize={cubeSize}
              onFaceClick={(faceIndex) => handleFaceClick(faceIndex, position)}
            />
          );
        }
      }
    }

    return cubies;
  };

  return <group>{generateCubies()}</group>;
};

// Scene setup
const Scene: React.FC<RubiksCubeProps> = (props) => {
  const { camera } = useThree();

  useEffect(() => {
    // Set initial camera position
    camera.position.set(8, 8, 8);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={0.5} />
      <RubiksCube {...props} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </>
  );
};

// Main component
const CubeView: React.FC<CubeViewProps> = (props) => {
  return (
    <div className="canvas-container">
      <Canvas>
        <PerspectiveCamera makeDefault fov={50} position={[8, 8, 8]} />
        <Scene {...props} />
      </Canvas>
    </div>
  );
};

export default CubeView;
