export interface Stat {
  value: string;
  label: string;
}

export const profile = {
  name: "Jacob Haflett",
  role: "Senior Backend and AI Platform Engineer",
  tagline:
    "I build data platforms, multi-tenant APIs and LLM-powered systems, and run them in production.",
  summary:
    "Five years across a live-commerce startup, Jabil, AWS and Airgas. I have been on call at every role, so I build with failure in mind: retries, autoscaling, tracing and SLO alerts.",
  availability:
    "Open to senior backend, data platform and AI infrastructure roles, and to contract work.",
  email: "jacobhaflett@icloud.com",
  links: {
    github: "https://github.com/haflettjm",
    email: "mailto:jacobhaflett@icloud.com",
    resume: "/resume.pdf",
  },
  stats: [
    { value: "100K", label: "requests/sec on multi-tenant APIs" },
    { value: "35,000", label: "robots in the data pipeline" },
    { value: "99.99%", label: "platform availability" },
    { value: "5+ yrs", label: "on call in production" },
  ] as Stat[],
};
