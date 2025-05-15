<template>
    <div
        class="
        w-full
        h-full
        text-green-400
        font-mono
        p-4
        overflow-y-auto
        font-mono
        text-xs
        sm:text-sm
        md:text-base
        leading-relaxed
        break-words
        whitespace-pre-wrap
        "
        ref="terminalRef"
        style="max-width: 100%; word-break: break-word"
        >
        <div v-for="(entry, index) in history" :key="index">
            <div
                v-if="entry.type === 'output'"
                v-html="entry.html"
                class="
                prose
                prose-invert
                w-full
                break-words
                whitespace-pre-wrap
                text-left
                text-green-400
                leading-relaxed
                break-words
                whitespace-pre-wrap "
                style="word-break: break-word"
            ></div>
            <div v-else-if="entry.type === 'prompt'" class="mb-2">
                <span class="muted-text">[10:34:56]</span>
                <span> $ ~/: {{ entry.command }} </span>
            </div>
        </div>
        <div class="flex items-center w-full">
            <span class="mr-3">$ ~/</span>
            <input
                v-model="currentCommand"
                @keydown.enter="handleCommand"
                class="bg-transparent border-none outline-none text-green-400 flex-1"
                autofocus
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, nextTick } from "vue";
import { renderMarkdown } from "../utils/markdownParser.ts";

const history = ref([
    {
        type: "output",
        html: '<p>Welcome to my portfolio! Type "help" for a list of commands</p>',
    },
]);

const currentCommand = ref("");
const terminalRef = ref(null);

async function handleCommand() {
    const cmd = currentCommand.value.trim();
    if (!cmd) return;

    history.value.push({ type: "prompt", command: cmd });
    type CommandHandler = () => Promise<string>;
    const commands: Record<string, CommandHandler> = {
        home: async () => {
            const res = await fetch("/content/home.md");
            const text = await res.text();
            return renderMarkdown(text);
        },
        help: async () => {
            return renderMarkdown(
                `# Available Commands\nj- \`home\`\n= \`help\``,
            );
        },
        clear: async () => {
            history.value = [];
            return "";
        },
    };

    const handler = commands[cmd];

    if (typeof handler === "function") {
        const html = await handler();
        if (html) {
            history.value.push({ type: "output", html });
        }
    } else {
        history.value.push({
            type: "output",
            html: `<p class="text-red-800">Command not found: <strong>${cmd}</strong></p>`,
        });
    }

    currentCommand.value = "";

    await nextTick();
    terminalRef.value.scrollTop = terminalRef.value.scrollHeight;
}
</script>
<style scoped>
  pre, code {
  white-space: pre-wrap;
  word-break: break-word;
  }
</style>
