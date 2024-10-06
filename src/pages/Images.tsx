import { getImages } from "@/api/queries/getImages";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const PAGE_SIZE = 10;

export default function Images() {
  const [page, setPage] = useState(1);

  const {
    data: imagesData,
    isPending: isImagesPending,
    isError: isImagesError,
  } = useQuery({
    queryKey: ["getImages", page],
    queryFn: () => getImages(page, PAGE_SIZE),
  });

  if (isImagesError) return <div>Error</div>;

  if (isImagesPending) return <div>Loading...</div>;

  console.log("imagesData", imagesData);

  return <div>Images</div>;
}
