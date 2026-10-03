<script setup lang="ts">
/*
 * Decorative boot log. It never gates content: the hero renders fully before this plays,
 * it is skippable, it plays once per browser session, and it is skipped entirely when the
 * visitor prefers reduced motion.
 */
const lines = [
  "mounting /home/jacob",
  "loading experience (4 roles, 5+ yrs)",
  "linking demos: llm-tutor, home-lab",
];
const KEY = "boot-seen";
const state = ref<"playing" | "done">("done");
const box = ref<HTMLElement | null>(null);
let timeline: { kill: () => void } | null = null;

function lineEls(): HTMLElement[] {
  return Array.from(box.value?.querySelectorAll<HTMLElement>("[data-boot-line]") ?? []);
}

function finish() {
  timeline?.kill();
  timeline = null;
  lineEls().forEach((el) => el.removeAttribute("style"));
  state.value = "done";
}

async function play() {
  if (!box.value) return;
  const { gsap } = await import("gsap");
  const els = lineEls();
  timeline?.kill();
  state.value = "playing";
  gsap.set(els, { opacity: 0, x: -6 });
  timeline = gsap.timeline({ onComplete: finish }).to(els, {
    opacity: 1,
    x: 0,
    duration: 0.25,
    stagger: 0.3,
    ease: "power1.out",
  });
}

function onButton() {
  if (state.value === "playing") finish();
  else play();
}

onMounted(() => {
  let seen = false;
  try {
    seen = sessionStorage.getItem(KEY) === "1";
    sessionStorage.setItem(KEY, "1");
  } catch {
    /* storage unavailable: treat as first visit */
  }
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!seen && !reduced) play();
});

onBeforeUnmount(() => timeline?.kill());
</script>

<template>
  <div class="boot">
    <div ref="box" aria-hidden="true" :data-boot="state">
      <div v-for="line in lines" :key="line" data-boot-line>[ ok ] {{ line }}</div>
    </div>
    <button type="button" class="boot__ctl tap" data-skip-boot @click="onButton">
      {{ state === "playing" ? "[ skip ]" : "[ replay boot ]" }}
    </button>
  </div>
</template>
