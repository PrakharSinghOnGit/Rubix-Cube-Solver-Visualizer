import {
  CubeState,
  Face,
  Move,
  MoveType,
  CubeColor,
  MoveNotation,
} from "../types";

// Create an initial solved cube state with the given size
export function createInitialCubeState(size: number): CubeState {
  const state: CubeState = [];

  // Create 6 faces with the appropriate color
  for (let face = 0; face < 6; face++) {
    const faceMatrix: number[][] = [];
    for (let i = 0; i < size; i++) {
      const row: number[] = [];
      for (let j = 0; j < size; j++) {
        row.push(face); // Each face has its own color
      }
      faceMatrix.push(row);
    }
    state.push(faceMatrix);
  }

  return state;
}

// Deep clone a cube state
export function cloneCubeState(state: CubeState): CubeState {
  return state.map((face) => face.map((row) => [...row]));
}

// Rotate a single face of the cube (clockwise or counter-clockwise)
export function rotateFace(face: number[][], clockwise: boolean): number[][] {
  const size = face.length;
  const newFace: number[][] = [];

  for (let i = 0; i < size; i++) {
    newFace.push(Array(size).fill(0));
  }

  if (clockwise) {
    // Clockwise rotation
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        newFace[j][size - 1 - i] = face[i][j];
      }
    }
  } else {
    // Counter-clockwise rotation
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        newFace[size - 1 - j][i] = face[i][j];
      }
    }
  }

  return newFace;
}

// Get adjacent faces and their corresponding edges for a given face
function getAdjacentFaces(
  face: Face,
  size: number
): {
  face: Face;
  edge: "top" | "right" | "bottom" | "left";
  reversed: boolean;
}[] {
  switch (face) {
    case Face.UP:
      return [
        { face: Face.BACK, edge: "top", reversed: true },
        { face: Face.RIGHT, edge: "top", reversed: false },
        { face: Face.FRONT, edge: "top", reversed: false },
        { face: Face.LEFT, edge: "top", reversed: false },
      ];
    case Face.DOWN:
      return [
        { face: Face.FRONT, edge: "bottom", reversed: false },
        { face: Face.RIGHT, edge: "bottom", reversed: false },
        { face: Face.BACK, edge: "bottom", reversed: true },
        { face: Face.LEFT, edge: "bottom", reversed: false },
      ];
    case Face.FRONT:
      return [
        { face: Face.UP, edge: "bottom", reversed: false },
        { face: Face.RIGHT, edge: "left", reversed: false },
        { face: Face.DOWN, edge: "top", reversed: false },
        { face: Face.LEFT, edge: "right", reversed: true },
      ];
    case Face.BACK:
      return [
        { face: Face.UP, edge: "top", reversed: true },
        { face: Face.LEFT, edge: "left", reversed: true }, // Fixed: RIGHT → LEFT
        { face: Face.DOWN, edge: "bottom", reversed: true },
        { face: Face.RIGHT, edge: "right", reversed: false }, // Fixed: LEFT → RIGHT
      ];
    case Face.RIGHT:
      return [
        { face: Face.UP, edge: "right", reversed: false },
        { face: Face.BACK, edge: "right", reversed: true },
        { face: Face.DOWN, edge: "right", reversed: false },
        { face: Face.FRONT, edge: "right", reversed: false },
      ];
    case Face.LEFT:
      return [
        { face: Face.UP, edge: "left", reversed: false },
        { face: Face.FRONT, edge: "left", reversed: false },
        { face: Face.DOWN, edge: "left", reversed: false },
        { face: Face.BACK, edge: "left", reversed: true },
      ];
    default:
      throw new Error(`Invalid face: ${face}`);
  }
}

// Get the edge of a face
function getEdge(
  face: number[][],
  edge: "top" | "right" | "bottom" | "left",
  reversed: boolean = false
): number[] {
  const size = face.length;
  let result: number[] = [];

  switch (edge) {
    case "top":
      result = [...face[0]];
      break;
    case "right":
      result = face.map((row) => row[size - 1]);
      break;
    case "bottom":
      result = [...face[size - 1]];
      break;
    case "left":
      result = face.map((row) => row[0]);
      break;
  }

  return reversed ? result.reverse() : result;
}

