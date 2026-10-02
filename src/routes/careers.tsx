import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Panel, SectionHeader, Btn, CodePanel } from "@/components/site/ui";
import { CareersEnergyVisual } from "@/components/site/CareersEnergyVisual";
import { COUNTRY_OPTIONS } from "@/routes/contact";
import { resilientDispatchService } from "@/services/resilientDispatchService";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Work With Us — Careers at Krait Abyss" },
      {
        name: "description",
        content:
          "Apply to work with Krait Abyss. Tell us the role you want, your skills and experience, and share your resume.",
      },
      { property: "og:title", content: "Work With Us — Krait Abyss" },
      {
        property: "og:description",
        content: "Tell us the role you're applying for and share your resume.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Careers,
});

const fieldStyle =
  "mt-2 w-full rounded-md border border-input bg-abyss px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-ring";

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  textarea,
  selectOptions,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  textarea?: boolean;
  selectOptions?: string[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}) {
  return (
    <label className="block">
      <span className="k-label">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          rows={4}
          required={required}
          placeholder={placeholder}
          className={fieldStyle}
          value={value ?? ""}
          onChange={onChange}
        />
      ) : selectOptions ? (
        <select
          name={name}
          required={required}
          className={fieldStyle}
          value={value ?? ""}
          onChange={onChange}
        >
          {selectOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className={fieldStyle}
          value={value ?? ""}
          onChange={onChange}
        />
      )}
    </label>
  );
}

