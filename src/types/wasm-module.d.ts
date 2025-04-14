// src/types/wasm-module.d.ts

// Replace "YourModuleName" with your module's export name
declare module "virtual:wasm-module" {
  // Define your module's interface based on what you exported in C++
  export class RubiksCube {
    constructor(size: number);
    setState(state: Array<Array<Array<string>>>): void;
    getState(): Array<Array<Array<string>>>;
    isSolved(): boolean;
    rotateFace(faceIdx: number, clockwise: boolean): void;
    delete(): void; // Important for memory management
  }

  export function solveRubiksCube(
    initialState: Array<Array<Array<string>>>
  ): string[];
  export function calculateManhattanDistance(
    cubeState: Array<Array<Array<string>>>
  ): number;

  // Add other functions and classes as needed
}

// This allows importing the JavaScript file that loads the WASM
declare module "*wasm/*.js" {
  const createModule: () => Promise;
  export default createModule;
}
