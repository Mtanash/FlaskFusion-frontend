import { keywordsText } from "@/api/mutations/keywordsText";
import toaster from "@/lib/toaster";
import { useMutation } from "@tanstack/react-query";
import { Label, Textarea } from "flowbite-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "./ui/button";

export default function KeywordsText() {
  const [keywords, setKeywords] = useState<string[] | null>(null);
  const [visualizationKey, setVisualizationKey] = useState(0);

  const { mutate: categorize, isPending: categorizePending } = useMutation({
    mutationKey: ["keywordsText"],
    mutationFn: (text: string) => keywordsText(text),
    onSuccess(data) {
      setKeywords(data.keywords);
      setVisualizationKey((prev) => prev + 1);
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

      {keywords && (
        <KeywordsDisplay keywords={keywords} key={visualizationKey} />
      )}
    </div>
  );
}

const KeywordsDisplay = ({ keywords }: { keywords: string[] }) => {
  return (
    <div className="w-full max-w-md mt-6 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-bold text-gray-700 mb-4">
        Extracted Keywords
      </h2>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <motion.span
            key={index}
            className="px-3 py-1 bg-blue-100 text-blue-600 font-semibold rounded-full text-sm"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {keyword}
          </motion.span>
        ))}
      </div>
    </div>
  );
};
