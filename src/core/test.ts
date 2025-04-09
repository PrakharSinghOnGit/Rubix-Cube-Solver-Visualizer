import { Cube } from "./cube.ts";
// import { CFOP } from "./CFOP.ts";

const cube = new Cube(3);
const moves = cube.generateScrambleMoves(20);
moves.forEach((move) => {
  cube.rotate(move.layer, move.axis, move.clockwise);
});
moves.reverse().forEach((move) => {
  cube.rotate(move.layer, move.axis, !move.clockwise);
});
