import React from "react";
import Slider from "@mui/material/Slider";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import ShuffleOnIcon from "@mui/icons-material/ShuffleOn";
import styles from "../App.module.css";

export default function SettingsPanel({
  size,
  setCubeSize,
}: {
  size: number;
  setCubeSize: (size: number) => void;
}) {
  return (
    <div style={{ padding: "15px", marginTop: "40px" }}>
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
      />
      <Button
        className={styles.btn}
        variant="contained"
        endIcon={<ShuffleOnIcon />}
      >
        Scramble
      </Button>
    </div>
  );
}
