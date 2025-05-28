import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import RenderCube from "./ui/RenderCube";

type LogEntry = {
  timestamp: string;
  level: string;
  logger: string;
  message: string;
  filename: string;
  lineno: number;
};

const StatsPanel: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

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

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const clearLogs = () => {
    setLogs([]);
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
    if (log.level == "CUBE") {
      return <RenderCube str={log.message} />;
    }
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

  return (
    <div className="overflow-scroll h-full">
      {/* Real-time Logs Section */}
      <div className="p-2 h-full">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">📋 Real-time Solver Logs</h2>
          <button
            onClick={clearLogs}
            className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 rounded"
          >
            Clear
          </button>
        </div>
        <div className="bg-black rounded p-2 overflow-y-scroll text-xs font-mono">
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
  );
};

export default StatsPanel;
