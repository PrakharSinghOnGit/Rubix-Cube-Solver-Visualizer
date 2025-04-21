# Rubik's Cube Solver

A comprehensive project for solving NxN Rubik's Cubes using various algorithmic techniques. This application provides a 3D visualization of the cube, implements multiple solving algorithms, and includes a benchmarking system to compare their performance.

## Features

- **Interactive 3D Visualization**: Manipulate and view the Rubik's Cube from any angle using Three.js
- **Multiple Solving Algorithms**:
  - Brute Force (for 2x2 cubes only)
  - Layer-by-Layer (LBL) Method
  - Kociemba's Two-Phase Algorithm
  - Thistlethwaite's Algorithm
  - Neural Network Approach (simulated)
- **Benchmarking System**: Compare the performance of different algorithms in terms of time, moves, and success rate
- **Step-by-Step Solution Playback**: View the solution steps and play them back at different speeds
- **Support for Different Cube Sizes**: 2x2, 3x3, 4x4, and 5x5 cubes

## Technologies Used

- **JavaScript**: Core programming language
- **Three.js**: 3D visualization library
- **Chart.js**: Data visualization for benchmarking results
- **Webpack**: Module bundling
- **Babel**: JavaScript transpiling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/rubiks-cube-solver.git
   cd rubiks-cube-solver
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:8080`

### Building for Production

To build the application for production:

```
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
rubiks-cube-solver/
├── src/
│   ├── components/
│   │   ├── CubeView3d/            # 3D cube visualization
│   │   ├── CubeView2d/           # 2D net view of cube
│   │   ├── SettingsPanel/        # Cube controls and settings
│   │   ├── SolverPanel/          # Algorithm selection
│   │   ├── StatsPanel/           # Performance metrics display
│   │   ├── LogsPanel/            # Move history and notation
│   │   ├── Header/               # Application header
│   │   └── ui/                   # Reusable UI components
│   │       ├── Button/
│   │       ├── PanelLabel/
│   │       ├── ResizeHandle/
│   │       └── MoveTable/
│   ├── core/
│   │   ├── cube.ts               # Cube state and logic
│   │   ├── IDDFS.ts              # IDDFS solver implementation
│   │   ├── IDAStar.ts            # IDA* solver implementation
│   │   ├── CFOP.ts               # CFOP solver implementation
│   │   └── Worker.ts             # Web Worker for background solving
│   ├── types/                    # TypeScript type definitions
│   ├── App.tsx                   # Main application component
│   └── App.module.css            # Global styles
├── public/                       # Static assets
├── package.json                  # Project dependencies
├── tsconfig.json                 # TypeScript configuration
└── README.md

```

## UI Overview

### Main Interface

![UI](./UI.png)

### The interface consists of three main panels:

1.**Control Panel** (Left):

- Cube size selection
- Scramble functionality
- Manual move controls
- Algorithm selection
  ![Setting]()

  2.**Visualization Panel** (Center):

- 3D cube renderer with orbit controls
- 2D net view of the cube
- Resizable panels for optimal viewing

  3.**Information Panel** (Right):

- Algorithm statistics (move count, time taken)
- Move history log
- Solution steps

### Solving Process

When solving:

1. Select an algorithm from the Solver panel
2. Watch the step-by-step solution
3. View performance metrics in real-time
4. Replay or reverse any part of the solution

## Algorithms

### Brute Force

The brute force approach tries all possible move sequences until a solution is found. Due to the enormous search space (approximately 43 quintillion positions for a 3x3 cube), this approach is only feasible for 2x2 cubes or for finding optimal solutions for specific cases.

### Layer-by-Layer (LBL)

The Layer-by-Layer method solves the cube one layer at a time, typically starting with the bottom layer, then the middle layer, and finally the top layer. This method is intuitive and commonly used by human solvers.

### Kociemba's Two-Phase Algorithm

Kociemba's algorithm divides the solution into two phases:

1. Reduce the cube to a subgroup where only specific moves are needed
2. Solve within that subgroup

This algorithm can find near-optimal solutions for 3x3 cubes.

### Thistlethwaite's Algorithm

Thistlethwaite's algorithm breaks down the solution into four stages, each reducing the cube to a smaller subgroup:

1. G0 -> G1: Orient all edges
2. G1 -> G2: Place M-slice edges in M-slice, orient all corners
3. G2 -> G3: Place E-slice edges in E-slice, U corners in U face, D corners in D face
4. G3 -> G4: Solve the cube

This approach significantly reduces the search space and can find solutions with a reasonable number of moves.

### Neural Network Approach

This approach uses machine learning techniques to learn solving strategies. While still experimental, neural networks show promise in developing efficient solving strategies.

## Real-World Applications

The algorithms used to solve Rubik's Cubes have applications beyond the puzzle itself:

- **AI and Search Algorithms**: The techniques used to navigate the vast state space of a Rubik's Cube are applicable to other complex search problems.
- **Robotics**: The manipulation sequences and pattern recognition used in cube solving inform robotic movement planning and object manipulation.
- **Logistics and Optimization**: The group theory and state-space reduction techniques have applications in scheduling, routing, and other optimization problems.
- **Parallel Computing**: Distributing the search for Rubik's Cube solutions demonstrates principles of parallel algorithm design that apply to other computationally intensive tasks.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Ernő Rubik for inventing the Rubik's Cube
- Herbert Kociemba for the Two-Phase Algorithm
- Morwen Thistlethwaite for Thistlethwaite's Algorithm
- The Three.js team for the amazing 3D library
