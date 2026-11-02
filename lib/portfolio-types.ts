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
  // Optional bullet list rendered after the paragraphs.
  items?: string[];
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

export type ProjectWalkthrough = {
  heading: string;
  intro: string;
  items: ProjectPreview[];
};

export type ProjectCardImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  // CSS object-position for the cropped bento frame.
  objectPosition?: string;
  // Visible label for images that are not product screenshots.
  caption?: string;
};

export type ProjectVideo = {
  url: string;
  label: string;
  // Local screenshot used as the poster; no third-party image is loaded.
  poster: ProjectPreview;
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
  // Named illustration rendered after the step flow.
  visual?: "etenmall";
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
  // Passphrase-protected hosted demo. Linked with an explicit "passphrase
  // required" label and never presented as an open live demo.
  gatedDemoUrl?: string;
  video?: ProjectVideo;
  // Real image shown on the homepage bento and archive card.
  cardImage?: ProjectCardImage;
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
  // Real interface screenshots, shown in their own section before Architecture.
  walkthrough?: ProjectWalkthrough;
  limits?: string[];
  // Development and testing evidence, shown after the engineering decisions.
  evidence?: CaseStudySection;
  // Planned work, shown after the limits. Not implemented functionality.
  roadmap?: string[];
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
  year?: number;
  // e.g. "In progress" for training that is not complete.
  status?: string;
};

export type SkillGroup = {
  label: string;
  skills: string[];
};
