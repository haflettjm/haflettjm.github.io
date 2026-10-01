<script setup lang="ts">
useHead({
  title: "Jacob Haflett — Backend & Data Engineer",
  meta: [
    {
      name: "description",
      content:
        "Jacob Haflett is a senior backend and data engineer building reliable data platforms, distributed systems, and AI pipelines.",
    },
  ],
});

const projects = [
  {
    name: "KITKAN",
    type: "Social platform · product systems",
    description:
      "A local-first social platform for discovering and sharing work together. I am shaping the product, system contracts, and the infrastructure that supports it.",
    href: "https://github.com/haflettjm/open-design-projects",
  },
  {
    name: "Home Lab",
    type: "Infrastructure · Kubernetes",
    description:
      "A self-hosted Kubernetes environment designed to grow from lightweight services into a hybrid infrastructure playground.",
    href: "https://github.com/haflettjm/home-lab",
  },
  {
    name: "Universal Chat Bridge",
    type: "Go · interoperability",
    description:
      "An experiment in carrying conversations across messaging platforms, with voice and video support in view.",
    href: "https://github.com/haflettjm/UVCB",
  },
];
</script>

<template>
  <main>
    <header class="site-header">
      <a class="wordmark" href="#top" aria-label="Jacob Haflett home">JH<span>.</span></a>
      <nav aria-label="Primary navigation">
        <a href="#work">Work</a>
        <a href="#experience">Experience</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>

    <section id="top" class="hero" aria-labelledby="hero-title">
      <p class="eyebrow">Backend & data engineering</p>
      <h1 id="hero-title">Systems that hold up when the work gets real.</h1>
      <p class="intro">
        I’m Jacob Haflett, a senior engineer building data platforms, distributed systems, and AI pipelines that stay useful under load.
      </p>
      <div class="hero-actions">
        <a class="button" href="#work">See selected work <span aria-hidden="true">↓</span></a>
        <a class="text-link" href="mailto:jacobhaflett@icloud.com">Start a conversation <span aria-hidden="true">↗</span></a>
      </div>
      <dl class="proof" aria-label="Selected career facts">
        <div><dt>100K</dt><dd>requests/sec API scale</dd></div>
        <div><dt>35K</dt><dd>robot fleet telemetry</dd></div>
        <div><dt>99.9%+</dt><dd>real-time availability</dd></div>
      </dl>
    </section>

    <section id="work" class="section work" aria-labelledby="work-title">
      <div class="section-heading">
        <p class="eyebrow">Selected work</p>
        <h2 id="work-title">Technical work with a point of view.</h2>
      </div>
      <div class="project-list">
        <article v-for="project in projects" :key="project.name" class="project">
          <p>{{ project.type }}</p>
          <h3>{{ project.name }}</h3>
          <p class="project-description">{{ project.description }}</p>
          <a :href="project.href" target="_blank" rel="noreferrer">View project <span aria-hidden="true">↗</span></a>
        </article>
      </div>
    </section>

    <section id="experience" class="section experience" aria-labelledby="experience-title">
      <div class="section-heading">
        <p class="eyebrow">Experience</p>
        <h2 id="experience-title">Production systems, from data to delivery.</h2>
      </div>
      <ol class="timeline">
        <li>
          <div class="timeline-date">2025—now</div>
          <div>
            <h3>Full-Stack ML / AI Engineer <span>· Verb (MARKET.live)</span></h3>
            <p>Multi-tenant APIs and event-driven inference on TypeScript, Go, Python, AlloyDB, and ClickHouse—built for real-time personalization and analytics.</p>
          </div>
        </li>
        <li>
          <div class="timeline-date">2023—2025</div>
          <div>
            <h3>MLOps / Cloud Engineer <span>· Jabil / Badger Technologies</span></h3>
            <p>Spark and lakehouse systems for 35,000 robots, across AWS, GCP, and Azure. Owned reliability, observability, and on-call delivery.</p>
          </div>
        </li>
        <li>
          <div class="timeline-date">2022—2023</div>
          <div>
            <h3>DevOps / Cloud Engineer <span>· AWS</span></h3>
            <p>Operated data services and automated cloud infrastructure for customer workloads spanning batch, streaming, and Kubernetes delivery.</p>
          </div>
        </li>
        <li>
          <div class="timeline-date">2021—2022</div>
          <div>
            <h3>Software Engineer <span>· Air Liquide / Airgas</span></h3>
            <p>Built Spark indexing and ETL pipelines across millions of SKUs, plus low-latency services for search and recommendation systems.</p>
          </div>
        </li>
      </ol>
    </section>

    <section class="section capabilities" aria-labelledby="capabilities-title">
      <div class="section-heading">
        <p class="eyebrow">Capabilities</p>
        <h2 id="capabilities-title">The stack is the means, not the headline.</h2>
      </div>
      <div class="capability-grid">
        <div><h3>Data platforms</h3><p>Spark, Kafka, Pub/Sub, BigQuery, Snowflake, PostgreSQL, ClickHouse.</p></div>
        <div><h3>Distributed systems</h3><p>REST, gRPC, multi-tenant services, queues, workers, retries, and recovery.</p></div>
        <div><h3>AI delivery</h3><p>LLM-powered products, vLLM serving, evaluation, tracing, and event-driven inference.</p></div>
        <div><h3>Reliable operations</h3><p>Kubernetes, Terraform, Docker, OpenTelemetry, Prometheus, Grafana, and practical on-call ownership.</p></div>
      </div>
    </section>

    <section id="contact" class="contact" aria-labelledby="contact-title">
      <p class="eyebrow">Contact</p>
      <h2 id="contact-title">Have a difficult system to make dependable?</h2>
      <a class="contact-link" href="mailto:jacobhaflett@icloud.com">jacobhaflett@icloud.com <span aria-hidden="true">↗</span></a>
      <div class="contact-meta">
        <a href="https://github.com/haflettjm" target="_blank" rel="noreferrer">GitHub</a>
        <span>New York, USA</span>
      </div>
    </section>

    <footer>© {{ new Date().getFullYear() }} Jacob Haflett</footer>
  </main>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&family=Work+Sans:wght@400;500;600&display=swap");

