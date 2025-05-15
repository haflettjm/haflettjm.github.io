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


interface Command {
  name: string;
  description: string;
  execute () => Promise<string>
}

const commandRegistry: Record<string, Command> ={
  home: {
    name: 'home',
    description: 'Shows the homepage.',
    execute: async () =>{
      const res = await fetch('/content/home.md');
      const text = await res.text();
      return renderMarkdown(text);
    }
  },
  help: {
    name: 'help',
    description: 'List all available commands.',
    execute: async () =>{
      const helpText = Object.values(commandRegistry)
        .map(cmd => `- \`${cmd.name}\`: ${cmd.description}`)
        .join('\n')
      return renderMarkdown(`## Available Commands\n ${helpText}`)
    }
  },
}


async function handleCommand() {
    const cmd = currentCommand.value.trim();
    if (!cmd) return;

    history.value.push({ type: "prompt", command: cmd });

    const command = commandRegistry[cmd];

  if (command) {
    const html = await command.execute()
    if (html) {
      history.value.push({ type: "output", html });
    }
  }
  else{
      history.value.push({
        type: "output",
        html: `<p class="text-red-800">Command not found <strong>${cmd}</strong></p>`,
      })
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
</style>
