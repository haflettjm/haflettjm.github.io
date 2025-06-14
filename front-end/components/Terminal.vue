<template>
    <div
        class="w-full h-full text-green-400 font-mono p-4 overflow-y-auto font-mono text-xs sm:text-sm md:text-base leading-relaxed break-words whitespace-pre-wrap"
        ref="terminalRef"
        style="max-width: 100%; word-break: break-word"
    >
        <div v-for="(entry, index) in history" :key="index">
            <div
                v-if="entry.type === 'output'"
                v-html="entry.html"
                class="prose prose-invert w-full break-words whitespace-pre-wrap text-left text-green-400 leading-relaxed break-words whitespace-pre-wrap"
                style="word-break: break-word"
            ></div>
            <div v-else-if="entry.type === 'prompt'" class="mb-2">
                <span class="muted-text">[10:34:56]</span>
                <span><strong>$ ~/:</strong>{{ entry.command }} </span>
            </div>
        </div>
        <div class="flex items-center w-full">
            <span class="mr-3"><strong>$ ~/:</strong></span>
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
import { onMounted, ref, nextTick, render } from "vue";
import { renderMarkdown } from "../utils/markdownParser.ts";

onMounted(async () => {
    const defaultCmd = "home";
    currentCommand.value = defaultCmd;
    await handleCommand();
});

const history = ref([
    {
        type: "output",
        html: '<p>Welcome to my portfolio! Type "help" for a list of commands</p>',
    },
]);

const currentCommand = ref("");
const terminalRef = ref(null);

interface Command {
    name: string;
    description: string;
    execute: () => Promise<string>;
}
function loadMarkdownPage(name: string): () => Promise<string> {
    return async () => {
        const res = await fetch(`/content/${name}.md`);
        const text = await res.text();
        return renderMarkdown(text);
    };
}

const commandRegistry: Record<string, Command> = {
    home: {
        name: "home",
        description: "Shows the homepage.",
        execute: loadMarkdownPage("home"),
    },
    help: {
        name: "help",
        description: "List all available commands.",
        execute: async () => {
            const helpText = Object.values(commandRegistry)
                .map((cmd) => `- \`${cmd.name}\`: ${cmd.description}`)
                .join("\n");
            return renderMarkdown(`## Available Commands\n ${helpText}`);
        },
    },
    clear: {
        name: "clear",
        description: "Clear the screen history of all previous commands.",
        execute: () => {
            history.value = [];
        },
    },
    about: {
        name: "about",
        description: "Clear the screen history of all previous commands.",
        execute: loadMarkdownPage("about"),
    },
    contact: {
        name: "contact",
        description: "Ways to get in touch with me directly.",
        execute: loadMarkdownPage("contact"),
    },
    skills: {
        name: "skills",
        description: "Technologies and domains I specialize in.",
        execute: loadMarkdownPage("skills"),
    },
    resume: {
        name: "resume",
        description: "View or download my full professional resume.",
        execute: loadMarkdownPage("resume"),
    },
    projects: {
        name: "projects",
        description:
            "Explore featured work with tools, descriptions, and links.",
        execute: loadMarkdownPage("projects"),
    },
};

async function handleCommand() {
    const cmd = currentCommand.value.trim();
    if (!cmd) return;

    history.value.push({ type: "prompt", command: cmd });

    const command = commandRegistry[cmd];

    if (command) {
        const html = await command.execute();
        if (html) {
            history.value.push({ type: "output", html });
        }
    } else {
        history.value.push({
            type: "output",
            html: `<p class="text-red-800">Command not found <strong>${cmd}</strong></p>`,
        });
    }
    currentCommand.value = "";

    await nextTick();
    terminalRef.value.scrollTop = terminalRef.value.scrollHeight;
}
</script>
<style scoped>
pre,
code {
    white-space: pre-wrap;
    word-break: break-word;
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
:root a[class*="text-green-400"] {
    color: #ff69b4 !important;
    text-shadow: 0 0 2px #ff69b4 !important;
    text-decoration: underline !important;
}
</style>
