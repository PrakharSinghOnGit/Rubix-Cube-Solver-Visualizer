import "../public/styles.css";
import { initCube } from "./visualization/cube.js";
import { initBenchmarks } from "./benchmarking/benchmarks.js";
import { setupEventListeners } from "./utils/eventHandlers.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("Rubik's Cube Solver Application Initialized");

  // Initialize the 3D cube visualization
  initCube();

  // Initialize the benchmarking system
  initBenchmarks();

  // Setup event listeners for UI controls
  setupEventListeners();
});
