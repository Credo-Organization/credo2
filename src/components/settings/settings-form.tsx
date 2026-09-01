"use client";

import { useState } from "react";
import { Profile } from "@/types/database";
import { updateProfile } from "@/actions/profile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

export function SettingsForm({ profile }: { profile: Profile }) {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedGender, setSelectedGender] = useState(
    profile.gender?.toLowerCase() || "male"
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const genderVal = (formData.get("gender") as string) || selectedGender;
    const isFemale = genderVal.toLowerCase() === "female";
    const avatarUrl = isFemale ? "/avatar-female.webp" : "/avatar-male.webp";

    const data = {
      full_name: formData.get("full_name") as string,
      bio: formData.get("bio") as string,
      college_name: formData.get("college_name") as string,
      graduation_year: formData.get("graduation_year") as string,
      degree: formData.get("degree") as string,
      career_goal: formData.get("career_goal") as string,
      gender: genderVal,
      avatar_url: avatarUrl,
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
      {/* Interactive Avatar Preview */}
      <div className="p-4 rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 flex items-center gap-4 transition-colors">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-900 dark:border-zinc-600 bg-white dark:bg-zinc-900 shrink-0 shadow-xs">
          <img
            src={selectedGender === "female" ? "/avatar-female.webp" : "/avatar-male.webp"}
            alt="Doodle Avatar Preview"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-black text-zinc-950 dark:text-zinc-100 block">
              Passport Doodle Avatar
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed mt-0.5">
            Automatically toggles between your official hand-drawn male and female WebP avatars based on gender selection.
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="full_name" className="text-xs font-bold text-zinc-950 dark:text-zinc-100">Full Name</Label>
        <Input 
          id="full_name" 
          name="full_name" 
          defaultValue={profile.full_name || ""} 
          placeholder="e.g. Subham Singh"
          className="h-11 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 rounded-xl text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-500 font-medium focus-visible:ring-2 focus-visible:ring-blue-600 shadow-xs"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bio" className="text-xs font-bold text-zinc-950 dark:text-zinc-100">Bio</Label>
        <Textarea 
          id="bio" 
          name="bio" 
          defaultValue={profile.bio || ""} 
          placeholder="Tell us a little about yourself and engineering interests..."
          className="min-h-[100px] bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 rounded-xl text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-500 font-medium focus-visible:ring-2 focus-visible:ring-blue-600 shadow-xs resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="college_name" className="text-xs font-bold text-zinc-950 dark:text-zinc-100">College / University</Label>
          <Input 
            id="college_name" 
            name="college_name" 
            defaultValue={profile.college_name || ""} 
            placeholder="e.g. IIT Delhi / BITS Pilani"
            className="h-11 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 rounded-xl text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-500 font-medium focus-visible:ring-2 focus-visible:ring-blue-600 shadow-xs"
          />
        </div>
        
        <div className="space-y-1.5">
          <Label htmlFor="graduation_year" className="text-xs font-bold text-zinc-950 dark:text-zinc-100">Graduation Year</Label>
          <Input 
            id="graduation_year" 
            name="graduation_year" 
            defaultValue={profile.graduation_year || ""} 
            placeholder="e.g. 2026"
            className="h-11 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 rounded-xl text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-500 font-medium focus-visible:ring-2 focus-visible:ring-blue-600 shadow-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="degree" className="text-xs font-bold text-zinc-950 dark:text-zinc-100">Degree</Label>
          <Input 
            id="degree" 
            name="degree" 
            defaultValue={profile.degree || ""} 
            placeholder="e.g. B.Tech Computer Science"
            className="h-11 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 rounded-xl text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-500 font-medium focus-visible:ring-2 focus-visible:ring-blue-600 shadow-xs"
          />
        </div>
        
        <div className="space-y-1.5">
          <Label htmlFor="career_goal" className="text-xs font-bold text-zinc-950 dark:text-zinc-100">Career Goal / Headline</Label>
          <Input 
            id="career_goal" 
            name="career_goal" 
            defaultValue={profile.headline || ""} 
            placeholder="e.g. Frontend Engineer"
            className="h-11 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 rounded-xl text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-500 font-medium focus-visible:ring-2 focus-visible:ring-blue-600 shadow-xs"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="gender" className="text-xs font-bold text-zinc-950 dark:text-zinc-100">Gender</Label>
        <Select 
          name="gender" 
          defaultValue={profile.gender || "male"}
          onValueChange={(val) => {
            if (val) setSelectedGender(val.toLowerCase());
          }}
        >
          <SelectTrigger className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 rounded-xl text-zinc-950 dark:text-zinc-100 font-medium focus-visible:ring-2 focus-visible:ring-blue-600 shadow-xs cursor-pointer">
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 rounded-xl text-zinc-950 dark:text-zinc-100 shadow-md">
            <SelectItem value="male" className="cursor-pointer">Male</SelectItem>
            <SelectItem value="female" className="cursor-pointer">Female</SelectItem>
            <SelectItem value="non-binary" className="cursor-pointer">Non-binary</SelectItem>
            <SelectItem value="prefer-not-to-say" className="cursor-pointer">Prefer not to say</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end pt-4 border-t-2 border-dashed border-zinc-200 dark:border-zinc-800">
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-black border-2 border-zinc-900 dark:border-zinc-700 rounded-xl px-6 h-11 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000] active:translate-y-[1px] transition-all cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving Profile...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
