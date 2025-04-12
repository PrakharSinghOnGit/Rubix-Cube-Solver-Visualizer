import { CubeType } from "../types.ts";
import { Cube } from "./cube.ts";
import { MoveType } from "../types.ts";

export class IDAStar {
  Cube: Cube;
  comparisonCount: number = 0;
  timeTaken: number = 0;
  moves: MoveType[] = [];
  solutionMoves: MoveType[] = [];
  moveCount: number = 0;
  isSolving: boolean = false;
  maxThreshold: number;

  constructor(CubeState: CubeType) {
    this.Cube = new Cube(CubeState.size);
    this.Cube.setState(CubeState);
    this.maxThreshold = this.calculateMaxThreshold(CubeState.size);
  } 

  calculateMaxThreshold(size: number): number {
    // Adjust maximum threshold based on cube size (similar to IDDFS max depth)
    switch (size) {
      case 2: return 11; // 2x2 optimal solutions are usually ≤ 11 moves
      case 3: return 20; // 3x3 optimal solutions are usually ≤ 20 moves
      case 4: return 30; // 4x4 optimal solutions are usually ≤ 30 moves
      case 5: return 40; // 5x5 optimal solutions are usually ≤ 40 moves
      default: return 50; // For larger cubes
    }
  }

  getState() {
    return this.Cube.getState();
  }

  solve() {
    if (this.isSolving) return;
    this.isSolving = true;
    
    const startTime = performance.now();
    this.doIDAStar();
    const endTime = performance.now();
    this.timeTaken = endTime - startTime;
    
    this.isSolving = false
  }

  doIDAStar() {
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

    // Initial threshold based on heuristic
    let threshold = this.Cube.heuristic();
    console.log(`Initial threshold: ${threshold}`);
    
    // Recursive DFS function with depth limit returns:
    // - true if solution is found
    // - minimal f value if threshold is exceeded
    const dfs = (g: number, threshold: number, prevMove: MoveType | null): number | true => {
      this.comparisonCount++;
      
        // Calculate f(n) = g(n) + h(n)
        const h  = this.Cube.heuristic();
        const f = g + h;

        if (f > threshold) {
          return f; // Candidate for next threshold
        }

      if (this.Cube.isSolved()) {
        this.solutionMoves = [...this.moves];
        return true;
      }
      
      let min = Infinity;

      for (const move of possibleMoves) {
        // Skip moves that are direct inverses of the previous move
        if (prevMove &&
            move.axis === prevMove.axis &&
            move.layer === prevMove.layer &&
            move.clockwise !== prevMove.clockwise) {
          continue;
        }

        // Save the current state
        const stateBefore = this.Cube.getState();

        // Apply the move
        this.Cube.rotate(move.layer, move.axis, move.clockwise);
        this.moves.push(move);
        this.moveCount++;

        // Recurse
        const result = dfs(g+1, threshold, move);
        if(result === true) {
            return true; // Solution found
        }

        // Update minimum threshold
        if(typeof result === "number" && result < min) {
            min = result;
        }

        // Backtrack
        this.Cube.setState(stateBefore);
        this.moves.pop();
        this.moveCount--;
      }
      return min;
    };

    // Iterative deepening with progress tracking
    while(threshold <= this.maxThreshold) {
      console.log(`Trying threshold ${threshold}...`);
      
      // Reset state
      this.Cube.setState(originalState);
      this.moves = [];
      this.moveCount = 0;
      
      const result = dfs(0, threshold, null);

      if (result === true) {
        console.log(`Solution found with ${this.solutionMoves.length} moves at threshold ${threshold}`);
        return;
      }
      
      if (typeof result === "number") {
        threshold = result;
        console.log(`No solution found at threshold. Increasing threshold to ${threshold}`);
      }
    }
    console.log("No solution found within maximum threshold");
  }
}
