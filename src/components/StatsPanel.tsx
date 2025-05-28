import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { AlgorithmContent } from "../types/types";

interface StatsPanelProps {
  content?: AlgorithmContent;
}

type Stat = {
  label: string;
  value: string | number | boolean;
};

type StatGroup = {
  title: string;
  stats: Stat[];
};

type LogEntry = {
  timestamp: string;
  level: string;
  logger: string;
  message: string;
  filename: string;
  lineno: number;
};

type SolverStatus = {
  status: "idle" | "solving" | "completed" | "error";
  cube_id?: string;
  message: string;
};

const StatsPanel: React.FC<StatsPanelProps> = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [solverStatus, setSolverStatus] = useState<SolverStatus>({
    status: "idle",
    message: "Ready to solve",
  });
  const socketRef = useRef<Socket | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const content = {
    title: "Solver Information",
    description: "Real-time solver progress and logs",
  };

  const solverStats = {
    timeTaken: "0ms",
    totalIterations: 0,
    moveCount: 0,
    comparisonCount: 0,
    maxDepthReached: 0,
    goalReached: false,
    nodesExplored: 0,
    searchTreeDepth: 0,
    uniqueStates: 0,
    backtracks: 0,
    heuristicCost: 0,
    statesPruned: 0,
    peakMemoryUsed: 0,
    openSetSize: 0,
    closedSetSize: 0,
    totalStatesInMemory: 0,
    solvedFaces: 0,
    heuristicEstimate: 0,
    solutionPathLength: 0,
  };

  useEffect(() => {
    // Connect to WebSocket
    const socket = io("http://localhost:5175");
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to solver WebSocket");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from solver WebSocket");
    });

    socket.on("solver_log", (logEntry: LogEntry) => {
      setLogs((prevLogs) => {
        const newLogs = [...prevLogs, logEntry];
        return newLogs.slice(-100);
      });
    });

    socket.on("solver_status", (status: SolverStatus) => {
      setSolverStatus(status);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new logs arrive
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const clearLogs = () => {
    setLogs([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "solving":
        return "text-yellow-500";
      case "completed":
        return "text-green-500";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "ERROR":
        return "text-red-400";
      case "WARNING":
        return "text-yellow-400";
      case "INFO":
        return "text-blue-400";
      case "DEBUG":
        return "text-gray-400";
      case "SUCCESS":
        return "text-green-400";
      case "CUBE":
        return "text-purple-400";
      default:
        return "text-white";
    }
  };

  const renderLogMessage = (log: LogEntry) => {
    return (
      <div className="flex justify-between items-center">
        <div>
          <span className={`${getLogLevelColor(log.level)}`}>
            [{log.level}]
          </span>
          <span className="ml-2 text-white">{log.message}</span>
        </div>
        <span className="text-gray-400 text-xs">
          {new Date(log.timestamp).toLocaleTimeString()}
        </span>
      </div>
    );
  };

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
  ];

  return (
    <div className="overflow-scroll h-full">
      <div className="p-2 rounded-[15px] space-y-2">
        <div className="border-1 border-gray-500 rounded-[15px] p-2">
          <h1 className="text-xl font-bold mb-1">{content.title}</h1>
          <p className="text-sm">{content.description}</p>
          <div
            className={`text-sm mt-2 ${getStatusColor(solverStatus.status)}`}
          >
            Status: {solverStatus.message}
          </div>
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

        {/* Real-time Logs Section */}
        <div className="border-1 border-gray-500 rounded-[15px] p-2">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">📋 Real-time Solver Logs</h2>
            <button
              onClick={clearLogs}
              className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 rounded"
            >
              Clear
            </button>
          </div>
          <div className="bg-black rounded p-2 h-64 overflow-y-auto text-xs font-mono">
            {logs.length === 0 ? (
              <div className="text-gray-500">
                No logs yet. Start solving a cube to see real-time progress...
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {renderLogMessage(log)}
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
