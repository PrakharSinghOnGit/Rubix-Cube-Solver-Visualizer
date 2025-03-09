import {
  createCube,
  scrambleCube,
  resetCube,
  applyMoves,
} from "../visualization/cube.js";
import { solveCube } from "../algorithms/solver.js";
import { runBenchmark } from "../benchmarking/benchmarks.js";

/**
 * Set up event listeners for UI controls
 */
export function setupEventListeners() {
  // Cube size selector
  const cubeSizeSelector = document.getElementById("cube-size");
  cubeSizeSelector.addEventListener("change", (event) => {
    const size = parseInt(event.target.value);
    createCube(size);

    // Disable brute force for cubes larger than 2x2
    const algorithmSelector = document.getElementById("algorithm");
    const bruteForceOption = algorithmSelector.querySelector(
      'option[value="brute-force"]'
    );

    if (size > 2) {
      bruteForceOption.disabled = true;
      if (algorithmSelector.value === "brute-force") {
        algorithmSelector.value = "lbl";
      }
    } else {
      bruteForceOption.disabled = false;
    }
  });

  // Algorithm selector
  const algorithmSelector = document.getElementById("algorithm");
  algorithmSelector.addEventListener("change", (event) => {
    // No immediate action needed, the selected algorithm will be used when solving
  });

  // Scramble button
  const scrambleBtn = document.getElementById("scramble-btn");
  scrambleBtn.addEventListener("click", () => {
    const size = parseInt(cubeSizeSelector.value);
    // More scramble moves for larger cubes
    const moveCount = size * 10;
    scrambleCube(moveCount);
  });

  // Solve button
  const solveBtn = document.getElementById("solve-btn");
  solveBtn.addEventListener("click", async () => {
    const algorithm = algorithmSelector.value;
    const size = parseInt(cubeSizeSelector.value);

    // Disable the solve button while solving
    solveBtn.disabled = true;
    solveBtn.textContent = "Solving...";

    try {
      // Solve the cube using the selected algorithm
      const solution = await solveCube(algorithm, size);

      // Apply the solution moves
      if (solution && solution.moves.length > 0) {
        applyMoves(solution.moves);
      }
    } catch (error) {
      console.error("Error solving cube:", error);
      alert(`Error solving cube: ${error.message}`);
    } finally {
      // Re-enable the solve button
      solveBtn.disabled = false;
      solveBtn.textContent = "Solve";
    }
  });

  // Reset button
  const resetBtn = document.getElementById("reset-btn");
  resetBtn.addEventListener("click", () => {
    resetCube();
  });

  // Playback controls
  const prevStepBtn = document.getElementById("prev-step");
  const playPauseBtn = document.getElementById("play-pause");
  const nextStepBtn = document.getElementById("next-step");
  const playbackSpeedSlider = document.getElementById("playback-speed");

  let playbackInterval = null;
  let currentStep = 0;

  prevStepBtn.addEventListener("click", () => {
    // Stop any ongoing playback
    stopPlayback();

    // Go to the previous step
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  });

  playPauseBtn.addEventListener("click", () => {
    if (playbackInterval) {
      // Pause playback
      stopPlayback();
      playPauseBtn.textContent = "Play";
    } else {
      // Start playback
      startPlayback();
      playPauseBtn.textContent = "Pause";
    }
  });

  nextStepBtn.addEventListener("click", () => {
    // Stop any ongoing playback
    stopPlayback();

    // Go to the next step
    const solutionSteps = document.querySelectorAll(
      "#solution-steps-container ol li"
    );
    if (currentStep < solutionSteps.length - 1) {
      currentStep++;
      showStep(currentStep);
    }
  });

  playbackSpeedSlider.addEventListener("input", () => {
    // Update playback speed if playback is active
    if (playbackInterval) {
      stopPlayback();
      startPlayback();
    }
  });

  function startPlayback() {
    const solutionSteps = document.querySelectorAll(
      "#solution-steps-container ol li"
    );
    if (solutionSteps.length === 0) return;

    // Calculate the interval based on the speed slider
    const speed = parseInt(playbackSpeedSlider.value);
    const interval = 1000 / speed;

    playbackInterval = setInterval(() => {
      if (currentStep < solutionSteps.length - 1) {
        currentStep++;
        showStep(currentStep);
      } else {
        // Stop playback when we reach the end
        stopPlayback();
        playPauseBtn.textContent = "Play";
      }
    }, interval);
  }

  function stopPlayback() {
    if (playbackInterval) {
      clearInterval(playbackInterval);
      playbackInterval = null;
    }
  }

  function showStep(stepIndex) {
    const solutionSteps = document.querySelectorAll(
      "#solution-steps-container ol li"
    );

    // Highlight the current step
    solutionSteps.forEach((step, index) => {
      if (index === stepIndex) {
        step.classList.add("current-step");
      } else {
        step.classList.remove("current-step");
      }
    });

    // Scroll to the current step
    solutionSteps[stepIndex].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }

  // Benchmark controls
  const runBenchmarkBtn = document.getElementById("run-benchmark");
  runBenchmarkBtn.addEventListener("click", async () => {
    const benchmarkCubeSize = parseInt(
      document.getElementById("benchmark-cube-size").value
    );
    const benchmarkScrambleCount = parseInt(
      document.getElementById("benchmark-scramble-count").value
    );

    // Disable the button while benchmarking
    runBenchmarkBtn.disabled = true;
    runBenchmarkBtn.textContent = "Running Benchmark...";

    try {
      // Run the benchmark
      await runBenchmark(benchmarkCubeSize, benchmarkScrambleCount);
    } catch (error) {
      console.error("Error running benchmark:", error);
      alert(`Error running benchmark: ${error.message}`);
    } finally {
      // Re-enable the button
      runBenchmarkBtn.disabled = false;
      runBenchmarkBtn.textContent = "Run Benchmark";
    }
  });
}
