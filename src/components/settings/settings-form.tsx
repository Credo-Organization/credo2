"use client";

import { useState } from "react";
import { Profile } from "@/types/database";
import { updateProfile } from "@/actions/profile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function SettingsForm({ profile }: { profile: Profile }) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      full_name: formData.get("full_name") as string,
      bio: formData.get("bio") as string,
      college_name: formData.get("college_name") as string,
      graduation_year: formData.get("graduation_year") as string,
    };

    const result = await updateProfile(data);
    
    if (result.success) {
      toast.success("Profile updated successfully!");
    } else {
      toast.error(result.error || "Failed to update profile");
    }
    
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input 
          id="full_name" 
          name="full_name" 
          defaultValue={profile.full_name || ""} 
          placeholder="e.g. Subham Singh"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea 
          id="bio" 
          name="bio" 
          defaultValue={profile.bio || ""} 
          placeholder="Tell us a little about yourself..."
          className="min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="college_name">College / University</Label>
          <Input 
            id="college_name" 
            name="college_name" 
            defaultValue={profile.college_name || ""} 
            placeholder="e.g. MIT"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="graduation_year">Graduation Year</Label>
          <Input 
            id="graduation_year" 
            name="graduation_year" 
            defaultValue={profile.graduation_year || ""} 
            placeholder="e.g. 2026"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-border">
        <Button type="submit" disabled={isSaving} className="bg-zinc-900 text-white hover:bg-zinc-800">
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
