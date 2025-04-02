import chalk from "chalk";
import { CubeType, FACE_COLORS, FaceColorType } from "../types";

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
      this.faces.l.push(new Array(n).fill("g"));
      this.faces.r.push(new Array(n).fill("b"));
      this.faces.f.push(new Array(n).fill("r"));
      this.faces.b.push(new Array(n).fill("o"));
    }
  }

  /**
   * Checks if the cube is in a solved state
   * @returns {boolean} True if the cube is solved, false otherwise
   */
  isSolved(): boolean {
    return Object.values(this.faces).every((face) => {
      const firstColor = face[0][0];
      return face.every((row) => row.every((cell) => cell === firstColor));
    });
  }

  /**
   * Converts the cube state to a flat string representation
   * @param {CubeType} faces - The cube state to convert
   * @returns {string} The flat string representation of the cube state
   */
  toFlatString(faces: { [face: string]: string[][] }): string {
    const order = ["u", "r", "f", "d", "l", "b"];
    return order.map((face) => faces[face].flat().join("")).join("");
  }

  /**
   * Converts a flat string representation of the cube state to a Cube object
   * @param {string} state - The flat string representation of the cube state
   * @param {number} n - The size of the cube (default is 3)
   * @returns {Cube} The Cube object representing the state
   */
  fromFlatString(state: string, n = 3) {
    const order = ["u", "r", "f", "d", "l", "b"];
    let index = 0;
    const faces: { [face: string]: string[][] } = {};

    for (const face of order) {
      faces[face] = Array.from({ length: n }, () =>
        Array.from({ length: n }, () => state[index++])
      );
    }
    return faces;
  }

  /**
   * Resets the cube to its initial state
   */
  reset() {
    this.initFaces();
  }

  /**
   * Rotates a layer of the cube along X, Y, or Z axis
   * @param {number} layer - The layer to rotate (0 to size-1)
   * @param {"X"|"Y"|"Z"} axis - The axis to rotate around
   * @param {boolean} clockwise - Direction of rotation (true for clockwise)
   */
  rotate(layer: number, axis: "X" | "Y" | "Z", clockwise: boolean) {
    // Validate layer index
    if (layer < 0 || layer >= this.size) {
      throw new Error(`Layer index out of bounds: ${layer}`);
    }

    // Deep copy the current state
    const rotatedFaces = JSON.parse(JSON.stringify(this.faces));

    // Rotate the appropriate layer based on axis
    switch (axis) {
      case "Y":
        this.rotateYLayer(layer, clockwise, rotatedFaces);
        break;
      case "X":
        this.rotateXLayer(layer, clockwise, rotatedFaces);
        break;
      case "Z":
        this.rotateZLayer(layer, clockwise, rotatedFaces);
        break;
      default:
        throw new Error(`Invalid axis: ${axis}`);
    }

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
        // newFace[j][n - 1 - i] = clockwise ? face[i][j] : face[n - 1 - j][i];
      }
    }

    return newFace;
  }

  /**
   * Scrambles the cube by performing a random number of moves
   * @param {number} count - The number of moves to perform (default is 20)
   */
  scramble(count: number = 20) {
    const moves = this.generateScrambleMoves(count);
    moves.forEach((move) => {
      this.rotate(move.layer, move.axis, move.clockwise);
      console.table({
        Layer: move.layer,
        Axis: move.axis,
        Direction: move.clockwise ? "Clock" : "C Clock",
      });
    });
  }

  generateScrambleMoves(count: number = 20) {
    const axes: ("X" | "Y" | "Z")[] = ["X", "Y", "Z"];
    const moves = [];

    for (let i = 0; i < count; i++) {
      const layer = Math.floor(Math.random() * this.size);
      const axis = axes[Math.floor(Math.random() * axes.length)];
      const clockwise = Math.random() > 0.5;
      moves.push({ layer, axis, clockwise });
      console.log(i, this.getNotation(axis, layer, this.size, clockwise));
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

  /**
   * Prints the current state of the cube to the console
   */
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
    rotatedFaces.u.forEach((row) => {
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
}
