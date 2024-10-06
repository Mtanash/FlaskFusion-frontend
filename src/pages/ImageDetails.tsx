import { generateHistogram } from "@/api/mutations/generateHistogram";
import { generateSegmentation } from "@/api/mutations/generateSegmentation";
import { getImageData } from "@/api/queries/getImageData";
import ColorHistogramChart from "@/components/ColorHistogramChart";
import ImageCropper from "@/components/ImageCropper";
import SpinnerComponent from "@/components/SpinnerComponent";
import { Button } from "@/components/ui/button";
import CONFIG from "@/config";
import toaster from "@/lib/toaster";
import { calculateFileSize } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, Modal, Tooltip } from "flowbite-react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowBigDownDash, Copy, Crop } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ImageDetails() {
  const params = useParams();
  const id = params.id;

  const queryClinet = useQueryClient();

  const [showCropper, setShowCropper] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [segmentationImageUrl, setSegmentationImageUrl] = useState("");

  const {
    data: imageData,
    isPending: isImageDataPending,
    isError: isImageDataError,
    isFetched: isImageDataFetched,
  } = useQuery({
    queryKey: ["getImageData", id],
    queryFn: () => getImageData(id!),
    select: (data) => data.data,
  });

  useEffect(() => {
    if (isImageDataFetched && imageData) {
      setImageUrl(`${CONFIG.BASE_URL}/uploads/images/${imageData.filename}`);

      if (imageData.segmentation_mask) {
        setSegmentationImageUrl(
          `${CONFIG.BASE_URL}/uploads/images/${imageData.segmentation_mask}`
        );
      }
    }
  }, [imageData, isImageDataFetched]);

  const {
    mutate: generateHistogramMutate,
    isPending: isGenerateHistogramPending,
  } = useMutation({
    mutationKey: ["generateHistogram"],
    mutationFn: () => generateHistogram(id!),
    onSuccess: () => {
      toaster.success("Histogram generated successfully");
      queryClinet.invalidateQueries({
        queryKey: ["getImageData"],
      });
    },
  });

  const {
    mutate: generateSegmentationMutate,
    isPending: isGenerateSegmentationPending,
  } = useMutation({
    mutationKey: ["generateSegmentation"],
    mutationFn: () => generateSegmentation(id!),
    onSuccess: () => {
      toaster.success("Segmentation mask generated successfully");
      queryClinet.invalidateQueries({
        queryKey: ["getImageData"],
      });
    },
  });

  if (isImageDataError) return <div>Error</div>;
  if (isImageDataPending) return <SpinnerComponent />;

  const handleDownloadImage = () => {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = imageData.original_name;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <AnimatePresence>
      <div className="p-4">
        <div className="flex items-start justify-around">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Card className="max-w-sm mb-6" imgSrc={imageUrl}>
              <p>
                <strong>Original Name:</strong> {imageData.original_name}
              </p>
              <p>
                <strong>Dimensions:</strong> {imageData.width}x
                {imageData.height} pixels
              </p>
              <p>
                <strong>Size:</strong> {calculateFileSize(imageData.file_size)}
              </p>
              <p>
                <strong>Uploaded At:</strong>{" "}
                {new Date(imageData.uploaded_at).toLocaleString()}
              </p>

              <div className="flex flex-col justify-center flex-wrap gap-3">
                <Button
                  onClick={() => generateHistogramMutate()}
                  disabled={isGenerateHistogramPending}
                >
                  {isGenerateHistogramPending ? (
                    <SpinnerComponent />
                  ) : (
                    "Generate Histogram"
                  )}
                </Button>
                <Button
                  onClick={() => generateSegmentationMutate()}
                  disabled={isGenerateSegmentationPending}
                >
                  {isGenerateSegmentationPending ? (
                    <SpinnerComponent />
                  ) : (
                    "Generate Segmentation Mask"
                  )}
                </Button>

                <div className="flex gap-3 items-center justify-center">
                  <Tooltip content="Download">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleDownloadImage}
                    >
                      <ArrowBigDownDash />
                    </Button>
                  </Tooltip>

                  <Tooltip content="Copy Image URL">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard
                          .writeText(imageUrl)
                          .then(() => toaster.success("Copied to clipboard"));
                      }}
                    >
                      <Copy />
                    </Button>
                  </Tooltip>

                  <Tooltip content="Crop Image">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowCropper(true)}
                    >
                      <Crop />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </Card>
          </motion.div>

          {segmentationImageUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <Card className="max-w-sm mb-6" imgSrc={segmentationImageUrl}>
                <p>Segmentation Mask for {imageData.original_name}</p>
              </Card>
            </motion.div>
          )}
        </div>

        {imageData.color_histogram && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <ColorHistogramChart data={imageData.color_histogram} />
          </motion.div>
        )}
      </div>

      <Modal show={showCropper} onClose={() => setShowCropper(false)}>
        <Modal.Header>Crop Image</Modal.Header>
        <Modal.Body>
          <ImageCropper
            image={imageUrl}
            imageId={imageData._id}
            onFinish={() => {
              setShowCropper(false);
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onClick={() => setShowCropper(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </AnimatePresence>
  );
}
