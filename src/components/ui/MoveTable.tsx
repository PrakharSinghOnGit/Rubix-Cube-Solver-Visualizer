import { MoveType } from "../../types";
import Button from "./Button";

interface MoveTableProps {
  id: string;
  isCollapsed: boolean;
  title: string;
  timestamp: Date;
  moves: MoveType[];
  onApply?: (move: MoveType) => void;
  onReapply?: (moves: MoveType[]) => void;
  onReverse?: (moves: MoveType[]) => void;
  onToggleCollapse?: (id: string) => void;
}

const MoveTable = ({
  id,
  isCollapsed,
  title,
  timestamp,
  moves,
  onApply,
  onReapply,
  onReverse,
  onToggleCollapse,
}: MoveTableProps) => {
  const formatMove = (move: MoveType) => {
    const layer =
      typeof move.layer === "number" && move.layer > 0 ? move.layer : "";
    const direction = move.clockwise ? "" : "'";
    return `${move.axis.toUpperCase()}${layer}${direction}`;
  };

  const handleToogleCollapse = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!(e.target instanceof HTMLButtonElement))
      if (onToggleCollapse) {
        onToggleCollapse(id);
      }
  };

  return (
    <div className={`mb-2 border border-gray-500 rounded-[15px] w-full`}>
      <div
        onClick={(e) => handleToogleCollapse(e)}
        className="flex items-center justify-between p-2 hover:border-blue-400 hover:bg-gray-800 rounded-[15px]"
      >
        <div className="flex gap-2 items-center">
          <span>{isCollapsed ? "▼" : "▶︎"}</span>
          <span className="text-xl font-bold">{title}</span>
        </div>
        <div className={`flex gap-2 items-center`}>
          <span className="text-sm text-gray-500">
            {timestamp.toLocaleTimeString()}
          </span>
          {onReapply && (
            <Button
              size="small"
              mainColor="blue"
              onClick={() => {
                onReapply(moves);
              }}
            >
              Apply All
            </Button>
          )}
          {onReverse && (
            <Button
              size="small"
              mainColor="red"
              onClick={() => onReverse(moves)}
            >
              Reverse All
            </Button>
          )}
        </div>
      </div>
      <table
        className={`border-t-2 mt-1 w-full border-collapse ${
          isCollapsed ? "hidden" : ""
        }`}
      >
        <thead className="border-b-1 border-gray-700">
          <tr>
            <th className="p-2">#</th>
            <th className="p-2">Notation</th>
            <th className="p-2">Axis</th>
            <th className="p-2">Layer</th>
            <th className="p-2">Direction</th>
            {onApply && <th className="p-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {moves.map((move, index) => (
            <tr
              key={index}
              className="hover:bg-gray-700 border-b-1 border-gray-700"
            >
              <td className="p-2 text-center">{index + 1}</td>
              <td className="p-2 text-center font-mono">{formatMove(move)}</td>
              <td className="p-2 text-center">{move.axis}</td>
              <td className="p-2 text-center">{move.layer}</td>
              <td className="p-2 text-center">
                {move.clockwise ? "CW" : "CCW"}
              </td>
              {onApply && (
                <td className="p-2">
                  <Button
                    className="w-full"
                    mainColor="green"
                    size="small"
                    onClick={() => onApply(move)}
                  >
                    Apply
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MoveTable;
