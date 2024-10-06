import { getCSVData } from "@/api/queries/getCSVData";
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
import { Link } from "react-router-dom";
import SpinnerComponent from "./SpinnerComponent";

const PAGE_SIZE = 10;

const CSVTable = () => {
  const [page, setPage] = useState(1);

  const {
    data: csvData,
    isPending: isCSVDataPending,
    isError: isCSVDataError,
  } = useQuery({
    queryKey: ["getCSVData", page],
    queryFn: () => getCSVData(page, PAGE_SIZE),
  });

  if (isCSVDataError) return <div>Error</div>;
  if (isCSVDataPending) return <SpinnerComponent />;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Uploaded At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {csvData?.data?.map((csvData) => (
            <TableRow
              key={csvData._id}
              className="hover:bg-gray-50 transition ease-in-out duration-150"
            >
              <TableCell>
                <Link
                  className="font-bold hover:underline underline-offset-4"
                  to={`/csv/${csvData._id}`}
                >
                  {csvData._id}
                </Link>
              </TableCell>
              <TableCell>{csvData.filename}</TableCell>
              <TableCell>
                {new Date(csvData.uploaded_at).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        className="my-4"
        currentPage={page}
        totalPages={Math.ceil(csvData.total / PAGE_SIZE)}
        onPageChange={(page) => setPage(page)}
      />
    </>
  );
};

export default CSVTable;
