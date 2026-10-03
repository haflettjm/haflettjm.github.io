<script setup lang="ts">
/* Scripted walkthrough of how llm-tutor teaches. It is not connected to the real tutor. */
interface Step {
  t: string;
  opts: [string, boolean][];
}
const steps: Step[] = [
  {
    t: "You already showed you can start goroutines. Here is a function that launches 3 workers and returns.\nWhat do you expect main to print?\n\n  results := make(chan int)\n  for i := 0; i < 3; i++ { go func(n int) { results <- n * n }(i) }\n  fmt.Println(len(results))",
    opts: [
      ["0, because the channel is unbuffered", true],
      ["3, one per worker", false],
      ["it deadlocks", false],
    ],
  },
  {
    t: "Right. An unbuffered channel never holds values, so len is 0 and the workers block until someone receives.\nHow would you collect all three results?",
    opts: [
      ["loop 3 times and receive from results", true],
      ["add time.Sleep before printing", false],
      ["close(results) then range over it", false],
    ],
  },
  {
    t: "Good. Receiving exactly as many times as you sent is the simplest correct pattern. I marked channels as practiced.\nNext concept unlocked: select.",
    opts: [],
  },
];
const WRONG = "Not quite. Think about where the values live before anyone receives them. Try again.";

const step = ref(0);
const msgs = ref<{ r: "t" | "u"; text: string }[]>([{ r: "t", text: steps[0].t }]);
const prog = reactive<Record<string, string>>({ goroutines: "demonstrated", channels: "introduced", select: "locked" });
const lastUp = ref("");
const scratch = ref("(empty)");

function choose(label: string, ok: boolean) {
  msgs.value.push({ r: "u", text: label });
  if (!ok) {
    msgs.value.push({ r: "t", text: WRONG });
    return;
  }
  step.value++;
  msgs.value.push({ r: "t", text: steps[step.value].t });
  if (step.value === steps.length - 1) {
    prog.channels = "practiced";
    prog.select = "introduced";
    lastUp.value = "channels";
    scratch.value = "- len(unbuffered) is always 0\n- receive N times for N sends";
  }
}
</script>

<template>
  <div class="demo">
    <div class="demo-head">
      <span><b>llm-tutor</b> · guided lesson</span>
      <span class="mut">lesson: go/concurrency</span>
    </div>
    <div class="demo-note">
      Scripted walkthrough of how the tutor teaches: it asks for a prediction, answers with a hint
      instead of the solution, and tracks what you have shown. Not connected to the real tutor.
    </div>
    <div class="tutor">
      <div class="chat" role="log" aria-live="polite">
        <div v-for="(m, i) in msgs" :key="i" class="msg" :class="`msg--${m.r}`">{{ m.text }}</div>
        <div v-if="steps[step].opts.length" class="choices">
          <button
            v-for="[label, ok] in steps[step].opts"
            :key="label"
            type="button"
            class="choice"
            @click="choose(label, ok)"
          >
            {{ label }}
          </button>
        </div>
      </div>
      <div class="side">
        <div>
          <h4>concept progress</h4>
          <div v-for="(v, k) in prog" :key="k" class="state" :class="{ 'state--up': lastUp === k || (k === 'select' && v === 'introduced') }">
            <span>{{ k }}</span><span>{{ v }}</span>
          </div>
        </div>
        <div>
          <h4>scratchpad</h4>
          <div class="scratch">{{ scratch }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
