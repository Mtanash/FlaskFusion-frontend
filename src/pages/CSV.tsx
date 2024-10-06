import { uploadCSV } from "@/api/mutations/uploadCSV";
import CSVTable from "@/components/CSVTable";
import { Button } from "@/components/ui/button";
import toaster from "@/lib/toaster";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileInput, Modal } from "flowbite-react";
import { useState } from "react";

export default function CSV() {
  const queryClinet = useQueryClient();

  const [openModal, setOpenModal] = useState(false);
  const [file, setFile] = useState<File>();

  const { mutate: mutateCSVData, isPending: isMutatePending } = useMutation({
    mutationKey: ["uploadCSV"],
    mutationFn: (file: File) => uploadCSV(file),
    onSuccess: () => {
      setOpenModal(false);
      setFile(undefined);
      toaster.success("CSV file uploaded successfully");
      queryClinet.invalidateQueries({
        queryKey: ["getCSVData"],
      });
    },
  });

  const handleUpload = () => {
    if (!file) return toaster.error("Please select a file");
    if (file.type !== "text/csv")
      return toaster.error("Please select a CSV file");

    mutateCSVData(file);
  };

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">CSV Data</h1>

        <div className="mb-6 flex items-center justify-end gap-4">
          <Button onClick={() => setOpenModal(true)}>Upload CSV</Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <CSVTable />
        </div>
      </div>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Uplad CSV</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Upload new CSV file to be parsed
            </p>

            <FileInput
              id="file-input"
              onChange={(e) => setFile(e.target.files![0])}
              accept="text/csv"
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button onClick={handleUpload} disabled={isMutatePending}>
            {isMutatePending ? "Uploading..." : "Upload"}
          </Button>
          <Button
            variant="destructive"
            onClick={() => setOpenModal(false)}
            disabled={isMutatePending}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
