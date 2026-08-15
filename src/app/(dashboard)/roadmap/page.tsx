import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Map, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RoadmapPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Career Roadmap"
        description="Your personalized learning path based on skill gap analysis."
        icon={Map}
      />
      <EmptyState
        icon={Map}
        title="No roadmap yet"
        description="Generate your skill passport first, then get a personalized career roadmap."
      >
        <Button className="gap-2">
          <Sparkles className="h-4 w-4" />
          Generate Roadmap
        </Button>
      </EmptyState>
    </div>
  );
}
