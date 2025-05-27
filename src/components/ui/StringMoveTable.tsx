import React from "react";
import { Collapse, DoubleRightArrow, Expand, Redo } from "./icons";

interface StringMoveTableProps {
  id: string;
  isCollapsed: boolean;
  title: string;
  timestamp: Date;
  moves: string[];
  onApply?: (moves: string[]) => void;
  onToggleCollapse?: (id: string) => void;
}

const StringMoveTable = ({
  id,
  isCollapsed,
  title,
  timestamp,
  moves,
  onApply,
  onToggleCollapse,
}: StringMoveTableProps) => {
  const reverseMove = (move: string): string => {
    if (move.endsWith("'")) {
      return move.slice(0, -1);
    } else if (move.endsWith("2")) {
      return move;
    } else {
      return move + "'";
    }
  };

  const parseMove = (move: string) => {
    const face = move.charAt(0);
    const modifier = move.slice(1);
    let direction = "CW";
    let turns = 1;

    if (modifier.includes("'")) {
      direction = "CCW";
    } else if (modifier.includes("2")) {
      turns = 2;
    }

    return { face, direction, turns, notation: move };
  };

  const handleToggleCollapse = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!(e.target instanceof SVGElement)) {
      if (onToggleCollapse) {
        onToggleCollapse(id);
      }
    }
  };

  const applyAllMoves = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onApply) {
      onApply(moves);
    }
  };

  const revertAllMoves = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onApply) {
      const reversedMoves = moves.map(reverseMove).reverse();
      onApply(reversedMoves);
    }
  };

  const applySingleMove = (move: string) => {
    if (onApply) {
      onApply([move]);
    }
  };

  const revertSingleMove = (move: string) => {
    if (onApply) {
      onApply([reverseMove(move)]);
    }
  };

  return (
    <div className={`mb-2 border border-gray-500 rounded-[15px] w-full`}>
      <div
        onClick={handleToggleCollapse}
        className="flex items-center justify-between p-2 hover:border-blue-400 hover:bg-gray-800 rounded-[15px]"
      >
        <div className="flex gap-2 items-center">
          <span>{isCollapsed ? <Expand /> : <Collapse />}</span>
          <span className="text-medium select-none">{title}</span>
          <span className="text-sm text-gray-400 select-none">
            ({moves.length} moves)
          </span>
        </div>
        <div className={`flex gap-2 items-center`}>
          <span className="text-sm text-gray-500 select-none">
            {timestamp.toLocaleTimeString()}
          </span>
          {onApply && (
            <div title="Apply All Moves" onClick={applyAllMoves}>
              <DoubleRightArrow hex="#fff" />
            </div>
          )}
          {onApply && (
            <div title="Revert All Moves" onClick={revertAllMoves}>
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
            <th className="p-2">Move</th>
            <th className="p-2">Face</th>
            <th className="p-2">Direction</th>
            <th className="p-2">Turns</th>
            {onApply && <th className="p-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {moves.map((move, index) => {
            const parsedMove = parseMove(move);
            return (
              <tr
                key={index}
                className="hover:bg-gray-700 border-b-1 border-gray-700"
              >
                <td className="p-2 text-center">{index + 1}</td>
                <td className="p-2 text-center font-mono font-bold">
                  {parsedMove.notation}
                </td>
                <td className="p-2 text-center">{parsedMove.face}</td>
                <td className="p-2 text-center">{parsedMove.direction}</td>
                <td className="p-2 text-center">{parsedMove.turns}</td>
                {onApply && (
                  <td className="p-2 flex gap-2 justify-center">
                    <div
                      title="Apply Move"
                      className="cursor-pointer hover:bg-gray-600 p-1 rounded"
                      onClick={() => applySingleMove(move)}
                    >
                      <DoubleRightArrow hex="#fff" />
                    </div>
                    <div
                      title="Revert Move"
                      className="cursor-pointer hover:bg-gray-600 p-1 rounded"
                      onClick={() => revertSingleMove(move)}
                    >
                      <Redo hex="#fff" />
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StringMoveTable;