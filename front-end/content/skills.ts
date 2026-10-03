export interface Skill {
  name: string;
  /** Actively being built, not yet production-proven. */
  growth?: boolean;
}

export interface SkillGroup {
  id: string;
  title: string;
  skills: Skill[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: "ai",
    title: "AI and LLM engineering",
    skills: [
      { name: "LLM features in production" },
      { name: "Evaluation and tracing" },
      { name: "vLLM" },
      { name: "RunPod" },
      { name: "AWS Bedrock" },
      { name: "KEDA autoscaling" },
      { name: "Anthropic API" },
      { name: "MCP servers" },
      { name: "Ollama" },
      { name: "MLOps" },
      { name: "PyTorch", growth: true },
      { name: "OCR models", growth: true },
    ],
  },
  {
    id: "data",
    title: "Data engineering",
    skills: [
      { name: "Apache Spark" },
      { name: "ETL and ELT" },
      { name: "Kafka" },
      { name: "Pub/Sub" },
      { name: "Dagster" },
      { name: "Dataform" },
      { name: "Airflow" },
      { name: "Iceberg" },
      { name: "Delta Lake" },
      { name: "BigQuery" },
      { name: "Snowflake" },
      { name: "ClickHouse" },
      { name: "PostgreSQL" },
      { name: "AlloyDB" },
    ],
  },
  {
    id: "backend",
    title: "Backend and distributed systems",
    skills: [
      { name: "Go" },
      { name: "TypeScript" },
      { name: "Python" },
      { name: "Java" },
      { name: "SQL" },
      { name: "REST and gRPC" },
      { name: "Microservices" },
      { name: "Multi-tenant SaaS" },
      { name: "Event-driven architecture" },
      { name: "Queues and workers" },
      { name: "Rate limiting and caching" },
    ],
  },
  {
    id: "infra",
    title: "Cloud and infrastructure",
    skills: [
      { name: "GCP" },
      { name: "AWS" },
      { name: "Azure" },
      { name: "Kubernetes" },
      { name: "K3s" },
      { name: "Helm" },
      { name: "ArgoCD" },
      { name: "Terraform" },
      { name: "CDKTF" },
      { name: "Pulumi" },
      { name: "Ansible" },
      { name: "Docker" },
      { name: "GitHub Actions" },
    ],
  },
  {
    id: "observability",
    title: "Observability",
    skills: [
      { name: "OpenTelemetry" },
      { name: "Prometheus" },
      { name: "Grafana" },
      { name: "New Relic" },
      { name: "SLO alerting" },
      { name: "On-call" },
      { name: "Post-mortems" },
    ],
  },
];
