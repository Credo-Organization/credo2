"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { Share2, Copy, Check, ExternalLink } from "lucide-react";
import { togglePassportVisibility } from "@/actions/passport";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface ShareDialogProps {
  isPublic: boolean;
  username: string;
}

export function ShareDialog({ isPublic: initialIsPublic, username }: ShareDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [isUpdating, setIsUpdating] = useState(false);
  const [copied, setCopied] = useState(false);

  // In production, use the actual domain. For dev, use origin.
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://credify.app';
  const shareUrl = `${baseUrl}/p/${username}`;

  const handleToggle = async (checked: boolean) => {
    try {
      setIsUpdating(true);
      await togglePassportVisibility(checked);
      setIsPublic(checked);
      toast.success(checked ? "Passport is now public" : "Passport is now private");
    } catch (error) {
      toast.error("Failed to update visibility");
    } finally {
      setIsUpdating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button className="gap-2 bg-foreground text-background hover:bg-foreground/90">
          <Share2 className="w-4 h-4" />
          Share Passport
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border/50">
        <DialogHeader>
          <DialogTitle>Share Your Skill Passport</DialogTitle>
          <DialogDescription>
            Make your passport public to share it with recruiters and peers.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-accent/20 mt-4">
          <div className="space-y-0.5">
            <Label className="text-base font-semibold">Public Access</Label>
            <p className="text-xs text-muted-foreground">
              Anyone with the link can view your passport.
            </p>
          </div>
          <Switch
            checked={isPublic}
            onCheckedChange={handleToggle}
            disabled={isUpdating}
          />
        </div>

        {isPublic && (
          <div className="space-y-6 mt-4 animate-fade-in-up">
            <div className="flex justify-center p-4 bg-white rounded-xl">
              <QRCodeSVG 
                value={shareUrl} 
                size={180}
                level="H"
                includeMargin={true}
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label>Public Link</Label>
              <div className="flex items-center gap-2">
                <Input 
                  readOnly 
                  value={shareUrl} 
                  className="bg-accent/50 text-muted-foreground"
                />
                <Button size="icon" variant="outline" onClick={copyToClipboard} className="shrink-0">
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button size="icon" variant="outline" onClick={() => window.open(shareUrl, '_blank')} className="shrink-0">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
