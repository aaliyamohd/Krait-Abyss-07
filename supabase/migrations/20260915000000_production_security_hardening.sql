-- Production Security, Auth, RLS, Meetings & Storage Hardening Migration

-- 1. Ensure Profiles table has all necessary columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'USER';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS two_factor_secret TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- 2. Enhanced Role Checks
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(
    (SELECT role FROM public.profiles WHERE id = _user_id),
    (SELECT role::text FROM public.user_roles WHERE user_id = _user_id LIMIT 1),
    'USER'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = _user_id AND role = 'ADMIN'
    UNION
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin', 'content_admin', 'marketing_admin')
  );
$$;

-- Revoke execute from public/anon, grant to authenticated
REVOKE ALL ON FUNCTION public.get_user_role(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_user_role(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;

-- 3. Update Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own profile read" ON public.profiles;
DROP POLICY IF EXISTS "own profile write" ON public.profiles;
DROP POLICY IF EXISTS "own profile insert" ON public.profiles;
DROP POLICY IF EXISTS "admins read profiles" ON public.profiles;

CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.is_admin(auth.uid()));

CREATE POLICY "own profile write" ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id OR public.is_admin(auth.uid()))
  WITH CHECK (
    (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()))
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- 4. Projects Table Columns & RLS Policy Update
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS user_email TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS user_name TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS service_type TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS project_description TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS budget_range TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS timeline TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS relevant_links TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS additional_requirements TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS assigned_team_member TEXT;

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public reads published projects" ON public.projects;
DROP POLICY IF EXISTS "auth reads published projects" ON public.projects;
DROP POLICY IF EXISTS "admins manage projects" ON public.projects;

CREATE POLICY "public reads published projects" ON public.projects FOR SELECT TO anon
  USING (published = true);

CREATE POLICY "auth reads own projects" ON public.projects FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR published = true OR public.is_admin(auth.uid()));

CREATE POLICY "auth inserts own project request" ON public.projects FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admins manage projects" ON public.projects FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 5. Meetings Table & RLS Policies
CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  meeting_type TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  call_duration TEXT NOT NULL DEFAULT '15 min',
  description TEXT,
  status TEXT NOT NULL DEFAULT 'REQUESTED',
  meeting_link TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.meetings TO authenticated;
GRANT ALL ON public.meetings TO service_role;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own meetings read" ON public.meetings;
DROP POLICY IF EXISTS "own meetings insert" ON public.meetings;
DROP POLICY IF EXISTS "admins manage meetings" ON public.meetings;

CREATE POLICY "own meetings read" ON public.meetings FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "own meetings insert" ON public.meetings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admins manage meetings" ON public.meetings FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Trigger for updating updated_at timestamp on meetings
DROP TRIGGER IF EXISTS t_meetings ON public.meetings;
CREATE TRIGGER t_meetings BEFORE UPDATE ON public.meetings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 6. Storage Bucket for Avatars & Policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "anyone views avatars" ON storage.objects;
DROP POLICY IF EXISTS "users upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "users update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "users delete own avatar" ON storage.objects;

CREATE POLICY "anyone views avatars" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'avatars');

CREATE POLICY "users upload own avatar" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "users update own avatar" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "users delete own avatar" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 7. Update handle_new_user trigger to populate default profile fields
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, company, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'company', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'USER'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);
  RETURN NEW;
END; $$;
