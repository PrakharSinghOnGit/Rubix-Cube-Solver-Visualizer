/**
 * Represents an NxN Rubik's Cube.
 * This class handles the state of the cube and provides methods for manipulating it.
 */
export class RubiksCube {
  /**
   * Creates a new Rubik's Cube of the specified size.
   * @param {number} size - The size of the cube (e.g., 2 for 2x2, 3 for 3x3, etc.)
   */
  constructor(size) {
    this.size = size;
    this.faces = this.initializeCube();
    this.moveHistory = [];
  }

  /**
   * Initialize a solved cube.
   * @returns {Array} - A 3D array representing the cube's state
   */
  initializeCube() {
    // Colors: 0 = White, 1 = Yellow, 2 = Red, 3 = Orange, 4 = Blue, 5 = Green
    const faces = [];

    // Initialize each face with its color
    for (let faceIndex = 0; faceIndex < 6; faceIndex++) {
      const face = [];
      for (let i = 0; i < this.size; i++) {
        const row = [];
        for (let j = 0; j < this.size; j++) {
          row.push(faceIndex);
        }
        face.push(row);
      }
      faces.push(face);
    }

    return faces;
  }

  /**
   * Get the current state of the cube.
   * @returns {Array} - The current state of the cube
   */
  getState() {
    return JSON.parse(JSON.stringify(this.faces));
  }

