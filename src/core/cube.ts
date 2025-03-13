import { CubeType, FACE_COLORS, FaceColorType } from "../types";
import chalk from "chalk";

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

    // Define face constants for better readability
    const FRONT = "f",
      BACK = "b",
      LEFT = "l",
      RIGHT = "r",
      UP = "u",
      DOWN = "d";

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

    // If the layer is the first or last, rotate the corresponding face
    if (layer === 0 || layer === this.size - 1) {
      let faceToRotate = "";
      if (axis === "X") faceToRotate = layer === 0 ? LEFT : RIGHT;
      if (axis === "Y") faceToRotate = layer === 0 ? UP : DOWN;
      if (axis === "Z") faceToRotate = layer === 0 ? FRONT : BACK;

      this.faces[faceToRotate] = this.rotateFace(
        this.faces[faceToRotate],
        clockwise
      );
    }
  }

  /**
   * Rotates a layer around the Y axis
   * @private
   */
  rotateYLayer(
    layer: number,
    clockwise: boolean,
    rotatedFaces: { [x: string]: string[][] }
  ) {
    const FRONT = "f",
      BACK = "b",
      LEFT = "l",
      RIGHT = "r";

    for (let i = 0; i < this.size; i++) {
      if (clockwise) {
        rotatedFaces[FRONT][i][layer] = this.faces[LEFT][i][layer];
        rotatedFaces[RIGHT][i][layer] = this.faces[FRONT][i][layer];
        rotatedFaces[BACK][i][layer] = this.faces[RIGHT][i][layer];
        rotatedFaces[LEFT][i][layer] = this.faces[BACK][i][layer];
      } else {
        rotatedFaces[FRONT][i][layer] = this.faces[RIGHT][i][layer];
        rotatedFaces[LEFT][i][layer] = this.faces[FRONT][i][layer];
        rotatedFaces[BACK][i][layer] = this.faces[LEFT][i][layer];
        rotatedFaces[RIGHT][i][layer] = this.faces[BACK][i][layer];
      }
    }
  }

  /**
   * Rotates a layer around the X axis
   * @private
   */
  rotateXLayer(
    layer: number,
    clockwise: boolean,
    rotatedFaces: { [x: string]: string[][] }
  ) {
    const FRONT = "f",
      BACK = "b",
      UP = "u",
      DOWN = "d";
    const lastIndex = this.size - 1;

    for (let i = 0; i < this.size; i++) {
      if (clockwise) {
        rotatedFaces[UP][layer][i] = this.faces[BACK][lastIndex - i][layer];
        rotatedFaces[FRONT][layer][i] = this.faces[UP][layer][i];
        rotatedFaces[DOWN][layer][i] = this.faces[FRONT][layer][i];
        rotatedFaces[BACK][lastIndex - i][layer] = this.faces[DOWN][layer][i];
      } else {
        rotatedFaces[UP][layer][i] = this.faces[FRONT][layer][i];
        rotatedFaces[FRONT][layer][i] = this.faces[DOWN][layer][i];
        rotatedFaces[DOWN][layer][i] = this.faces[BACK][lastIndex - i][layer];
        rotatedFaces[BACK][lastIndex - i][layer] = this.faces[UP][layer][i];
      }
    }
  }

  /**
   * Rotates a layer around the Z axis
   * @private
   */
  rotateZLayer(
    layer: number,
    clockwise: boolean,
    rotatedFaces: { [x: string]: string[][] }
  ) {
    const UP = "u",
      RIGHT = "r",
      DOWN = "d",
      LEFT = "l";
    const lastIndex = this.size - 1;

    for (let i = 0; i < this.size; i++) {
      if (clockwise) {
        // Fixed the indexing issue in the left face
        rotatedFaces[UP][i][layer] = this.faces[LEFT][lastIndex - i][layer];
        rotatedFaces[RIGHT][layer][i] = this.faces[UP][i][layer];
        rotatedFaces[DOWN][i][layer] = this.faces[RIGHT][layer][i];
        rotatedFaces[LEFT][lastIndex - i][layer] = this.faces[DOWN][i][layer];
      } else {
        rotatedFaces[UP][i][layer] = this.faces[RIGHT][layer][i];
        rotatedFaces[RIGHT][layer][i] = this.faces[DOWN][i][layer];
        rotatedFaces[DOWN][i][layer] = this.faces[LEFT][lastIndex - i][layer];
        rotatedFaces[LEFT][lastIndex - i][layer] = this.faces[UP][i][layer];
      }
    }
  }

  /** Rotates a face 90° clockwise or counterclockwise */
  rotateFace(face: string[][], clockwise: boolean): string[][] {
    const n = this.size;
    const newFace = Array.from({ length: n }, () => Array(n).fill(""));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        newFace[j][n - 1 - i] = clockwise ? face[i][j] : face[n - 1 - j][i];
      }
    }

    return newFace;
  }

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
    }

    return moves;
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

  printCube() {
    console.log("------------------------------");
    const n = this.size;
    const { u, d, l, r, f, b } = this.faces;

    // Print top face
    u.forEach((row) => {
      console.log(
        " ".repeat(n * 4) +
          row
            .map((r) => chalk.hex(FACE_COLORS[r as FaceColorType])("▇▇▇"))
            .join(" ")
      );
    });

    // Print middle faces (l, f, r, b)
    for (let i = 0; i < n; i++) {
      const left = l[i]
        .map((r) => chalk.hex(FACE_COLORS[r as FaceColorType])("▇▇▇"))
        .join(" ");
      const front = f[i]
        .map((r) => chalk.hex(FACE_COLORS[r as FaceColorType])("▇▇▇"))
        .join(" ");
      const right = r[i]
        .map((r) => chalk.hex(FACE_COLORS[r as FaceColorType])("▇▇▇"))
        .join(" ");
      const back = b[i]
        .map((r) => chalk.hex(FACE_COLORS[r as FaceColorType])("▇▇▇"))
        .join(" ");
      console.log(`${left} ${front} ${right} ${back}`);
    }

    // Print bottom face
    d.forEach((row) => {
      console.log(
        " ".repeat(n * 4) +
          row
            .map((r) => chalk.hex(FACE_COLORS[r as FaceColorType])("▇▇▇"))
            .join(" ")
      );
    });
  }
}

// const cube = new Cube(3);
// cube.printCube();
// cube.rotate(0, "Y", true);
// cube.printCube();
