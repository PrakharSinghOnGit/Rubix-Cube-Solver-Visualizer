import { Cube } from "./cubeAPI";

const cube = await Cube.create(
  3,
  "RLDLBDRFFLBFRBFBRBURUUFDURRLBDLDFFRDFBBLFBDBBLUUUDFLBR"
);
const sol = await cube.solve("Kociemba");
console.log(sol);
