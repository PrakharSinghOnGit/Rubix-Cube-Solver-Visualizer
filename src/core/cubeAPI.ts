// cube.ts - TypeScript client for Rubiks Cube API
import { CubeType, SolverType } from "../types/types";
import { Moves } from "./Moves";
export interface CubeState {
  cube_id: string;
  state: string;
  solved: boolean;
  size: number;
  appliedMoves?: string[];
}

export interface CubeResponse {
  success: boolean;
  cube_id?: string;
  state?: string;
  solved?: boolean;
  size?: number;
  moves_applied?: string[];
  kociemba_string?: string;
  solution?: string[];
  solution_length?: number;
  original_state?: string;
  solved_state?: string;
  cube_display?: string;
  error?: string;
  message?: string;
}

export interface CubeInfo {
  cube_id: string;
  size: number;
  solved: boolean;
  state: string;
}

export interface CubeListResponse {
  success: boolean;
  cubes: CubeInfo[];
  total_cubes: number;
  error?: string;
}

export interface HealthResponse {
  status: string;
  active_cubes: number;
  supported_sizes: string;
}

export interface SolveResult {
  solution: string[];
  solution_length: number;
  original_state: string;
  solved_state: string;
  solved: boolean;
}

export type CubeMove = string;

export class CubeAPI {
  private baseUrl: string;

  constructor(baseUrl: string = "http://localhost:5175") {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Network error" }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async createCube(
    size: number = 3,
    state?: string,
    order?: string,
    colormap?: string
  ): Promise<CubeState> {
    const body: {
      size: number;
      state?: string;
      order?: string;
      colormap?: string;
    } = { size };
    if (state) body.state = state;
    if (order) body.order = order;
    if (colormap) body.colormap = colormap;

    const response = await this.request<CubeResponse>("/cube", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!response.success || !response.cube_id) {
      throw new Error(response.error || "Failed to create cube");
    }

    return {
      cube_id: response.cube_id,
      state: response.state || "",
      solved: response.solved || false,
      size: response.size || size,
    };
  }

  async getCubeState(cubeId: string): Promise<CubeState> {
    const response = await this.request<CubeResponse>(`/cube/${cubeId}`);

    if (!response.success) {
      throw new Error(response.error || "Failed to get cube state");
    }

    return {
      cube_id: cubeId,
      state: response.state || "",
      solved: response.solved || false,
      size: response.size || 3,
    };
  }

  async rotateCube(
    cubeId: string,
    moves: CubeMove | CubeMove[]
  ): Promise<CubeState> {
    const movesArray = Array.isArray(moves) ? moves : [moves];

    const response = await this.request<CubeResponse>(
      `/cube/${cubeId}/rotate`,
      {
        method: "POST",
        body: JSON.stringify({ moves: movesArray }),
      }
    );

    if (!response.success) {
      throw new Error(response.error || "Failed to rotate cube");
    }

    return {
      cube_id: cubeId,
      state: response.state || "",
      solved: response.solved || false,
      size: response.size || 3,
    };
  }

  async solveCube(cubeId: string, type: SolverType): Promise<SolveResult> {
    const body: { type: SolverType } = { type: type };
    const response = await this.request<CubeResponse>(`/cube/${cubeId}/solve`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!response.success) {
      throw new Error(response.error || "Failed to solve cube");
    }

    return {
      solution: response.solution || [],
      solution_length: response.solution_length || 0,
      original_state: response.original_state || "",
      solved_state: response.solved_state || "",
      solved: response.solved || false,
    };
  }

  async resetCube(cubeId: string): Promise<CubeState> {
    const response = await this.request<CubeResponse>(`/cube/${cubeId}/reset`, {
      method: "POST",
    });

    if (!response.success) {
      throw new Error(response.error || "Failed to reset cube");
    }

    return {
      cube_id: cubeId,
      state: response.state || "",
      solved: response.solved || false,
      size: response.size || 3,
    };
  }

  async getKociembaString(cubeId: string): Promise<string> {
    const response = await this.request<CubeResponse>(
      `/cube/${cubeId}/kociemba`
    );

    if (!response.success) {
      throw new Error(response.error || "Failed to get kociemba string");
    }

    return response.kociemba_string || "";
  }

