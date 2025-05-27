import chalk from "chalk";
import { CubeType, FACE_COLORS, FaceColorType } from "../types/types";

// Define face constants for better readability
const FRONT = "f",
  BACK = "b",
  LEFT = "l",
  RIGHT = "r",
  UP = "u",
  DOWN = "d";

export class Cube {
  size: number;
  faces: {
    [face: string]: string[][];
  } = {
    u: [],
    d: [],
    l: [],
    r: [],
    f: [],
    b: [],
  };

  constructor(size: number = 3) {
    this.size = size;
    this.initFaces();
  }

  initFaces() {
    const n = this.size;
    for (let i = 0; i < n; i++) {
      this.faces.u.push(new Array(n).fill("w"));
      this.faces.d.push(new Array(n).fill("y"));
      this.faces.l.push(new Array(n).fill("o"));
      this.faces.r.push(new Array(n).fill("r"));
      this.faces.f.push(new Array(n).fill("g"));
      this.faces.b.push(new Array(n).fill("b"));
    }
  }

  isSolved(): boolean {
    return (
      this.isFaceSolved(UP) &&
      this.isFaceSolved(DOWN) &&
      this.isFaceSolved(LEFT) &&
      this.isFaceSolved(RIGHT) &&
      this.isFaceSolved(FRONT) &&
      this.isFaceSolved(BACK)
    );
  }

