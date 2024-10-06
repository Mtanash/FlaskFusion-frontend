import { getCSVDataDetails } from "@/api/queries/getCSVDataDetails";
import { getCSVDataDetailsStatistics } from "@/api/queries/getCSVDataDetailsStatistics";
import { getCSVDataDetailsTable } from "@/api/queries/getCSVDataDetailsTable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "flowbite-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
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
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryTheme,
} from "victory";

const PAGE_SIZE = 10;

export default function CSVDetails() {
  const params = useParams();
  const id = params.id;

  const [page, setPage] = useState(1);

  const {
    data: csvDetails,
    isPending: isCSVDetailsPending,
    isError: isCSVDetailsError,
  } = useQuery({
    queryKey: ["getCSVDataDetails", id],
    queryFn: () => getCSVDataDetails(id!),
  });

  const {
    data: csvDetailsTable,
    isPending: isCSVDetailsTablePending,
    isError: isCSVDetailsTableError,
  } = useQuery({
    queryKey: ["getCSVDataDetailsTable", id, page, PAGE_SIZE],
    queryFn: () => getCSVDataDetailsTable(id!, page, PAGE_SIZE),
  });

  const {
    data: csvDetailsStatistics,
    isPending: isCSVDetailsStatisticsPending,
    isError: isCSVDetailsStatisticsError,
  } = useQuery({
    queryKey: ["getCSVDataDetailsStatistics", id],
    queryFn: () => getCSVDataDetailsStatistics(id!),
  });

  console.log("csvDetailsStatistics", csvDetailsStatistics);

  if (isCSVDetailsPending || isCSVDetailsTablePending)
    return <div>Loading...</div>;
  if (isCSVDetailsError || isCSVDetailsTableError) return <div>Error</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">CSV Details</h1>

      <div className="mb-8 flex flex-col gap-4 md:flex-row items-center">
        <p className="text-lg text-gray-700">
          File Name:{" "}
          <span className="font-semibold text-red-500">
            {csvDetails?.data.filename}
          </span>
        </p>
        <p className="text-lg text-gray-700">
          Total Rows:{" "}
          <span className="font-semibold text-red-500">
            {csvDetailsTable?.total}
          </span>
        </p>
        <p className="text-lg text-gray-700">
          Total Columns:{" "}
          <span className="font-semibold text-red-500">
            {Object.keys(csvDetailsTable?.data[0])?.length}
          </span>
        </p>
      </div>

      {csvDetailsTable && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <Table className="min-w-full border-collapse table-auto">
            <TableHeader>
              <TableRow className="bg-gray-100 border-b border-gray-200">
                {Object.keys(csvDetailsTable.data[0]).map((key) => (
                  <TableHead
                    key={key}
                    className="px-4 py-2 text-gray-600 font-medium uppercase"
                  >
                    {key}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {csvDetailsTable.data.map((data) => (
                <TableRow
                  key={data._id}
                  className="hover:bg-gray-50 transition ease-in-out duration-150"
                >
                  {Object.values(data).map((value, index) => (
                    <TableCell key={index} className="px-4 py-2 text-gray-700">
                      {value}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            className="my-4"
            currentPage={page}
            totalPages={Math.ceil(csvDetailsTable.total / PAGE_SIZE)}
            onPageChange={(page) => setPage(page)}
          />
        </div>
      )}

      {/* Statistics */}

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Statistics</h2>

      {/* Statistical Tables */}
      {["Mean", "Median", "Mode"].map((statType) => (
        <div key={statType} className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-medium text-gray-700 mb-4">{statType}</h3>
          <Table className="min-w-full border-collapse table-auto">
            <TableHeader>
              <TableRow className="bg-gray-100 border-b border-gray-200">
                {Object.keys(
                  csvDetailsStatistics?.[statType.toLowerCase()] || {}
                ).map((key) => (
                  <TableHead
                    key={key}
                    className="px-4 py-2 text-gray-600 font-medium uppercase"
                  >
                    {key}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {Object.values(
                  csvDetailsStatistics?.[statType.toLowerCase()] || {}
                ).map((value, index) => (
                  <TableCell key={index} className="px-4 py-2 text-gray-700">
                    {new Intl.NumberFormat("en-US").format(value)}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ))}

      {/* Quartiles */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-medium text-gray-700 mb-4">Quartiles</h3>
        <Table className="min-w-full border-collapse table-auto">
          <TableHeader>
            <TableRow className="bg-gray-100 border-b border-gray-200">
              <TableHead className="px-4 py-2 text-gray-600 font-medium uppercase">
                Category
              </TableHead>
              {Object.keys(csvDetailsStatistics?.quartiles?.size || {}).map(
                (quartile) => (
                  <TableHead
                    key={quartile}
                    className="px-4 py-2 text-gray-600 font-medium uppercase"
                  >
                    {quartile}
                  </TableHead>
                )
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(csvDetailsStatistics?.quartiles || {}).map(
              ([category, quartiles]) => (
                <TableRow
                  key={category}
                  className="hover:bg-gray-50 transition ease-in-out duration-150"
                >
                  <TableCell className="px-4 py-2 text-gray-700 font-semibold">
                    {category}
                  </TableCell>
                  {Object.values(quartiles).map((value, index) => (
                    <TableCell key={index} className="px-4 py-2 text-gray-700">
                      {new Intl.NumberFormat("en-US").format(value)}
                    </TableCell>
                  ))}
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>

      {/* Outliers */}
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Outliers</h3>
      {Object.entries(csvDetailsStatistics?.outliers || {}).map(
        ([category, outliers]) => (
          <div
            key={category}
            className="mb-8 bg-white p-6 rounded-lg shadow-md"
          >
            <h4 className="text-lg font-bold text-gray-700 mb-2">
              {category.charAt(0).toUpperCase() + category.slice(1)} Outliers
            </h4>
            <Table className="w-full mt-2">
              <TableHeader>
                <TableRow className="bg-gray-100 border-b border-gray-200">
                  {Object.keys(outliers[0] || {}).map((field) => (
                    <TableHead
                      key={field}
                      className="px-4 py-2 text-gray-600 font-medium uppercase"
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {outliers.map((outlier, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-gray-50 transition ease-in-out duration-150"
                  >
                    {Object.values(outlier).map((value, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        className="px-4 py-2 text-gray-700"
                      >
                        {typeof value === "number"
                          ? new Intl.NumberFormat("en-US").format(value)
                          : value}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      )}

      {/* Charts */}
      {csvDetailsStatistics && (
        <>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Charts</h3>
          <StatisticsChart data={csvDetailsStatistics} />
        </>
      )}

      {csvDetailsStatistics && (
        <>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Quartile Chart
          </h3>
          <QuartileChart data={csvDetailsStatistics} />
        </>
      )}
    </div>
  );
}

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
