<script setup>
import Terminal from "../components/Terminal.vue";
</script>

<template>
    <div
        class="terminal-window justify-center items-center min-h-screen w-screen h-screen flex flex-col"
    >
        <div class="terminal-header">
            <h1>TTY - Admin</h1>
        </div>
        <main
            class="terminal-body w-11/12 h-90vh border-2 items-center mx-auto my-6 p-4 bg-gray-700 rounded-sm border-green-950"
        >
            <div
                class="w-full"
                style="font-size: calc(100vw / 80); width: 90vw; height: 85vh"
            >
                <Terminal />
            </div>
        </main>
    </div>
</template>
<style>
.terminal-window {
    background-color: #0d0d0d;
    color: #ff66cc;
    font-family: var(--crt-font);
    text-shadow: var(--crt-text-glow);
}
:global(a.text-green-400) {
    color: #ff69b4 !important;
    text-shadow: 0 0 2px #ff69b4 !important;
}

:global(a.text-green-400:hover) {
    color: #ff85c1 !important;
    text-shadow: 0 0 4px #ff85c1 !important;
}

:global(a.text-green-400:visited) {
    color: #ff1493 !important;
    text-shadow: 0 0 2px #ff1493 !important;
}
</style>
