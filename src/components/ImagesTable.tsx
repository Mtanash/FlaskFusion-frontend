import { deleteImage } from "@/api/mutations/deleteImage";
import { getImages } from "@/api/queries/getImages";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CONFIG from "@/config";
import toaster from "@/lib/toaster";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Modal, Pagination } from "flowbite-react";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import SpinnerComponent from "./SpinnerComponent";

const PAGE_SIZE = 10;

const ImagesTable = () => {
  const queryClinet = useQueryClient();

  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageId, setImageId] = useState<string | null>("");

  const {
    data: imagesData,
    isPending: isImagesDataPending,
    isError: isImagesDataError,
  } = useQuery({
    queryKey: ["getImages", page],
    queryFn: () => getImages(page, PAGE_SIZE),
  });

  const { mutate: deleteImageMutate, isPending: isDeleteImagePending } =
    useMutation({
      mutationKey: ["deleteImage"],
      mutationFn: (id: string) => deleteImage(id),
      onSuccess: () => {
        queryClinet.invalidateQueries({
          queryKey: ["getImages"],
        });
        toaster.success("Image deleted successfully");
        setShowDeleteModal(false);
      },
    });

  const handleDelete = () => {
    if (!imageId) return toaster.error("Please select an image");

    deleteImageMutate(imageId);
  };

  if (isImagesDataError) return <div>Error</div>;
  if (isImagesDataPending) return <SpinnerComponent />;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Orignal Name</TableHead>
            <TableHead>Uploaded At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {imagesData?.data?.map((imageData) => (
            <TableRow
              key={imageData._id}
              className="hover:bg-gray-50 transition ease-in-out duration-150"
            >
              <TableCell>
                <Link
                  className="font-bold hover:underline underline-offset-4"
                  to={`/images/${imageData._id}`}
                >
                  {imageData._id}
                </Link>
              </TableCell>
              <TableCell>
                <img
                  src={`${CONFIG.BASE_URL}/uploads/images/${imageData.filename}`}
                  alt={imageData.original_name}
                  className="w-16 h-16 object-contain rounded-md"
                />
              </TableCell>
              <TableCell>{imageData.original_name}</TableCell>
              <TableCell>
                {new Date(imageData.uploaded_at).toLocaleString()}
              </TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        window.open(
                          `${CONFIG.BASE_URL}/uploads/images/${imageData.filename}`,
                          "_blank"
                        )
                      }
                    >
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500"
                      onClick={() => {
                        setImageId(imageData._id);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        className="my-4"
        currentPage={page}
        totalPages={Math.ceil(imagesData.total / PAGE_SIZE)}
        onPageChange={(page) => setPage(page)}
      />

      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Modal.Header>Delete Image</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this image?
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button onClick={handleDelete} disabled={isDeleteImagePending}>
            {isDeleteImagePending ? "Deleting..." : "Delete"}
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteModal(false)}
            disabled={isDeleteImagePending}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ImagesTable;
