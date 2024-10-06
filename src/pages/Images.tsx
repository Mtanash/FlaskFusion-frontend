import { uploadImages } from "@/api/mutations/uploadImages";
import ImagesTable from "@/components/ImagesTable";
import { Button } from "@/components/ui/button";
import toaster from "@/lib/toaster";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileInput, Modal } from "flowbite-react";
import { useState } from "react";

const MAX_FILES = 10;
const MAX_SIZE = 1 * 1024 * 1024; // 1MB

export default function Images() {
  const queryClinet = useQueryClient();

  const [openModal, setOpenModal] = useState(false);
  const [files, setFiles] = useState<FileList>();

  const { mutate: uploadImagesMutate, isPending: uploadImagesPending } =
    useMutation({
      mutationKey: ["uploadImages"],
      mutationFn: (files: FileList) => uploadImages(files),
      onSuccess: () => {
        setOpenModal(false);
        setFiles(undefined);
        toaster.success("Images uploaded successfully");
        queryClinet.invalidateQueries({
          queryKey: ["getImages"],
        });
      },
    });

  const handleUpload = () => {
    if (!files) return toaster.error("Please select at least one image");

    if (files.length > MAX_FILES) {
      return toaster.error(`Please select less than ${MAX_FILES} images`);
    }

    for (const file of files) {
      if (
        file.type !== "image/jpeg" &&
        file.type !== "image/png" &&
        file.type !== "image/webp"
      ) {
        return toaster.error("Please select only images");
      }

      if (file.size > MAX_SIZE) {
        return toaster.error("Please select images less than 5MB");
      }
    }

    uploadImagesMutate(files);
  };

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Images Data
        </h1>

        <div className="mb-6 flex items-center justify-end gap-4">
          <Button onClick={() => setOpenModal(true)}>Upload Images</Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <ImagesTable />
        </div>
      </div>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Uplad Images</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Upload new images
            </p>

            <FileInput
              id="file-input"
              onChange={(e) => setFiles(e.target.files!)}
              accept="image/png, image/jpeg, image/webp"
              max={MAX_FILES}
              multiple
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button onClick={handleUpload} disabled={uploadImagesPending}>
            {uploadImagesPending ? "Uploading..." : "Upload"}
          </Button>
          <Button
            variant="destructive"
            onClick={() => setOpenModal(false)}
            disabled={uploadImagesPending}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
