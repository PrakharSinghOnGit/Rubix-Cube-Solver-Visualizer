import { ContentDictionary } from "../types/types";
export const Content: ContentDictionary = {
  IDDFS: {
    title: "Iterative Deepening Depth First Search",
    description:
      "Depth-first search with increasing depth limits for optimal memory use",
    complexity: "O(b^d)",
  },
  BFS: {
    title: "Breadth First Search",
    description:
      "A search algorithm that uses a breadth first search. The algorithm will explore all the nodes at the current depth before moving on to the next depth.",
    complexity: "O(b^d)",
  },
  DFS: {
    title: "Depth First Search",
    description:
      "A search algorithm that uses a depth first search. The algorithm will explore all the nodes at the current depth before moving on to the next depth.",
    complexity: "O(b^d)",
  },
  "IDA*": {
    title: "Iterative Deepening A*",
    description:
      "Heuristic-based search combining A* accuracy with DFS memory efficiency",
    complexity: "O(b^d)",
  },
  kociemba: {
    title: "Kociemba's Algorithm",
    description:
      "The Kociemba algorithm is a two-phase algorithm that efficiently solves a Rubik’s Cube by reducing it to a simpler state in Phase 1, then solving it completely in Phase 2. It finds near-optimal solutions quickly, often within 20 moves.",
    complexity: "Doesn't have a strict theoretical complexity",
  },
};
