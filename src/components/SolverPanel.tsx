import Button from "./ui/Button";
import { SolverType } from "../types";

export default function SolverPanel({
  setSolver,isSolved
}: {
  setSolver: (solver: SolverType) => void;
  isSolved:boolean;
}) {
  return (
    <div className="mt-5 p-3">
      {isSolved && <div className="text-green-500 text-center mb-3">Cube is solved!</div>}
      {!isSolved && <div className="text-red-500 text-center mb-3">Cube is not solved!</div>}
      <Button
        onClick={() => {
          setSolver("IDDFS");
        }}
        className="w-full mt-3"
      >
        IDDFS
      </Button>
      <Button
        onClick={() => {
          setSolver("CFOP");
        }}
        className="w-full mt-3"
      >
        CFOP
      </Button>
    </div>
  );
}
