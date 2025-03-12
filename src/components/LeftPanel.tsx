import React from "react";

export default function LeftPanel({
  setCubeSize,
}: {
  setCubeSize: (size: number) => void;
}) {
  return (
    <div>
      <input
        type="number"
        name="cubesize"
        id="cubesize"
        onChange={(e) => setCubeSize(parseInt(e.target.value))}
        placeholder="Enter cube size"
        defaultValue={3}
      />
    </div>
  );
}
