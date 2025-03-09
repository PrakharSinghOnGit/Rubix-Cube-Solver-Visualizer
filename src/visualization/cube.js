import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RubiksCube } from "../core/cube.js";

// Global variables
let scene, camera, renderer, controls;
let cubeGroup, cubeSize, cubieSize, gap;
let cube; // RubiksCube instance
let animationInProgress = false;
let animationQueue = [];

// Color mapping
const COLORS = {
  0: 0xffffff, // White
  1: 0xffff00, // Yellow
  2: 0xff0000, // Red
  3: 0xffa500, // Orange
  4: 0x0000ff, // Blue
  5: 0x00ff00, // Green
};

/**
 * Initialize the 3D cube visualization
 */
export function initCube() {
  // Get the container element
  const container = document.getElementById("cube-container");

  // Set up the scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xecf0f1);

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
  createCube(3);

  // Handle window resize
  window.addEventListener("resize", onWindowResize);

  // Start the animation loop
  animate();
}

/**
 * Create a new Rubik's Cube with the specified size
 * @param {number} size - The size of the cube (e.g., 2 for 2x2, 3 for 3x3, etc.)
 */
export function createCube(size) {
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

  // Update the solution steps display
  updateSolutionSteps();
}

/**
 * Create the individual cubies that make up the Rubik's Cube
 */
