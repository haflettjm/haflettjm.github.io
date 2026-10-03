import type { Stat } from "./profile";

export interface Role {
  id: string;
  when: string;
  title: string;
  org: string;
  framing: string;
  stats: Stat[];
  points: string[];
}

export const experience: Role[] = [
  {
    id: "live-commerce",
    when: "2025 - Present",
    title: "Full-Stack ML / AI Engineer",
    org: "Live-Commerce Startup",
    framing:
      "Backend services and LLM inference infrastructure for real-time analytics and personalization.",
    stats: [
      { value: "100K", label: "requests/sec" },
      { value: "99.9%+", label: "availability on real-time APIs" },
    ],
    points: [
      "Multi-tenant REST and gRPC APIs in TypeScript, Go and Python on AlloyDB and ClickHouse, with rate limiting, caching and load balancing",
      "Event-driven inference on GCP with vLLM and RunPod serverless GPUs, using Pub/Sub queues, retries and KEDA autoscaling",
      "Customer data integrations from external commerce platforms, with warehouse transforms in Dataform",
      "OpenTelemetry, Cloud Monitoring and Prometheus alerting",
    ],
  },
  {
    id: "jabil",
    when: "2023 - 2025",
    title: "MLOps / Cloud Engineer",
    org: "Jabil (Badger Technologies)",
    framing: "Telemetry, data and inference platform for a retail robot fleet.",
    stats: [
      { value: "35,000", label: "robots in the pipeline" },
      { value: "99.99%", label: "platform availability" },
      { value: "15%", label: "system performance gain" },
    ],
    points: [
      "Apache Spark pipelines ingesting about 25 GB/day of 8K camera imagery and diagnostics per robot, with orchestrated workflows and automatic recovery",
      "Lakehouse storage plus BigQuery and Snowflake warehouse layers, fed by Kafka and Pub/Sub",
      "Multi-tenant data and inference platform across AWS, GCP and Azure on Kubernetes, Terraform and Helm",
      "LLM-powered features and production models with evaluation and tracing to catch regressions",
    ],
  },
  {
    id: "aws",
    when: "2022 - 2023",
    title: "DevOps / Cloud Engineer",
    org: "Amazon Web Services",
    framing: "Data services and infrastructure automation for customer workloads.",
    stats: [
      { value: "20%", label: "faster deployments" },
      { value: "15%", label: "less production downtime" },
    ],
    points: [
      "Operated Redshift, Athena, EMR/Spark, Kinesis and Glue for customer batch and streaming pipelines",
      "Terraform, CDKTF and Kubernetes automation with GitHub Actions CI/CD",
      "Tiered monitoring with Prometheus, Grafana and OpenTelemetry, plus standardized post-mortems",
    ],
  },
  {
    id: "airgas",
    when: "2021 - 2022",
    title: "Software Engineer",
    org: "Air Liquide / Airgas",
    framing: "Search and catalog data pipelines behind product search.",
    stats: [
      { value: "Millions", label: "of SKUs indexed" },
      { value: "15%", label: "faster search queries" },
    ],
    points: [
      "Apache Spark indexing and ETL pipelines for product catalog and search data",
      "Microservices and low-latency APIs in TypeScript, Go, Java and Python",
      "Caching and index optimization found through bottleneck analysis",
    ],
  },
];
