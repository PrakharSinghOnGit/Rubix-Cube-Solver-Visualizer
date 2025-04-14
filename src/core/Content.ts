import { ContentDictionary } from "../types/types";
export const Content: ContentDictionary = {
  IDDFS: {
    title: "Iterative Deepening Depth First Search",
    description:
      "A search algorithm that uses a depth first search with a limited depth. The depth is increased until the goal is found.",
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
      "A search algorithm that uses a depth first search with a limited depth. The depth is increased until the goal is found.",
    complexity: "O(b^d)",
  },
};