  isFaceSolved(face: string): boolean {
    const grid = this.faces[face];
    const targetColor = grid[0][0]; // top-left corner as reference

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (grid[i][j] !== targetColor) {
          return false;
        }
      }
    }
    return true;
  }

  reset() {
    this.initFaces();
  }
  /**
   * Rotates a layer of the cube along X, Y, or Z axis
   * @param {number|number[]} layer - The layer to rotate (0 to size-1)
   * @param {"X"|"Y"|"Z"} axis - The axis to rotate around
   * @param {boolean} clockwise - Direction of rotation (true for clockwise)
   */
  rotate(layer: number | number[], axis: "X" | "Y" | "Z", clockwise: boolean) {
    // converrt layer to array if it is a number
    if (typeof layer === "number") {
      layer = [layer];
    }

    layer.forEach((l) => {
      if (l < 0 || l >= this.size) {
        throw new Error(`Layer index out of bounds: ${l}`);
      }
    });

    // Deep copy the current state
    const rotatedFaces = JSON.parse(JSON.stringify(this.faces));

    // Rotate the appropriate layer based on axis
    layer.forEach((l) => {
      switch (axis) {
        case "Y":
          this.rotateYLayer(l, clockwise, rotatedFaces);
          break;
        case "X":
          this.rotateXLayer(l, clockwise, rotatedFaces);
          break;
        case "Z":
          this.rotateZLayer(l, clockwise, rotatedFaces);
          break;
        default:
          throw new Error(`Invalid axis: ${axis}`);
      }
    });

    // Update the cube state
    this.faces = rotatedFaces;
  }

  rotateYLayer(
    layer: number,
    clockwise: boolean,
    rotatedFaces: { [x: string]: string[][] }
  ) {
    for (let i = 0; i < this.size; i++) {
      if (clockwise) {
        rotatedFaces[FRONT][i][layer] = this.faces[LEFT][i][layer];
        rotatedFaces[RIGHT][i][layer] = this.faces[FRONT][i][layer];
        rotatedFaces[BACK][i][layer] = this.faces[RIGHT][i][layer];
        rotatedFaces[LEFT][i][layer] = [...this.faces[BACK][i][layer]]
          .reverse()
          .join("");
      } else {
        rotatedFaces[FRONT][i][layer] = this.faces[RIGHT][i][layer];
        rotatedFaces[LEFT][i][layer] = this.faces[FRONT][i][layer];
        rotatedFaces[BACK][i][layer] = this.faces[LEFT][i][layer];
        rotatedFaces[RIGHT][i][layer] = this.faces[BACK][i][layer];
      }
    }
    if (layer === 0) {
      rotatedFaces[DOWN] = this.rotateFace(rotatedFaces[DOWN], clockwise);
    }
    if (layer === this.size - 1) {
      rotatedFaces[UP] = this.rotateFace(rotatedFaces[UP], !clockwise);
    }
  }

  rotateXLayer(
    layer: number,
    clockwise: boolean,
    rotatedFaces: { [x: string]: string[][] }
  ) {
    const lastIndex = this.size - 1;

    if (clockwise) {
      rotatedFaces[FRONT][layer] = this.faces[DOWN][layer];
      rotatedFaces[UP][layer] = this.faces[FRONT][layer];
      rotatedFaces[BACK][lastIndex - layer] = [
        ...this.faces[UP][layer],
      ].reverse();
      rotatedFaces[DOWN][layer] = [
        ...this.faces[BACK][lastIndex - layer],
      ].reverse();
    } else {
      rotatedFaces[FRONT][layer] = this.faces[UP][layer];
      rotatedFaces[DOWN][layer] = this.faces[FRONT][layer];
      rotatedFaces[BACK][lastIndex - layer] = [
        ...this.faces[DOWN][layer],
      ].reverse();
      rotatedFaces[UP][layer] = [
        ...this.faces[BACK][lastIndex - layer],
      ].reverse();
    }

    if (layer === 0) {
      rotatedFaces[LEFT] = this.rotateFace(rotatedFaces[LEFT], !clockwise);
    }
    if (layer === this.size - 1) {
      rotatedFaces[RIGHT] = this.rotateFace(rotatedFaces[RIGHT], clockwise);
    }
  }

  rotateZLayer(
    layer: number,
    clockwise: boolean,
    rotatedFaces: { [x: string]: string[][] }
  ) {
    const lastIndex = this.size - 1;

    for (let i = 0; i < this.size; i++) {
      if (clockwise) {
        rotatedFaces[UP][i][layer] = this.faces[LEFT][lastIndex - layer][i];
        rotatedFaces[RIGHT][layer][i] = this.faces[UP][lastIndex - i][layer];
        rotatedFaces[DOWN][i][lastIndex - layer] = this.faces[RIGHT][layer][i];
        rotatedFaces[LEFT][lastIndex - layer][i] =
          this.faces[DOWN][lastIndex - i][lastIndex - layer];
      } else {
        rotatedFaces[UP][i][layer] = this.faces[RIGHT][layer][lastIndex - i];
        rotatedFaces[RIGHT][layer][i] = this.faces[DOWN][i][lastIndex - layer];
        rotatedFaces[DOWN][i][lastIndex - layer] =
          this.faces[LEFT][lastIndex - layer][lastIndex - i];
        rotatedFaces[LEFT][lastIndex - layer][i] = this.faces[UP][i][layer];
      }
    }
    if (layer === 0) {
      rotatedFaces[FRONT] = this.rotateFace(rotatedFaces[FRONT], clockwise);
    }
    if (layer === this.size - 1) {
      rotatedFaces[BACK] = this.rotateFace(rotatedFaces[BACK], !clockwise);
    }
  }

  rotateFace(face: string[][], clockwise: boolean): string[][] {
    const n = this.size;
    const newFace = Array.from({ length: n }, () => Array(n).fill(""));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (clockwise) {
          newFace[j][n - 1 - i] = face[i][j];
        } else {
          newFace[i][j] = face[j][n - 1 - i];
        }
      }
    }

    return newFace;
  }

  scramble(count: number = 20) {
    const moves = this.generateScrambleMoves(count);
    moves.forEach((move) => {
      this.rotate(move.layer, move.axis, move.clockwise);
    });
  }

  generateScrambleMoves(count: number = 20) {
    const axes: ("X" | "Y" | "Z")[] = ["X", "Y", "Z"];
    const moves = [];
    const WIDE_MOVE_CHANCE = 0; // TODO: fix wide implemetation

    for (let i = 0; i < count; i++) {
      const layer =
        Math.random() < WIDE_MOVE_CHANCE
          ? [
              Math.floor(Math.random() * this.size),
              Math.floor(Math.random() * this.size),
            ]
          : Math.floor(Math.random() * this.size);
      const axis = axes[Math.floor(Math.random() * axes.length)];
      const clockwise = Math.random() > 0.5;
      moves.push({ layer, axis, clockwise });
    }

    return moves;
  }

  getNotation(
    axis: "X" | "Y" | "Z",
    layer: number,
    size: number,
    clockwise: boolean
  ): string {
    let move = "";

    switch (axis) {
      case "Y":
        if (layer === size - 1) move = "U";
        else if (layer === 0) move = "D";
        else move = `${size - layer}Uw`; // Wide move for NxN
        break;
      case "X":
        if (layer === size - 1) move = "R";
        else if (layer === 0) move = "L";
        else move = `${size - layer}Rw`; // Wide move for NxN
        break;
      case "Z":
        if (layer === size - 1) move = "F";
        else if (layer === 0) move = "B";
        else move = `${size - layer}Fw`; // Wide move for NxN
        break;
    }

    if (!clockwise) move += "'"; // Add counterclockwise notation

    return move;
  }

  getState(): CubeType {
    return {
      size: this.size,
      u: this.faces.u,
      d: this.faces.d,
      l: this.faces.l,
      r: this.faces.r,
      f: this.faces.f,
      b: this.faces.b,
    };
  }

  setState(state: CubeType) {
    this.size = state.size;
    this.faces.u = state.u;
    this.faces.b = state.b;
    this.faces.d = state.d;
    this.faces.f = state.f;
    this.faces.l = state.l;
    this.faces.r = state.r;
  }

  printCube() {
    console.log("------------------------------");
    const n = this.size;
    const { u, d, l, r, f, b } = this.faces;
    const rotatedFaces = {
      u: this.rotateFace(u, true),
      d: this.rotateFace(d, true),
      l: this.rotateFace(l, true),
      r: this.rotateFace(r, true),
      f: this.rotateFace(f, true),
      b: this.rotateFace(b, true),
    };
    // Print top face
    this.faces.u.forEach((row) => {
      console.log(
        " ".repeat(n * 4) +
          row
            .map((r) => chalk.hex(FACE_COLORS[r as FaceColorType])("▇▇▇"))
            .join(" ")
      );
    });
    // Print middle faces (l, f, r, b)
    for (let i = 0; i < n; i++) {
      const left = rotatedFaces.l[i]
        .map((r) => chalk.hex(FACE_COLORS[r as FaceColorType])("▇▇▇"))
        .join(" ");
      const front = rotatedFaces.f[i]
        .map((r) => chalk.hex(FACE_COLORS[r as FaceColorType])("▇▇▇"))
        .join(" ");
      const right = rotatedFaces.r[i]
        .map((r) => chalk.hex(FACE_COLORS[r as FaceColorType])("▇▇▇"))
        .join(" ");
      const back = rotatedFaces.b[i]
        .map((r) => chalk.hex(FACE_COLORS[r as FaceColorType])("▇▇▇"))
        .join(" ");
      console.log(`${left} ${front} ${right} ${back}`);
    }

    rotatedFaces.d.forEach((row) => {
      console.log(
        " ".repeat(n * 4) +
          row
            .map((r) => chalk.hex(FACE_COLORS[r as FaceColorType])("▇▇▇"))
            .join(" ")
      );
    });
  }

  /**
   * Converts cube state to Kociemba format string (URFDLB order)
   * @returns {string} Cube state in Kociemba format
   */
  toKociembaString(): string {
    // Create a solved cube to determine the color-to-face mapping
    const solvedCube = new Cube(this.size);

    // Map each color to its corresponding face in Kociemba notation
    const colorToFace: { [color: string]: string } = {
      [solvedCube.faces.u[0][0]]: "U", // white -> Up
      [solvedCube.faces.r[0][0]]: "R", // blue -> Right
      [solvedCube.faces.f[0][0]]: "F", // red -> Front
      [solvedCube.faces.d[0][0]]: "D", // yellow -> Down
      [solvedCube.faces.l[0][0]]: "L", // green -> Left
      [solvedCube.faces.b[0][0]]: "B", // orange -> Back
    };

    // Kociemba order: U, R, F, D, L, B
    const kociembaOrder = ["u", "r", "f", "d", "l", "b"];

    return kociembaOrder
      .map((face) =>
        this.faces[face]
          .flat()
          .map((color) => colorToFace[color] || color)
          .join("")
      )
      .join("");
  }

  /**
   * Sets cube state from Kociemba format string (URFDLB order)
   * @param {string} state - Cube state in Kociemba format
   */
  fromKociembaString(state: string): void {
    // Create a solved cube to determine the face-to-color mapping
    const solvedCube = new Cube(this.size);

    // Face to color mapping (inverse of toKociembaString)
    const faceToColor: { [face: string]: string } = {
      U: solvedCube.faces.u[0][0], // Up -> white
      R: solvedCube.faces.r[0][0], // Right -> blue
      F: solvedCube.faces.f[0][0], // Front -> red
      D: solvedCube.faces.d[0][0], // Down -> yellow
      L: solvedCube.faces.l[0][0], // Left -> green
      B: solvedCube.faces.b[0][0], // Back -> orange
    };

    const kociembaOrder = ["u", "r", "f", "d", "l", "b"];
    let index = 0;

    for (const face of kociembaOrder) {
      this.faces[face] = Array.from({ length: this.size }, () =>
        Array.from({ length: this.size }, () => {
          const faceChar = state[index++];
          return faceToColor[faceChar] || faceChar;
        })
      );
    }
  }

  /**
   * Converts Kociemba move notation to rotate function parameters
   * @param {string} move - Move in Kociemba notation (e.g., "R", "U'", "F2", "Rw", "x", "y'")
   * @returns {Object} Parameters for rotate function
   */
  parseKociembaMove(move: string): {
    layer: number | number[];
    axis: "X" | "Y" | "Z";
    clockwise: boolean;
  } {
    // Remove whitespace
    move = move.trim();

    // Check for rotations (whole cube moves)
    if (move.match(/^[xyz]['2]?$/)) {
      return this.parseRotationMove(move);
    }

    // Check for wide moves (lowercase or 'w' suffix)
    const isWide = move.includes("w") || /^[a-z]/.test(move);

    // Extract the base face and modifiers
    const baseFace = move.charAt(0).toUpperCase();
    const modifiers = move.slice(1);

    // Determine direction
    let clockwise = true;
    if (modifiers.includes("'")) {
      clockwise = false;
    } else if (modifiers.includes("2")) {
      // For double moves, we'll return the first rotation
      // The caller should execute this twice
      clockwise = true;
    }

    // Determine layer(s)
    let layer: number | number[];
    if (isWide) {
      // Wide moves affect outer two layers
      layer = [0, 1];
    } else {
      // Regular moves affect only outer layer
      layer = 0;
    }

    // Check for middle layer moves (M, E, S)
    if (["M", "E", "S"].includes(baseFace)) {
      return this.parseMiddleLayerMove(baseFace, clockwise);
    }

    // Map face to axis and adjust for cube orientation
    const faceToAxisMap: {
      [key: string]: { axis: "X" | "Y" | "Z"; needsInvert: boolean };
    } = {
      U: { axis: "Y", needsInvert: false }, // Up face - Y axis
      D: { axis: "Y", needsInvert: true }, // Down face - Y axis (inverted)
      R: { axis: "Z", needsInvert: false }, // Right face - Z axis
      L: { axis: "Z", needsInvert: true }, // Left face - Z axis (inverted)
      F: { axis: "X", needsInvert: false }, // Front face - X axis
      B: { axis: "X", needsInvert: true }, // Back face - X axis (inverted)
    };

    const mapping = faceToAxisMap[baseFace];
    if (!mapping) {
      throw new Error(`Unknown face: ${baseFace}`);
    }

    // Adjust layer for back/down faces
    if (mapping.needsInvert && typeof layer === "number") {
      layer = this.size - 1 - layer;
    } else if (mapping.needsInvert && Array.isArray(layer)) {
      layer = layer.map((l) => this.size - 1 - l);
    }

    // Invert clockwise for back/down faces to match standard notation
    if (mapping.needsInvert) {
      clockwise = !clockwise;
    }

    return {
      layer,
      axis: mapping.axis,
      clockwise,
    };
  }

  /**
   * Parses rotation moves (x, y, z)
   * @param {string} move - Rotation move (x, y, z with optional ' or 2)
   * @returns {Object} Parameters for rotate function
   */
  private parseRotationMove(move: string): {
    layer: number | number[];
    axis: "X" | "Y" | "Z";
    clockwise: boolean;
  } {
    const baseFace = move.charAt(0).toLowerCase();
    const modifiers = move.slice(1);

    let clockwise = true;
    if (modifiers.includes("'")) {
      clockwise = false;
    }

    // Rotation moves affect all layers
    const allLayers = Array.from({ length: this.size }, (_, i) => i);

    const rotationMap: { [key: string]: "X" | "Y" | "Z" } = {
      x: "X", // Rotate like R
      y: "Y", // Rotate like U
      z: "Z", // Rotate like F
    };

    return {
      layer: allLayers,
      axis: rotationMap[baseFace],
      clockwise,
    };
  }

  /**
   * Parses middle layer moves (M, E, S)
   * @param {string} face - Middle layer face (M, E, S)
   * @param {boolean} clockwise - Direction
   * @returns {Object} Parameters for rotate function
   */
  private parseMiddleLayerMove(
    face: string,
    clockwise: boolean
  ): { layer: number | number[]; axis: "X" | "Y" | "Z"; clockwise: boolean } {
    const middleLayer = Math.floor(this.size / 2);

    switch (face) {
      case "M": // Middle layer parallel to L and R faces
        return {
          layer: middleLayer,
          axis: "Z",
          clockwise: !clockwise, // M moves follow L face direction
        };
      case "E": // Equatorial layer parallel to U and D faces
        return {
          layer: middleLayer,
          axis: "Y",
          clockwise: !clockwise, // E moves follow D face direction
        };
      case "S": // Standing layer parallel to F and B faces
        return {
          layer: middleLayer,
          axis: "X",
          clockwise: clockwise, // S moves follow F face direction
        };
      default:
        throw new Error(`Unknown middle layer: ${face}`);
    }
  }

  /**
   * Executes a sequence of Kociemba moves
   * @param {string} moveSequence - Space-separated sequence of moves
   */
  executeKociembaMoves(moveSequence: string): void {
    const moves = moveSequence.trim().split(/\s+/);

    for (const move of moves) {
      if (!move) continue;

      const params = this.parseKociembaMove(move);

      // Handle double moves (execute twice)
      const repetitions = move.includes("2") ? 2 : 1;

      for (let i = 0; i < repetitions; i++) {
        this.rotate(params.layer, params.axis, params.clockwise);
      }
    }
  }

  /**
   * Converts your internal move format to Kociemba notation
   * @param {number | number[]} layer - Layer(s) being rotated
   * @param {"X" | "Y" | "Z"} axis - Rotation axis
   * @param {boolean} clockwise - Direction
   * @returns {string} Move in Kociemba notation
   */
  toKociembaMove(
    layer: number | number[],
    axis: "X" | "Y" | "Z",
    clockwise: boolean
  ): string {
    // Handle multiple layers (wide moves)
    const isWide = Array.isArray(layer) && layer.length > 1;

    // Get the primary layer (outermost)
    const primaryLayer = Array.isArray(layer) ? Math.min(...layer) : layer;

    // Map axis and layer to face
    let face = "";
    let needsInvert = false;

    switch (axis) {
      case "X":
        if (primaryLayer === 0) {
          face = "F";
        } else if (primaryLayer === this.size - 1) {
          face = "B";
          needsInvert = true;
        } else {
          face = "S"; // Middle layer
        }
        break;
      case "Y":
        if (primaryLayer === 0) {
          face = "D";
          needsInvert = true;
        } else if (primaryLayer === this.size - 1) {
          face = "U";
        } else {
          face = "E"; // Middle layer
          needsInvert = true;
        }
        break;
      case "Z":
        if (primaryLayer === 0) {
          face = "L";
          needsInvert = true;
        } else if (primaryLayer === this.size - 1) {
          face = "R";
        } else {
          face = "M"; // Middle layer
          needsInvert = true;
        }
        break;
    }

    // Adjust clockwise for inverted faces
    if (needsInvert) {
      clockwise = !clockwise;
    }

    // Add wide move notation
    if (isWide && !["M", "E", "S"].includes(face)) {
      face = face.toLowerCase() + "w";
    }

    // Add direction modifier
    let notation = face;
    if (!clockwise) {
      notation += "'";
    }
    return notation;
  }
  /**
   * Debug function to verify the color mapping
   */
  debugColorMapping(): void {
    const solvedCube = new Cube(this.size);
    console.log("Color mapping:");
    console.log(`U (Up): ${solvedCube.faces.u[0][0]}`);
    console.log(`R (Right): ${solvedCube.faces.r[0][0]}`);
    console.log(`F (Front): ${solvedCube.faces.f[0][0]}`);
    console.log(`D (Down): ${solvedCube.faces.d[0][0]}`);
    console.log(`L (Left): ${solvedCube.faces.l[0][0]}`);
    console.log(`B (Back): ${solvedCube.faces.b[0][0]}`);

    console.log(
      "\nSolved cube Kociemba string:",
      solvedCube.toKociembaString()
    );
  }

  /**
   * Validates if the cube state is valid for solving
   * @returns {boolean} True if valid, false otherwise
   */
  isValidCubeState(): boolean {
    const colorCounts: { [color: string]: number } = {};
    const expectedCount = this.size * this.size;

    // Count each color
    Object.values(this.faces).forEach((face) => {
      face.flat().forEach((color) => {
        colorCounts[color] = (colorCounts[color] || 0) + 1;
      });
    });

    // Check if we have exactly 6 colors with equal counts
    const colors = Object.keys(colorCounts);
    if (colors.length !== 6) {
      console.error(`Expected 6 colors, found ${colors.length}:`, colors);
      return false;
    }

    const invalidColors = colors.filter(
      (color) => colorCounts[color] !== expectedCount
    );
    if (invalidColors.length > 0) {
      console.error(`Invalid color counts:`, colorCounts);
      console.error(`Expected ${expectedCount} of each color`);
      return false;
    }

    return true;
  }
}
