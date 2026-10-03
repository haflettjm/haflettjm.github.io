<script setup lang="ts">
import { profile } from "~/content/profile";
import { experience } from "~/content/experience";
import { projects, systems } from "~/content/projects";
import { skillGroups } from "~/content/skills";

/* Staggered reveals. Content below the fold is hidden by script only, so it is fully
   visible without JS and under reduced motion. A plain scroll handler reveals every element
   at or above the viewport, so jumps (anchor links, End key, restored scroll) can never leave
   content hidden. */
let teardown = () => {};
onMounted(async () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const { gsap } = await import("gsap");
  const pending = new Set(
    gsap.utils
      .toArray<HTMLElement>("[data-reveal]")
      .filter((el) => el.getBoundingClientRect().top > window.innerHeight * 0.92),
  );
  gsap.set([...pending], { opacity: 0, y: 18 });

  let queued = false;
  const flush = () => {
    queued = false;
    const limit = window.innerHeight * 0.92;
    const ready = [...pending].filter((el) => el.getBoundingClientRect().top < limit);
    if (!ready.length) return;
    ready.forEach((el) => pending.delete(el));
    // Content the visitor already scrolled past appears instantly. Only what is on
    // screen animates, with a stagger capped at 0.4s however many elements arrive at once.
    const passed = ready.filter((el) => el.getBoundingClientRect().bottom < 0);
    const onScreen = ready.filter((el) => !passed.includes(el));
    if (passed.length) gsap.set(passed, { opacity: 1, y: 0, clearProps: "transform" });
    if (onScreen.length) {
      gsap.to(onScreen, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: { amount: Math.min(0.4, 0.08 * onScreen.length) },
        ease: "power2.out",
        overwrite: true,
        clearProps: "transform",
      });
    }
  };
  const schedule = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(flush);
    }
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  window.addEventListener("hashchange", schedule);
  window.addEventListener("load", schedule);
  setTimeout(schedule, 150);
  teardown = () => {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    window.removeEventListener("hashchange", schedule);
    window.removeEventListener("load", schedule);
  };
});
onBeforeUnmount(() => teardown());
</script>

<template>
  <div>
    <section id="top" class="hero" aria-labelledby="hero-title">
      <div class="wrap hero__grid">
        <div class="hero__text">
          <h1 id="hero-title" class="hero__title">{{ profile.name }}</h1>
          <p class="role" data-role>{{ profile.role }}</p>
          <p class="hero__lede">{{ profile.tagline }}</p>
          <p>{{ profile.summary }}</p>
          <div class="cta">
            <a class="btn btn--primary" :href="profile.links.resume">Resume (PDF)</a>
            <a class="btn" href="#contact">Contact</a>
            <a class="btn btn--ghost" :href="profile.links.github" target="_blank" rel="noopener">GitHub</a>
          </div>
          <ul class="stats">
            <li v-for="s in profile.stats" :key="s.label">
              <strong>{{ s.value }}</strong>
              <span>{{ s.label }}</span>
            </li>
          </ul>
        </div>
        <div class="hero__side">
          <BootLog />
          <div class="tty">
            <AsciiPortrait />
          </div>
        </div>
      </div>
    </section>

    <section id="work" class="section" aria-labelledby="work-title">
      <div class="wrap">
        <h2 id="work-title" class="section__title" data-reveal>Selected work</h2>
        <h3 class="group-title">Production systems</h3>
        <div class="cards">
          <article v-for="s in systems" :key="s.id" class="card" data-reveal data-system>
            <h4 class="card__title">{{ s.title }}</h4>
            <div class="card__meta">{{ s.org }}</div>
            <p>{{ s.blurb }}</p>
            <ul class="role-stats">
              <li v-for="k in s.stats" :key="k.label">
                <strong>{{ k.value }}</strong>
                <span>{{ k.label }}</span>
              </li>
            </ul>
            <div class="card__note">Employer system, described from public facts. No code shown.</div>
          </article>
        </div>

        <h3 class="group-title">Projects</h3>
        <div class="cards cards--wide">
          <article v-for="p in projects" :key="p.id" class="card" data-reveal data-project :data-project-id="p.id">
            <div class="card__head">
              <h4 class="card__title">{{ p.title }}</h4>
              <span class="tag" :class="`tag--${p.status.replace(' ', '-')}`" data-status>{{ p.status }}</span>
            </div>
            <div class="card__meta">{{ p.kind }}</div>
            <p>{{ p.blurb }}</p>
            <ul class="chips">
              <li v-for="t in p.stack" :key="t" class="chip">{{ t }}</li>
            </ul>
            <div v-if="p.note" class="card__note">{{ p.note }}</div>
            <div v-if="p.repo" class="card__links">
              <a class="btn btn--ghost" :href="p.repo" target="_blank" rel="noopener">Source on GitHub</a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="experience" class="section" aria-labelledby="experience-title">
      <div class="wrap">
        <h2 id="experience-title" class="section__title" data-reveal>Experience</h2>
        <ol class="timeline">
          <li v-for="r in experience" :key="r.id" class="role-item" data-reveal>
            <div class="role-item__when">{{ r.when }}</div>
            <div class="role-item__body">
              <h3 class="role-item__title">{{ r.title }}</h3>
              <div class="role-item__org">{{ r.org }}</div>
              <p>{{ r.framing }}</p>
              <ul class="role-stats">
                <li v-for="s in r.stats" :key="s.label">
                  <strong>{{ s.value }}</strong>
                  <span>{{ s.label }}</span>
                </li>
              </ul>
              <ul class="points">
                <li v-for="pt in r.points" :key="pt">{{ pt }}</li>
              </ul>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section id="skills" class="section" aria-labelledby="skills-title">
      <div class="wrap">
        <h2 id="skills-title" class="section__title" data-reveal>Skills</h2>
        <div class="skill-groups">
          <div v-for="g in skillGroups" :key="g.id" class="skill-group" data-reveal>
            <h3>{{ g.title }}</h3>
            <ul class="chips">
              <li
                v-for="s in g.skills"
                :key="s.name"
                class="chip"
                :class="{ 'chip--growth': s.growth }"
                :data-growth="s.growth ? 'true' : undefined"
              >
                {{ s.name }}<span v-if="s.growth" class="chip__tag">learning</span>
              </li>
            </ul>
          </div>
        </div>
        <p class="legend">Dashed chips marked learning are personal projects, not yet production experience.</p>
      </div>
    </section>

    <section id="contact" class="section" aria-labelledby="contact-title">
      <div class="wrap contact">
        <h2 id="contact-title" class="section__title" data-reveal>Contact</h2>
        <p>{{ profile.availability }}</p>
        <div class="cta">
          <a class="btn btn--primary" :href="profile.links.email">Email {{ profile.email }}</a>
          <a class="btn btn--ghost" :href="profile.links.github" target="_blank" rel="noopener">GitHub</a>
          <a class="btn btn--ghost" :href="profile.links.resume">Resume (PDF)</a>
        </div>
      </div>
    </section>
  </div>
</template>
