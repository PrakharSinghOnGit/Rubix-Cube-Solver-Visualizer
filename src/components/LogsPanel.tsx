import { useState, forwardRef, useImperativeHandle } from "react";
import { MoveType } from "../types";
import MoveTable from "./ui/MoveTable";
import Button from "./ui/Button";

interface LogsPanelProps {
  onApplyMove?: (move: MoveType) => void;
}

interface HistoryEntry {
  id: string;
  title: string;
  moves: MoveType[];
  timestamp: Date;
}

export interface LogsPanelRef {
  addMoveSet: (moves: MoveType[], title: string) => void;
}

const LogsPanel = forwardRef<LogsPanelRef, LogsPanelProps>(
  ({ onApplyMove }, ref) => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [collapsedEntries, setCollapsedEntries] = useState<Set<string>>(
      new Set()
    );

    const addMoveSet = (moves: MoveType[], title: string) => {
      const newEntry: HistoryEntry = {
        id: Date.now().toString(),
        title,
        moves,
        timestamp: new Date(),
      };
      setHistory((prev) => [newEntry, ...prev]);
    };

    const clearHistory = () => {
      setHistory([]);
    };

    const handleReapply = (moves: MoveType[]) => {
      moves.forEach((move) => onApplyMove?.(move));
    };

    const handleReverse = (moves: MoveType[]) => {
      [...moves].reverse().forEach((move) => {
        onApplyMove?.({
          ...move,
          clockwise: !move.clockwise,
        });
      });
    };

    useImperativeHandle(ref, () => ({
      addMoveSet,
    }));

    const toggleCollapseAll = () => {
      if (collapsedEntries.size === history.length) {
        // If all are collapsed, expand all
        setCollapsedEntries(new Set());
      } else {
        // Collapse all
        const allIds = new Set(history.map((entry) => entry.id));
        setCollapsedEntries(allIds);
      }
    };

    const toggleCollapse = (id: string) => {
      setCollapsedEntries((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    };

    return (
      <div className="h-full overflow-scroll">
        <div className="w-full flex p-2 gap-2 items-center">
          <div className="w-full"></div>
          <Button
            size="small"
            className="float-left"
            mainColor="blue"
            onClick={toggleCollapseAll}
          >
            {collapsedEntries.size === history.length ? "Expand" : "Collapse"}
          </Button>
          <Button
            size="small"
            className="float-left"
            mainColor="red"
            onClick={clearHistory}
          >
            Clear
          </Button>
        </div>

        <div className="p-2">
          {history.map((entry) => (
            <MoveTable
              key={entry.id}
              id={entry.id}
              title={entry.title}
              timestamp={entry.timestamp}
              moves={entry.moves}
              onApply={onApplyMove}
              onReapply={handleReapply}
              onReverse={handleReverse}
              isCollapsed={collapsedEntries.has(entry.id)}
              onToggleCollapse={toggleCollapse}
            />
          ))}
        </div>
      </div>
    );
  }
);

LogsPanel.displayName = "LogsPanel";

export default LogsPanel;