:root { --ink: #152126; --paper: #f4f3ee; --pine: #1d5a61; --soft-pine: #dce9e7; --muted: #657077; --line: #c9d0ce; }
* { box-sizing: border-box; }
html { scroll-behavior: smooth; background: var(--paper); }
body { margin: 0; background: var(--paper); color: var(--ink); font-family: "Work Sans", Arial, sans-serif; }
a { color: inherit; }
.site-header, .hero, .section, .contact, footer { width: min(1160px, calc(100% - 48px)); margin-inline: auto; }
.site-header { display: flex; align-items: center; justify-content: space-between; min-height: 80px; border-bottom: 1px solid var(--line); }
.wordmark { color: var(--ink); font: 700 1.5rem/1 "Source Serif 4", Georgia, serif; text-decoration: none; letter-spacing: -.08em; }
.wordmark span { color: var(--pine); }
nav { display: flex; gap: 1.5rem; }
nav a, .eyebrow, .timeline-date, footer { font-family: "DM Mono", monospace; font-size: .72rem; letter-spacing: .06em; text-transform: uppercase; }
nav a { text-decoration: none; color: var(--muted); }
nav a:hover, .project a:hover, .contact-meta a:hover { color: var(--pine); }
.hero { padding: clamp(5rem, 12vw, 10rem) 0 5rem; border-bottom: 1px solid var(--line); }
.eyebrow { margin: 0 0 1.25rem; color: var(--pine); }
h1, h2, h3, p { margin-top: 0; }
h1, h2 { font-family: "Source Serif 4", Georgia, serif; letter-spacing: -.045em; }
h1 { max-width: 920px; margin-bottom: 1.75rem; font-size: clamp(3.5rem, 8.4vw, 7.5rem); line-height: .9; font-weight: 700; }
.intro { max-width: 650px; color: #364047; font-size: clamp(1.1rem, 2vw, 1.4rem); line-height: 1.55; }
.hero-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 1.4rem; margin-top: 2.25rem; }
.button { display: inline-flex; gap: .7rem; align-items: center; padding: .85rem 1.1rem; background: var(--pine); border: 1px solid var(--pine); color: #fff; text-decoration: none; font-weight: 600; }
.button:hover { background: #17484e; }
.text-link, .project a { font-weight: 600; text-underline-offset: .28em; }
.proof { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; max-width: 720px; margin: 5rem 0 0; }
.proof div { border-top: 2px solid var(--ink); padding-top: .75rem; }
.proof dt { font: 600 clamp(1.8rem, 4vw, 2.75rem)/1 "Source Serif 4", Georgia, serif; }
.proof dd { margin: .45rem 0 0; color: var(--muted); font-size: .9rem; }
.section { padding: clamp(4.5rem, 9vw, 7.5rem) 0; border-bottom: 1px solid var(--line); }
.section-heading { max-width: 690px; }
h2 { margin-bottom: 2.5rem; font-size: clamp(2.35rem, 5vw, 4.5rem); line-height: .98; }
.project-list { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--line); }
.project { display: flex; min-height: 360px; padding: 1.5rem; flex-direction: column; border-bottom: 1px solid var(--line); }
.project + .project { border-left: 1px solid var(--line); }
.project > p:first-child { margin-bottom: 3rem; color: var(--pine); font: .68rem/1.4 "DM Mono", monospace; text-transform: uppercase; }
.project h3, .timeline h3, .capability-grid h3 { font-family: "Source Serif 4", Georgia, serif; }
.project h3 { margin-bottom: 1rem; font-size: 2rem; letter-spacing: -.035em; }
.project-description { flex: 1; color: var(--muted); line-height: 1.6; }
.project a { color: var(--pine); }
.timeline { padding: 0; margin: 0; list-style: none; border-top: 1px solid var(--line); }
.timeline li { display: grid; grid-template-columns: 150px 1fr; gap: 2rem; padding: 1.7rem 0; border-bottom: 1px solid var(--line); }
.timeline-date { padding-top: .35rem; color: var(--pine); }
.timeline h3 { margin-bottom: .6rem; font-size: clamp(1.35rem, 2.4vw, 1.8rem); letter-spacing: -.025em; }
.timeline h3 span { color: var(--muted); font-family: "Work Sans", Arial, sans-serif; font-size: .88em; font-weight: 400; letter-spacing: 0; }
.timeline p { max-width: 680px; margin: 0; color: var(--muted); line-height: 1.6; }
.capability-grid { display: grid; grid-template-columns: repeat(2, 1fr); border-top: 1px solid var(--line); }
.capability-grid > div { padding: 1.5rem 1.5rem 1.7rem 0; border-bottom: 1px solid var(--line); }
.capability-grid > div:nth-child(even) { padding-left: 1.5rem; border-left: 1px solid var(--line); }
.capability-grid h3 { margin-bottom: .65rem; font-size: 1.45rem; letter-spacing: -.025em; }
.capability-grid p { max-width: 430px; margin-bottom: 0; color: var(--muted); line-height: 1.55; }
.contact { padding: clamp(5rem, 12vw, 10rem) 0; }
.contact h2 { max-width: 760px; margin-bottom: 1.5rem; }
.contact-link { display: inline-block; color: var(--pine); font: 600 clamp(1.4rem, 3vw, 2.4rem)/1.2 "Source Serif 4", Georgia, serif; text-decoration-thickness: 1px; text-underline-offset: .2em; }
.contact-meta { display: flex; gap: 1rem; margin-top: 3rem; color: var(--muted); font: .76rem "DM Mono", monospace; }
.contact-meta a { color: var(--muted); }
footer { padding: 1.5rem 0 2.5rem; color: var(--muted); border-top: 1px solid var(--line); }
@media (max-width: 720px) {
  .site-header, .hero, .section, .contact, footer { width: min(100% - 32px, 1160px); }
  .site-header { min-height: 68px; }
  nav { gap: 1rem; }
  .hero { padding-top: 5.5rem; }
  .proof, .project-list, .capability-grid { grid-template-columns: 1fr; }
  .project { min-height: 0; }
  .project + .project, .capability-grid > div:nth-child(even) { border-left: 0; padding-left: 0; }
  .project > p:first-child { margin-bottom: 2rem; }
  .project-description { margin-bottom: 2rem; }
  .timeline li { grid-template-columns: 1fr; gap: .6rem; }
}
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
</style>
