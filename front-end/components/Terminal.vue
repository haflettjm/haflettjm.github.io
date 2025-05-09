<script setup>
    import { ref, nextTick } from 'vue'
    import { renderMarkdown } from '../utils/markdownParser.ts'

    const history = ref([
      { type: 'output', html: '<p>Welcome to my portfolio! Type "help" for a list of commands</p>'}
    ])

    const currentCommand = ref('')
    const terminalRef = ref=(null)
</script>

<template>
  <div class="w-full h-full bg-black text-green-400 font-mono p-4 overflow-y-auto" ref="terminalRef">
    <div v-for="(entry, index) in history" :key="index">
      <div v-if="entry.type ==='output'" v-html="entry.html" class="mb-2"></div>
      <div v-else-if="entry.type === 'prompt'" class="mb-2">
        <span>
          $~ {{ entry.command }}
        </span>
      </div>
    </div>
    <div>
      <span class="mr-2">
        $~
      </span>
      <input
          v-model="currentCommand"
          @keydown.enter="handleCommand"
          class="bg-transparent border-none outline-none text-green-400 flex-1"
          autofocus
      />
    </div>
  </div>
</template>