// Set the edge of a face
function setEdge(
  face: number[][],
  edge: "top" | "right" | "bottom" | "left",
  values: number[],
  reversed: boolean = false
): void {
  const size = face.length;
  const vals = reversed ? [...values].reverse() : values;

  switch (edge) {
    case "top":
      for (let i = 0; i < size; i++) {
        face[0][i] = vals[i];
      }
      break;
    case "right":
      for (let i = 0; i < size; i++) {
        face[i][size - 1] = vals[i];
      }
      break;
    case "bottom":
      for (let i = 0; i < size; i++) {
        face[size - 1][i] = vals[i];
      }
      break;
    case "left":
      for (let i = 0; i < size; i++) {
        face[i][0] = vals[i];
      }
      break;
  }
}

// Apply a face rotation move to the cube state
function applyFaceRotation(
  state: CubeState,
  face: Face,
  direction: 1 | -1 | 2
): CubeState {
  const newState = cloneCubeState(state);
  const size = newState[0].length;

  // Rotate the face itself
  if (direction === 1) {
    newState[face] = rotateFace(newState[face], true);
  } else if (direction === -1) {
    newState[face] = rotateFace(newState[face], false);
  } else if (direction === 2) {
    newState[face] = rotateFace(rotateFace(newState[face], true), true);
  }

  // Get adjacent faces and their edges
  const adjacentFaces = getAdjacentFaces(face, size);

  // Store the edges before modifying them
  const edges: number[][] = adjacentFaces.map((adj) =>
    getEdge(newState[adj.face], adj.edge, adj.reversed)
  );

  // Shift the edges based on the rotation direction
  let shiftAmount = direction === 2 ? 2 : 1;

  for (let shift = 0; shift < shiftAmount; shift++) {
    if (direction === 1 || direction === 2) {
      // Clockwise rotation
      const temp = edges.pop()!;
      edges.unshift(temp);
    } else {
      // Counter-clockwise rotation
      const temp = edges.shift()!;
      edges.push(temp);
    }
  }

  // Update the edges on the adjacent faces
  for (let i = 0; i < adjacentFaces.length; i++) {
    const adj = adjacentFaces[i];
    setEdge(newState[adj.face], adj.edge, edges[i], adj.reversed);
  }

  return newState;
}

// Apply a slice move to the cube state
function applySliceMove(
  state: CubeState,
  sliceIndex: number,
  axis: "x" | "y" | "z",
  direction: 1 | -1 | 2
): CubeState {
  const newState = cloneCubeState(state);
  const size = newState[0].length;

  // Ensure slice index is valid
  if (sliceIndex < 0 || sliceIndex >= size) {
    throw new Error(`Invalid slice index: ${sliceIndex}`);
  }

  // Define which faces and rows/columns are affected by this slice
  let affectedFaces: {
    face: Face;
    type: "row" | "column";
    index: number;
    reversed?: boolean;
  }[] = [];

  // Fixed: Correct slice directions to match standard notation
  switch (axis) {
    case "x": // Slice parallel to YZ plane (between L and R)
      affectedFaces = [
        { face: Face.UP, type: "column", index: sliceIndex },
        { face: Face.FRONT, type: "column", index: sliceIndex },
        { face: Face.DOWN, type: "column", index: sliceIndex },
        {
          face: Face.BACK,
          type: "column",
          index: size - 1 - sliceIndex,
          reversed: true,
        },
      ];
      break;
    case "y": // Slice parallel to XZ plane (between U and D)
      affectedFaces = [
        { face: Face.FRONT, type: "row", index: sliceIndex },
        { face: Face.RIGHT, type: "row", index: sliceIndex },
        { face: Face.BACK, type: "row", index: sliceIndex },
        { face: Face.LEFT, type: "row", index: sliceIndex },
      ];
      // For E slice (equatorial), invert direction to match standard notation
      if (axis === "y" && sliceIndex === 1 && size === 3) {
        direction = direction === 1 ? -1 : direction === -1 ? 1 : 2;
      }
      break;
    case "z": // Slice parallel to XY plane (between F and B)
      affectedFaces = [
        {
          face: Face.UP,
          type: "row",
          index: size - 1 - sliceIndex,
          reversed: true,
        },
        {
          face: Face.RIGHT,
          type: "column",
          index: size - 1 - sliceIndex,
          reversed: true,
        },
        { face: Face.DOWN, type: "row", index: sliceIndex },
        { face: Face.LEFT, type: "column", index: sliceIndex },
      ];
      // For S slice (standing), invert direction to match standard notation
      if (axis === "z" && sliceIndex === 1 && size === 3) {
        direction = direction === 1 ? -1 : direction === -1 ? 1 : 2;
      }
      break;
  }

  // Get the values from each affected face
  const values: number[][] = affectedFaces.map(
    ({ face, type, index, reversed }) => {
      const faceMatrix = newState[face];
      let value: number[];

      if (type === "row") {
        value = [...faceMatrix[index]];
      } else {
        // column
        value = faceMatrix.map((row) => row[index]);
      }

      return reversed ? value.reverse() : value;
    }
  );

  // Shift the values based on the rotation direction
  let shiftAmount = direction === 2 ? 2 : 1;

  for (let shift = 0; shift < shiftAmount; shift++) {
    if (direction === 1 || direction === 2) {
      // Clockwise rotation
      const temp = values.pop()!;
      values.unshift(temp);
    } else {
      // Counter-clockwise rotation
      const temp = values.shift()!;
      values.push(temp);
    }
  }

  // Update the values on the affected faces
  for (let i = 0; i < affectedFaces.length; i++) {
    const { face, type, index, reversed } = affectedFaces[i];
    const faceMatrix = newState[face];
    const value = reversed ? [...values[i]].reverse() : values[i];

    if (type === "row") {
      for (let j = 0; j < size; j++) {
        faceMatrix[index][j] = value[j];
      }
    } else {
      // column
      for (let j = 0; j < size; j++) {
        faceMatrix[j][index] = value[j];
      }
    }
  }

  return newState;
}

