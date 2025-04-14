import { MoveType } from "../../types";
import { Collapse, DoubleRightArrow, Expand, Redo } from "./icons";

interface MoveTableProps {
  id: string;
  isCollapsed: boolean;
  title: string;
  timestamp: Date;
  moves: MoveType[];
  onApply?: (move: MoveType[]) => void;
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
    if (!(e.target instanceof SVGElement))
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
          <span>{isCollapsed ? <Expand /> : <Collapse />}</span>
          <span className="text-medium select-none">{title}</span>
        </div>
        <div className={`flex gap-2 items-center`}>
          <span className="text-sm text-gray-500 select-none">
            {timestamp.toLocaleTimeString()}
          </span>
          {onApply && (
            <div
              title="Apply All Moves"
              onClick={async (e) => {
                e.stopPropagation();
                for (const move of moves) {
                  onApply([move]);
                  const anim = Number(localStorage.getItem("anim") || "100");
                  if (anim !== 0) {
                    await new Promise((resolve) => setTimeout(resolve, anim));
                  }
                }
              }}
            >
              <DoubleRightArrow hex="#fff" />
            </div>
          )}
          {onApply && (
            <div
              title="Revert All Moves"
              onClick={async (e) => {
                e.stopPropagation();
                for (let i = moves.length - 1; i >= 0; i--) {
                  onApply([{ ...moves[i], clockwise: !moves[i].clockwise }]);
                  const anim = Number(localStorage.getItem("anim") || "100");
                  if (anim !== 0) {
                    await new Promise((resolve) => setTimeout(resolve, anim));
                  }
                }
              }}
            >
              <Redo hex="#fff" />
            </div>
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
                <td className="p-2 flex">
                  <div
                    title="Apply Move"
                    className="w-full"
                    onClick={() => onApply([move])}
                  >
                    <DoubleRightArrow hex="#fff" />
                  </div>
                  <div
                    title="Revert Move"
                    className="w-full"
                    onClick={() =>
                      onApply([
                        {
                          layer: move.layer,
                          axis: move.axis,
                          clockwise: !move.clockwise,
                        },
                      ])
                    }
                  >
                    <Redo hex="#fff" />
                  </div>
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
