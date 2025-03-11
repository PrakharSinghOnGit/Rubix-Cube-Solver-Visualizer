import { CubeType, FACE_COLORS, FaceType } from "../types";
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

  rotateFace(face: string, direction: "cw" | "ccw") {
    const n = this.size;
    const faceCopy = this.faces[face].map((row) => [...row]);

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (direction === "cw") {
          this.faces[face][i][j] = faceCopy[n - j - 1][i];
        } else {
          this.faces[face][i][j] = faceCopy[j][n - i - 1];
        }
      }
    }
  }

  rotateSlice(slice: string, index: number, direction: "cw" | "ccw") {
    const n = this.size;
    const sliceCopy = this.faces[slice].map((row) => [...row]);

    for (let i = 0; i < n; i++) {
      if (direction === "cw") {
        this.faces[slice][i][index] = sliceCopy[n - index - 1][i];
      } else {
        this.faces[slice][i][index] = sliceCopy[index][n - i - 1];
      }
    }
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
    const n = this.size;
    const { u, d, l, r, f, b } = this.faces;

    // Print top face
    u.forEach((row) => {
      console.log(
        " ".repeat(n * 4) +
          row.map((r) => chalk.hex(FACE_COLORS[r as FaceType])("▇▇▇")).join(" ")
      );
    });

    // Print middle faces (l, f, r, b)
    for (let i = 0; i < n; i++) {
      const left = l[i]
        .map((r) => chalk.hex(FACE_COLORS[r as FaceType])("▇▇▇"))
        .join(" ");
      const front = f[i]
        .map((r) => chalk.hex(FACE_COLORS[r as FaceType])("▇▇▇"))
        .join(" ");
      const right = r[i]
        .map((r) => chalk.hex(FACE_COLORS[r as FaceType])("▇▇▇"))
        .join(" ");
      const back = b[i]
        .map((r) => chalk.hex(FACE_COLORS[r as FaceType])("▇▇▇"))
        .join(" ");
      console.log(`${left} ${front} ${right} ${back}`);
    }

    // Print bottom face
    d.forEach((row) => {
      console.log(
        " ".repeat(n * 4) +
          row.map((r) => chalk.hex(FACE_COLORS[r as FaceType])("▇▇▇")).join(" ")
      );
    });
  }
}

const cube = new Cube(5);
cube.printCube();
