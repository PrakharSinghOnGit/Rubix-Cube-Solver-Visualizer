import { useState, forwardRef, useImperativeHandle } from "react";
import { MoveType } from "../types/types";
import MoveTable from "./ui/MoveTable";
import { CollapseAll, Cross, ExpandAll } from "./ui/icons";

interface LogsPanelProps {
  onApplyMove?: (move: MoveType[]) => void;
}

interface HistoryEntry {
  id: string;
  title: string;
  moves: MoveType[];
  timestamp: Date;
}

export interface LogsPanelRef {
  addMoveSet: (moves: string[], title: string) => void;
}

const LogsPanel = forwardRef<LogsPanelRef, LogsPanelProps>(
  ({ onApplyMove }, ref) => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [collapsedEntries, setCollapsedEntries] = useState<Set<string>>(
      new Set()
    );

    const addMoveSet = (moves: string[], title: string) => {
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

    useImperativeHandle(ref, () => ({
      addMoveSet,
    }));

    const toggleCollapseAll = () => {
      if (collapsedEntries.size === history.length) {
        setCollapsedEntries(new Set());
      } else {
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
          <div
            title={
              collapsedEntries.size === history.length
                ? "Expand All"
                : "Collapse All"
            }
            onClick={toggleCollapseAll}
          >
            {collapsedEntries.size === history.length ? (
              <ExpandAll hex="#fff" />
            ) : (
              <CollapseAll hex="#fff" />
            )}
          </div>
          <div title="Clear All" onClick={clearHistory}>
            <Cross hex="#fff" />
          </div>
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