// Apply a whole cube rotation
function applyWholeRotation(
  state: CubeState,
  axis: "x" | "y" | "z",
  direction: 1 | -1 | 2
): CubeState {
  const size = state[0].length;
  let newState = cloneCubeState(state);

  // Apply the rotation to each slice
  for (let i = 0; i < size; i++) {
    newState = applySliceMove(newState, i, axis, direction);
  }

  // Fix: Update face orientations after whole cube rotation
  // This is necessary because the slices update the stickers but not the face identities
  if (axis === "x") {
    // x rotation affects UP, DOWN, FRONT, BACK
    if (direction === 1 || direction === 2) {
      const tempUp = newState[Face.UP];
      if (direction === 1) {
        newState[Face.UP] = newState[Face.BACK];
        newState[Face.BACK] = rotateFace(
          rotateFace(newState[Face.DOWN], true),
          true
        );
        newState[Face.DOWN] = newState[Face.FRONT];
        newState[Face.FRONT] = tempUp;
      } else {
        // direction === 2
        newState[Face.UP] = rotateFace(
          rotateFace(newState[Face.DOWN], true),
          true
        );
        newState[Face.BACK] = rotateFace(
          rotateFace(newState[Face.FRONT], true),
          true
        );
        newState[Face.DOWN] = rotateFace(rotateFace(tempUp, true), true);
        newState[Face.FRONT] = rotateFace(
          rotateFace(newState[Face.BACK], true),
          true
        );
      }
    } else {
      // direction === -1
      const tempUp = newState[Face.UP];
      newState[Face.UP] = newState[Face.FRONT];
      newState[Face.FRONT] = newState[Face.DOWN];
      newState[Face.DOWN] = rotateFace(
        rotateFace(newState[Face.BACK], true),
        true
      );
      newState[Face.BACK] = tempUp;
    }
  } else if (axis === "y") {
    // y rotation affects FRONT, BACK, RIGHT, LEFT
    if (direction === 1 || direction === 2) {
      const tempFront = newState[Face.FRONT];
      if (direction === 1) {
        newState[Face.FRONT] = newState[Face.RIGHT];
        newState[Face.RIGHT] = newState[Face.BACK];
        newState[Face.BACK] = newState[Face.LEFT];
        newState[Face.LEFT] = tempFront;
      } else {
        // direction === 2
        newState[Face.FRONT] = newState[Face.BACK];
        newState[Face.RIGHT] = newState[Face.LEFT];
        newState[Face.BACK] = tempFront;
        newState[Face.LEFT] = newState[Face.RIGHT];
      }
    } else {
      // direction === -1
      const tempFront = newState[Face.FRONT];
      newState[Face.FRONT] = newState[Face.LEFT];
      newState[Face.LEFT] = newState[Face.BACK];
      newState[Face.BACK] = newState[Face.RIGHT];
      newState[Face.RIGHT] = tempFront;
    }
  } else if (axis === "z") {
    // z rotation affects UP, DOWN, RIGHT, LEFT
    if (direction === 1 || direction === 2) {
      const tempUp = newState[Face.UP];
      if (direction === 1) {
        newState[Face.UP] = rotateFace(newState[Face.LEFT], true);
        newState[Face.LEFT] = rotateFace(newState[Face.DOWN], true);
        newState[Face.DOWN] = rotateFace(newState[Face.RIGHT], true);
        newState[Face.RIGHT] = rotateFace(tempUp, true);
      } else {
        // direction === 2
        newState[Face.UP] = rotateFace(
          rotateFace(newState[Face.DOWN], true),
          true
        );
        newState[Face.LEFT] = rotateFace(
          rotateFace(newState[Face.RIGHT], true),
          true
        );
        newState[Face.DOWN] = rotateFace(rotateFace(tempUp, true), true);
        newState[Face.RIGHT] = rotateFace(
          rotateFace(newState[Face.LEFT], true),
          true
        );
      }
    } else {
      // direction === -1
      const tempUp = newState[Face.UP];
      newState[Face.UP] = rotateFace(newState[Face.RIGHT], false);
      newState[Face.RIGHT] = rotateFace(newState[Face.DOWN], false);
      newState[Face.DOWN] = rotateFace(newState[Face.LEFT], false);
      newState[Face.LEFT] = rotateFace(tempUp, false);
    }
  }

  return newState;
}

