<template>
    <div class="terminal-window justify-center align-center">
        <div class="terminal-header text-center">
            <span class="command-text text-blue-50">echo "Hello, World!"</span>
            <span class="muted-text">[12:34:56]</span>
        </div>
        <div class="terminal-body">
            <div class="highlight-border">
                <div class="markdown-highlight">Hello, World!</div>
            </div>
        </div>
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
