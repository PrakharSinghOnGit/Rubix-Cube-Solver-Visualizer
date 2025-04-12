
const StatsPanel = ({
    comparisonCount,
    timeTaken,
    moveCount,
}: {
    comparisonCount: number;
    timeTaken: number;
    moveCount: number;
}) => {
  return <div className="mt-9 p-3">
    <div>
        <span>Comparison Count:</span>
        <span>  {comparisonCount}</span>
    </div>
    <div>
        <span>Time Taken:</span>
        <span>  {timeTaken.toFixed(2)} ms</span>
    </div>
    <div>
        <span>Move Count:</span>
        <span>  {moveCount}</span>
    </div>
  </div>;
};

export default StatsPanel;