// Apply a move to the cube state
export function applyMove(state: CubeState, move: Move): CubeState {
  switch (move.type) {
    case MoveType.FACE_CLOCKWISE:
    case MoveType.FACE_COUNTER_CLOCKWISE:
    case MoveType.FACE_DOUBLE:
      if (move.face === undefined) {
        throw new Error("Face must be defined for face rotation moves");
      }
      const direction =
        move.type === MoveType.FACE_CLOCKWISE
          ? 1
          : move.type === MoveType.FACE_COUNTER_CLOCKWISE
          ? -1
          : 2;
      return applyFaceRotation(state, move.face, direction);

    case MoveType.SLICE:
    case MoveType.SLICE_INVERSE:
    case MoveType.SLICE_DOUBLE:
      if (move.face === undefined || move.sliceIndex === undefined) {
        throw new Error("Face and sliceIndex must be defined for slice moves");
      }
      const sliceDirection =
        move.type === MoveType.SLICE
          ? 1
          : move.type === MoveType.SLICE_INVERSE
          ? -1
          : 2;

      let sliceAxis: "x" | "y" | "z";
      if (move.face === Face.LEFT || move.face === Face.RIGHT) {
        sliceAxis = "x";
      } else if (move.face === Face.UP || move.face === Face.DOWN) {
        sliceAxis = "y";
      } else {
        sliceAxis = "z";
      }

      return applySliceMove(state, move.sliceIndex, sliceAxis, sliceDirection);

    case MoveType.ROTATE_X:
    case MoveType.ROTATE_Y:
    case MoveType.ROTATE_Z:
      if (move.rotationDirection === undefined) {
        throw new Error(
          "rotationDirection must be defined for whole cube rotation"
        );
      }

      let rotationAxis: "x" | "y" | "z";
      if (move.type === MoveType.ROTATE_X) {
        rotationAxis = "x";
      } else if (move.type === MoveType.ROTATE_Y) {
        rotationAxis = "y";
      } else {
        rotationAxis = "z";
      }

      return applyWholeRotation(state, rotationAxis, move.rotationDirection);

    default:
      throw new Error(`Unknown move type: ${move.type}`);
  }
}