export function Careers() {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  // Controlled Form Fields State
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [linkedin, setLinkedin] = useState<string>("");
  const [portfolioUrl, setPortfolioUrl] = useState<string>("");
  const [selectedExp, setSelectedExp] = useState<string>("");
  const [skills, setSkills] = useState<string>("");
  const [whyKraitAbyss, setWhyKraitAbyss] = useState<string>("");

  // International Phone Selector State (Reusing COUNTRY_OPTIONS)
  const [selectedCountryIndex, setSelectedCountryIndex] = useState<number>(0);
  const [countryCode, setCountryCode] = useState<string>(COUNTRY_OPTIONS[0]!.code);
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setLocation("");
    setSelectedRole("");
    setLinkedin("");
    setPortfolioUrl("");
    setSelectedExp("");
    setSkills("");
    setWhyKraitAbyss("");
    setSelectedCountryIndex(0);
    setCountryCode(COUNTRY_OPTIONS[0]!.code);
    setPhoneNumber("");
    setSelectedFile(null);
    setFileError(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setStatus("idle");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    const fileExt = (file.name.split(".").pop() || "").toLowerCase();
    const allowed = ["pdf", "doc", "docx"];
    if (!allowed.includes(fileExt)) {
      setFileError("Please upload a PDF, DOC, or DOCX resume.");
      setSelectedFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError("Please upload a PDF, DOC, or DOCX resume under 5 MB.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    setError(null);
    setFileError(null);

    const cleanFullName = fullName.trim();
    const cleanEmail = email.trim();
    const cleanLocation = location.trim();
    const roleApplied = selectedRole.trim();
    const cleanLinkedin = linkedin.trim();
    const cleanPortfolioUrl = portfolioUrl.trim();
    const experience = selectedExp.trim();
    const cleanSkills = skills.trim();
    const cleanWhy = whyKraitAbyss.trim();

    // 1. FULL NAME VALIDATION
    const nameRegex = /^[a-zA-Z\s'\-áéíóúÁÉÍÓÚñÑäöüÄÖÜ]{2,80}$/;
    if (!cleanFullName || !nameRegex.test(cleanFullName) || /^(\w)\1+$/.test(cleanFullName.replace(/\s/g, ""))) {
      setError("Please enter a valid full name using real letters.");
      return;
    }

    // 2. EMAIL ADDRESS VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setError("Please enter a valid email address (e.g. john@example.com).");
      return;
    }

    // 3. INTERNATIONAL PHONE NUMBER VALIDATION
    const rawNum = phoneNumber.trim();
    if (!rawNum) {
      setError("Please enter your phone number.");
      return;
    }

    const country = (COUNTRY_OPTIONS[selectedCountryIndex] || COUNTRY_OPTIONS[0])!;
    const digitsOnly = rawNum.replace(/\D/g, "");

    if (digitsOnly.length < country.minDigits || digitsOnly.length > country.maxDigits) {
      if (country.minDigits === country.maxDigits) {
        setError(`Please enter a valid ${country.minDigits}-digit phone number for ${country.name}.`);
      } else {
        setError(`Please enter a valid ${country.minDigits}-${country.maxDigits} digit phone number for ${country.name}.`);
      }
      return;
    }

    const fullPhone = `${countryCode} ${rawNum} (${country.name})`.trim();

    // 4. LOCATION VALIDATION
    if (!cleanLocation || cleanLocation.length < 2) {
      setError("Please enter a valid location (City, Country).");
      return;
    }

    // 5. ROLE APPLYING FOR VALIDATION
    if (!roleApplied || roleApplied.length < 2) {
      setError("Please enter the role you are applying for.");
      return;
    }

    // 6. LINKEDIN PROFILE URL VALIDATION
    const linkedinRegex = /^(https?:\/\/)?([a-z0-9]+\.)?linkedin\.com\/(in|company|pub|profile)\/[a-zA-Z0-9_\-%.\/]+(\?.*)?$/i;
    if (cleanLinkedin && cleanLinkedin.length > 0) {
      if (!linkedinRegex.test(cleanLinkedin) && !cleanLinkedin.toLowerCase().includes("linkedin.com")) {
        setError("Please enter a valid LinkedIn profile URL (e.g. https://linkedin.com/in/username).");
        return;
      }
    }

    // 7. PORTFOLIO URL VALIDATION (OPTIONAL BUT VALID IF ENTERED)
    if (cleanPortfolioUrl && cleanPortfolioUrl.length > 0) {
      const urlRegex = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[^\s]*)?$/i;
      if (!urlRegex.test(cleanPortfolioUrl)) {
        setError("Please enter a valid portfolio URL (e.g. https://yourportfolio.com or https://github.com/username).");
        return;
      }
    }

    // 8. YEARS OF EXPERIENCE VALIDATION
    if (!experience || experience.toLowerCase().includes("select")) {
      setError("Please select a valid years of experience level.");
      return;
    }

    // 9. SKILLS & TECHNOLOGIES VALIDATION
    if (!cleanSkills || cleanSkills.length < 5) {
      setError("Please list your relevant skills and technologies (min 5 characters).");
      return;
    }

    // 10. WHY WORK WITH KRAIT ABYSS VALIDATION
    if (!cleanWhy || cleanWhy.length < 15) {
      setError("Please provide a meaningful answer for why you want to work with Krait Abyss (min 15 characters).");
      return;
    }

    // 11. RESUME FILE VALIDATION
    const resumeFile = selectedFile;
    if (!resumeFile || resumeFile.size === 0) {
      setError("Please upload your Resume/CV (PDF, DOC, or DOCX up to 5 MB).");
      return;
    }

    const fileExt = (resumeFile.name.split(".").pop() || "").toLowerCase();
    if (!["pdf", "doc", "docx"].includes(fileExt)) {
      setError("Invalid file format. Please upload a PDF, DOC, or DOCX resume.");
      return;
    }

    if (resumeFile.size > 5 * 1024 * 1024) {
      setError("Please upload a PDF, DOC, or DOCX resume under 5 MB.");
      return;
    }

    setStatus("sending");

    try {
      const base64Data = await readFileAsBase64(resumeFile);

      const res = await resilientDispatchService.submitCareerApplication({
        fullName: cleanFullName,
        email: cleanEmail,
        phone: fullPhone,
        location: cleanLocation,
        roleApplied,
        linkedin: cleanLinkedin,
        portfolioUrl: cleanPortfolioUrl,
        experience,
        skills: cleanSkills,
        whyKraitAbyss: cleanWhy,
        resume: {
          fileName: resumeFile.name,
          fileType: resumeFile.type,
          fileSize: resumeFile.size,
          base64Data,
        },
      });

      if (res.success) {
        setStatus("done");
      } else {
        setError(res.error || "Failed to submit job application. Please check your details and try again.");
        setStatus("idle");
      }
    } catch (err: any) {
      console.error("Careers form submission error:", err);
      setError("Network error submitting application. Please check your connection.");
      setStatus("idle");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeader
        eyebrow="KRAIT_ABYSS / CAREERS"
        title="Work with us & Internships"
        description="We're a specialized technology studio building AI agents, automation pipelines, web products and digital experiences. Explore open roles, internships, or submit a general application."
      />

      {/* Open Roles & Internships Overview */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            role: "AI / ML Engineering Intern",
            type: "INTERNSHIP / Remote",
            desc: "Build agentic workflows, LLM prompt engineering, RAG pipelines, and Python AI models.",
            skills: "Python, LangChain, n8n, OpenAI, Vector DBs",
          },
          {
            role: "UI / UX Product Design Intern",
            type: "INTERNSHIP / Remote",
            desc: "Design token-driven UI systems, interactive Figma prototypes, and product UI interfaces.",
            skills: "Figma, Design Systems, UI/UX Prototyping",
          },
          {
            role: "AI / ML Systems Engineer",
            type: "FULL-TIME / Remote",
            desc: "Engineer autonomous AI agent swarms, RAG pipelines, n8n automations, and AI infrastructure.",
            skills: "Python, PyTorch, FastAPI, n8n, LangGraph",
          },
          {
            role: "Full-Stack Web Engineer",
            type: "FULL-TIME / Remote or On-site",
            desc: "Develop production web applications, React/TypeScript frontends, and cloud API backends.",
            skills: "TypeScript, React, Node.js, Tailwind, Postgres",
          },
        ].map((job, idx) => (
          <div
            key={idx}
            className="surface-panel rounded-xl p-4 border border-border/80 bg-card/70 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-[9px] text-steel font-bold uppercase">
                  {job.type}
                </span>
                <span className="font-mono text-[9px] bg-steel/10 text-steel px-2 py-0.5 rounded border border-steel/30 font-semibold">
                  OPEN
                </span>
              </div>
              <h3 className="text-sm font-semibold text-foreground">{job.role}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{job.desc}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/50 text-[10px] font-mono text-steel">
              Skills: {job.skills}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
        {status === "done" ? (
          <Panel label="APPLICATION / RECEIVED" hover={false}>
            <h3 className="text-xl font-semibold text-foreground">Thank you for applying!</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Your job application and resume have been logged securely and notified to Krait Abyss engineering leads at
              kraitabyss07@gmail.com. We will review your profile and reach out shortly.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-steel/40 bg-steel/10 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-steel hover:bg-steel/20 cursor-pointer"
              >
                Submit Another Application
              </button>
            </div>
          </Panel>
        ) : (
          <form onSubmit={onSubmit} className="k-card p-7 space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Full Name *"
                name="full_name"
                required
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Field
                label="Email Address *"
                name="email"
                type="email"
                required
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
              {/* REUSED INTERNATIONAL PHONE SELECTOR FROM QUICK DISCOVERY CALL */}
              <div className="block">
                <span className="k-label">Phone Number *</span>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 mt-2">
                  <div className="sm:col-span-6 relative">
                    <select
                      value={selectedCountryIndex}
                      onChange={(e) => {
                        const idx = Number(e.target.value);
                        setSelectedCountryIndex(idx);
                        const c = COUNTRY_OPTIONS[idx];
                        if (c) setCountryCode(c.code);
                      }}
                      className="w-full appearance-none rounded-md border border-input bg-abyss pl-3 pr-7 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-ring font-mono truncate"
                    >
                      {COUNTRY_OPTIONS.map((c, i) => (
                        <option key={`${c.short}-${i}`} value={i} className="bg-card text-foreground py-1">
                          {c.flag} {c.name} ({c.code})
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-2.5 top-3.5 pointer-events-none text-muted-foreground text-[10px]">
                      ▼
                    </div>
                  </div>
                  <div className="sm:col-span-6 relative flex items-center">
                    <span className="absolute left-3 font-mono text-sm text-steel font-bold pointer-events-none select-none z-10">
                      {countryCode}
                    </span>
                    <input
                      name="phone"
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^\d\s-]/g, "");
                        const country = (COUNTRY_OPTIONS[selectedCountryIndex] || COUNTRY_OPTIONS[0])!;
                        const digitsOnly = val.replace(/\D/g, "");
                        if (digitsOnly.length <= country.maxDigits) {
                          setPhoneNumber(val);
                        }
                      }}
                      placeholder={COUNTRY_OPTIONS[selectedCountryIndex]?.placeholder || "Enter phone number"}
                      className={`w-full rounded-md border border-input bg-abyss pr-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-ring ${
                        countryCode.length >= 4 ? "pl-16" : countryCode.length >= 3 ? "pl-14" : "pl-10"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <Field
                label="Location *"
                name="location"
                required
                placeholder="Hyderabad, India or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Field
                label="Role Applying For *"
                name="role_applied"
                required
                placeholder="e.g. AI / ML Engineering Intern, Full-Stack Web Engineer..."
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              />

              <Field
                label="LinkedIn Profile URL (Optional)"
                name="linkedin"
                placeholder="https://linkedin.com/in/username"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
              />
              <Field
                label="Portfolio URL (Optional)"
                name="portfolio_url"
                placeholder="https://yourportfolio.com"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
              />
              <Field
                label="Years of Experience *"
                name="experience"
                required
                value={selectedExp}
                onChange={(e) => setSelectedExp(e.target.value)}
                selectOptions={[
                  "Select Years of Experience...",
                  "0 (Fresher / Internship Candidate)",
                  "1 Year",
                  "2+ Years",
                  "3+ Years",
                  "5+ Years",
                ]}
              />
            </div>
            <div className="space-y-5">
              <Field
                label="Skills & Technologies *"
                name="skills"
                textarea
                required
                placeholder="e.g. Python, React, TypeScript, Figma..."
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
              <Field
                label="Why do you want to work with Krait Abyss? *"
                name="why"
                textarea
                required
                placeholder="Share your motivation..."
                value={whyKraitAbyss}
                onChange={(e) => setWhyKraitAbyss(e.target.value)}
              />
              
              <label className="block">
                <span className="k-label">Resume / CV (PDF, DOC, DOCX — Max 5 MB) *</span>
                <input
                  ref={fileInputRef}
                  name="resume"
                  type="file"
                  required
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className={`${fieldStyle} file:mr-3 file:rounded file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:text-secondary-foreground cursor-pointer`}
                />
                {fileError && <span className="text-xs text-destructive font-mono mt-1 block">{fileError}</span>}
              </label>
            </div>

            {error ? <p className="text-xs text-destructive font-mono bg-destructive/10 p-3 rounded-lg border border-destructive/30">{error}</p> : null}

            <p className="text-[10px] text-muted-foreground leading-tight text-center font-mono">
              By applying, you agree to our{" "}
              <Link to="/privacy-policy" className="underline hover:text-foreground">
                Privacy Policy
              </Link>{" "}
              &amp;{" "}
              <Link to="/terms" className="underline hover:text-foreground">
                Terms of Service
              </Link>
              .
            </p>

            <Btn
              type="submit"
              className="w-full justify-center font-mono uppercase tracking-widest font-bold text-xs py-3.5"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Submitting Job Application…" : "Submit Job Application →"}
            </Btn>
          </form>
        )}

        <aside className="space-y-5 flex flex-col justify-between">
          <Panel label="LOCATION / 001">
            <p className="text-lg font-semibold tracking-tight">Hyderabad & Remote</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Remote-friendly collaboration across global teams.
            </p>
          </Panel>
          <CodePanel
            title="APPLICATION_PIPELINE"
            lines={["received", "reviewed by engineering leads", "we reach out to you"]}
          />
          <div className="surface-panel p-4 rounded-2xl border border-border/80 bg-card/90 flex-1 flex flex-col min-h-[320px]">
            <div className="flex-1 w-full flex items-center justify-center overflow-hidden rounded-xl bg-black/60 min-h-[280px] relative">
              <CareersEnergyVisual className="w-full h-full min-h-[280px]" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
