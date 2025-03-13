import React, { useState } from "react";
import Slider from "@mui/material/Slider";
import { Typography, ButtonGroup, Switch } from "@mui/material";
import Button from "@mui/material/Button";
import ShuffleOnIcon from "@mui/icons-material/ShuffleOn";
import styles from "../App.module.css";
import Stack from "@mui/material/Stack";
import Rotate90DegreesCwIcon from "@mui/icons-material/Rotate90DegreesCw";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

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
    <div style={{ padding: "15px", marginTop: "15px" }}>
      <div style={{ marginTop: 20 }}>
        <Typography id="input-slider" gutterBottom>
          Cube Size - {size}x{size}
        </Typography>
        <Slider
          defaultValue={3}
          aria-label="cube size"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={2}
          max={10}
          onChange={(_, value) => setCubeSize(value as number)}
          disabled={isAnimating}
        />
      </div>

      <div style={{ marginTop: 20 }}>
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

      <div style={{ marginTop: 20 }}>
        <Stack direction="row">
          <input
            placeholder="Layer"
            className={styles.inp}
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
            <Button onClick={() => setAxis("X")}>X</Button>
            <Button onClick={() => setAxis("Y")}>Y</Button>
            <Button onClick={() => setAxis("Z")}>Z</Button>
          </ButtonGroup>
          <Switch
            onChange={(e) => {
              setClockwise(e.target.checked);
            }}
          />
        </Stack>
        <Button
          style={{ marginTop: 20 }}
          className={styles.btn}
          variant="contained"
          startIcon={<Rotate90DegreesCwIcon />}
          onClick={() => onRotate(layerIndex, axis, clockwise)}
          disabled={isAnimating}
        >
          Move
        </Button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Stack direction="row">
          <input
            placeholder="Count"
            className={styles.inp}
            value={scrambleCount}
            onChange={(e) =>
              setScrambleCount(Math.max(1, parseInt(e.target.value) || 1))
            }
            disabled={isAnimating}
          />
          <Button
            className={styles.btn}
            variant="contained"
            endIcon={<ShuffleOnIcon />}
            onClick={() => onScramble(scrambleCount)}
            disabled={isAnimating}
          >
            {isAnimating ? "Scrambling..." : "Scramble"}
          </Button>
        </Stack>
        <Button
          style={{ marginTop: 20 }}
          className={styles.btn}
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
