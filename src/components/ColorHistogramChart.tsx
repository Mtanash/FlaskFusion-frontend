import { ColorHistogram } from "@/api/queries/getImages";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function ColorHistogramChart({
  data,
}: {
  data: ColorHistogram;
}) {
  const chartData = Array.from({ length: 256 }).map((_, index) => ({
    index,
    R: data.R[index],
    G: data.G[index],
    B: data.B[index],
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="index"
          label={{ value: "Intensity", position: "insideBottom", offset: -5 }}
        />
        <YAxis
          label={{ value: "Frequency", angle: -90, position: "insideLeft" }}
        />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="R" stroke="#ff0000" dot={false} />
        <Line type="monotone" dataKey="G" stroke="#00ff00" dot={false} />
        <Line type="monotone" dataKey="B" stroke="#0000ff" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
