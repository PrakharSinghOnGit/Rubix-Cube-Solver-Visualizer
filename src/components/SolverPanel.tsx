import Button from "./ui/Button";
import { SolverType } from "../types";

export default function SolverPanel({
  setSolver,
}: {
  setSolver: (solver: SolverType) => void;
}) {
  return (
    <div className="mt-5 p-3">
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
