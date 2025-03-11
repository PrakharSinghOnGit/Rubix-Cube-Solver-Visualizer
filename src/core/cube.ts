type Face = "U" | "D" | "F" | "B" | "L" | "R";
type Color = "W" | "Y" | "G" | "B" | "O" | "R";
type Axis = "X" | "Y" | "Z";

/**
 * Rubik's Cube is represented as a 6*(N*N) matrices cube.
 * The faces are represented as a 2D array of colors.
 * The cube is represented as a 3D array of faces.
 */

export interface ICube {
  rotateLayer(layer: number, axis: Axis, clockwise: boolean): void;
  printCube(): void;
}

export class RubiksCube implements ICube {
  private N: number;
  private faces: Record<Face, Color[][]>;

  constructor(N: number) {
    this.N = N;
    this.faces = {
      U: Array(N)
        .fill(null)
        .map(() => Array(N).fill("W")), // Up (White)
      D: Array(N)
        .fill(null)
        .map(() => Array(N).fill("Y")), // Down (Yellow)
      F: Array(N)
        .fill(null)
        .map(() => Array(N).fill("G")), // Front (Green)
      B: Array(N)
        .fill(null)
        .map(() => Array(N).fill("B")), // Back (Blue)
      L: Array(N)
        .fill(null)
        .map(() => Array(N).fill("O")), // Left (Orange)
      R: Array(N)
        .fill(null)
        .map(() => Array(N).fill("R")), // Right (Red)
    };
  }

