import Button from "./ui/Button";
import { SolverType } from "../types";

export default function SolverPanel({
  solver,
  isWorking,
  setSolver,
  isSolved,
  onSolve,
}: {
  solver: SolverType;
  isWorking: boolean;
  setSolver: (solver: SolverType) => void;
  isSolved: boolean;
  onSolve: (solver: SolverType) => void;
}) {
  return (
    <div className="p-3 flex flex-col h-full">
      <div className="grow overflow-scroll">
        <div className="text-right mb-4">
          {solver === null && "Select a solver"}
          {solver != null && "."}
        </div>
        <Button
          disabled={isWorking}
          selected={solver === "IDDFS"}
          onClick={() => setSolver("IDDFS")}
          className="w-full mb-3"
        >
          IDDFS
        </Button>
        {/* <Button
          disabled={isWorking}
          selected={solver === "CFOP"}
          onClick={() => setSolver("CFOP")}
          className="w-full mb-3"
        >
          CFOP
        </Button> */}
        <Button
          disabled={isWorking}
          selected={solver === "IDA*"}
          onClick={() => setSolver("IDA*")}
          className="w-full mb-3"
        >
          IDA*
        </Button>
        {/* <Button
          disabled={isWorking}
          selected={solver === "BFS"}
          onClick={() => setSolver("BFS")}
          className="w-full mb-3"
        >
          BFS
        </Button> */}
      </div>
      <div>
        <Button
          onClick={() => onSolve(solver)}
          disabled={isWorking || isSolved || solver === null}
          color="green"
          className="w-full"
        >
          Solve
        </Button>
      </div>
    </div>
  );
}
