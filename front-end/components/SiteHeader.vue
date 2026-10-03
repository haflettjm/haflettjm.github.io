<script setup lang="ts">
const open = useState<boolean>("terminal-open", () => false);
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner">
      <a class="brand tap" href="#top">jacob@haflett</a>
      <button
        type="button"
        class="term-toggle tap"
        data-terminal-toggle
        aria-label="Open terminal"
        aria-haspopup="dialog"
        @click="open = true"
      >
        <span aria-hidden="true">&gt;_</span>
      </button>
      <nav class="site-nav" aria-label="Primary">
        <a class="tap" href="#work">work</a>
        <a class="tap" href="#experience">experience</a>
        <a class="tap" href="#skills">skills</a>
        <a class="tap" href="#contact">contact</a>
      </nav>
    </div>
  </header>
</template>
