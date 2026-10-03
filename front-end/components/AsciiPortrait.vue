<script setup lang="ts">
/* Draws public/portrait.jpg as ASCII on desktop only. The box is sized in CSS so nothing shifts. */
const COLS = 44;
const ROWS = 33;
const RAMP = " .,:;-=+*#%@";
const el = ref<HTMLPreElement | null>(null);

onMounted(() => {
  if (!window.matchMedia("(min-width: 900px)").matches) return;
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = COLS;
    canvas.height = ROWS;
    const ctx = canvas.getContext("2d");
    if (!ctx || !el.value) return;
    ctx.drawImage(img, 0, 0, COLS, ROWS);
    const px = ctx.getImageData(0, 0, COLS, ROWS).data;
    let text = "";
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const v = px[(r * COLS + c) * 4] / 255;
        text += RAMP[Math.min(RAMP.length - 1, Math.floor(v * RAMP.length))];
      }
      text += "\n";
    }
    el.value.textContent = text;
  };
  img.src = "/portrait.jpg";
});
</script>

<template>
  <pre ref="el" class="face" aria-hidden="true" />
</template>
