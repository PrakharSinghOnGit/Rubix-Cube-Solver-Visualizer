import { Cube } from "./cubeAPI";

const cube = await Cube.create(3);
await cube.scramble(3);
const sol = await cube.solve("Kociemba");
console.log(sol);
// await cube.destroy();
await cube.init(2);
await cube.scramble(3);
const sol2 = await cube.solve("Kociemba");
console.log(sol2);
