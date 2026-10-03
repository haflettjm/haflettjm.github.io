<script setup lang="ts">
const open = useState<boolean>("terminal-open", () => false);
</script>

<template>
  <header class="bar">
    <a class="brand tap" href="#top">haflett.sh</a>
    <nav class="chips" aria-label="Primary">
      <a class="chip tap" href="#work">work</a>
      <a class="chip tap" href="#experience">experience</a>
      <a class="chip tap" href="#skills">skills</a>
      <a class="chip tap" href="#contact">contact</a>
    </nav>
    <button
      type="button"
      class="toggle tap"
      data-terminal-toggle
      aria-label="Open terminal"
      aria-haspopup="dialog"
      @click="open = true"
    >
      [ terminal ]
    </button>
  </header>
</template>
