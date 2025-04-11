import { IDDFS } from "./IDDFS.ts";
import { Cube } from "./cube.ts";

const cube = new Cube(2);
const moves = cube.generateScrambleMoves(2);

// Scramble the cube
moves.forEach((move) => {
  cube.rotate(move.layer, move.axis, move.clockwise);
});

const iddfs = new IDDFS(cube.getState());

console.log("Scrambled State:");
console.log(iddfs.getState());

iddfs.solve();

console.log("Solved State:");
console.log(iddfs.getState());
console.log("Solution Moves:");
iddfs.solutionMoves.forEach((move, index) => {
  const dir = move.clockwise ? "CW" : "CCW";
  console.log(`${index + 1}. Axis: ${move.axis}, Layer: ${move.layer}, Direction: ${dir}`);
});
