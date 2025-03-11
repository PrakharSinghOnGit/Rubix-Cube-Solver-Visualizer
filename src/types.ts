// Colors for the cube faces
export enum CubeColor {
  WHITE = 0,
  YELLOW = 1,
  RED = 2,
  ORANGE = 3,
  BLUE = 4,
  GREEN = 5,
}

// Mapping colors to actual hex values
export const colorMap: Record<CubeColor, string> = {
  [CubeColor.WHITE]: "#FFFFFF",
  [CubeColor.YELLOW]: "#FFFF00",
  [CubeColor.RED]: "#FF0000",
  [CubeColor.ORANGE]: "#FFA500",
  [CubeColor.BLUE]: "#0000FF",
  [CubeColor.GREEN]: "#00FF00",
};

// Face indices
export enum Face {
  UP = 0, // White
  DOWN = 1, // Yellow
  FRONT = 2, // Red
  BACK = 3, // Orange
  RIGHT = 4, // Blue
  LEFT = 5, // Green
}

// Cube state represented as 6 matrices (one for each face)
export type CubeFace = number[][];
export type CubeState = CubeFace[];

// Move types
export enum MoveType {
  FACE_CLOCKWISE = "FACE_CLOCKWISE",
  FACE_COUNTER_CLOCKWISE = "FACE_COUNTER_CLOCKWISE",
  FACE_DOUBLE = "FACE_DOUBLE",
  SLICE = "SLICE",
  SLICE_INVERSE = "SLICE_INVERSE",
  SLICE_DOUBLE = "SLICE_DOUBLE",
  ROTATE_X = "ROTATE_X",
  ROTATE_Y = "ROTATE_Y",
  ROTATE_Z = "ROTATE_Z",
}

// Move representation
export interface Move {
  type: MoveType;
  face?: Face;
  sliceIndex?: number;
  rotationDirection?: 1 | -1 | 2; // 1 for clockwise, -1 for counter-clockwise, 2 for double
}

// Standard notation for moves
export enum MoveNotation {
  // Face moves
  F = "F", // Front clockwise
  Fp = "F'", // Front counter-clockwise
  F2 = "F2", // Front double
  B = "B", // Back clockwise
  Bp = "B'", // Back counter-clockwise
  B2 = "B2", // Back double
  U = "U", // Up clockwise
  Up = "U'", // Up counter-clockwise
  U2 = "U2", // Up double
  D = "D", // Down clockwise
  Dp = "D'", // Down counter-clockwise
  D2 = "D2", // Down double
  R = "R", // Right clockwise
  Rp = "R'", // Right counter-clockwise
  R2 = "R2", // Right double
  L = "L", // Left clockwise
  Lp = "L'", // Left counter-clockwise
  L2 = "L2", // Left double

  // Slice moves (for cubes larger than 3x3)
  M = "M", // Middle slice (between L and R)
  Mp = "M'", // Middle slice counter-clockwise
  M2 = "M2", // Middle slice double
  E = "E", // Equatorial slice (between U and D)
  Ep = "E'", // Equatorial slice counter-clockwise
  E2 = "E2", // Equatorial slice double
  S = "S", // Standing slice (between F and B)
  Sp = "S'", // Standing slice counter-clockwise
  S2 = "S2", // Standing slice double

  // Whole cube rotations
  X = "x", // Rotate entire cube on R
  Xp = "x'", // Rotate entire cube on R counter-clockwise
  X2 = "x2", // Rotate entire cube on R double
  Y = "y", // Rotate entire cube on U
  Yp = "y'", // Rotate entire cube on U counter-clockwise
  Y2 = "y2", // Rotate entire cube on U double
  Z = "z", // Rotate entire cube on F
  Zp = "z'", // Rotate entire cube on F counter-clockwise
  Z2 = "z2", // Rotate entire cube on F double
}
