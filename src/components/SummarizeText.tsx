import { summarizeText } from "@/api/mutations/summarizeText";
import toaster from "@/lib/toaster";
import { useMutation } from "@tanstack/react-query";
import { Label, Textarea } from "flowbite-react";
import { useState } from "react";
import { Button } from "./ui/button";

export default function SummarizeText() {
  const [summary, setSummary] = useState("");

  const { mutate: summarize, isPending: summarizePending } = useMutation({
    mutationKey: ["summarizeText"],
    mutationFn: (text: string) => summarizeText(text),
    onSuccess(data) {
      setSummary(data.summary);
    },
  });

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission here

    const text = event.currentTarget.text.value;
    if (!text) return toaster.error("Please enter some text");

    summarize(text);
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

        <Button type="submit" disabled={summarizePending}>
          {summarizePending ? "Summarizing..." : "Summarize"}
        </Button>
      </form>

      {summary && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Summary
          </h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
