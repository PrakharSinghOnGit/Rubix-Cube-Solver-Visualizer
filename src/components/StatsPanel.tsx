import { AlgorithmContent, SolverStatType } from "../types";

interface StatsPanelProps {
  content?: AlgorithmContent;
  solverStats: SolverStatType;
}

type Stat = {
  label: string;
  value: string | number | boolean;
};

type StatGroup = {
  title: string;
  stats: Stat[];
};

const StatsPanel: React.FC<StatsPanelProps> = ({ solverStats, content }) => {
  const statGroups: StatGroup[] = [
    {
      title: "🧮 Algorithm Stats",
      stats: [
        { label: "Time Taken", value: solverStats.timeTaken },
        { label: "Total Iterations", value: solverStats.totalIterations },
        { label: "Move Count", value: solverStats.moveCount },
        { label: "Comparison Count", value: solverStats.comparisonCount },
        { label: "Max Depth Reached", value: solverStats.maxDepthReached },
        { label: "Goal Reached?", value: solverStats.goalReached },
      ],
    },
    {
      title: "🧠 Search & Decision Metrics",
      stats: [
        { label: "Nodes Explored", value: solverStats.nodesExplored },
        { label: "Search Tree Depth", value: solverStats.searchTreeDepth },
        { label: "Unique States", value: solverStats.uniqueStates },
        { label: "Backtracks", value: solverStats.backtracks },
        { label: "Heuristic Cost", value: solverStats.heuristicCost },
        { label: "States Pruned", value: solverStats.statesPruned },
      ],
    },
    {
      title: "💾 Memory Usage",
      stats: [
        { label: "Peak Memory Used", value: solverStats.peakMemoryUsed },
        { label: "Open Set Size", value: solverStats.openSetSize },
        { label: "Closed Set Size", value: solverStats.closedSetSize },
        {
          label: "Total States in Memory",
          value: solverStats.totalStatesInMemory,
        },
      ],
    },
    {
      title: "🧩 Puzzle-Specific Stats",
      stats: [
        { label: "Solved Faces", value: solverStats.solvedFaces },
        { label: "Heuristic Estimate", value: solverStats.heuristicEstimate },
        {
          label: "Solution Path Length",
          value: solverStats.solutionPathLength,
        },
      ],
    },
  ];

  if (!content) {
    return (
      <div>
        <h3 className="text-xl font-bold mb-1">Algorithm Information</h3>
        <p className="text-sm">No solver selected</p>
      </div>
    );
  }
  return (
    <div className="overflow-scroll h-full">
      <div className="p-2 rounded-[15px] space-y-2">
        <div className="border-1 border-gray-500 rounded-[15px] p-2">
          <h1 className="text-xl font-bold mb-1">{content.title}</h1>
          <p className="text-sm">{content.description}</p>
        </div>

        {statGroups.map((group, idx) => (
          <div
            key={idx}
            className="border-1 border-gray-500 rounded-[15px] p-2"
          >
            <h2 className="text-xl font-bold mb-1">{group.title}</h2>
            <table className="w-full text-left table-auto">
              <tbody>
                {group.stats.map((stat, index) => (
                  <tr
                    key={index}
                    className="border-b last:border-b-0 border-gray-600"
                  >
                    <td className="text-sm py-1.5">{stat.label}</td>
                    <td>{String(stat.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsPanel;