// Convert a move to standard notation
export function moveToNotation(move: Move, size: number): string {
  if (
    move.type === MoveType.FACE_CLOCKWISE ||
    move.type === MoveType.FACE_COUNTER_CLOCKWISE ||
    move.type === MoveType.FACE_DOUBLE
  ) {
    if (move.face === undefined) {
      throw new Error("Face must be defined for face rotation moves");
    }

    let faceChar = "";
    switch (move.face) {
      case Face.UP:
        faceChar = "U";
        break;
      case Face.DOWN:
        faceChar = "D";
        break;
      case Face.FRONT:
        faceChar = "F";
        break;
      case Face.BACK:
        faceChar = "B";
        break;
      case Face.RIGHT:
        faceChar = "R";
        break;
      case Face.LEFT:
        faceChar = "L";
        break;
    }

    let suffix = "";
    if (move.type === MoveType.FACE_COUNTER_CLOCKWISE) {
      suffix = "'";
    } else if (move.type === MoveType.FACE_DOUBLE) {
      suffix = "2";
    }

    return faceChar + suffix;
  }

  if (
    move.type === MoveType.SLICE ||
    move.type === MoveType.SLICE_INVERSE ||
    move.type === MoveType.SLICE_DOUBLE
  ) {
    if (move.face === undefined || move.sliceIndex === undefined) {
      throw new Error("Face and sliceIndex must be defined for slice moves");
    }

    // For 3x3 cube, use standard slice notation
    if (size === 3 && move.sliceIndex === 1) {
      let sliceChar = "";
      if (move.face === Face.LEFT || move.face === Face.RIGHT) {
        sliceChar = "M"; // Middle slice (between L and R)
      } else if (move.face === Face.UP || move.face === Face.DOWN) {
        sliceChar = "E"; // Equatorial slice (between U and D)
      } else {
        sliceChar = "S"; // Standing slice (between F and B)
      }

      let suffix = "";
      if (move.type === MoveType.SLICE_INVERSE) {
        suffix = "'";
      } else if (move.type === MoveType.SLICE_DOUBLE) {
        suffix = "2";
      }

      return sliceChar + suffix;
    }

    // For larger cubes, use more specific notation
    let faceChar = "";
    switch (move.face) {
      case Face.UP:
        faceChar = "U";
        break;
      case Face.DOWN:
        faceChar = "D";
        break;
      case Face.FRONT:
        faceChar = "F";
        break;
      case Face.BACK:
        faceChar = "B";
        break;
      case Face.RIGHT:
        faceChar = "R";
        break;
      case Face.LEFT:
        faceChar = "L";
        break;
    }

    let suffix = "";
    if (move.type === MoveType.SLICE_INVERSE) {
      suffix = "'";
    } else if (move.type === MoveType.SLICE_DOUBLE) {
      suffix = "2";
    }

    return `${move.sliceIndex + 1}${faceChar}${suffix}`;
  }

  if (
    move.type === MoveType.ROTATE_X ||
    move.type === MoveType.ROTATE_Y ||
    move.type === MoveType.ROTATE_Z
  ) {
    if (move.rotationDirection === undefined) {
      throw new Error(
        "rotationDirection must be defined for whole cube rotation"
      );
    }

    let rotChar = "";
    if (move.type === MoveType.ROTATE_X) {
      rotChar = "x";
    } else if (move.type === MoveType.ROTATE_Y) {
      rotChar = "y";
    } else {
      rotChar = "z";
    }

    let suffix = "";
    if (move.rotationDirection === -1) {
      suffix = "'";
    } else if (move.rotationDirection === 2) {
      suffix = "2";
    }

    return rotChar + suffix;
  }

  throw new Error(`Unknown move type: ${move.type}`);
}

