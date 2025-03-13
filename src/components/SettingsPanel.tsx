import React, { useState } from "react";
import Slider from "@mui/material/Slider";
import { Typography, ButtonGroup, Switch } from "@mui/material";
import Button from "@mui/material/Button";
import ShuffleOnIcon from "@mui/icons-material/ShuffleOn";
import Rotate90DegreesCwIcon from "@mui/icons-material/Rotate90DegreesCw";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import NumberInp from "./ui/NumberInp";

export default function SettingsPanel({
  size,
  setCubeSize,
  onScramble,
  onRotate,
  onReset,
  isAnimating,
  animationSpeed,
  setAnimationSpeed,
}: {
  size: number;
  setCubeSize: (size: number) => void;
  onScramble: (count: number) => void;
  onReset: () => void;
  onRotate: (
    layerIndex: number,
    axis: "X" | "Y" | "Z",
    clockwise: boolean
  ) => void;
  isAnimating: boolean;
  animationSpeed: number;
  setAnimationSpeed: (speed: number) => void;
}) {
  const [scrambleCount, setScrambleCount] = useState(20);
  const [layerIndex, setLayerIndex] = useState(0);
  const [axis, setAxis] = useState<"X" | "Y" | "Z">("X");
  const [clockwise, setClockwise] = useState<boolean>(false);

  return (
    <div className="p-4 mt-4">
      <NumberInp
        max={10}
        min={2}
        def={size}
        steps={1}
        label="Cube Size"
        onChange={(newSize) => setCubeSize(newSize)}
      />

      <div className="mt-5">
        <Typography gutterBottom>Speed - {animationSpeed}ms</Typography>
        <Slider
          value={animationSpeed}
          onChange={(_, value) => setAnimationSpeed(value as number)}
          min={50}
          max={500}
          step={50}
          marks
        />
      </div>

      <div className="mt-5">
        <div className="flex flex-row items-center space-x-2">
          <input
            placeholder="Layer"
            className="border border-gray-300 rounded px-2 py-1 w-16 text-gray-700 focus:outline-none focus:border-blue-500"
            value={layerIndex}
            onChange={(e) =>
              setLayerIndex(
                parseInt(e.target.value) < size && parseInt(e.target.value) > -1
                  ? parseInt(e.target.value)
                  : 0
              )
            }
            disabled={isAnimating}
          />
          <ButtonGroup variant="contained" aria-label="axis Selector">
            <Button
              onClick={() => setAxis("X")}
              className={axis === "X" ? "bg-blue-600" : ""}
            >
              X
            </Button>
            <Button
              onClick={() => setAxis("Y")}
              className={axis === "Y" ? "bg-blue-600" : ""}
            >
              Y
            </Button>
            <Button
              onClick={() => setAxis("Z")}
              className={axis === "Z" ? "bg-blue-600" : ""}
            >
              Z
            </Button>
          </ButtonGroup>
          <div className="flex items-center">
            <span className="mr-2 text-sm">CCW</span>
            <Switch
              onChange={(e) => {
                setClockwise(e.target.checked);
              }}
            />
            <span className="ml-2 text-sm">CW</span>
          </div>
        </div>
        <Button
          className="mt-4 bg-blue-500 hover:bg-blue-600"
          variant="contained"
          startIcon={<Rotate90DegreesCwIcon />}
          onClick={() => onRotate(layerIndex, axis, clockwise)}
          disabled={isAnimating}
        >
          Move
        </Button>
      </div>

      <div className="mt-5">
        <div className="flex flex-row items-center space-x-2">
          <input
            placeholder="Count"
            className="border border-gray-300 rounded px-2 py-1 w-16 text-gray-700 focus:outline-none focus:border-blue-500"
            value={scrambleCount}
            onChange={(e) =>
              setScrambleCount(Math.max(1, parseInt(e.target.value) || 1))
            }
            disabled={isAnimating}
          />
          <Button
            className="bg-green-500 hover:bg-green-600"
            variant="contained"
            endIcon={<ShuffleOnIcon />}
            onClick={() => onScramble(scrambleCount)}
            disabled={isAnimating}
          >
            {isAnimating ? "Scrambling..." : "Scramble"}
          </Button>
        </div>
        <Button
          className="mt-4 bg-red-500 hover:bg-red-600"
          variant="contained"
          endIcon={<RestartAltIcon />}
          onClick={() => onReset()}
          disabled={isAnimating}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
