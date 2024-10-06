import { sentimentText } from "@/api/mutations/sentimentText";
import toaster from "@/lib/toaster";
import { useMutation } from "@tanstack/react-query";
import { Label, Textarea } from "flowbite-react";
import { useState } from "react";
import SentimentDisplay from "./SentimentDisplay";
import { Button } from "./ui/button";

export default function SentimentText() {
  const [sentimentData, setSentimentData] = useState<{
    label: string;
    score: number;
  } | null>(null);

  const { mutate: sentiment, isPending: sentimentPending } = useMutation({
    mutationKey: ["sentimentText"],
    mutationFn: (text: string) => sentimentText(text),
    onSuccess(data) {
      console.log(data);
      setSentimentData(data);
    },
  });

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission here

    const text = event.currentTarget.text.value;
    if (!text) return toaster.error("Please enter some text");

    sentiment(text);
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

        <Button type="submit" disabled={sentimentPending}>
          {sentimentPending ? "Analyzing..." : "Analyze"}
        </Button>
      </form>

      {sentimentData && <SentimentDisplay sentiment={sentimentData} />}
    </div>
  );
}
