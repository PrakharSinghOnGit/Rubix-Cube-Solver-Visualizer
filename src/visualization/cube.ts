import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { RubiksCube } from "../core/cube";

// Color mapping
const colorMap: Record<string, number> = {
  W: 0xffffff, // White
  Y: 0xffff00, // Yellow
  G: 0x00ff00, // Green
  B: 0x0000ff, // Blue
  O: 0xffa500, // Orange
  R: 0xff0000, // Red
};

// Face to index mapping for notation
const faceToIndex: Record<string, number> = {
  U: 0, // Up (White)
  D: 1, // Down (Yellow)
  F: 2, // Front (Green)
  B: 3, // Back (Blue)
  L: 4, // Left (Orange)
  R: 5, // Right (Red)
};

// Global variables
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let cubeGroup: THREE.Group;
let cubeSize: number;
let cubieSize: number;
let gap: number;
let cube: RubiksCube; // RubiksCube instance
let animationInProgress = false;
let animationQueue: any[] = [];

/**
 * Initialize the 3D cube visualization
 */
export function initCube(): void {
  // Get the container element
  const container = document.getElementById("cube-container");
  if (!container) {
    console.error("Cube container not found");
    return;
  }

  // Set up the scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // Set up the camera
  camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(5, 5, 7);

  // Set up the renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Set up the controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7);
  scene.add(directionalLight);

  // Create a new Rubik's Cube instance (default 3x3)
  createCube(7);

  // Handle window resize
  window.addEventListener("resize", onWindowResize);

  // Start the animation loop
  animate();
}

/**
 * Create a new Rubik's Cube with the specified size
 */
export function createCube(size: number): void {
  console.log("Creating cube with size:", size);

  // Clear any existing cube
  if (cubeGroup) {
    scene.remove(cubeGroup);
  }

  // Create a new Rubik's Cube instance
  cube = new RubiksCube(size);
  cubeSize = size;

  // Set up the cube group
  cubeGroup = new THREE.Group();
  scene.add(cubeGroup);

  // Set the size of each cubie and the gap between them
  cubieSize = 1;
  gap = 0.05;

  // Create the cubies
  createCubies();
}

/**
 * Create the individual cubies that make up the Rubik's Cube
 */
function createCubies(): void {
  const offset = (cubeSize - 1) / 2;

  // Create a cubie geometry
  const geometry = new THREE.BoxGeometry(cubieSize, cubieSize, cubieSize);

  // Create materials for each face
  const materials = Array(6)
    .fill(null)
    .map(() => new THREE.MeshLambertMaterial({ color: 0x333333 }));

  // Create cubies
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

        // Create a cubie
        const cubie = new THREE.Mesh(
          geometry,
          materials.map((m) => m.clone())
        );

        // Position the cubie
        cubie.position.set(
          (x - offset) * (cubieSize + gap),
          (y - offset) * (cubieSize + gap),
          (z - offset) * (cubieSize + gap)
        );

        // Store the cubie's coordinates
        cubie.userData = { x, y, z };

        // Add the cubie to the cube group
        cubeGroup.add(cubie);

        // Color the faces of the cubie
        colorCubie(cubie);
      }
    }
  }
}

/**
 * Color the faces of a cubie based on its position
 */
function colorCubie(cubie: THREE.Mesh): void {
  const { x, y, z } = cubie.userData;
  const faces = cube.getFaces();

  // Top face (White)
  if (y === cubeSize - 1) {
    const color = faces["U"][z][x];
    (cubie.material as THREE.MeshLambertMaterial[])[2].color.setHex(
      colorMap[color]
    );
  }

  // Bottom face (Yellow)
  if (y === 0) {
    const color = faces["D"][cubeSize - 1 - z][x];
    (cubie.material as THREE.MeshLambertMaterial[])[3].color.setHex(
      colorMap[color]
    );
  }

  // Front face (Green)
  if (z === cubeSize - 1) {
    const color = faces["F"][cubeSize - 1 - y][x];
    (cubie.material as THREE.MeshLambertMaterial[])[4].color.setHex(
      colorMap[color]
    );
  }

  // Back face (Blue)
  if (z === 0) {
    const color = faces["B"][cubeSize - 1 - y][cubeSize - 1 - x];
    (cubie.material as THREE.MeshLambertMaterial[])[5].color.setHex(
      colorMap[color]
    );
  }

  // Left face (Orange)
  if (x === 0) {
    const color = faces["L"][cubeSize - 1 - y][z];
    (cubie.material as THREE.MeshLambertMaterial[])[1].color.setHex(
      colorMap[color]
    );
  }

  // Right face (Red)
  if (x === cubeSize - 1) {
    const color = faces["R"][cubeSize - 1 - y][cubeSize - 1 - z];
    (cubie.material as THREE.MeshLambertMaterial[])[0].color.setHex(
      colorMap[color]
    );
  }
}

/**
 * Update the 3D visualization based on the current state of the cube
 */
function updateCubeVisualization(): void {
  cubeGroup.children.forEach((cubie) => {
    colorCubie(cubie as THREE.Mesh);
  });
}

/**
 * Handle window resize
 */
function onWindowResize(): void {
  const container = document.getElementById("cube-container");
  if (!container) return;

  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

/**
 * Animation loop
 */
function animate(): void {
  requestAnimationFrame(animate);

  // Update the controls
  controls.update();

  // Render the scene
  renderer.render(scene, camera);
}

/**
 * Scramble the cube
 */
export function scrambleCube(moveCount: number = 20): void {
  console.log("Scrambling cube with", moveCount, "moves");

  if (!cube) {
    console.error("Cube is not initialized");
    return;
  }

  // Scramble the cube
  cube.scramble(moveCount);
  console.log("Is solved after scramble:", cube.isSolved());

  // Update the cube visualization
  updateCubeVisualization();
}

/**
 * Reset the cube to its solved state
 */
export function resetCube(): void {
  // Create a new cube with the same size
  cube = new RubiksCube(cubeSize);

  // Update the cube visualization
  updateCubeVisualization();
}

/**
 * Get the current cube instance
 */
export function getCube(): RubiksCube {
  return cube;
}
