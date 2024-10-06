import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const StatisticsChart = ({ data }) => {
  const chartData = [
    { name: "Mean", ...data.mean },
    { name: "Median", ...data.median },
    { name: "Mode", ...data.mode },
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="size" fill="#8884d8" />
        <Bar dataKey="tip" fill="#82ca9d" />
        <Bar dataKey="total_bill" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StatisticsChart;
