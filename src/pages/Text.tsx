import CategorizeText from "@/components/CategorizeText";
import KeywordsText from "@/components/KeywordsText";
import SentimentText from "@/components/SentimentText";
import SummarizeText from "@/components/SummarizeText";
import { Tabs, TabsRef } from "flowbite-react";
import { ChartBarStacked, KeyRound, Laugh, Shrink } from "lucide-react";
import { useRef, useState } from "react";

export default function Text() {
  const tabsRef = useRef<TabsRef>(null);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="p-4">
      <Tabs
        aria-label="Default tabs"
        variant="default"
        ref={tabsRef}
        onActiveTabChange={(tab) => setActiveTab(tab)}
      >
        <Tabs.Item active title="Summarizer" icon={Shrink}>
          <SummarizeText />
        </Tabs.Item>
        <Tabs.Item active title="Sentiment Analysis" icon={Laugh}>
          <SentimentText />
        </Tabs.Item>
        <Tabs.Item active title="Categories Extraction" icon={ChartBarStacked}>
          <CategorizeText />
        </Tabs.Item>
        <Tabs.Item active title="Keywords Extraction" icon={KeyRound}>
          <KeywordsText />
        </Tabs.Item>
      </Tabs>
    </div>
  );
}
