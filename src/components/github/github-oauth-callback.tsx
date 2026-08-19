"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { syncGitHub } from "@/actions/github";
import { generatePassport } from "@/actions/passport";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  token: string;
  login: string;
}

export function GitHubOAuthCallback({ token, login }: Props) {
  const router = useRouter();
  const hasSynced = useRef(false);

  useEffect(() => {
    if (hasSynced.current) return;
    hasSynced.current = true;

    async function doSync() {
      try {
        const result = await syncGitHub(login, token);
        if (result.success) {
          // Immediately generate passport so the dashboard isn't blank
          await generatePassport();
          toast.success("GitHub account connected and synced successfully!");
        } else {
          toast.error(result.error || "Failed to sync GitHub data.");
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to sync GitHub data.");
      } finally {
        router.replace("/dashboard"); // Redirect to dashboard after sync
      }
    }

    doSync();
  }, [token, login, router]);

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
      <Loader2 className="w-10 h-10 animate-spin text-zinc-900 mb-4" />
      <h3 className="text-xl font-medium text-zinc-900">Syncing GitHub Profile...</h3>
      <p className="text-muted-foreground mt-2">
        This might take a few moments as we analyze your repositories.
      </p>
    </div>
  );
}
