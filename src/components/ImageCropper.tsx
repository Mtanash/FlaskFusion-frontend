import { cropImage } from "@/api/mutations/cropImage";
import toaster from "@/lib/toaster";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "cropperjs/dist/cropper.css";
import { useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import { Button } from "./ui/button";

export default function ImageCropper({
  image,
  imageId,
  onFinish,
}: {
  image: string;
  imageId: string;
  onFinish: () => void;
}) {
  const queryClient = useQueryClient();

  const cropperRef = useRef<ReactCropperElement>(null);

  const { mutate: cropImageMutate, isPending: cropImagePending } = useMutation({
    mutationKey: ["cropImage"],
    mutationFn: ({
      id,
      top,
      left,
      right,
      bottom,
    }: {
      id: string;
      top: number;
      left: number;
      right: number;
      bottom: number;
    }) => cropImage(id, top, left, right, bottom),
    onSuccess: () => {
      toaster.success("Image cropped successfully");
      queryClient.invalidateQueries({
        queryKey: ["getImageData", imageId],
        stale: true,
      });

      onFinish();
    },
  });

  const handleCropImage = () => {
    const cropper = cropperRef.current?.cropper;
    const cropData = cropper?.getData();

    if (cropData) {
      const { x, y, width, height } = cropData;

      const payload = {
        left: x,
        top: y,
        right: x + width,
        bottom: y + height,
      };

      cropImageMutate({
        id: imageId,
        ...payload,
      });
    }
  };

  return (
    <>
      <Cropper
        src={image}
        style={{ height: 400, width: "100%" }}
        // Cropper.js options
        initialAspectRatio={16 / 9}
        guides={false}
        ref={cropperRef}
      />

      <Button
        className="mt-4"
        onClick={handleCropImage}
        disabled={cropImagePending}
      >
        {cropImagePending ? "Cropping..." : "Crop Image"}
      </Button>
    </>
  );
}
