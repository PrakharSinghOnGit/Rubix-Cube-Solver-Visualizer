import { getCube } from "../visualization/cube.js";
import { BruteForceAlgorithm } from "./bruteForce.js";
import { LayerByLayerAlgorithm } from "./layerByLayer.js";
import { KociembaAlgorithm } from "./kociemba.js";
import { ThistlethwaiteAlgorithm } from "./thistlethwaite.js";
import { NeuralNetworkAlgorithm } from "./neuralNetwork.js";

/**
 * Solve the cube using the specified algorithm
 * @param {string} algorithm - The algorithm to use
 * @param {number} size - The size of the cube
 * @returns {Promise<Object>} - The solution { moves, time, algorithm }
 */
export async function solveCube(algorithm, size) {
  const cube = getCube();

  if (cube.isSolved()) {
    console.log("Cube is already solved");
    return { moves: [], time: 0, algorithm };
  }

  // Get the current state of the cube
  const state = cube.getState();

  // Start timing
  const startTime = performance.now();

  // Solve the cube using the specified algorithm
  let solution;

  switch (algorithm) {
    case "brute-force":
      if (size > 2) {
        throw new Error(
          "Brute force algorithm is only available for 2x2 cubes"
        );
      }
      solution = await BruteForceAlgorithm.solve(state, size);
      break;
    case "lbl":
      solution = await LayerByLayerAlgorithm.solve(state, size);
      break;
    case "kociemba":
      solution = await KociembaAlgorithm.solve(state, size);
      break;
    case "thistlethwaite":
      solution = await ThistlethwaiteAlgorithm.solve(state, size);
      break;
    case "neural-network":
      solution = await NeuralNetworkAlgorithm.solve(state, size);
      break;
    default:
      throw new Error(`Unknown algorithm: ${algorithm}`);
  }

  // End timing
  const endTime = performance.now();
  const time = endTime - startTime;

  console.log(
    `Solved using ${algorithm} in ${time.toFixed(2)}ms with ${
      solution.length
    } moves`
  );

  return {
    moves: solution,
    time,
    algorithm,
  };
}
