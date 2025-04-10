import { Cube } from "./cube.ts";
// import { CFOP } from "./CFOP.ts";

const cube = new Cube(2);
const moves = cube.generateScrambleMoves(20);
moves.forEach((move) => {
  cube.rotate(move.layer, move.axis, move.clockwise);
});
moves.reverse().forEach((move) => {
  cube.rotate(move.layer, move.axis, !move.clockwise);
});

cube.printCube()
console.log(cube.isSolved());
console.log(cube.isFaceSolved('u'));