  async listCubes(): Promise<CubeInfo[]> {
    const response = await this.request<CubeListResponse>("/cubes");

    if (!response.success) {
      throw new Error(response.error || "Failed to list cubes");
    }

    return response.cubes || [];
  }

  async deleteCube(cubeId: string): Promise<boolean> {
    const response = await this.request<CubeResponse>(`/cube/${cubeId}`, {
      method: "DELETE",
    });

    return response.success || false;
  }

  async healthCheck(): Promise<HealthResponse> {
    const response = await this.request<HealthResponse>("/health");
    return response;
  }
}

export class Cube {
  private api: CubeAPI;
  private cubeId: string | null = null;
  private _size: number;
  private _state: string = "";
  private _solved: boolean = false;

  constructor(size: number = 3, apiBaseUrl?: string) {
    this.api = new CubeAPI(apiBaseUrl);
    this._size = size;
  }

  // Initialize the cube (creates it on the server)
  async init(
    size: number,
    state?: string,
    order?: string,
    colormap?: string
  ): Promise<void> {
    const cubeState = await this.api.createCube(size, state, order, colormap);
    this.cubeId = cubeState.cube_id;
    this._state = cubeState.state;
    this._solved = cubeState.solved;
  }

  private ensureInitialized(): void {
    if (!this.cubeId) {
      throw new Error("Cube not initialized. Call init() first.");
    }
  }

  static async create(
    size: number = 3,
    state?: string,
    apiBaseUrl?: string,
    order?: string,
    colormap?: string
  ): Promise<Cube> {
    const cube = new Cube(size, apiBaseUrl);
    await cube.init(size, state, order, colormap);
    return cube;
  }

  async rotate(moves: CubeMove | CubeMove[]): Promise<void> {
    this.ensureInitialized();
    const cubeState = await this.api.rotateCube(this.cubeId!, moves);
    this._state = cubeState.state;
    this._solved = cubeState.solved;
  }

  async solve(type: SolverType): Promise<SolveResult> {
    this.ensureInitialized();
    const result = await this.api.solveCube(this.cubeId!, type);
    await this.refresh();
    return result;
  }

  async reset(): Promise<void> {
    this.ensureInitialized();
    const cubeState = await this.api.resetCube(this.cubeId!);
    this._state = cubeState.state;
    this._solved = cubeState.solved;
  }

  async getKociembaString(): Promise<string> {
    this.ensureInitialized();
    return await this.api.getKociembaString(this.cubeId!);
  }

  async refresh(): Promise<void> {
    this.ensureInitialized();
    const cubeState = await this.api.getCubeState(this.cubeId!);
    this._state = cubeState.state;
    this._solved = cubeState.solved;
  }

  async destroy(): Promise<void> {
    if (this.cubeId) {
      await this.api.deleteCube(this.cubeId);
      this.cubeId = null;
    }
  }

  generateRandomMoves(length: number = 20): string[] {
    const moves: CubeMove[] = [];
    const validMoves = Moves[this.size];
    for (let i = 0; i < length; i++) {
      const randomMove =
        validMoves[Math.floor(Math.random() * validMoves.length)];
      moves.push(randomMove);
    }
    return moves;
  }

  async scramble(length: number = 20): Promise<string[]> {
    const moves = this.generateRandomMoves(length);
    await this.rotate(moves);
    return moves;
  }

  private splitIntoChunks(str: string, chunkSize: number): string[] {
    const result: string[] = [];
    for (let i = 0; i < str.length; i += chunkSize) {
      result.push(str.slice(i, i + chunkSize));
    }
    return result;
  }

  private stringToMatrix(str: string, size: number): string[][] {
    const matrix: string[][] = [];
    for (let i = 0; i < size; i++) {
      matrix.push([]);
      for (let j = 0; j < size; j++) {
        matrix[i].push(str[i * size + j]);
      }
    }
    return matrix;
  }

