import { deleteCSVRecord } from "@/api/mutations/deleteCSVRecord";
import { getCSVDataDetails } from "@/api/queries/getCSVDataDetails";
import { getCSVDataDetailsStatistics } from "@/api/queries/getCSVDataDetailsStatistics";
import { getCSVDataDetailsTable } from "@/api/queries/getCSVDataDetailsTable";
import QuartileChart from "@/components/QuartileChart";
import StatisticsChart from "@/components/StatisticsChart";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import toaster from "@/lib/toaster";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Modal, Pagination } from "flowbite-react";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

const PAGE_SIZE = 10;

export default function CSVDetails() {
  const params = useParams();
  const id = params.id;

  const queryClinet = useQueryClient();

  const [page, setPage] = useState(1);
  const [selectedRecordId, setSelectedRecordId] = useState<string>();
  const [showDeleteModalConfirm, setShowDeleteModalConfirm] = useState(false);

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

  const { mutate: deleteRecord, isPending: isDeletePending } = useMutation({
    mutationKey: ["deleteCSVRecord"],
    mutationFn: (id: string) => deleteCSVRecord(id),
    onSuccess: () => {
      toaster.success("CSV record deleted successfully");
      queryClinet.invalidateQueries({
        queryKey: ["getCSVDataDetailsTable"],
      });
      setShowDeleteModalConfirm(false);
    },
  });

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
                <TableHead className="px-4 py-2 text-gray-600 font-medium uppercase">
                  Actions
                </TableHead>
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
                  <TableCell className="px-4 py-2 text-gray-700 flex gap-2">
                    {/* <Button
                      onClick={() => handleEdit(data._id)}
                      size="icon"
                      className="p-1 rounded-full"
                    >
                      <Pencil />
                    </Button> */}
                    <Button
                      onClick={() => {
                        setSelectedRecordId(data._id);
                        setShowDeleteModalConfirm(true);
                      }}
                      variant="destructive"
                      size="icon"
                      className="p-1 rounded-full"
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
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

      <Modal
        show={showDeleteModalConfirm}
        onClose={() => setShowDeleteModalConfirm(false)}
      >
        <Modal.Header>Delete Record</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this record?
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button
            variant="destructive"
            onClick={() => {
              if (!selectedRecordId) return toaster.error("No record selected");

              deleteRecord(selectedRecordId);
            }}
            disabled={isDeletePending}
          >
            {isDeletePending ? "Deleting..." : "Delete"}
          </Button>
          <Button
            onClick={() => setShowDeleteModalConfirm(false)}
            autoFocus
            disabled={isDeletePending}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
