import React from "react";

interface LeftPanelProps {
  cubeSize: number;
  onSizeChange: (size: number) => void;
  onReset: () => void;
  onScramble: () => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  cubeSize,
  onSizeChange,
  onReset,
  onScramble,
}) => {
  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = parseInt(e.target.value, 10);
    onSizeChange(size);
  };

  return (
    <div className="left-panel">
      <div className="panel-header">Cube Controls</div>

      <div className="control-group">
        <div className="control-group-title">Cube Size</div>
        <div className="control-row">
          <select
            value={cubeSize}
            onChange={handleSizeChange}
            className="size-selector"
          >
            <option value="2">2×2</option>
            <option value="3">3×3</option>
            <option value="4">4×4</option>
            <option value="5">5×5</option>
            <option value="6">6×6</option>
            <option value="7">7×7</option>
          </select>
        </div>
      </div>

      <div className="control-group">
        <div className="control-group-title">Actions</div>
        <div className="control-row">
          <button onClick={onScramble}>Scramble</button>
          <button onClick={onReset}>Reset</button>
        </div>
      </div>

      <div className="control-group">
        <div className="control-group-title">Help</div>
        <div className="help-text">
          <p>Mouse controls:</p>
          <ul>
            <li>Left click + drag: Rotate cube</li>
            <li>Right click + drag: Pan view</li>
            <li>Scroll: Zoom in/out</li>
          </ul>
          <p>Click on a face and drag to rotate that face.</p>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
