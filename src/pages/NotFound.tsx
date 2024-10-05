import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center">
      <h1>Page Not Found</h1>

      <Button onClick={() => navigate(-1)}>Go Back</Button>
    </div>
  );
}
