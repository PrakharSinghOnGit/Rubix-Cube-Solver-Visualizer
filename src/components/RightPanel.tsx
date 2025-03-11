import React from "react";
import { Move } from "../types";
import { moveToNotation } from "../utils/cubeLogic";

interface RightPanelProps {
  moveHistory: Move[];
}

const RightPanel: React.FC<RightPanelProps> = ({ moveHistory }) => {
  return (
    <div className="right-panel">
      <div className="panel-header">Move History</div>

      <div className="move-history">
        {moveHistory.length === 0 ? (
          <div className="empty-history">No moves yet</div>
        ) : (
          moveHistory.map((move, index) => (
            <div key={index} className="move-item">
              {index + 1}. {moveToNotation(move, 3)}
            </div>
          ))
        )}
      </div>

      <div className="panel-header" style={{ marginTop: "20px" }}>
        Statistics
      </div>
      <div className="statistics">
        <div className="stat-item">
          <div className="stat-label">Total Moves:</div>
          <div className="stat-value">{moveHistory.length}</div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
