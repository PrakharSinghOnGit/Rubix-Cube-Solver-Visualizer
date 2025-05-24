import { IDDFS } from "./IDDFS.ts";
import { IDAStar } from "./IDAStar.ts";
import { BFS } from "./BFS.ts";
import { Kociemba } from "./Kociemba.ts";

self.onmessage = (e: MessageEvent) => {
    const { cubeState, solver: solverType } = e.data;
    
    let solver;
    if (solverType === "IDDFS") {
        solver = new IDDFS(cubeState);
    }
    else if (solverType === "IDA*") {
        solver = new IDAStar(cubeState);
    }
    else if (solverType === "Kociemba") {
        solver = new Kociemba();
    }
    else if (solverType === "BFS") {
        solver = new BFS(cubeState);
    }
    else {
        self.postMessage({
            error: "Unsupported solver type"
        });
        return;
    }
    
    solver.solve();
    
    self.postMessage({
        moves: solver.moves,
        comparisonCount: solver.comparisonCount,
        moveCount: solver.moveCount,
        timeTaken: solver.timeTaken
    });
};