function createCubies() {
  const offset = (cubeSize - 1) / 2;

  // Create a cubie geometry
  const geometry = new THREE.BoxGeometry(cubieSize, cubieSize, cubieSize);

  // Create materials for each face
  const materials = Array(6)
    .fill()
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
 * @param {THREE.Mesh} cubie - The cubie to color
 */
function colorCubie(cubie) {
  const { x, y, z } = cubie.userData;
  const state = cube.getState();

  // Top face (White)
  if (y === cubeSize - 1) {
    cubie.material[1].color.setHex(COLORS[state[0][cubeSize - 1 - z][x]]);
  }

  // Bottom face (Yellow)
  if (y === 0) {
    cubie.material[0].color.setHex(COLORS[state[1][z][x]]);
  }

  // Front face (Red)
  if (z === cubeSize - 1) {
    cubie.material[2].color.setHex(COLORS[state[2][cubeSize - 1 - y][x]]);
  }

  // Back face (Orange)
  if (z === 0) {
    cubie.material[3].color.setHex(
      COLORS[state[3][cubeSize - 1 - y][cubeSize - 1 - x]]
    );
  }

  // Left face (Blue)
  if (x === 0) {
    cubie.material[4].color.setHex(COLORS[state[4][cubeSize - 1 - y][z]]);
  }

  // Right face (Green)
  if (x === cubeSize - 1) {
    cubie.material[5].color.setHex(
      COLORS[state[5][cubeSize - 1 - y][cubeSize - 1 - z]]
    );
  }
}

/**
 * Update the 3D visualization based on the current state of the cube
 */
function updateCubeVisualization() {
  cubeGroup.children.forEach((cubie) => {
    colorCubie(cubie);
  });
}

/**
 * Handle window resize
 */
function onWindowResize() {
  const container = document.getElementById("cube-container");
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

/**
 * Animation loop
 */
function animate() {
  requestAnimationFrame(animate);

  // Update the controls
  controls.update();

  // Process the animation queue
  if (!animationInProgress && animationQueue.length > 0) {
    const move = animationQueue.shift();
    animateMove(move);
  }

  // Render the scene
  renderer.render(scene, camera);
}

/**
 * Animate a move
 * @param {Object} move - The move to animate { face, clockwise, layer }
 */
function animateMove(move) {
  animationInProgress = true;

  // Get the axis and direction of rotation
  const { axis, direction } = getMoveRotationParams(move);

  // Get the cubies to rotate
  const cubiesToRotate = getCubiesToRotate(move);

  // Create a group for the cubies to rotate
  const rotationGroup = new THREE.Group();
  scene.add(rotationGroup);

  // Add the cubies to the rotation group
  cubiesToRotate.forEach((cubie) => {
    // Remove the cubie from the cube group
    cubeGroup.remove(cubie);

    // Add it to the rotation group
    rotationGroup.add(cubie);
  });

  // Animate the rotation
  const duration = 500; // milliseconds
  const startTime = Date.now();
  const targetAngle = (direction * Math.PI) / 2;

  function rotateStep() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Use an easing function for smoother animation
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    // Set the rotation
    rotationGroup.rotation[axis] = targetAngle * easeProgress;

    if (progress < 1) {
      requestAnimationFrame(rotateStep);
    } else {
      // Animation complete

      // Move the cubies back to the cube group
      while (rotationGroup.children.length > 0) {
        const cubie = rotationGroup.children[0];

        // Remove from rotation group
        rotationGroup.remove(cubie);

        // Reset the cubie's rotation
        cubie.position.applyAxisAngle(
          new THREE.Vector3(
            axis === "x" ? 1 : 0,
            axis === "y" ? 1 : 0,
            axis === "z" ? 1 : 0
          ),
          targetAngle
        );

        // Update the cubie's coordinates
        updateCubieCoordinates(cubie, move);

        // Add to cube group
        cubeGroup.add(cubie);
      }

      // Remove the rotation group
      scene.remove(rotationGroup);

      // Update the cube visualization
      updateCubeVisualization();

      // Animation is no longer in progress
      animationInProgress = false;
    }
  }

  rotateStep();
}

/**
 * Get the rotation parameters for a move
 * @param {Object} move - The move { face, clockwise, layer }
 * @returns {Object} - The rotation parameters { axis, direction }
 */
function getMoveRotationParams(move) {
  const { face, clockwise } = move;

  // Define the rotation axis and direction for each face
  const rotationParams = {
    0: { axis: "y", direction: clockwise ? 1 : -1 }, // Top (White)
    1: { axis: "y", direction: clockwise ? -1 : 1 }, // Bottom (Yellow)
    2: { axis: "z", direction: clockwise ? -1 : 1 }, // Front (Red)
    3: { axis: "z", direction: clockwise ? 1 : -1 }, // Back (Orange)
    4: { axis: "x", direction: clockwise ? 1 : -1 }, // Left (Blue)
    5: { axis: "x", direction: clockwise ? -1 : 1 }, // Right (Green)
  };

  return rotationParams[face];
}

/**
 * Get the cubies to rotate for a move
 * @param {Object} move - The move { face, clockwise, layer }
 * @returns {Array} - The cubies to rotate
 */
function getCubiesToRotate(move) {
  const { face, layer } = move;
  const cubiesToRotate = [];

  // Get all cubies
  const cubies = cubeGroup.children;

  // Filter the cubies based on the face and layer
  cubies.forEach((cubie) => {
    const { x, y, z } = cubie.userData;

    switch (face) {
      case 0: // Top (White)
        if (y === cubeSize - 1 - layer) {
          cubiesToRotate.push(cubie);
        }
        break;
      case 1: // Bottom (Yellow)
        if (y === layer) {
          cubiesToRotate.push(cubie);
        }
        break;
      case 2: // Front (Red)
        if (z === cubeSize - 1 - layer) {
          cubiesToRotate.push(cubie);
        }
        break;
      case 3: // Back (Orange)
        if (z === layer) {
          cubiesToRotate.push(cubie);
        }
        break;
      case 4: // Left (Blue)
        if (x === layer) {
          cubiesToRotate.push(cubie);
        }
        break;
      case 5: // Right (Green)
        if (x === cubeSize - 1 - layer) {
          cubiesToRotate.push(cubie);
        }
        break;
    }
  });

  return cubiesToRotate;
}

/**
 * Update the coordinates of a cubie after a rotation
 * @param {THREE.Mesh} cubie - The cubie to update
 * @param {Object} move - The move that was applied
 */
function updateCubieCoordinates(cubie, move) {
  const { face, clockwise } = move;
  const { x, y, z } = cubie.userData;

  // Update the coordinates based on the face and direction
  switch (face) {
    case 0: // Top (White)
      cubie.userData = {
        x: clockwise ? z : cubeSize - 1 - z,
        y,
        z: clockwise ? cubeSize - 1 - x : x,
      };
      break;
    case 1: // Bottom (Yellow)
      cubie.userData = {
        x: clockwise ? cubeSize - 1 - z : z,
        y,
        z: clockwise ? x : cubeSize - 1 - x,
      };
      break;
    case 2: // Front (Red)
      cubie.userData = {
        x: clockwise ? y : cubeSize - 1 - y,
        y: clockwise ? cubeSize - 1 - x : x,
        z,
      };
      break;
    case 3: // Back (Orange)
      cubie.userData = {
        x: clockwise ? cubeSize - 1 - y : y,
        y: clockwise ? x : cubeSize - 1 - x,
        z,
      };
      break;
    case 4: // Left (Blue)
      cubie.userData = {
        x,
        y: clockwise ? z : cubeSize - 1 - z,
        z: clockwise ? cubeSize - 1 - y : y,
      };
      break;
    case 5: // Right (Green)
      cubie.userData = {
        x,
        y: clockwise ? cubeSize - 1 - z : z,
        z: clockwise ? y : cubeSize - 1 - y,
      };
      break;
  }
}

/**
 * Apply a move to the cube
 * @param {Object} move - The move to apply { face, clockwise, layer }
 */
export function applyMove(move) {
  // Apply the move to the cube model
  if (move.layer === 0) {
    cube.rotateFace(move.face, move.clockwise);
  } else {
    cube.rotateLayer(move.face, move.layer, move.clockwise);
  }

  // Add the move to the animation queue
  animationQueue.push(move);

  // Update the solution steps display
  updateSolutionSteps();
}

/**
 * Apply a sequence of moves to the cube
 * @param {Array} moves - The moves to apply
 */
export function applyMoves(moves) {
  // Apply each move to the cube model
  cube.applyMoves(moves);

  // Add the moves to the animation queue
  animationQueue.push(...moves);

  // Update the solution steps display
  updateSolutionSteps();
}

/**
 * Scramble the cube
 * @param {number} moveCount - The number of random moves to apply
 */
export function scrambleCube(moveCount = 20) {
  // Scramble the cube
  const moves = cube.scramble(moveCount);

  // Update the cube visualization
  updateCubeVisualization();

  // Update the solution steps display
  updateSolutionSteps();

  return moves;
}

/**
 * Reset the cube to its solved state
 */
export function resetCube() {
  // Reset the cube
  cube.reset();

  // Update the cube visualization
  updateCubeVisualization();

  // Update the solution steps display
  updateSolutionSteps();
}

/**
 * Update the solution steps display
 */
function updateSolutionSteps() {
  const stepsContainer = document.getElementById("solution-steps-container");
  const moveHistory = cube.getMoveHistory();

  // Clear the container
  stepsContainer.innerHTML = "";

  if (moveHistory.length === 0) {
    stepsContainer.innerHTML = "<p>No moves applied yet.</p>";
    return;
  }

  // Create a list of moves
  const movesList = document.createElement("ol");

  moveHistory.forEach((move, index) => {
    const moveItem = document.createElement("li");
    moveItem.textContent = RubiksCube.moveToNotation(move);
    movesList.appendChild(moveItem);
  });

  stepsContainer.appendChild(movesList);
}

/**
 * Get the current cube instance
 * @returns {RubiksCube} - The current cube instance
 */
export function getCube() {
  return cube;
}
