<script setup>
import Terminal from "../components/Terminal.vue";
</script>

<template>
    <div
        class="terminal-window justify-center items-center min-h-screen w-screen h-screen flex flex-col"
    >
        <div class="terminal-header">
            <h1>TTY</h1>
        </div>
        <main
            class="terminal-body h-full border-2 w-10/12 items-center mx-0 bg-gray-700 rounded-sm border-green-950"
        >
            <div class="h-full p-4">
                <Terminal />
            </div>
        </main>
    </div>
</template>
<style scoped>
.terminal-window {
    background-color: #0d0d0d;
    color: #ff66cc;
    font-family: var(--crt-font);
    text-shadow: var(--crt-text-glow);
}
</style>