  /**
   * Rotates a given face 90° clockwise or counterclockwise.
   */
  private rotateFace(face: Face, clockwise: boolean = true): void {
    const N = this.N;
    const newFace: Color[][] = Array(N)
      .fill(null)
      .map(() => Array(N).fill((null as unknown) as Color));

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (clockwise) {
          newFace[j][N - 1 - i] = this.faces[face][i][j];
        } else {
          newFace[N - 1 - j][i] = this.faces[face][i][j];
        }
      }
    }

    this.faces[face] = newFace;
  }

  /**
   * Rotates a middle layer of the cube.
   * @param layer - The index of the layer (0 to N-1)
   * @param axis - 'X', 'Y', or 'Z' (X = vertical, Y = horizontal, Z = depth)
   * @param clockwise - Direction of rotation
   */
  rotateLayer(layer: number, axis: Axis, clockwise: boolean = true): void {
    if (layer < 0 || layer >= this.N) {
      throw new Error(`Layer index out of bounds: ${layer}`);
    }

    if (axis === "Y") {
      // Horizontal layers (U, middle, D)
      if (layer === 0) {
        this.rotateFace("U", clockwise);
      } else if (layer === this.N - 1) {
        this.rotateFace("D", !clockwise);
      }

      // Store a copy of the front face layer
      const temp = [...this.faces["F"][layer]];

      if (clockwise) {
        // Move left to front
        this.faces["F"][layer] = [...this.faces["L"][layer]];

        // Move back to left (with reversal)
        const reversedBackLayer = [
          ...this.faces["B"][this.N - 1 - layer],
        ].reverse();
        this.faces["L"][layer] = reversedBackLayer;

        // Move right to back
        this.faces["B"][this.N - 1 - layer] = [
          ...this.faces["R"][layer],
        ].reverse();

        // Move front (temp) to right
        this.faces["R"][layer] = temp;
      } else {
        // Move right to front
        this.faces["F"][layer] = [...this.faces["R"][layer]];

        // Move back to right (with reversal)
        const reversedBackLayer = [
          ...this.faces["B"][this.N - 1 - layer],
        ].reverse();
        this.faces["R"][layer] = reversedBackLayer;

        // Move left to back
        this.faces["B"][this.N - 1 - layer] = [
          ...this.faces["L"][layer],
        ].reverse();

        // Move front (temp) to left
        this.faces["L"][layer] = temp;
      }
    } else if (axis === "X") {
      // Vertical layers (L, middle, R)
      if (layer === 0) {
        this.rotateFace("L", !clockwise);
      } else if (layer === this.N - 1) {
        this.rotateFace("R", clockwise);
      }

      // Store a copy of the column from the up face
      const temp: Color[] = [];
      for (let i = 0; i < this.N; i++) {
        temp.push(this.faces["U"][i][layer]);
      }

      if (clockwise) {
        for (let i = 0; i < this.N; i++) {
          // Move back to up
          this.faces["U"][i][layer] = this.faces["B"][this.N - 1 - i][
            this.N - 1 - layer
          ];

          // Move down to back
          this.faces["B"][this.N - 1 - i][this.N - 1 - layer] = this.faces["D"][
            this.N - 1 - i
          ][layer];

          // Move front to down
          this.faces["D"][this.N - 1 - i][layer] = this.faces["F"][i][layer];

          // Move up (temp) to front
          this.faces["F"][i][layer] = temp[i];
        }
      } else {
        for (let i = 0; i < this.N; i++) {
          // Move front to up
          this.faces["U"][i][layer] = this.faces["F"][i][layer];

          // Move down to front
          this.faces["F"][i][layer] = this.faces["D"][this.N - 1 - i][layer];

          // Move back to down
          this.faces["D"][this.N - 1 - i][layer] = this.faces["B"][
            this.N - 1 - i
          ][this.N - 1 - layer];

          // Move up (temp) to back
          this.faces["B"][this.N - 1 - i][this.N - 1 - layer] = temp[i];
        }
      }
    } else if (axis === "Z") {
      // Depth layers (F, middle, B)
      if (layer === 0) {
        this.rotateFace("F", clockwise);
      } else if (layer === this.N - 1) {
        this.rotateFace("B", !clockwise);
      }

      // Store a copy of the row from the up face
      const temp = [...this.faces["U"][this.N - 1 - layer]];

      if (clockwise) {
        // Create a temporary array for the left face column
        const leftColumn: Color[] = [];
        for (let i = 0; i < this.N; i++) {
          leftColumn.push(this.faces["L"][this.N - 1 - i][layer]);
        }

        // Move left column to up row
        this.faces["U"][this.N - 1 - layer] = leftColumn;

        // Move down row to left column (reversed)
        for (let i = 0; i < this.N; i++) {
          this.faces["L"][this.N - 1 - i][layer] = this.faces["D"][layer][
            this.N - 1 - i
          ];
        }

        // Move right column to down row (reversed)
        const rightColumn: Color[] = [];
        for (let i = 0; i < this.N; i++) {
          rightColumn.push(this.faces["R"][i][this.N - 1 - layer]);
        }
        this.faces["D"][layer] = rightColumn;

        // Move up row to right column
        for (let i = 0; i < this.N; i++) {
          this.faces["R"][i][this.N - 1 - layer] = temp[this.N - 1 - i];
        }
      } else {
        // Create a temporary array for the right face column
        const rightColumn: Color[] = [];
        for (let i = 0; i < this.N; i++) {
          rightColumn.push(this.faces["R"][i][this.N - 1 - layer]);
        }

        // Move right column to up row (reversed)
        for (let i = 0; i < this.N; i++) {
          this.faces["U"][this.N - 1 - layer][i] = rightColumn[this.N - 1 - i];
        }

        // Move down row to right column
        for (let i = 0; i < this.N; i++) {
          this.faces["R"][i][this.N - 1 - layer] = this.faces["D"][layer][i];
        }

        // Move left column to down row
        const leftColumn: Color[] = [];
        for (let i = 0; i < this.N; i++) {
          leftColumn.push(this.faces["L"][this.N - 1 - i][layer]);
        }
        this.faces["D"][layer] = leftColumn;

        // Move up row to left column (reversed)
        for (let i = 0; i < this.N; i++) {
          this.faces["L"][this.N - 1 - i][layer] = temp[i];
        }
      }
    }
  }

  /**
   * Prints the current cube state to the console
   */
  printCube(): void {
    const faceOrder: Face[] = ["U", "D", "F", "B", "L", "R"];

    for (const face of faceOrder) {
      console.log(`Face ${face}:`);
      for (const row of this.faces[face]) {
        console.log(row.join(" "));
      }
      console.log();
    }
  }

  isSolved(): boolean {
    return Object.values(this.faces).every((face) =>
      face.every((row) => row.every((color) => color === face[0][0]))
    );
  }

  scramble(moveCount: number = 20): void {
    const moves = ["U", "D", "F", "B", "L", "R"];
    for (let i = 0; i < moveCount; i++) {
      const move = moves[Math.floor(Math.random() * moves.length)];
      const layer = Math.floor(Math.random() * this.N);
      const axis = ["X", "Y", "Z"][Math.floor(Math.random() * 3)];
      const clockwise = Math.random() < 0.5;
      console.log(move, axis, clockwise);
      this.rotateLayer(layer, axis as Axis, clockwise);
    }
  }

  public getFaces(): Record<string, string[][]> {
    return this.faces;
  }
}
