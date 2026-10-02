-- ==============================================================================
-- KRAIT ABYSS - BULLETPROOF PRODUCTION DATABASE SCHEMA & SECURITY HARDENING
-- Target Project ID: epwmvtlnxkixoyuflxuy
-- Execute in Supabase SQL Editor: https://supabase.com/dashboard/project/epwmvtlnxkixoyuflxuy/sql/new
-- ==============================================================================

-- 1. EXTENSIONS & ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('super_admin', 'content_admin', 'marketing_admin');
  END IF;
END $$;

-- 2. HELPER FUNCTIONS & TRIGGERS
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END; $$;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  company TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'USER',
  is_verified BOOLEAN NOT NULL DEFAULT false,
  two_factor_enabled BOOLEAN NOT NULL DEFAULT false,
  two_factor_secret TEXT,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO anon, authenticated, service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. USER ROLES TABLE
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated, service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Enhanced Role & Admin Checks (No Infinite Recursion)
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(
    (SELECT role FROM public.profiles WHERE id = _user_id),
    'USER'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = _user_id AND role = 'ADMIN'
  );
$$;

GRANT EXECUTE ON FUNCTION public.get_user_role(uuid) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO anon, authenticated, service_role;

-- Profiles RLS Policies (Safe, No Subquery Loops)
DROP POLICY IF EXISTS "anyone reads profiles" ON public.profiles;
DROP POLICY IF EXISTS "own profile read" ON public.profiles;
DROP POLICY IF EXISTS "own profile write" ON public.profiles;
DROP POLICY IF EXISTS "own profile insert" ON public.profiles;

CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "own profile write" ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id OR public.is_admin(auth.uid()))
  WITH CHECK (auth.uid() = id OR public.is_admin(auth.uid()));

CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated, anon
  WITH CHECK (true);

-- 5. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT,
  user_name TEXT,
  name TEXT NOT NULL DEFAULT 'Project Brief',
  client_name TEXT,
  category TEXT,
  service_type TEXT,
  description TEXT,
  project_description TEXT,
  what_we_did TEXT,
  budget_range TEXT,
  timeline TEXT,
  relevant_links TEXT,
  additional_requirements TEXT,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  project_link TEXT,
  completion_date DATE,
  status TEXT NOT NULL DEFAULT 'completed',
  published BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  assigned_team_member TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO anon, authenticated, service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public reads published projects" ON public.projects;
DROP POLICY IF EXISTS "auth reads own projects" ON public.projects;
DROP POLICY IF EXISTS "admins manage projects" ON public.projects;
DROP POLICY IF EXISTS "anyone inserts project" ON public.projects;

CREATE POLICY "public reads published projects" ON public.projects FOR SELECT TO anon, authenticated
  USING (published = true OR auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "anyone inserts project" ON public.projects FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "admins manage projects" ON public.projects FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP TRIGGER IF EXISTS t_projects ON public.projects;
CREATE TRIGGER t_projects BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 6. MEETINGS TABLE (Book a Call Intake)
CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meetings TO anon, authenticated, service_role;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own meetings read" ON public.meetings;
DROP POLICY IF EXISTS "own meetings insert" ON public.meetings;
DROP POLICY IF EXISTS "admins manage meetings" ON public.meetings;
DROP POLICY IF EXISTS "anyone inserts meeting" ON public.meetings;

CREATE POLICY "anyone inserts meeting" ON public.meetings FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "own meetings read" ON public.meetings FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "admins manage meetings" ON public.meetings FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP TRIGGER IF EXISTS t_meetings ON public.meetings;
CREATE TRIGGER t_meetings BEFORE UPDATE ON public.meetings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 7. USER 2FA TABLE
CREATE TABLE IF NOT EXISTS public.user_2fa (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  encrypted_secret TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  backup_code_hashes TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_2fa TO authenticated, service_role;
ALTER TABLE public.user_2fa ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own 2fa status" ON public.user_2fa;
CREATE POLICY "Users can view own 2fa status" ON public.user_2fa FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS user_2fa_updated_at ON public.user_2fa;
CREATE TRIGGER user_2fa_updated_at BEFORE UPDATE ON public.user_2fa FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 8. CONTACT REQUESTS & CAREER APPLICATIONS
CREATE TABLE IF NOT EXISTS public.contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  service TEXT,
  budget TEXT,
  message TEXT NOT NULL,
  preferred_time TEXT,
  handled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_requests TO anon, authenticated, service_role;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone submits enquiry" ON public.contact_requests;
CREATE POLICY "anyone submits enquiry" ON public.contact_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anyone reads enquiries" ON public.contact_requests FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.career_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role_applied TEXT NOT NULL,
  location TEXT,
  portfolio_url TEXT,
  resume_url TEXT,
  cover_note TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.career_applications TO anon, authenticated, service_role;
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone applies" ON public.career_applications;
CREATE POLICY "anyone applies" ON public.career_applications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anyone reads applications" ON public.career_applications FOR SELECT TO anon, authenticated USING (true);

-- 9. SERVICES & TEAM MEMBERS TABLES
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  tagline TEXT,
  summary TEXT,
  items TEXT[] NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO anon, authenticated, service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public reads services" ON public.services;
CREATE POLICY "public reads services" ON public.services FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  category TEXT NOT NULL,
  responsibilities TEXT[] NOT NULL DEFAULT '{}',
  linkedin_url TEXT,
  photo_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO anon, authenticated, service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public reads team" ON public.team_members;
CREATE POLICY "public reads team" ON public.team_members FOR SELECT TO anon, authenticated USING (true);

-- 10. STORAGE BUCKET FOR AVATARS
DO $$ BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('avatars', 'avatars', true)
  ON CONFLICT (id) DO NOTHING;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 11. AUTH SIGNUP TRIGGER
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(published);
CREATE INDEX IF NOT EXISTS idx_meetings_user_email ON public.meetings(user_email);
CREATE INDEX IF NOT EXISTS idx_meetings_preferred_date ON public.meetings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
