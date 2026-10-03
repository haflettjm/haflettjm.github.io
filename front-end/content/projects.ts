export type ProjectStatus = "live" | "early" | "private" | "in progress";

export interface Project {
  id: string;
  title: string;
  kind: string;
  status: ProjectStatus;
  blurb: string;
  stack: string[];
  repo?: string;
  note?: string;
}

export interface System {
  id: string;
  title: string;
  org: string;
  blurb: string;
  kpis: string[];
}

/** Employer systems, described from public facts. No code. */
export const systems: System[] = [
  {
    id: "robot-fleet",
    title: "Robot fleet data platform",
    org: "Jabil (Badger Technologies), 2023 - 2025",
    blurb:
      "Spark pipelines over 8K camera imagery and telemetry into a lakehouse with BigQuery and Snowflake layers, across AWS, GCP and Azure.",
    kpis: ["35,000 robots", "about 25 GB per robot per day", "99.99% availability"],
  },
  {
    id: "realtime-apis",
    title: "Real-time APIs and LLM inference",
    org: "Live-Commerce Startup, 2025 - Present",
    blurb:
      "Multi-tenant REST and gRPC services on AlloyDB and ClickHouse, plus event-driven LLM inference on vLLM with Pub/Sub and KEDA autoscaling.",
    kpis: ["100K requests/sec", "99.9%+ availability"],
  },
  {
    id: "catalog-search",
    title: "Catalog search and indexing pipeline",
    org: "Air Liquide / Airgas, 2021 - 2022",
    blurb:
      "Spark indexing and ETL over a product catalog of millions of SKUs, powering downstream search and recommendation services.",
    kpis: ["millions of SKUs", "15% faster search"],
  },
];

export const projects: Project[] = [
  {
    id: "llm-tutor",
    title: "llm-tutor",
    kind: "AI / LLM",
    status: "early",
    blurb:
      "A Socratic programming tutor for the editor. A Go backend selects a tutor persona, composes the prompt, and drives the claude CLI one turn at a time with schema-checked replies, session resume and MCP callbacks. Progress is tracked locally so it remembers what you have actually demonstrated.",
    stack: ["Go", "Claude CLI", "MCP"],
    repo: "https://github.com/haflettjm/llm-tutor",
    note: "The Neovim plugin and Zed bridge are not verified end to end.",
  },
  {
    id: "home-lab",
    title: "Home-lab",
    kind: "Infra",
    status: "live",
    blurb:
      "A self-hosted Kubernetes platform on physical hardware. Rocky Linux and Proxmox underneath, Ansible for node and K3s setup, Pulumi (Go) for VMs and the Linode edge, ArgoCD for GitOps, and a WireGuard tunnel for public ingress.",
    stack: ["K3s", "Ansible", "Pulumi", "ArgoCD", "WireGuard"],
    repo: "https://github.com/haflettjm/home-lab",
    note: "The platform layer is live. No application workloads are deployed yet.",
  },
  {
    id: "mac-studio-agents",
    title: "Agent server on a Mac Studio",
    kind: "AI / Infra",
    status: "private",
    blurb:
      "An Ansible playbook that turns a Mac Studio M3 Ultra into an LLM agent host. Ollama runs natively for Metal GPU acceleration, Caddy fronts it, monitoring is built in, and each agent gets an isolated workspace.",
    stack: ["Ansible", "Ollama", "Caddy", "Prometheus", "Grafana"],
    note: "Private repository.",
  },
  {
    id: "uvcb",
    title: "UVCB",
    kind: "Backend",
    status: "early",
    blurb:
      "A chat bridge in Go built around a NATS message bus. Discord text ingest works today. Voice, video and more platforms are planned.",
    stack: ["Go", "NATS"],
    repo: "https://github.com/haflettjm/UVCB",
  },
];
