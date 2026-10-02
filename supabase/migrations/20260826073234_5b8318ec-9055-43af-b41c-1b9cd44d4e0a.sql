
-- roles
CREATE TYPE public.app_role AS ENUM ('super_admin','content_admin','marketing_admin');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile write" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id);
$$;

CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "super admin manages roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name',''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- projects
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  client_name TEXT,
  category TEXT,
  description TEXT,
  what_we_did TEXT,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  project_link TEXT,
  completion_date DATE,
  status TEXT NOT NULL DEFAULT 'completed',
  published BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads published projects" ON public.projects FOR SELECT TO anon USING (published = true);
CREATE POLICY "auth reads published projects" ON public.projects FOR SELECT TO authenticated USING (published = true OR public.is_admin(auth.uid()));
CREATE POLICY "admins manage projects" ON public.projects FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER t_projects BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- offers
CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  discount TEXT,
  start_date DATE,
  end_date DATE,
  image_url TEXT,
  cta_text TEXT,
  cta_link TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.offers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.offers TO authenticated;
GRANT ALL ON public.offers TO service_role;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads active offers" ON public.offers FOR SELECT TO anon
  USING (active = true AND (end_date IS NULL OR end_date >= CURRENT_DATE));
CREATE POLICY "auth reads offers" ON public.offers FOR SELECT TO authenticated
  USING ((active = true AND (end_date IS NULL OR end_date >= CURRENT_DATE)) OR public.is_admin(auth.uid()));
CREATE POLICY "admins manage offers" ON public.offers FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER t_offers BEFORE UPDATE ON public.offers FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- services (editable overrides / additions)
CREATE TABLE public.services (
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
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads services" ON public.services FOR SELECT TO anon USING (published = true);
CREATE POLICY "auth reads services" ON public.services FOR SELECT TO authenticated USING (published = true OR public.is_admin(auth.uid()));
CREATE POLICY "admins manage services" ON public.services FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER t_services BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- testimonials
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  company TEXT,
  quote TEXT NOT NULL,
  rating INT,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads testimonials" ON public.testimonials FOR SELECT TO anon USING (published = true);
CREATE POLICY "auth reads testimonials" ON public.testimonials FOR SELECT TO authenticated USING (published = true OR public.is_admin(auth.uid()));
CREATE POLICY "admins manage testimonials" ON public.testimonials FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER t_testimonials BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- team members
CREATE TABLE public.team_members (
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
GRANT SELECT ON public.team_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads team" ON public.team_members FOR SELECT TO anon USING (published = true);
CREATE POLICY "auth reads team" ON public.team_members FOR SELECT TO authenticated USING (published = true OR public.is_admin(auth.uid()));
CREATE POLICY "admins manage team" ON public.team_members FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER t_team BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- generic site content (key/value blocks)
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  label TEXT,
  value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads content" ON public.site_content FOR SELECT TO anon USING (true);
CREATE POLICY "auth reads content" ON public.site_content FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins manage content" ON public.site_content FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER t_content BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- contact enquiries
CREATE TABLE public.contact_requests (
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
GRANT INSERT ON public.contact_requests TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_requests TO authenticated;
GRANT ALL ON public.contact_requests TO service_role;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone submits enquiry" ON public.contact_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read enquiries" ON public.contact_requests FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admins update enquiries" ON public.contact_requests FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "admins delete enquiries" ON public.contact_requests FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- career applications
CREATE TABLE public.career_applications (
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
GRANT INSERT ON public.career_applications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.career_applications TO authenticated;
GRANT ALL ON public.career_applications TO service_role;
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone applies" ON public.career_applications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read applications" ON public.career_applications FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admins update applications" ON public.career_applications FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "admins delete applications" ON public.career_applications FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- seed team
INSERT INTO public.team_members (name, role, category, responsibilities, linkedin_url, sort_order) VALUES
('Mohd Aaliya Jabeen','Front-End Designer · Team Designer · Website Builder','Development',ARRAY['Front-end design','UI/UX and visual design','Team design','Website building','Website interface implementation'],'https://www.linkedin.com/in/mohd-aaliya-jabeen-8b7272325/',1),
('Abdullah Mohammed Khan','Backend Professional · AWS & Cloud','Development',ARRAY['Backend development','Server-side systems','Database/backend integration','AWS','Cloud infrastructure','Deployment and backend operations'],'https://www.linkedin.com/in/abdullah-mohammed-khan-1b4436346/',2),
('Shahistha Aliya Shaik','Software Testing & Debugging','Development',ARRAY['Software testing','Bug detection','Debugging','Quality assurance','Functional testing','UI testing'],'https://www.linkedin.com/in/shahistha-aliya-shaik-800b292a2/',3),
('Mohammed Fardeen','Research & Pitching','Research & Pitching',ARRAY['Client research','Market research','Lead research','Preparing information for pitches','Pitching','Client communication'],'https://www.linkedin.com/in/fardeen-md/',4),
('Mohd Saniya Begum','Research · Database Handling','Research & Pitching',ARRAY['Research','Market research','Client research','Collecting relevant information','Preparing research material required for pitching','Database handling','Organizing and maintaining research data'],'https://www.linkedin.com/in/mohd-saniya-begum/',5),
('Keshav Loya','Digital Marketing','Marketing & Social Media',ARRAY['Digital marketing','Marketing campaigns','Online growth','Digital presence','Marketing strategy and execution'],'https://www.linkedin.com/in/keshav-loya/',6),
('Mohammed Imran Khan','Social Media Handling','Marketing & Social Media',ARRAY['Social media handling','Social media management','Content coordination','Maintaining the company''s social presence','Social media engagement'],'https://www.linkedin.com/in/mohammed-imran-khan-971392420/',7);

INSERT INTO public.site_content (key, label, value) VALUES
('home_hero_title','Homepage hero title','We build digital products and intelligent systems.'),
('home_hero_subtitle','Homepage hero subtitle','A technology studio for businesses, creators and organizations — engineering websites, AI agents, automation pipelines, interfaces and the infrastructure underneath them.'),
('contact_note','Contact page note','Tell us about the work. Our team reviews every brief and reaches out to schedule a call.');
