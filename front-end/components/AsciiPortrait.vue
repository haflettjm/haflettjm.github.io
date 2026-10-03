<script setup lang="ts">
/* Draws public/portrait.jpg as ASCII on desktop only. The box is sized in CSS so nothing shifts. */
const COLS = 58;
const ROWS = 44;
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
    const lum: number[] = [];
    for (let i = 0; i < COLS * ROWS; i++) lum.push(px[i * 4] / 255);
    // stretch contrast between the 3rd and 97th percentile so the face reads clearly
    const sorted = [...lum].sort((x, y) => x - y);
    const lo = sorted[Math.floor(sorted.length * 0.03)];
    const hi = sorted[Math.floor(sorted.length * 0.97)];
    const norm = (v: number) => Math.min(1, Math.max(0, (v - lo) / Math.max(0.001, hi - lo))) ** 0.85;
    let html = "";
    for (let r = 0; r < ROWS; r++) {
      let run = "";
      let runDim = false;
      for (let c = 0; c < COLS; c++) {
        const v = norm(lum[r * COLS + c]);
        const dim = v < 0.55;
        if (dim !== runDim && run) {
          html += runDim ? `<span class="dim">${run}</span>` : run;
          run = "";
        }
        runDim = dim;
        run += RAMP[Math.min(RAMP.length - 1, Math.floor(v * RAMP.length))];
      }
      html += (runDim ? `<span class="dim">${run}</span>` : run) + "\n";
    }
    el.value.innerHTML = html;
  };
  img.src = "/portrait.jpg";
});
</script>

<template>
  <pre ref="el" class="face" aria-hidden="true" />
</template>
