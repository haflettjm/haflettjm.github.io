<script setup lang="ts">
/* One real line of text for readers and search, plus decorative offset color layers and two clipped slices. */
defineProps<{ text: string }>();
</script>

<template>
  <span class="g-host">
    <span class="sr">{{ text }}</span>
    <span class="g-main" aria-hidden="true">{{ text }}</span>
    <span class="g-layer g-c" aria-hidden="true">{{ text }}</span>
    <span class="g-layer g-m" aria-hidden="true">{{ text }}</span>
    <span class="g-slice g-s1" aria-hidden="true">{{ text }}</span>
    <span class="g-slice g-s2" aria-hidden="true">{{ text }}</span>
  </span>
</template>
