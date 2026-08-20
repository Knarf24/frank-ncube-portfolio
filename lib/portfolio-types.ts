export type ProjectCategory =
  | "Software engineering"
  | "AI / ML"
  | "Web"
  | "Cloud"
  | "Product"
  | "Entrepreneurship";

export type CaseStudySection = {
  heading: string;
  body: string[];
};

export type Project = {
  title: string;
  slug: string;
  summary: string;
  year: number;
  categories: ProjectCategory[];
  technologies: string[];
  featured: boolean;
  featuredOrder?: number;
  status: "Live" | "In development" | "Completed";
  githubUrl?: string;
  liveUrl?: string;
  caseStudy: CaseStudySection[];
};

export type ExperienceItem = {
  title: string;
  organization: string;
  location?: string;
  period: string;
  kind: "Professional" | "Entrepreneurship" | "Campus" | "Client work";
  summary: string;
};

export type EducationRecord = {
  institution: string;
  degree: string;
  graduation: string;
  gpa: string;
  coursework: string[];
};

export type Achievement = {
  title: string;
  issuer: string;
  year: number;
};

export type SkillGroup = {
  label: string;
  skills: string[];
};
