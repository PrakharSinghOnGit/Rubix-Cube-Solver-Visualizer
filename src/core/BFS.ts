import { CubeType } from "../types.ts";
import { Cube } from "./cube.ts";
import { MoveType } from "../types.ts";

export class BFS {
  Cube: Cube;
  comparisonCount: number = 0;
  timeTaken: number = 0;
  moves: MoveType[] = [];
  solutionMoves: MoveType[] = [];
  moveCount: number = 0;
  isSolving: boolean = false;


  constructor(CubeState: CubeType) {
    this.Cube = new Cube(CubeState.size);
    this.Cube.setState(CubeState);
  }

  getState() {
    return this.Cube.getState();
  }

  solve() {
    if (this.isSolving) return;
    this.isSolving = true;
    
    const startTime = performance.now();
    this.doBFS();
    const endTime = performance.now();
    this.timeTaken = endTime - startTime;
    
    this.isSolving = false;
  }

  doBFS() {
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
    // TODO: Implement BFS Algorithm
  }
}
