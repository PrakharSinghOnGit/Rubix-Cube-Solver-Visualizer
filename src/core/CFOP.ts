import { CubeType } from "../types";
import { Cube } from "./cube.ts";
import { MoveType } from "../types";

export class CFOP {
  Cube: Cube;
  comparisonCount: number = 0;
  timeTaken: number = 0;
  moves: MoveType[] = [];
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
    this.doCFOP();
    const endTime = performance.now();
    this.timeTaken = endTime - startTime;
  }

  doCFOP() {
    // TODO: implement CFOP algorithm here
    this.comparisonCount += 1;
    this.moveCount += 1;
    this.moves.push({
      layer: 0,
      clockwise: true,
      axis: "X",
    });
  }
}
