import { useParams } from "react-router-dom";

export default function ImageDetails() {
  const params = useParams();
  const id = params.id;

  return <div>{id}</div>;
}
