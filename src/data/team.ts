export type TeamCategory = "Development" | "Research & Pitching" | "Marketing & Social Media";

export type TeamMember = {
  name: string;
  role: string;
  category: TeamCategory;
  summary: string;
  responsibilities: string[];
  linkedin: string;
  linkedinId: string;
};

export const teamCategories: { key: TeamCategory; index: string; note: string }[] = [
  {
    key: "Development",
    index: "01",
    note: "Design, engineering, infrastructure and quality.",
  },
  {
    key: "Research & Pitching",
    index: "02",
    note: "Understanding the client, the market and the brief.",
  },
  {
    key: "Marketing & Social Media",
    index: "03",
    note: "Reach, presence and communication.",
  },
];

export const team: TeamMember[] = [
  {
    name: "Mohd Aaliya Jabeen",
    role: "Front-End Designer · Team Designer · Website Builder",
    category: "Development",
    summary: "Leads front-end design, UI/UX and the build of the website interface.",
    responsibilities: [
      "Front-end design",
      "UI/UX and visual design",
      "Team design",
      "Website building",
      "Website interface implementation",
    ],
    linkedin: "https://www.linkedin.com/in/mohd-aaliya-jabeen-8b7272325/",
    linkedinId: "in/mohd-aaliya-jabeen-8b7272325",
  },
  {
    name: "Abdullah Mohammed Khan",
    role: "Backend Professional · AWS & Cloud",
    category: "Development",
    summary: "Builds backend systems, database integration and cloud infrastructure.",
    responsibilities: [
      "Backend development",
      "Server-side systems",
      "Database/backend integration",
      "AWS",
      "Cloud infrastructure",
      "Deployment and backend operations",
    ],
    linkedin: "https://www.linkedin.com/in/abdullah-mohammed-khan-1b4436346/",
    linkedinId: "in/abdullah-mohammed-khan-1b4436346",
  },
  {
    name: "Shahistha Aliya Shaik",
    role: "Software Testing & Debugging",
    category: "Development",
    summary: "Owns testing, debugging and quality assurance across every release.",
    responsibilities: [
      "Software testing",
      "Bug detection",
      "Debugging",
      "Quality assurance",
      "Functional testing",
      "UI testing",
    ],
    linkedin: "https://www.linkedin.com/in/shahistha-aliya-shaik-800b292a2/",
    linkedinId: "in/shahistha-aliya-shaik-800b292a2",
  },
  {
    name: "Mohammed Fardeen",
    role: "Research & Pitching",
    category: "Research & Pitching",
    summary: "Researches clients and markets, prepares pitch material and speaks to clients.",
    responsibilities: [
      "Client research",
      "Market research",
      "Lead research",
      "Preparing information for pitches",
      "Pitching",
      "Client communication",
    ],
    linkedin: "https://www.linkedin.com/in/fardeen-md/",
    linkedinId: "in/fardeen-md",
  },
  {
    name: "Mohd Saniya Begum",
    role: "Research · Database Handling",
    category: "Research & Pitching",
    summary: "Handles research, research data and the databases behind it.",
    responsibilities: [
      "Research",
      "Market research",
      "Client research",
      "Collecting relevant information",
      "Preparing research material required for pitching",
      "Database handling",
      "Organizing and maintaining research data",
    ],
    linkedin: "https://www.linkedin.com/in/mohd-saniya-begum/",
    linkedinId: "in/mohd-saniya-begum",
  },
  {
    name: "Keshav Loya",
    role: "Digital Marketing",
    category: "Marketing & Social Media",
    summary: "Runs digital marketing, campaigns and online growth for the studio.",
    responsibilities: [
      "Digital marketing",
      "Marketing campaigns",
      "Online growth",
      "Digital presence",
      "Marketing strategy and execution",
    ],
    linkedin: "https://www.linkedin.com/in/keshav-loya/",
    linkedinId: "in/keshav-loya",
  },
  {
    name: "Mohammed Imran Khan",
    role: "Social Media Handling",
    category: "Marketing & Social Media",
    summary: "Manages social media, content coordination and audience engagement.",
    responsibilities: [
      "Social media handling",
      "Social media management",
      "Content coordination",
      "Maintaining the company's social presence",
      "Social media engagement",
    ],
    linkedin: "https://www.linkedin.com/in/mohammed-imran-khan-971392420/",
    linkedinId: "in/mohammed-imran-khan-971392420",
  },
];