// Parse a notation string to a move
export function notationToMove(notation: string, size: number): Move {
  // Handle whole cube rotations
  if (
    notation.startsWith("x") ||
    notation.startsWith("y") ||
    notation.startsWith("z")
  ) {
    const axis = notation[0];
    let rotationType: MoveType;
    let direction: 1 | -1 | 2 = 1;

    if (axis === "x") {
      rotationType = MoveType.ROTATE_X;
    } else if (axis === "y") {
      rotationType = MoveType.ROTATE_Y;
    } else {
      rotationType = MoveType.ROTATE_Z;
    }

    if (notation.length > 1) {
      if (notation[1] === "'") {
        direction = -1;
      } else if (notation[1] === "2") {
        direction = 2;
      }
    }

    return {
      type: rotationType,
      rotationDirection: direction,
    };
  }

  // Handle standard slice moves
  if (
    notation.startsWith("M") ||
    notation.startsWith("E") ||
    notation.startsWith("S")
  ) {
    const sliceType = notation[0];
    let face: Face;
    let sliceIndex = 1; // Middle slice for 3x3
    let moveType: MoveType = MoveType.SLICE;

    if (sliceType === "M") {
      face = Face.LEFT; // Middle slice is between L and R
    } else if (sliceType === "E") {
      face = Face.DOWN; // Equatorial slice is between U and D
    } else {
      face = Face.FRONT; // Standing slice is between F and B
    }

    if (notation.length > 1) {
      if (notation[1] === "'") {
        moveType = MoveType.SLICE_INVERSE;
      } else if (notation[1] === "2") {
        moveType = MoveType.SLICE_DOUBLE;
      }
    }

    return {
      type: moveType,
      face,
      sliceIndex,
    };
  }

  // Handle face moves and specific slice moves for larger cubes
  let faceChar: string;
  let sliceIndex: number | undefined;
  let moveType: MoveType = MoveType.FACE_CLOCKWISE;

  // Check if it's a specific slice move for larger cubes
  const match = notation.match(/^(\d+)([UDFBRL])('|2)?$/);
  if (match) {
    sliceIndex = parseInt(match[1]) - 1;
    faceChar = match[2];

    // Fixed: Validate slice index against cube size
    if (sliceIndex >= size) {
      throw new Error(
        `Invalid slice index ${sliceIndex + 1} for cube size ${size}`
      );
    }

    if (match[3] === "'") {
      moveType = MoveType.SLICE_INVERSE;
    } else if (match[3] === "2") {
      moveType = MoveType.SLICE_DOUBLE;
    } else {
      moveType = MoveType.SLICE;
    }
  } else {
    // It's a standard face move
    faceChar = notation[0];

    if (notation.length > 1) {
      if (notation[1] === "'") {
        moveType = MoveType.FACE_COUNTER_CLOCKWISE;
      } else if (notation[1] === "2") {
        moveType = MoveType.FACE_DOUBLE;
      }
    }
  }

  // Convert face character to Face enum
  let face: Face;
  switch (faceChar) {
    case "U":
      face = Face.UP;
      break;
    case "D":
      face = Face.DOWN;
      break;
    case "F":
      face = Face.FRONT;
      break;
    case "B":
      face = Face.BACK;
      break;
    case "R":
      face = Face.RIGHT;
      break;
    case "L":
      face = Face.LEFT;
      break;
    default:
      throw new Error(`Unknown face: ${faceChar}`);
  }

  if (sliceIndex !== undefined) {
    return {
      type: moveType,
      face,
      sliceIndex,
    };
  } else {
    return {
      type: moveType,
      face,
    };
  }
}

// Generate a random move
function generateRandomMove(size: number): Move {
  const faces = [
    Face.UP,
    Face.DOWN,
    Face.FRONT,
    Face.BACK,
    Face.RIGHT,
    Face.LEFT,
  ];

  // Fixed: Include all move types for better scrambles
  const moveTypes = [
    MoveType.FACE_CLOCKWISE,
    MoveType.FACE_COUNTER_CLOCKWISE,
    MoveType.FACE_DOUBLE,
  ];

  // Include slice moves and whole cube rotations for larger cubes
  if (size > 2) {
    moveTypes.push(
      MoveType.SLICE,
      MoveType.SLICE_INVERSE,
      MoveType.SLICE_DOUBLE
    );
  }

  // Randomly select a move type
  const randomIndex = Math.floor(Math.random() * moveTypes.length);
  const randomMoveType = moveTypes[randomIndex];

  if (randomMoveType === MoveType.SLICE) {
    const sliceIndex = Math.floor(Math.random() * (size - 1));
    return {
      type: randomMoveType,
      face: faces[Math.floor(Math.random() * faces.length)],
      sliceIndex,
    };
  } else if (
    randomMoveType === MoveType.ROTATE_X ||
    randomMoveType === MoveType.ROTATE_Y ||
    randomMoveType === MoveType.ROTATE_Z
  ) {
    const direction = Math.floor(Math.random() * 3) + 1;
    return {
      type: randomMoveType,
      rotationDirection: direction as 1 | -1 | 2,
    };
  }

  return {
    type: randomMoveType,
    face: faces[Math.floor(Math.random() * faces.length)],
  };
}

// Generate a random scramble
export function scrambleCube(size: number, length: number): Move[] {
  const scramble: Move[] = [];
  for (let i = 0; i < length; i++) {
    scramble.push(generateRandomMove(size));
  }
  return scramble;
}
