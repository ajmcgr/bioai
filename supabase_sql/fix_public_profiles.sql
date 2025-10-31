-- Fix public profile access for trybio.ai
-- Run this in Supabase SQL Editor

-- 1. Ensure profiles table has all needed columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS button_style text DEFAULT 'solid',
ADD COLUMN IF NOT EXISTS button_corners text DEFAULT 'round',
ADD COLUMN IF NOT EXISTS font_size integer DEFAULT 16,
ADD COLUMN IF NOT EXISTS font_weight text DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS hide_branding boolean DEFAULT false;

-- 2. Recreate profiles_api view with all columns needed by Profile.tsx
DROP VIEW IF EXISTS public.profiles_api;
CREATE VIEW public.profiles_api AS
SELECT
  id,
  user_id,
  username,
  full_name,
  avatar_url,
  bio,
  wallpaper_url,
  text_color,
  button_color,
  button_text_color,
  background_color,
  font,
  links,
  is_primary,
  button_style,
  button_corners,
  font_size,
  font_weight,
  hide_branding,
  created_at,
  updated_at
FROM public.profiles;

-- 3. Ensure public read access to profiles
DROP POLICY IF EXISTS profiles_select_public ON public.profiles;
CREATE POLICY profiles_select_public ON public.profiles
FOR SELECT TO anon, authenticated
USING (true);

-- 4. Grant access to view
GRANT SELECT ON public.profiles_api TO anon, authenticated;

-- 5. Refresh schema cache
NOTIFY pgrst, 'reload schema';
