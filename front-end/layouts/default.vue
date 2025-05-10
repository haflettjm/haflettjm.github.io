<template>
    <div class="crt-effect min-h-screen h-screen">
        <NuxtPage />
    </div>
</template>

<script setup></script>

<style>
.crt-effect {
    background-color: var(--crt-bg, #0d0d0d);
    color: var(--crt-text, #f1f1f1);
    text-shadow: var(--crt-text-shadow, 0 0 2px #ff69b4);
    font-family: var(--crt-font, "Courier New", monospace);
    position: relative;
    overflow: hidden;
}

/* Scanline effect */
.crt-effect::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
        to bottom,
        rgba(255, 102, 0, 0.05),
        rgba(255, 102, 0, 0.05) 1px,
        transparent 2px,
        transparent 4px
    );
    pointer-events: none;
    z-index: 1;
}
</style>
