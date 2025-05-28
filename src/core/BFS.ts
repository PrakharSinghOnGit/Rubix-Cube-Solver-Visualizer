import { CubeType } from "../types/types.ts";
import { Cube } from "./cube.ts";
import { MoveType } from "../types/types.ts";

export class BFS {
  Cube: Cube;
  comparisonCount: number = 0;
  timeTaken: number = 0;
  moves: MoveType[] = [];
  solutionMoves: MoveType[] = [];
  moveCount: number = 0;
  isSolving: boolean = false;
  maxDepth: number;
  startDepth: number;

  constructor(CubeState: CubeType) {
    this.Cube = new Cube(CubeState.size);
    this.Cube.setState(CubeState);
    this.maxDepth = this.calculateMaxDepth(CubeState.size);
    this.startDepth = this.calculateStartDepth(CubeState.size);
  }

  calculateMaxDepth(size: number): number {
    // Adjust maximum depth based on cube size
    switch (size) {
      case 2:
        return 11; // 2x2 optimal solutions are usually ≤ 11 moves
      case 3:
        return 20; // 3x3 optimal solutions are usually ≤ 20 moves
      case 4:
        return 30; // 4x4 optimal solutions are usually ≤ 30 moves
      case 5:
        return 40; // 5x5 optimal solutions are usually ≤ 40 moves
      default:
        return 50; // For larger cubes
    }
  }

  calculateStartDepth(size: number): number {
    // Start with a smaller depth appropriate for the cube size
    switch (size) {
      case 2:
        return 1; // 2x2 can be solved quickly
      case 3:
        return 3; // 3x3 needs more depth
      default:
        return 5; // Larger cubes need more depth
    }
  }

  getState() {
    return this.Cube.getState();
  }

  solve() {
    if (this.isSolving) return;
    this.isSolving = true;

    const startTime = performance.now();
    this.doIDDFS();
    const endTime = performance.now();
    this.timeTaken = endTime - startTime;

    this.isSolving = false;
  }

  doIDDFS() {
    // Check if cube is already solved
    if (this.Cube.isSolved()) {
      console.log("Cube is already solved!");
      return;
    }

    // Generate possible moves based on cube size
    const possibleMoves: MoveType[] = [];
    const layers = Math.ceil(this.Cube.size / 2);

    for (let layer = 0; layer < layers; layer++) {
      // Add moves for each axis
      possibleMoves.push(
        { axis: "X", layer, clockwise: true },
        { axis: "X", layer, clockwise: false },
        { axis: "Y", layer, clockwise: true },
        { axis: "Y", layer, clockwise: false },
        { axis: "Z", layer, clockwise: true },
        { axis: "Z", layer, clockwise: false }
      );
    }

    // Save the original state
    const originalState = this.Cube.getState();

    // Recursive DFS function with depth limit
    const dfs = (
      depth: number,
      maxDepth: number,
      prevMove: MoveType | null
    ): boolean => {
      this.comparisonCount++;

      if (this.Cube.isSolved()) {
        this.solutionMoves = [...this.moves];
        return true;
      }

      if (depth >= maxDepth) return false;

      for (const move of possibleMoves) {
        // Skip moves that are direct inverses of the previous move
        if (
          prevMove &&
          move.axis === prevMove.axis &&
          move.layer === prevMove.layer &&
          move.clockwise !== prevMove.clockwise
        ) {
          continue;
        }

        // Save the current state
        const stateBefore = this.Cube.getState();

        // Apply the move
        this.Cube.rotate(move.layer, move.axis, move.clockwise);
        this.moves.push(move);
        this.moveCount++;

        // Recurse
        if (dfs(depth + 1, maxDepth, move)) {
          return true;
        }

        // Backtrack
        this.Cube.setState(stateBefore);
        this.moves.pop();
        this.moveCount--;
      }
      return false;
    };

    // Iterative deepening with progress tracking
    for (let depth = this.startDepth; depth <= this.maxDepth; depth++) {
      console.log(`Trying depth ${depth}...`);

      // Reset state
      this.Cube.setState(originalState);
      this.moves = [];
      this.moveCount = 0;

      if (dfs(0, depth, null)) {
        console.log(
          `Solution found at depth ${depth} with ${this.solutionMoves.length} moves`
        );
        break;
      }

      console.log(`No solution found at depth ${depth}`);
    }

    if (this.solutionMoves.length === 0) {
      console.log("No solution found within maximum depth");
    }
  }
}
