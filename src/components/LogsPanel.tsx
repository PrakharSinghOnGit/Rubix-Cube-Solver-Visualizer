
interface LogsPanelProps {
  logs: string[];
}

export default function LogsPanel({ logs }: LogsPanelProps) {
  const getMoveNotation = (log: string): string => {
    const [layer, axis, direction] = log.split(' ');
    let notation = "";
    
    // Determine the face
    switch (axis) {
      case "X":
        notation = layer === "0" ? "L" : "R";
        break;
      case "Y":
        notation = layer === "0" ? "D" : "U";
        break;
      case "Z":
        notation = layer === "0" ? "B" : "F";
        break;
    }
    
    // Add ' for counterclockwise
    if (direction === "CCW") {
      notation += "'";
    }
    
    return notation;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 text-white">
        <thead>
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Move</th>
            <th className="px-4 py-2">Axis</th>
            <th className="px-4 py-2">Layer</th>
            <th className="px-4 py-2">Direction</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => {
            const [layer, axis, direction] = log.split(' ');
            return (
              <tr key={index} className="border-t border-gray-700">
                <td className="px-4 py-2 text-center">{index + 1}</td>
                <td className="px-4 py-2 text-center font-mono">{getMoveNotation(log)}</td>
                <td className="px-4 py-2 text-center">{axis}</td>
                <td className="px-4 py-2 text-center">{layer}</td>
                <td className="px-4 py-2 text-center">{direction}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
