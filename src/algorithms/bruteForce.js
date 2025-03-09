import { RubiksCube } from "../core/cube.js";

/**
 * Brute Force Algorithm for solving the Rubik's Cube
 * This algorithm is only feasible for 2x2 cubes due to the exponential growth of the search space
 */
export class BruteForceAlgorithm {
  /**
   * Solve the cube using a brute force approach
   * @param {Array} state - The current state of the cube
   * @param {number} size - The size of the cube
   * @returns {Promise<Array>} - The solution moves
   */
  static async solve(state, size) {
    if (size !== 2) {
      throw new Error("Brute force algorithm is only available for 2x2 cubes");
    }

    // Create a new cube with the given state
    const cube = new RubiksCube(size);
    cube.faces = JSON.parse(JSON.stringify(state));

    // Check if the cube is already solved
    if (cube.isSolved()) {
      return [];
    }

    // Maximum depth for the search
    const maxDepth = 14; // Most 2x2 cubes can be solved in 14 moves or less

    // Iterative deepening depth-first search
    for (let depth = 1; depth <= maxDepth; depth++) {
      console.log(`Searching at depth ${depth}...`);

      const solution = await this.searchAtDepth(cube, depth);

      if (solution) {
        console.log(`Solution found at depth ${depth}`);
        return solution;
      }
    }

    throw new Error("No solution found within the maximum depth");
  }

  /**
   * Search for a solution at a specific depth
   * @param {RubiksCube} cube - The cube to solve
   * @param {number} depth - The maximum depth to search
   * @returns {Promise<Array|null>} - The solution moves or null if no solution is found
   */
  static async searchAtDepth(cube, depth) {
    // Create a copy of the cube
    const cubeCopy = new RubiksCube(cube.size);
    cubeCopy.faces = JSON.parse(JSON.stringify(cube.faces));

    // Search for a solution
    return await this.depthLimitedSearch(cubeCopy, depth, []);
  }

  /**
   * Perform a depth-limited search
   * @param {RubiksCube} cube - The cube to solve
   * @param {number} depth - The remaining depth to search
   * @param {Array} moves - The moves applied so far
   * @returns {Promise<Array|null>} - The solution moves or null if no solution is found
   */
  static async depthLimitedSearch(cube, depth, moves) {
    // Check if the cube is solved
    if (cube.isSolved()) {
      return moves;
    }

    // If we've reached the maximum depth, return null
    if (depth === 0) {
      return null;
    }

    // Try all possible moves
    const possibleMoves = this.getPossibleMoves();

    for (const move of possibleMoves) {
      // Skip redundant moves (e.g., applying the same face twice in a row)
      if (moves.length > 0) {
        const lastMove = moves[moves.length - 1];
        if (lastMove.face === move.face) {
          continue;
        }
      }

      // Apply the move
      const cubeCopy = new RubiksCube(cube.size);
      cubeCopy.faces = JSON.parse(JSON.stringify(cube.faces));
      cubeCopy.rotateFace(move.face, move.clockwise);

      // Add the move to the list
      const newMoves = [...moves, move];

      // Recursively search
      const solution = await this.depthLimitedSearch(
        cubeCopy,
        depth - 1,
        newMoves
      );

      // If a solution is found, return it
      if (solution) {
        return solution;
      }
    }

    // No solution found at this depth
    return null;
  }

  /**
   * Get all possible moves for a 2x2 cube
   * @returns {Array} - The possible moves
   */
  static getPossibleMoves() {
    const moves = [];

    // For a 2x2 cube, we have 6 faces and 2 directions (clockwise and counterclockwise)
    for (let face = 0; face < 6; face++) {
      moves.push({ face, clockwise: true, layer: 0 });
      moves.push({ face, clockwise: false, layer: 0 });
    }

    return moves;
  }
}
