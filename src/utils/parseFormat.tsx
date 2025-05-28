import { CubeType } from "../types/types";

function stringToMatrix(str: string, size: number): string[][] {
  const matrix: string[][] = [];
  for (let i = 0; i < size; i++) {
    matrix.push([]);
    for (let j = 0; j < size; j++) {
      matrix[i].push(str[i * size + j]);
    }
  }
  return matrix;
}

function rotateMatrix(mat: string[][], clockwise: boolean): string[][] {
  const n = mat.length;
  const res: string[][] = Array.from({ length: n }, () => Array(n).fill(""));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (clockwise) {
        res[j][n - 1 - i] = mat[i][j];
      } else {
        res[n - 1 - j][i] = mat[i][j];
      }
    }
  }

  return res;
}

export default function parseKociembaFormat(state: string): CubeType {
  const size = Math.sqrt(state.length / 6);

  const faceSize = size * size;

  // Map Kociemba face letters to color letters
  const faceToColor: Record<string, string> = {
    U: "w", // Up = White
    R: "r", // Right = Red
    F: "g", // Front = Green
    D: "y", // Down = Yellow
    L: "o", // Left = Orange
    B: "b", // Back = Blue
  };

  const faces = {
    u: state.slice(0, faceSize), // Up
    r: state.slice(faceSize, faceSize * 2), // Right
    f: state.slice(faceSize * 2, faceSize * 3), // Front
    d: state.slice(faceSize * 3, faceSize * 4), // Down
    l: state.slice(faceSize * 4, faceSize * 5), // Left
    b: state.slice(faceSize * 5, faceSize * 6), // Back
  };

  // Convert face letters to color letters
  const convertToColors = (faceString: string) =>
    faceString
      .split("")
      .map((letter) => faceToColor[letter] || letter)
      .join("");

  return {
    u: rotateMatrix(stringToMatrix(convertToColors(faces.u), size), true),
    r: rotateMatrix(stringToMatrix(convertToColors(faces.r), size), true),
    f: rotateMatrix(stringToMatrix(convertToColors(faces.f), size), true),
    d: rotateMatrix(stringToMatrix(convertToColors(faces.d), size), true),
    l: rotateMatrix(stringToMatrix(convertToColors(faces.l), size), true),
    b: rotateMatrix(stringToMatrix(convertToColors(faces.b), size), true),
    size: size,
  };
}
