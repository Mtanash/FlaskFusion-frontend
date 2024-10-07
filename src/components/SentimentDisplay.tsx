import { motion } from "framer-motion";

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
        <motion.span
          className={`text-xl font-semibold ${
            label === "NEGATIVE" ? "text-red-500" : "text-green-500"
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {label}
        </motion.span>
        <motion.span
          className="text-gray-600"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {percentage}%
        </motion.span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-4">
        <motion.div
          className={`h-full rounded-full ${sentimentColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        ></motion.div>
      </div>
    </div>
  );
};

export default SentimentDisplay;
