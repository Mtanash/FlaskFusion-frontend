import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryTheme,
} from "victory";

const QuartileChart = ({ data }) => {
  const quartileKeys = Object.keys(data.quartiles);
  const chartData = quartileKeys.map((key) => ({
    category: key,
    Q1: data.quartiles[key]["0.25"],
    Q2: data.quartiles[key]["0.5"],
    Q3: data.quartiles[key]["0.75"],
  }));

  return (
    <VictoryChart theme={VictoryTheme.material}>
      <VictoryAxis />
      <VictoryAxis dependentAxis />
      <VictoryBar
        data={chartData}
        x="category"
        y="Q1"
        labelComponent={<VictoryLabel dy={-10} />}
      />
      <VictoryBar
        data={chartData}
        x="category"
        y="Q2"
        labelComponent={<VictoryLabel dy={-10} />}
      />
      <VictoryBar
        data={chartData}
        x="category"
        y="Q3"
        labelComponent={<VictoryLabel dy={-10} />}
      />
    </VictoryChart>
  );
};

export default QuartileChart;
