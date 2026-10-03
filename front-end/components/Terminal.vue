<script setup lang="ts">
import { profile } from "~/content/profile";
import { experience } from "~/content/experience";
import { projects } from "~/content/projects";
import { skillGroups } from "~/content/skills";
import { renderMarkdown } from "~/utils/markdownParser";

interface Line {
  kind: "in" | "out";
  html: string;
}

const open = useState<boolean>("terminal-open", () => false);
const dlg = ref<HTMLDialogElement | null>(null);
const input = ref<HTMLInputElement | null>(null);
const out = ref<HTMLElement | null>(null);
const cmd = ref("");
const lines = ref<Line[]>([{ kind: "out", html: "Type <b>help</b> for commands." }]);

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
const rows = (items: string[]) => items.map(esc).join("<br>");

function push(html: string, kind: Line["kind"] = "out") {
  lines.value.push({ kind, html });
  nextTick(() => out.value?.scrollTo({ top: out.value.scrollHeight }));
}

const commands: Record<string, () => Promise<string> | string> = {
  help: () =>
    rows([
      "about       who I am and how I work",
      "projects    what I have built",
      "experience  roles and impact",
      "skills      what I work with",
      "contact     how to reach me",
      "clear       clear the screen",
    ]),
  about: async () => renderMarkdown(await (await fetch("/content/about.md")).text()),
  projects: () => rows(projects.map((p) => `${p.title} [${p.status}] ${p.blurb}`)),
  experience: () => rows(experience.map((r) => `${r.when}  ${r.title}, ${r.org}`)),
  skills: () => rows(skillGroups.map((g) => `${g.title}: ${g.skills.map((s) => s.name).join(", ")}`)),
  contact: () =>
    `Email <a class="md-link" href="${profile.links.email}">${esc(profile.email)}</a><br>` +
    `GitHub <a class="md-link" href="${profile.links.github}" target="_blank" rel="noopener">github.com/haflettjm</a><br>` +
    `Resume <a class="md-link" href="${profile.links.resume}">PDF</a>`,
};

async function run() {
  const raw = cmd.value.trim();
  cmd.value = "";
  if (!raw) return;
  push(esc(`visitor@haflett:~$ ${raw}`), "in");
  const name = raw.split(/\s+/)[0].toLowerCase();
  if (name === "clear") {
    lines.value = [];
    return;
  }
  const fn = commands[name];
  if (!fn) {
    push(`command not found: ${esc(name)}. Try <b>help</b>.`);
    return;
  }
  try {
    push(await fn());
  } catch {
    push("Could not load that. Try again.");
  }
}

watch(open, async (isOpen) => {
  const d = dlg.value;
  if (!d) return;
  if (isOpen && !d.open) {
    d.showModal();
    await nextTick();
    input.value?.focus();
  } else if (!isOpen && d.open) {
    d.close();
  }
});

function onClose() {
  open.value = false;
  document.querySelector<HTMLElement>("[data-terminal-toggle]")?.focus();
}

function onBackdrop(e: MouseEvent) {
  if (e.target === dlg.value) dlg.value?.close();
}
</script>

<template>
  <dialog ref="dlg" class="term" aria-label="Terminal" @close="onClose" @click="onBackdrop">
    <div class="term__bar">
      <span>visitor@haflett: ~</span>
      <button type="button" class="term__close" aria-label="Close terminal" @click="dlg?.close()">
        esc
      </button>
    </div>
    <div ref="out" class="term__out" role="log" aria-label="Terminal output" tabindex="0">
      <div
        v-for="(line, i) in lines"
        :key="i"
        :class="line.kind === 'in' ? 'term__line--in' : ''"
        v-html="line.html"
      />
    </div>
    <form class="term__form" @submit.prevent="run">
      <label class="term__ps" for="term-input">visitor@haflett:~$</label>
      <input
        id="term-input"
        ref="input"
        v-model="cmd"
        class="term__input"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
      />
    </form>
  </dialog>
</template>
