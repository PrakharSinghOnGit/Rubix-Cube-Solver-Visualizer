import { CubeType, MoveType, CFOPState } from "../types/types.ts";
import { Cube } from "./cube.ts";

interface EdgePiece {
  face: string;
  position: [number, number];
  color: string;
  adjacentColor: string;
}

export class CFOP {
  private cube: Cube;
  private state: CFOPState;
  comparisonCount: number = 0;
  timeTaken: number = 0;
  solutionMoves: MoveType[] = [];

  constructor(cubeState: CubeType) {
    this.cube = new Cube(cubeState.size);
    this.cube.setState(cubeState);
    this.state = {
      stage: "CROSS",
      substage: "D_CROSS",
      progress: 0,
      moves: [],
    };
  }

  getState(): CFOPState {
    return this.state;
  }

  solve(): MoveType[] {
    const startTime = performance.now();

    // Solve in stages
    this.solveCross();
    this.solveF2L();
    this.solveOLL();
    this.solvePLL();

    const endTime = performance.now();
    this.timeTaken = endTime - startTime;

    return this.solutionMoves;
  }

  private solveCross(): void {
    this.state.stage = "CROSS";
    this.state.substage = "D_CROSS";

    // Solve white cross on bottom
    const whiteEdges = this.findWhiteEdges();
    console.log("whiteEdges", whiteEdges);

    for (const edge of whiteEdges) {
      this.solveWhiteEdge(edge);
    }

    this.state.progress = 100;
  }

  private solveF2L(): void {
    this.state.stage = "F2L";
    this.state.substage = "PAIR_1";

    // Solve four F2L pairs
    for (let i = 0; i < 4; i++) {
      this.state.substage = `PAIR_${i + 1}`;
      this.solveF2LPair();
      this.state.progress = (i + 1) * 25;
    }
  }

  private solveOLL(): void {
    this.state.stage = "OLL";
    this.state.substage = "RECOGNIZE";

    // Recognize OLL case
    const ollCase = this.recognizeOLL();
    this.state.substage = ollCase;

    // Apply OLL algorithm
    this.applyOLL(ollCase);

    this.state.progress = 100;
  }

  private solvePLL(): void {
    this.state.stage = "PLL";
    this.state.substage = "RECOGNIZE";

    // Recognize PLL case
    const pllCase = this.recognizePLL();
    this.state.substage = pllCase;

    // Apply PLL algorithm
    this.applyPLL(pllCase);

    this.state.progress = 100;
  }

  private findWhiteEdges(): EdgePiece[] {
    const edges: EdgePiece[] = [];
    const cubeState = this.cube.getState();

    // Check each face for white edge pieces
    const faces = ["u", "d", "l", "r", "f", "b"] as const;
    for (const face of faces) {
      const grid = cubeState[face];

      // Check edges of the face
      // Top edge
      if (grid[0][1] === "w") {
        edges.push({
          face,
          position: [0, 1],
          color: "w",
          adjacentColor: this.getAdjacentColor(face, [0, 1]),
        });
      }

      // Right edge
      if (grid[1][2] === "w") {
        edges.push({
          face,
          position: [1, 2],
          color: "w",
          adjacentColor: this.getAdjacentColor(face, [1, 2]),
        });
      }

      // Bottom edge
      if (grid[2][1] === "w") {
        edges.push({
          face,
          position: [2, 1],
          color: "w",
          adjacentColor: this.getAdjacentColor(face, [2, 1]),
        });
      }

      // Left edge
      if (grid[1][0] === "w") {
        edges.push({
          face,
          position: [1, 0],
          color: "w",
          adjacentColor: this.getAdjacentColor(face, [1, 0]),
        });
      }
    }

    return edges;
  }

  private getAdjacentColor(face: string, position: [number, number]): string {
    const cubeState = this.cube.getState();
    // Implementation to get the color of the adjacent piece
    // This is a placeholder - actual implementation would depend on cube orientation
    return "unknown";
  }

  private solveWhiteEdge(edge: EdgePiece): void {
    // Implementation to solve a single white edge
    // This will move the edge to its correct position in the cross
  }

  private solveF2LPair(): void {
    // Implementation to solve a single F2L pair
  }

  private recognizeOLL(): string {
    // Implementation to recognize OLL case
    return "OLL_CASE_1";
  }

  private applyOLL(caseName: string): void {
    // Implementation to apply OLL algorithm
  }

  private recognizePLL(): string {
    // Implementation to recognize PLL case
    return "PLL_CASE_1";
  }

  private applyPLL(caseName: string): void {
    // Implementation to apply PLL algorithm
  }

  private applyMove(move: MoveType): void {
    this.cube.rotate(move.layer, move.axis, move.clockwise);
    this.solutionMoves.push(move);
    this.comparisonCount++;
  }
}
