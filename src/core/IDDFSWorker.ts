import { IDDFS } from "./IDDFS.ts";

self.onmessage = (e: MessageEvent) => {
    const { cubeState } = e.data;
    const solver = new IDDFS(cubeState);
    solver.solve();
    
    self.postMessage({
        moves: solver.moves,
        comparisonCount: solver.comparisonCount,
        moveCount: solver.moveCount,
        timeTaken: solver.timeTaken
    });
};