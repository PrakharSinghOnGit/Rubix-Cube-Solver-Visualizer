import { useState } from "react";
import NumberInp from "./ui/NumberInp";
import SliderInp from "./ui/SliderInp";
import Button from "./ui/Button";
import ButtonGroup from "./ui/ButtonGroup";
import Switch from "./ui/Switch";
import {
  Rotate90DegreesCw as Rotate90DegreesCwIcon,
  Shuffle as ShuffleOnIcon,
  RestartAlt as RestartAltIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  Input as InputIcon,
} from "./ui/Icons";
import InputCubeModal from "./InputCubeModal";

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
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showInputModal, setShowInputModal] = useState<boolean>(false);

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
    // You'll need to implement the actual pause/resume logic elsewhere
  };

  return (
    <div className="p-6 mt-4">
      <div className="flex flex-row justify-between items-center">
        <NumberInp
          max={10}
          min={2}
          def={size}
          steps={1}
          onChange={(newSize) => setCubeSize(newSize)}
          label="Cube Size"
        />

        <Button
          className="bg-purple-500 hover:bg-purple-600"
          variant="contained"
          startIcon={<InputIcon />}
          onClick={() => setShowInputModal(true)}
          disabled={isAnimating}
        >
          Input Cube
        </Button>
      </div>

      <div className="mt-5">
        <p>
          Animation Delay -{" "}
          {animationSpeed == 0 ? "Instant" : animationSpeed + "ms"}
        </p>
        <SliderInp
          def={animationSpeed}
          onChange={(value: number) => setAnimationSpeed(value as number)}
          min={0}
          max={500}
          steps={50}
          label="Speed"
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
          <ButtonGroup aria-label="axis Selector">
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
              checked={clockwise}
              onChange={(e) => {
                setClockwise(e.target.checked);
              }}
              disabled={isAnimating}
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
        <div className="flex mt-4 space-x-2">
          <Button
            className="bg-red-500 hover:bg-red-600"
            variant="contained"
            endIcon={<RestartAltIcon />}
            onClick={() => onReset()}
            disabled={isAnimating}
          >
            Reset
          </Button>

          {isAnimating && (
            <Button
              className={
                isPaused
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }
              variant="contained"
              startIcon={isPaused ? <PlayArrowIcon /> : <PauseIcon />}
              onClick={handlePauseToggle}
            >
              {isPaused ? "Resume" : "Pause"}
            </Button>
          )}
        </div>
      </div>

      {showInputModal && (
        <InputCubeModal onClose={() => setShowInputModal(false)} />
      )}
    </div>
  );
}
