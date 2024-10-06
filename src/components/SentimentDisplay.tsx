const SentimentDisplay = ({
  sentiment,
}: {
  sentiment: { label: string; score: number };
}) => {
  const { label, score } = sentiment;
  const percentage = Math.round(score * 100);

  // Determine color based on sentiment label
  const sentimentColor =
    label === "POSITIVE"
      ? "bg-green-500"
      : label === "NEGATIVE"
      ? "bg-red-500"
      : "bg-yellow-500";

  return (
    <div className="w-full max-w-xs p-4 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-lg font-bold text-gray-700 mb-2">
        Sentiment Analysis
      </h2>

      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-xl font-semibold ${
            label === "NEGATIVE" ? "text-red-500" : "text-green-500"
          }`}
        >
          {label}
        </span>
        <span className="text-gray-600">{percentage}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className={`h-full rounded-full ${sentimentColor}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default SentimentDisplay;
