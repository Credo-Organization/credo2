"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GitBranch, Loader2, ArrowRight } from "lucide-react";

export function GitHubConnectForm() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleConnect = () => {
    setIsRedirecting(true);
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/api/auth/github";
  };

  return (
    <div className="max-w-md mx-auto mt-12 animate-fade-in-up">
      <div className="bg-card p-8 rounded-2xl shadow-sm border border-border text-center">
        <div className="w-16 h-16 bg-zinc-100 border border-zinc-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <GitBranch className="w-8 h-8 text-zinc-900" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2 text-zinc-900">Connect GitHub</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Authenticate with GitHub to sync your repositories, languages, and contribution statistics.
        </p>

        <Button 
          onClick={handleConnect}
          className="w-full h-12 gap-2 bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm transition-all duration-300 rounded-lg text-base font-medium" 
          disabled={isRedirecting}
        >
          {isRedirecting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              Connect Account
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
