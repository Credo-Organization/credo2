import { PageHeader } from "@/components/shared/page-header";
import { Loader2, Fingerprint } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingPassport() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <PageHeader
          title="Skill Passport"
          description="Compiling your verified skills and generating evidence signatures..."
          icon={Fingerprint}
        />
        <div className="flex items-center gap-2 text-xs bg-muted/50 text-muted-foreground px-3 py-1.5 rounded-full border border-border">
          <Loader2 className="h-3 w-3 animate-spin text-primary" />
          AI Engine Processing
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card className="border-border/50 bg-card/50 overflow-hidden">
            <CardHeader className="pb-3 text-center items-center">
              <Skeleton className="h-24 w-24 rounded-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="pt-4 flex gap-2 justify-center">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