  /**
   * Check if the cube is solved.
   * @returns {boolean} - True if the cube is solved, false otherwise
   */
  isSolved() {
    for (let faceIndex = 0; faceIndex < 6; faceIndex++) {
      const faceColor = this.faces[faceIndex][0][0];

      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          if (this.faces[faceIndex][i][j] !== faceColor) {
            return false;
          }
        }
      }
    }

    return true;
  }

  /**
   * Rotate a face of the cube.
   * @param {number} faceIndex - The index of the face to rotate (0-5)
   * @param {boolean} clockwise - True for clockwise rotation, false for counterclockwise
   */
  rotateFace(faceIndex, clockwise) {
    // Create a copy of the face
    const face = JSON.parse(JSON.stringify(this.faces[faceIndex]));

    // Rotate the face
    const rotatedFace = [];
    for (let i = 0; i < this.size; i++) {
      const row = [];
      for (let j = 0; j < this.size; j++) {
        if (clockwise) {
          row.push(face[this.size - 1 - j][i]);
        } else {
          row.push(face[j][this.size - 1 - i]);
        }
      }
      rotatedFace.push(row);
    }

    this.faces[faceIndex] = rotatedFace;

    // Update the adjacent faces
    this.updateAdjacentFaces(faceIndex, clockwise);

    // Record the move
    this.moveHistory.push({
      face: faceIndex,
      clockwise: clockwise,
      layer: 0, // Outer layer
    });
  }

  /**
   * Update the adjacent faces after a face rotation.
   * @param {number} faceIndex - The index of the rotated face
   * @param {boolean} clockwise - The direction of rotation
   */
  updateAdjacentFaces(faceIndex, clockwise) {
    // Define the adjacent faces and their affected rows/columns for each face
    const adjacentFaces = {
      0: {
        // White (Top)
        faces: [2, 5, 3, 4], // Red, Green, Orange, Blue
        getIndices: (i) => [
          { face: 2, indices: [0, i] }, // Red top row
          { face: 5, indices: [0, i] }, // Green top row
          { face: 3, indices: [0, this.size - 1 - i] }, // Orange top row (reversed)
          { face: 4, indices: [0, i] }, // Blue top row
        ],
      },
      1: {
        // Yellow (Bottom)
        faces: [2, 4, 3, 5], // Red, Blue, Orange, Green
        getIndices: (i) => [
          { face: 2, indices: [this.size - 1, i] }, // Red bottom row
          { face: 4, indices: [this.size - 1, this.size - 1 - i] }, // Blue bottom row (reversed)
          { face: 3, indices: [this.size - 1, i] }, // Orange bottom row
          { face: 5, indices: [this.size - 1, this.size - 1 - i] }, // Green bottom row (reversed)
        ],
      },
      2: {
        // Red (Front)
        faces: [0, 4, 1, 5], // White, Blue, Yellow, Green
        getIndices: (i) => [
          { face: 0, indices: [this.size - 1, i] }, // White bottom row
          { face: 4, indices: [i, 0] }, // Blue left column
          { face: 1, indices: [0, this.size - 1 - i] }, // Yellow top row (reversed)
          { face: 5, indices: [this.size - 1 - i, this.size - 1] }, // Green right column (reversed)
        ],
      },
      3: {
        // Orange (Back)
        faces: [0, 5, 1, 4], // White, Green, Yellow, Blue
        getIndices: (i) => [
          { face: 0, indices: [0, this.size - 1 - i] }, // White top row (reversed)
          { face: 5, indices: [i, 0] }, // Green left column
          { face: 1, indices: [this.size - 1, i] }, // Yellow bottom row
          { face: 4, indices: [this.size - 1 - i, this.size - 1] }, // Blue right column (reversed)
        ],
      },
      4: {
        // Blue (Left)
        faces: [0, 2, 1, 3], // White, Red, Yellow, Orange
        getIndices: (i) => [
          { face: 0, indices: [i, 0] }, // White left column
          { face: 2, indices: [i, 0] }, // Red left column
          { face: 1, indices: [i, 0] }, // Yellow left column
          { face: 3, indices: [this.size - 1 - i, this.size - 1] }, // Orange right column (reversed)
        ],
      },
      5: {
        // Green (Right)
        faces: [0, 3, 1, 2], // White, Orange, Yellow, Red
        getIndices: (i) => [
          { face: 0, indices: [i, this.size - 1] }, // White right column
          { face: 3, indices: [i, 0] }, // Orange left column
          { face: 1, indices: [i, this.size - 1] }, // Yellow right column
          { face: 2, indices: [this.size - 1 - i, this.size - 1] }, // Red right column (reversed)
        ],
      },
    };

    // Get the adjacent faces and their affected rows/columns
    const { faces, getIndices } = adjacentFaces[faceIndex];

    // Store the values from each face
    const values = [];
    for (let i = 0; i < this.size; i++) {
      const faceValues = [];
      for (let j = 0; j < 4; j++) {
        const { face, indices } = getIndices(i);
        faceValues.push(this.faces[face][indices[0]][indices[1]]);
      }
      values.push(faceValues);
    }

    // Update the values on each face
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < 4; j++) {
        const { face, indices } = getIndices(i);
        const sourceIndex = clockwise ? (j + 3) % 4 : (j + 1) % 4;
        this.faces[face][indices[0]][indices[1]] = values[i][sourceIndex];
      }
    }
  }

  /**
   * Apply a sequence of moves to the cube.
   * @param {Array} moves - An array of move objects { face, clockwise, layer }
   */
  applyMoves(moves) {
    for (const move of moves) {
      if (move.layer === 0) {
        this.rotateFace(move.face, move.clockwise);
      } else {
        // Handle inner layer rotations for NxN cubes
        this.rotateLayer(move.face, move.layer, move.clockwise);
      }
    }
  }

  /**
   * Rotate an inner layer of the cube (for NxN cubes where N > 2).
   * @param {number} faceIndex - The face defining the axis of rotation
   * @param {number} layer - The layer to rotate (1 to size-1, where 1 is the layer next to the face)
   * @param {boolean} clockwise - True for clockwise rotation, false for counterclockwise
   */
  rotateLayer(faceIndex, layer, clockwise) {
    if (layer <= 0 || layer >= this.size) {
      throw new Error(
        `Invalid layer: ${layer}. Must be between 1 and ${this.size - 1}`
      );
    }

    // For inner layers, we only need to update the adjacent faces
    // The logic is similar to updateAdjacentFaces but with different indices

    // Record the move
    this.moveHistory.push({
      face: faceIndex,
      clockwise: clockwise,
      layer: layer,
    });

    // Implementation for inner layer rotations would go here
    // This is more complex and would require tracking the state of inner cubies
  }

  /**
   * Scramble the cube with a random sequence of moves.
   * @param {number} moveCount - The number of random moves to apply
   */
  scramble(moveCount) {
    const moves = [];

    for (let i = 0; i < moveCount; i++) {
      const face = Math.floor(Math.random() * 6);
      const clockwise = Math.random() > 0.5;
      const layer = Math.floor(Math.random() * Math.floor(this.size / 2));

      moves.push({ face, clockwise, layer });
    }

    this.applyMoves(moves);
    return moves;
  }

  /**
   * Reset the cube to its solved state.
   */
  reset() {
    this.faces = this.initializeCube();
    this.moveHistory = [];
  }

  /**
   * Get the move history.
   * @returns {Array} - The history of moves applied to the cube
   */
  getMoveHistory() {
    return [...this.moveHistory];
  }

  /**
   * Convert a move to standard notation (e.g., R, L', F2, etc.).
   * @param {Object} move - A move object { face, clockwise, layer }
   * @returns {string} - The move in standard notation
   */
  static moveToNotation(move) {
    const faceNotation = ["U", "D", "F", "B", "L", "R"];
    let notation = "";

    // For inner layers on NxN cubes
    if (move.layer > 0) {
      notation = `${move.layer + 1}${faceNotation[move.face]}`;
    } else {
      notation = faceNotation[move.face];
    }

    // Add suffix for direction
    if (!move.clockwise) {
      notation += "'";
    }

    return notation;
  }

  /**
   * Convert a sequence of moves to standard notation.
   * @param {Array} moves - An array of move objects
   * @returns {string} - The sequence in standard notation
   */
  static movesToNotation(moves) {
    return moves.map((move) => RubiksCube.moveToNotation(move)).join(" ");
  }
}
