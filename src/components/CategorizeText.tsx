import { categorizeText } from "@/api/mutations/categorizeText";
import toaster from "@/lib/toaster";
import { useMutation } from "@tanstack/react-query";
import { Label, Textarea } from "flowbite-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "./ui/button";

export default function CategorizeText() {
  const [categories, setCategories] = useState<
    { label: string; score: number }[] | null
  >(null);
  const [visualizationKey, setVisualizationKey] = useState(0);

  const { mutate: categorize, isPending: categorizePending } = useMutation({
    mutationKey: ["categorizeText"],
    mutationFn: (text: string) => categorizeText(text),
    onSuccess(data) {
      setCategories(data.categories[0]);
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

      {categories && (
        <CategoryVisualization
          categoriesData={categories}
          key={visualizationKey}
        />
      )}
    </div>
  );
}

const CategoryVisualization = ({
  categoriesData,
}: {
  categoriesData: { label: string; score: number }[];
}) => {
  return (
    <div className="p-4 max-w-md mt-6 bg-white shadow-lg rounded-md">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Categorization Analysis
      </h2>
      <div>
        {categoriesData.map((category, index) => (
          <div key={index} className="mb-2">
            <p className="capitalize text-sm font-medium text-gray-600">
              {category.label}
            </p>
            <div className="w-full bg-gray-200 h-5 rounded-full overflow-hidden">
              <motion.div
                className={`h-5 rounded-full ${
                  category.label === "positive"
                    ? "bg-green-400"
                    : category.label === "neutral"
                    ? "bg-yellow-400"
                    : "bg-red-400"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${(category.score * 100).toFixed(2)}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
            <p className="text-sm text-gray-500">
              {(category.score * 100).toFixed(2)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
