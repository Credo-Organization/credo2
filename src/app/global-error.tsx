"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in the future
    console.error("Caught in Global Error Boundary:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
          {/* Atmospheric background */}
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-red-500/5 blur-[120px]" />
          
          <div className="relative z-10 max-w-md w-full rounded-2xl border border-red-500/20 bg-card/50 backdrop-blur-md p-8 text-center shadow-2xl">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            
            <h2 className="text-2xl font-bold mb-3 tracking-tight">System Glitch</h2>
            <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
              We encountered an unexpected anomaly while calculating your skill vectors. 
              Our AI engine has logged the discrepancy.
            </p>
            
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => reset()} 
                size="lg"
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Retry Process
              </Button>
              <Link href="/dashboard" className="w-full">
                <Button variant="outline" size="lg" className="w-full h-12">
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
