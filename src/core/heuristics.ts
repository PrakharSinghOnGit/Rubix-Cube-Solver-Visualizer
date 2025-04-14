import { CubeType } from "../types/types";

export function heuristicMisplaced(cubeState: CubeType): number {
  console.log("CubeState received:", cubeState);
  let misplaced = 0;
  const faces: (keyof CubeType)[] = ["u", "d", "l", "r", "f", "b"];

  for (const face of faces) {
    const grid = cubeState[face];

    // Check if grid is valid
    if (!Array.isArray(grid) || grid.length === 0 || !Array.isArray(grid[0])) {
      console.error(`Invalid grid for face ${face}:`, grid);
      continue; // Skip this face if it's invalid
    }

    const n = grid.length;
    const center = Math.floor(n / 2);
    const solvedColor = grid[center][center]; // The color of the center sticker represents the solved color

    console.log(`Checking face: ${face}, Solved color: ${solvedColor}`);

    // Check each sticker in the grid
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const sticker = grid[i][j];
        if (sticker !== solvedColor) {
          misplaced++;
          console.log(
            `Misplaced sticker at [${i}, ${j}] on face ${face}: ${sticker} !== ${solvedColor}`
          );
        }
      }
    }
  }
  console.log(`Total misplaced stickers: ${misplaced}`);
  return misplaced;
}

export function heuristicManhattan(cubeState: CubeType): number {
  let distance = 0;
  const faces: (keyof CubeType)[] = ["u", "d", "l", "r", "f", "b"];

  for (const face of faces) {
    const grid = cubeState[face];
    if (!Array.isArray(grid) || grid.length === 0 || !Array.isArray(grid[0])) {
      continue; // Skip this face if it's invalid
    }

    const n = grid.length;
    const center = Math.floor(n / 2);
    const targetColor = grid[center][center];

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (grid[i][j] !== targetColor) {
          const manhattanDist = Math.abs(i - center) + Math.abs(j - center);
          distance += manhattanDist / 2;
        }
      }
    }
  }
  console.log(`Total Manhattan distance: ${distance}`);
  return distance;
}
