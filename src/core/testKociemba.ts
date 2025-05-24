import { Kociemba } from "./Kociemba.ts";

async function test() {
  const solver = new Kociemba();

  // Set your test cube state string here
  const testState = "DLRRFULLDUBFDURDBFBRBLFU";

  solver.setState(testState);
  await solver.solve();

  console.log("Moves:", solver.moves);
  console.log("Move count:", solver.moveCount);
  console.log("Time taken (ms):", solver.timeTaken);
}

test();
