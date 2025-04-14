import { IDAStar } from "./IDAStar.ts";
import { Cube } from "./cube.ts";

const cube = new Cube(2);
const moves = cube.generateScrambleMoves(10);

// Scramble the cube
moves.forEach((move) => {
  cube.rotate(move.layer, move.axis, move.clockwise);
});

// const iddfs = new IDDFS(cube.getState());
const idaStar = new IDAStar(cube.getState());

console.log("Scrambled State:");
console.log(idaStar.getState());

idaStar.solve();

console.log("Solved State:");
console.log(idaStar.getState());
console.log("Solution Moves:");
idaStar.solutionMoves.forEach((move, index) => {
  const dir = move.clockwise ? "CW" : "CCW";
  console.log(
    `${index + 1}. Axis: ${move.axis}, Layer: ${move.layer}, Direction: ${dir}`
  );
});
