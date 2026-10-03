<script setup lang="ts">
const demo = useState<string | null>("demo", () => null);
const dlg = ref<HTMLDialogElement | null>(null);
let opener: HTMLElement | null = null;

watch(demo, async (id) => {
  const d = dlg.value;
  if (!d) return;
  if (id && !d.open) {
    opener = document.activeElement as HTMLElement | null;
    d.showModal();
    await nextTick();
    d.querySelector<HTMLElement>(".demo-dlg__close")?.focus();
  } else if (!id && d.open) {
    d.close();
  }
});

function onClose() {
  demo.value = null;
  opener?.focus();
}
function onBackdrop(e: MouseEvent) {
  if (e.target === dlg.value) dlg.value?.close();
}
</script>

<template>
  <dialog ref="dlg" class="demo-dlg" aria-label="Demo" @close="onClose" @click="onBackdrop">
    <div class="demo-dlg__bar">
      <span>{{ demo === "llm-tutor" ? "llm-tutor demo" : "home-lab demo" }}</span>
      <button type="button" class="demo-dlg__close" aria-label="Close demo" @click="dlg?.close()">[ close ]</button>
    </div>
    <TutorDemo v-if="demo === 'llm-tutor'" />
    <LabDemo v-else-if="demo === 'home-lab'" />
  </dialog>
</template>
