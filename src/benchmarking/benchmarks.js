import { RubiksCube } from "../core/cube.js";
import { BruteForceAlgorithm } from "../algorithms/bruteForce.js";
import { LayerByLayerAlgorithm } from "../algorithms/layerByLayer.js";
import { KociembaAlgorithm } from "../algorithms/kociemba.js";
import { ThistlethwaiteAlgorithm } from "../algorithms/thistlethwaite.js";
import { NeuralNetworkAlgorithm } from "../algorithms/neuralNetwork.js";
import Chart from "chart.js/auto";

// Global variables for charts
let timeChart, movesChart;

/**
 * Initialize the benchmarking system
 */
export function initBenchmarks() {
  // Initialize the time chart
  const timeChartCtx = document.getElementById("time-chart").getContext("2d");
  timeChart = new Chart(timeChartCtx, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "Average Time (ms)",
          data: [],
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Time (ms)",
          },
        },
        x: {
          title: {
            display: true,
            text: "Algorithm",
          },
        },
      },
    },
  });

  // Initialize the moves chart
  const movesChartCtx = document.getElementById("moves-chart").getContext("2d");
  movesChart = new Chart(movesChartCtx, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "Average Moves",
          data: [],
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Moves",
          },
        },
        x: {
          title: {
            display: true,
            text: "Algorithm",
          },
        },
      },
    },
  });
}

/**
 * Run a benchmark for the specified cube size and scramble count
 * @param {number} cubeSize - The size of the cube
 * @param {number} scrambleCount - The number of scrambles to perform
 */
export async function runBenchmark(cubeSize, scrambleCount) {
  console.log(
    `Running benchmark for ${cubeSize}x${cubeSize} cube with ${scrambleCount} scrambles`
  );

  // Define the algorithms to benchmark
  const algorithms = [
    { name: "Layer-by-Layer", solver: LayerByLayerAlgorithm, enabled: true },
    { name: "Kociemba", solver: KociembaAlgorithm, enabled: true },
    { name: "Thistlethwaite", solver: ThistlethwaiteAlgorithm, enabled: true },
    { name: "Neural Network", solver: NeuralNetworkAlgorithm, enabled: true },
  ];

  // Add Brute Force only for 2x2 cubes
  if (cubeSize === 2) {
    algorithms.unshift({
      name: "Brute Force",
      solver: BruteForceAlgorithm,
      enabled: true,
    });
  }

  // Results for each algorithm
  const results = [];

  // Run the benchmark for each algorithm
  for (const algorithm of algorithms) {
    if (!algorithm.enabled) continue;

    try {
      const result = await benchmarkAlgorithm(
        algorithm.name,
        algorithm.solver,
        cubeSize,
        scrambleCount
      );
      results.push(result);
    } catch (error) {
      console.error(`Error benchmarking ${algorithm.name}:`, error);
      results.push({
        name: algorithm.name,
        avgTime: 0,
        avgMoves: 0,
        successRate: 0,
      });
    }
  }

  // Update the charts
  updateCharts(results);

  // Update the table
  updateTable(results);

  return results;
}

/**
 * Benchmark a specific algorithm
 * @param {string} name - The name of the algorithm
 * @param {Object} solver - The solver class
 * @param {number} cubeSize - The size of the cube
 * @param {number} scrambleCount - The number of scrambles to perform
 * @returns {Object} - The benchmark results
 */
async function benchmarkAlgorithm(name, solver, cubeSize, scrambleCount) {
  console.log(`Benchmarking ${name}...`);

  // Create a new cube
  const cube = new RubiksCube(cubeSize);

  // Results
  const times = [];
  const moveCounts = [];
  let successCount = 0;

  // Run the benchmark for each scramble
  for (let i = 0; i < scrambleCount; i++) {
    try {
      // Reset the cube
      cube.reset();

      // Scramble the cube
      const scrambleMoves = cube.scramble(20);

      // Get the current state
      const state = cube.getState();

      // Start timing
      const startTime = performance.now();

      // Solve the cube
      const solution = await solver.solve(state, cubeSize);

      // End timing
      const endTime = performance.now();
      const time = endTime - startTime;

      // Record the results
      times.push(time);
      moveCounts.push(solution.length);
      successCount++;

      console.log(
        `Scramble ${i + 1}/${scrambleCount}: Solved in ${time.toFixed(
          2
        )}ms with ${solution.length} moves`
      );
    } catch (error) {
      console.error(`Error solving scramble ${i + 1}/${scrambleCount}:`, error);
    }
  }

  // Calculate the average time and moves
  const avgTime =
    times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  const avgMoves =
    moveCounts.length > 0
      ? moveCounts.reduce((a, b) => a + b, 0) / moveCounts.length
      : 0;
  const successRate = (successCount / scrambleCount) * 100;

  console.log(
    `${name} results: Avg Time: ${avgTime.toFixed(
      2
    )}ms, Avg Moves: ${avgMoves.toFixed(
      2
    )}, Success Rate: ${successRate.toFixed(2)}%`
  );

  return {
    name,
    avgTime,
    avgMoves,
    successRate,
  };
}

/**
 * Update the charts with the benchmark results
 * @param {Array} results - The benchmark results
 */
function updateCharts(results) {
  // Update the time chart
  timeChart.data.labels = results.map((result) => result.name);
  timeChart.data.datasets[0].data = results.map((result) => result.avgTime);
  timeChart.update();

  // Update the moves chart
  movesChart.data.labels = results.map((result) => result.name);
  movesChart.data.datasets[0].data = results.map((result) => result.avgMoves);
  movesChart.update();
}

/**
 * Update the table with the benchmark results
 * @param {Array} results - The benchmark results
 */
function updateTable(results) {
  const tableBody = document.querySelector("#benchmark-table tbody");

  // Clear the table
  tableBody.innerHTML = "";

  // Add the results to the table
  for (const result of results) {
    const row = document.createElement("tr");

    // Algorithm name
    const nameCell = document.createElement("td");
    nameCell.textContent = result.name;
    row.appendChild(nameCell);

    // Average time
    const timeCell = document.createElement("td");
    timeCell.textContent = result.avgTime.toFixed(2);
    row.appendChild(timeCell);

    // Average moves
    const movesCell = document.createElement("td");
    movesCell.textContent = result.avgMoves.toFixed(2);
    row.appendChild(movesCell);

    // Success rate
    const successRateCell = document.createElement("td");
    successRateCell.textContent = `${result.successRate.toFixed(2)}%`;
    row.appendChild(successRateCell);

    tableBody.appendChild(row);
  }
}
