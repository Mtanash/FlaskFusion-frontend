import { categorizeText } from "@/api/mutations/categorizeText";
import toaster from "@/lib/toaster";
import { useMutation } from "@tanstack/react-query";
import { Label, Textarea } from "flowbite-react";
import { Button } from "./ui/button";

export default function CategorizeText() {
  const { mutate: categorize, isPending: categorizePending } = useMutation({
    mutationKey: ["categorizeText"],
    mutationFn: (text: string) => categorizeText(text),
    onSuccess(data) {
      console.log(data);
    },
  });

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission here

    const text = event.currentTarget.text.value;
    if (!text) return toaster.error("Please enter some text");

    categorize(text);
  };

  return (
    <div>
      <form
        className="flex max-w-md flex-col gap-4"
        onSubmit={handleFormSubmit}
      >
        <div>
          <div className="mb-2 block">
            <Label htmlFor="text" value="Enter Text" />
          </div>
          <Textarea
            id="text"
            name="text"
            placeholder="Enter Text here"
            required
            shadow
            rows={6}
          />
        </div>

        <Button type="submit" disabled={categorizePending}>
          {categorizePending ? "Analyzing..." : "Analyze"}
        </Button>
      </form>

      {/* {sentimentData && <SentimentDisplay sentiment={sentimentData} />} */}
    </div>
  );
}
