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

export type GlanceItem = {
  label: string;
  value: string;
};

export type ProjectContribution = {
  // "individual" is only used once individual ownership is explicitly confirmed.
  mode: "individual" | "team";
  summary: string;
  team?: string[];
  teamNote?: string;
};

export type EngineeringDecision = {
  title: string;
  body: string;
};

export type ProjectPreview = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
};

export type ProjectEvent = {
  title: string;
  subtitle: string;
  banner: {
    src: string;
    alt: string;
    width: number;
    height: number;
    objectPosition?: string;
  };
  team: {
    src: string;
    alt: string;
    width: number;
    height: number;
    caption: string;
  };
};

export type ProjectArchitecture = {
  caption: string;
  steps: string[];
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
  liveKind?: "project" | "demo";
  devpostUrl?: string;
  // Extra verified facts for "Project at a glance" (Role, Team, Event, ...).
  glance?: GlanceItem[];
  // Overrides the displayed status, e.g. "Completed prototype".
  statusLabel?: string;
  // Optional override for the glance strip; defaults to all technologies.
  primaryStack?: string[];
  contribution?: ProjectContribution;
  // Optional hackathon/event visuals shown between contribution and architecture.
  event?: ProjectEvent;
  architecture?: ProjectArchitecture;
  // At most three are rendered.
  decisions?: EngineeringDecision[];
  preview?: ProjectPreview;
  limits?: string[];
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
