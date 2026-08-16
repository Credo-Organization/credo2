-- Run this in your Supabase SQL Editor
-- This script creates the "certificates" storage bucket and sets up the necessary security rules so you can upload files.

-- 1. Create the bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'certificates', 
  'certificates', 
  true, 
  5242880, -- 5MB limit
  ARRAY['application/pdf', 'image/png', 'image/jpeg']::text[]
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['application/pdf', 'image/png', 'image/jpeg']::text[];

-- 2. Enable RLS on the storage.objects table if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow anyone to view public certificates
DROP POLICY IF EXISTS "Certificates are publicly accessible" ON storage.objects;
CREATE POLICY "Certificates are publicly accessible" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'certificates');

-- 4. Policy: Allow authenticated users to upload files to their own folder (folder name = user.id)
DROP POLICY IF EXISTS "Users can upload their own certificates" ON storage.objects;
CREATE POLICY "Users can upload their own certificates" 
  ON storage.objects FOR INSERT 
  TO authenticated 
  WITH CHECK (
    bucket_id = 'certificates' 
    AND (auth.uid())::text = (string_to_array(name, '/'))[1]
  );

-- 5. Policy: Allow authenticated users to delete their own certificates
DROP POLICY IF EXISTS "Users can delete their own certificates" ON storage.objects;
CREATE POLICY "Users can delete their own certificates" 
  ON storage.objects FOR DELETE 
  TO authenticated 
  USING (
    bucket_id = 'certificates' 
    AND (auth.uid())::text = (string_to_array(name, '/'))[1]
  );
