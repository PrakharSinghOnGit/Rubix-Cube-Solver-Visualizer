// src/index.js
import "../public/styles.css";
import { initCube } from "./visualization/cube";
import { scrambleCube } from "./visualization/cube";
// import { setupEventListeners } from "./utils/eventHandlers";

document.addEventListener("DOMContentLoaded", () => {
  console.log("Rubik's Cube Solver Application Initialized");

  // Initialize the 3D cube visualization
  initCube();
  scrambleCube(1);

  // Setup event listeners for UI controls
  // setupEventListeners();
});
