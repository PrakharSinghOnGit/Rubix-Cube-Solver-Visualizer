export type CubeType = {
  size: number;
  u: string[][];
  d: string[][];
  l: string[][];
  r: string[][];
  f: string[][];
  b: string[][];
};

export type SolverType = "IDDFS" | "BFS" | "IDA*" |"CFOP";
export type MoveType = {
  layer: number | number[];
  axis: "X" | "Y" | "Z";
  clockwise: boolean;
};
export type FaceType = string[][];
export type FaceNames = "u" | "d" | "l" | "r" | "f" | "b";

export const FACE_COLORS: Record<string, string> = {
  w: "#ffffff", // White
  r: "#ff0000", // Red
  o: "#ff6a00", // Orange
  b: "#0000ff", // Blue
  g: "#00ff00", // Green
  y: "#fcba03", // Yellow
};

export const Zoom = [350, 180, 120, 90, 70, 55, 50, 43, 40, 35];

export type FaceColorType = keyof typeof FACE_COLORS;

export const FACE_POSITIONS = {
  f: { normal: [0, 0, 1], xAxis: [1, 0, 0], yAxis: [0, 1, 0] }, // Front
  b: { normal: [0, 0, -1], xAxis: [-1, 0, 0], yAxis: [0, 1, 0] }, // Back
  u: { normal: [0, 1, 0], xAxis: [1, 0, 0], yAxis: [0, 0, -1] }, // Up
  d: { normal: [0, -1, 0], xAxis: [1, 0, 0], yAxis: [0, 0, 1] }, // Down
  l: { normal: [-1, 0, 0], xAxis: [0, 0, 1], yAxis: [0, 1, 0] }, // Left - changed xAxis
  r: { normal: [1, 0, 0], xAxis: [0, 0, -1], yAxis: [0, 1, 0] }, // Right - changed xAxis
};

export const FACE_ROTATIONS = {
  f: [0, 0, 0],
  u: [-Math.PI / 2, 0, 0],
  d: [Math.PI / 2, 0, 0],
  b: [0, Math.PI, 0],
  l: [0, -Math.PI / 2, 0],
  r: [0, Math.PI / 2, 0],
};

export type CFOPStage = "CROSS" | "F2L" | "OLL" | "PLL";

export type CFOPState = {
    stage: CFOPStage;
    substage: string;
    progress: number;
    moves: MoveType[];
};