  private rotateMatrix(mat: string[][], clockwise: boolean): string[][] {
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

  parseKociembaFormat(): CubeType {
    const faceSize = this.size * this.size;

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
      u: this.state.slice(0, faceSize), // Up
      r: this.state.slice(faceSize, faceSize * 2), // Right
      f: this.state.slice(faceSize * 2, faceSize * 3), // Front
      d: this.state.slice(faceSize * 3, faceSize * 4), // Down
      l: this.state.slice(faceSize * 4, faceSize * 5), // Left
      b: this.state.slice(faceSize * 5, faceSize * 6), // Back
    };

    // Convert face letters to color letters
    const convertToColors = (faceString: string) =>
      faceString
        .split("")
        .map((letter) => faceToColor[letter] || letter)
        .join("");

    return {
      u: this.rotateMatrix(
        this.stringToMatrix(convertToColors(faces.u), this.size),
        true
      ),
      r: this.rotateMatrix(
        this.stringToMatrix(convertToColors(faces.r), this.size),
        true
      ),
      f: this.rotateMatrix(
        this.stringToMatrix(convertToColors(faces.f), this.size),
        true
      ),
      d: this.rotateMatrix(
        this.stringToMatrix(convertToColors(faces.d), this.size),
        true
      ),
      l: this.rotateMatrix(
        this.stringToMatrix(convertToColors(faces.l), this.size),
        true
      ),
      b: this.rotateMatrix(
        this.stringToMatrix(convertToColors(faces.b), this.size),
        true
      ),
      size: this.size,
    };
  }

  print(): void {
    const faceToColor: Record<string, string> = {
      U: "w", // Up = White
      R: "r", // Right = Red
      F: "g", // Front = Green
      D: "y", // Down = Yellow
      L: "o", // Left = Orange
      B: "b", // Back = Blue
    };
    let colorState = "";
    for (let i = 0; i < this.state.length; i++) {
      const faceLetter = this.state.charAt(i);
      colorState += faceToColor[faceLetter];
    }
    const rows = this.splitIntoChunks(colorState, this.size);
    console.log("--------------------------");
    for (let i = 0; i < this.size; i++) {
      console.log(" ".repeat(this.size), rows[i]);
    }
    for (let i = 0; i < this.size; i++) {
      console.log(
        rows[this._size * 4 + i],
        rows[this._size * 2 + i],
        rows[this._size * 1 + i],
        rows[this._size * 5 + i]
      );
    }
    for (let i = 0; i < this.size; i++) {
      console.log(
        " ".repeat(this.size),
        rows[this._size * 3 + i].split("").reverse().join("")
      );
    }
  }

  // Getters
  get size(): number {
    return this._size;
  }

  get state(): string {
    return this._state;
  }

  get solved(): boolean {
    return this._solved;
  }

  get id(): string | null {
    return this.cubeId;
  }

  get initialized(): boolean {
    return this.cubeId !== null;
  }
}

// Utility functions for common cube operations
export class CubeUtils {
  static parseAlgorithm(algorithm: string): CubeMove[] {
    // Parse space-separated moves, handling moves like R', U2, Rw, etc.
    return algorithm
      .trim()
      .split(/\s+/)
      .filter((move) => move.length > 0);
  }

  static reverseAlgorithm(moves: CubeMove[]): CubeMove[] {
    return moves
      .slice()
      .reverse()
      .map((move) => {
        if (move.endsWith("'")) {
          return move.slice(0, -1);
        } else if (move.endsWith("2")) {
          return move;
        } else {
          return move + "'";
        }
      });
  }

  static formatAlgorithm(moves: CubeMove[]): string {
    return moves.join(" ");
  }

  static async createMultipleCubes(
    count: number,
    size: number = 3,
    apiBaseUrl?: string
  ): Promise<Cube[]> {
    const cubes: Cube[] = [];
    for (let i = 0; i < count; i++) {
      const cube = await Cube.create(size, undefined, apiBaseUrl);
      cubes.push(cube);
    }
    return cubes;
  }

  static async destroyMultipleCubes(cubes: Cube[]): Promise<void> {
    await Promise.all(cubes.map((cube) => cube.destroy()));
  }
}

export const COMMON_ALGORITHMS = {
  // 3x3x3 algorithms
  "3x3": {
    "Sexy Move": "R U R' U'",
    Sledgehammer: "R' F R F'",
    "T-Perm": "R U R' F' R U R' U' R' F R2 U' R'",
    "Y-Perm": "R U' R' F R F' R U R' F' R U R' U' R' F R F'",
  },
  // 2x2x2 algorithms
  "2x2": {
    "Ortega OLL": "R U R' F' R U R' U' R' F R2 U' R'",
    "CLL T": "R U R' F' R U R' U' R' F R F R F'",
  },
};

export default Cube;
