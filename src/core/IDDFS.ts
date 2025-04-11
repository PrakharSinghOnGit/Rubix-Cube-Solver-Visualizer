import { CubeType } from "../types.ts";
import { Cube } from "./cube.ts";
import { MoveType } from "../types.ts";

export class IDDFS {
  Cube: Cube;
  comparisonCount: number = 0;
  timeTaken: number = 0;
  moves: MoveType[] = [];
  solutionMoves: MoveType[] = [];
  moveCount: number = 0;
  // TODO: add more variables to track the state of the cube

  constructor(CubeState: CubeType) {
    this.Cube = new Cube(CubeState.size);
    this.Cube.setState(CubeState);
  }

  getState() {
    return this.Cube.getState();
  }

  solve() {
    const startTime = performance.now();
    this.doIDDFS();
    const endTime = performance.now();
    this.timeTaken = endTime - startTime;
  }

  doIDDFS() {
    // Simple 2x2 solver using Iterative Deepening Depth-First Search (IDDFS)
    
    // Maximum search depth (for a 2x2 cube, optimal solutions are usually ≤ 11 moves)
    const maxDepth = 7;
    
    // Allowed moves for a 2x2 cube (using your MoveType structure).
    // Here we only use outer layer moves (layer 0) on each axis.
    // For a 2x2, the only layers are 0 and 1; we choose 0 as the outer face.
    const possibleMoves: MoveType[] = [
      { axis: "X", layer: 0, clockwise: true },
      { axis: "X", layer: 0, clockwise: false },
      { axis: "Y", layer: 0, clockwise: true },
      { axis: "Y", layer: 0, clockwise: false },
      { axis: "Z", layer: 0, clockwise: true },
      { axis: "Z", layer: 0, clockwise: false },
    ];
  
    // Save the original state so that we can reset between iterative deepening iterations.
    const originalState = this.Cube.getState();
    // Recursive DFS function (with depth limit) that avoids undoing the previous move.
    const dfs = (depth: number, maxDepth: number, prevMove: MoveType | null): boolean => {
      if (this.Cube.isSolved()) return true;
      if (depth >= maxDepth) return false;
  
      for (const move of possibleMoves) {
        // Optional: skip moves that are direct inverses of the previous move to avoid redundant back-and-forth.
        if (prevMove &&
            move.axis === prevMove.axis &&
            move.clockwise !== prevMove.clockwise) {
          continue;
        }
  
        // Save the current state to backtrack later.
        const stateBefore = this.Cube.getState();
  
        // Apply the move using your Cube.rotate() method.
        this.Cube.rotate(move.layer, move.axis, move.clockwise);
        this.moves.push(move);
        this.moveCount++;
  
        // Recurse at a deeper level.
        if (dfs(depth + 1, maxDepth, move)) {
          return true;
        }
  
        // Backtrack: restore state and remove the move from the moves list.
        this.Cube.setState(stateBefore);
        this.moves.pop();
        this.moveCount--;
      }
      return false;
    };
  
    // Iterative deepening: try increasing depths until a solution is found.
    for (let depth = 1; depth <= maxDepth; depth++) {
      // Reset the cube to its original state and clear previous moves.
      this.Cube.setState(originalState);
      this.moves = [];
      this.moveCount = 0;
      if (dfs(0, depth, null)) {
        this.solutionMoves = [...this.moves]
        break;
      }
    }
  
    // You might want to update your comparisonCount with the number of moves tried during the search.
    this.comparisonCount += this.moveCount;
  }
  
}
