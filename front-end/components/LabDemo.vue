<script setup lang="ts">
/* Topology of the home-lab repo. Node facts come from the repo's Ansible inventory and role names. */
const COMMIT = "6faf1ae";
const NW = 112;
const NH = 40;
interface LabNode {
  id: string;
  x: number;
  y: number;
  label: string;
  sub: string;
  file: string;
  info: string;
}
const nodes: LabNode[] = [
  { id: "edge", x: 30, y: 40, label: "edge", sub: "Linode Nanode", file: "pulumi/ + ansible/roles/wireguard_edge", info: "Public entry point. Pulumi (Go) creates it, Ansible configures WireGuard and iptables forwarding." },
  { id: "wg", x: 250, y: 40, label: "worker-01", sub: "wg_home endpoint", file: "ansible/roles/wireguard_home", info: "Terminates the WireGuard tunnel inside the house and hands traffic to ingress-nginx." },
  { id: "cp", x: 470, y: 40, label: "control-plane", sub: "K3s server", file: "ansible/inventory/hosts.yaml", info: "Single K3s server. Tier: high." },
  { id: "w2", x: 250, y: 150, label: "worker-02", sub: "K3s agent", file: "ansible/inventory/hosts.yaml", info: "General workloads. Tier: low." },
  { id: "w3", x: 360, y: 150, label: "worker-03", sub: "K3s agent", file: "ansible/inventory/hosts.yaml", info: "General workloads. Tier: low." },
  { id: "w4", x: 470, y: 150, label: "worker-04", sub: "K3s agent", file: "ansible/inventory/hosts.yaml", info: "General workloads. Tier: low." },
  { id: "nas", x: 30, y: 150, label: "nas-01", sub: "Podman, outside K3s", file: "ansible/inventory/hosts.yaml", info: "NAS and backups. Backs the nfs-provisioner storage class." },
  { id: "argo", x: 250, y: 260, label: "ArgoCD", sub: "root app", file: "kubernetes/bootstrap/argocd/root-app.yaml", info: "App-of-apps. Syncs everything under kubernetes/infrastructure from git." },
];
const edges: [string, string, string?][] = [
  ["edge", "wg", "wg"], ["wg", "cp"], ["cp", "w4"], ["wg", "w2"], ["w2", "w3"], ["w3", "w4"], ["nas", "w2"], ["argo", "w2"],
];
const apps = ["cert-manager", "cilium", "ingress-nginx", "longhorn", "metallb", "monitoring", "nfs-provisioner", "sealed-secrets"];
const byId: Record<string, LabNode> = Object.fromEntries(nodes.map((n) => [n.id, n]));
const sel = ref<string | null>(null);
const info = computed(() => (sel.value ? byId[sel.value] : null));
</script>

<template>
  <div class="demo">
    <div class="demo-head">
      <span><b>home-lab</b> · topology</span>
      <span class="mut">from haflettjm/home-lab @ {{ COMMIT }}</span>
    </div>
    <div class="demo-note">
      Platform layer is live. No app workloads deployed yet. IPs, hostnames and keys are left out.
    </div>
    <div class="lab">
      <div class="map">
        <svg viewBox="0 0 600 340" role="group" aria-label="home-lab topology">
          <line
            v-for="(e, i) in edges"
            :key="i"
            class="edge"
            :class="e[2]"
            :x1="byId[e[0]].x + NW / 2"
            :y1="byId[e[0]].y + NH / 2"
            :x2="byId[e[1]].x + NW / 2"
            :y2="byId[e[1]].y + NH / 2"
          />
          <text class="lbl" x="150" y="32">wireguard</text>
          <g
            v-for="n in nodes"
            :key="n.id"
            class="node"
            :class="{ sel: sel === n.id }"
            role="button"
            tabindex="0"
            :aria-label="`${n.label}, ${n.sub}`"
            :aria-pressed="sel === n.id"
            @click="sel = n.id"
            @keydown.enter.prevent="sel = n.id"
            @keydown.space.prevent="sel = n.id"
          >
            <rect :x="n.x" :y="n.y" :width="NW" :height="NH" />
            <text :x="n.x + 8" :y="n.y + 17">{{ n.label }}</text>
            <text class="lbl" :x="n.x + 8" :y="n.y + 31">{{ n.sub }}</text>
          </g>
          <text v-for="(a, k) in apps" :key="a" class="lbl" :x="380 + (k % 2) * 110" :y="268 + Math.floor(k / 2) * 16">{{ a }}</text>
        </svg>
      </div>
      <div class="info" aria-live="polite">
        <template v-if="info">
          <b class="pk">{{ info.label }}</b>
          <span>{{ info.info }}</span>
          <span class="mut">defined in</span>
          <a :href="`https://github.com/haflettjm/home-lab/tree/${COMMIT}`" target="_blank" rel="noopener"><code>{{ info.file }}</code></a>
        </template>
        <span v-else class="mut">Select a node to see where it is defined.</span>
      </div>
    </div>
  </div>
</template>
