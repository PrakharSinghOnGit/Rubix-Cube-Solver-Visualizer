import { ContentDictionary } from "../types";
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
};
