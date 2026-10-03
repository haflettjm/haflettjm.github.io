# Projects

Links go to the source. Status is noted where a project is early.

---

# **[llm-tutor](https://github.com/haflettjm/llm-tutor)**
**AI / LLM** • Go, Claude CLI, MCP

A Socratic programming tutor for the editor. A Go backend selects a tutor persona, composes the prompt, and drives the `claude` CLI one turn at a time with schema-checked replies, session resume and MCP callbacks. Progress is tracked locally so it remembers what you have actually demonstrated. *Status: early. The Neovim plugin and Zed bridge are not verified end to end.*

---

# **Agent server on a Mac Studio**
**AI / Infra** • Ansible, Ollama, Caddy, Prometheus, Grafana

An Ansible playbook that turns a Mac Studio M3 Ultra into an LLM agent host. Ollama runs natively for Metal GPU acceleration, Caddy fronts it, monitoring is built in, and each agent gets an isolated workspace. (Private repo.)

---

# **[Home-lab](https://github.com/haflettjm/home-lab)**
**Infra** • K3s, Ansible, Pulumi, ArgoCD, WireGuard

A self-hosted Kubernetes platform on physical hardware. Rocky Linux and Proxmox underneath, Ansible for node and K3s setup, Pulumi (Go) for VMs and the Linode edge, ArgoCD for GitOps, and a WireGuard tunnel for public ingress.

---

# **[UVCB](https://github.com/haflettjm/UVCB)**
**Backend** • Go, NATS

A chat bridge in Go built around a NATS message bus. Discord text ingest works today; voice, video and more platforms are planned. *Status: early.*

---

# **[This site](https://github.com/haflettjm/haflettjm.github.io)**
A terminal-style portfolio built with Nuxt 3 and Tailwind that renders its content from markdown.
