<script setup lang="ts">
/*
 * ASCII portrait. The photo is sampled per character cell on the GPU, the glyph comes from a
 * JetBrains Mono atlas, and the cursor pushes a noise ripple through it with film grain on top.
 * Ported from the Open Design build to raw WebGL2. Falls back to a plain ASCII render when
 * WebGL2 is missing or the visitor prefers reduced motion. The box has a fixed size, so nothing
 * shifts while it loads. Background pixels stay empty so the head reads clearly.
 */
const box = ref<HTMLDivElement | null>(null);
const mode = ref<"pending" | "gpu" | "ascii">("pending");
let stop = () => {};

const GLYPHS = " .,:;-=+*#%@";

function hexToVec3(value: string): [number, number, number] {
  const h = value.trim().replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function renderAscii(el: HTMLElement, img: HTMLImageElement) {
  const cols = 50;
  const rows = 50;
  const canvas = document.createElement("canvas");
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.drawImage(img, 0, 0, cols, rows);
  const px = ctx.getImageData(0, 0, cols, rows).data;
  let html = "";
  let run = "";
  let runCls = "";
  const flush = () => {
    if (run) html += `<span class="${runCls}">${run}</span>`;
    run = "";
  };
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = px[(r * cols + c) * 4] / 255;
      const ch = GLYPHS[Math.min(GLYPHS.length - 1, Math.floor(v * GLYPHS.length))];
      const cls = v > 0.62 ? "g2" : "g1";
      if (cls !== runCls) {
        flush();
        runCls = cls;
      }
      run += ch;
    }
    run += "\n";
  }
  flush();
  const pre = document.createElement("pre");
  pre.setAttribute("aria-hidden", "true");
  // Safe: html is built only from characters of the fixed GLYPHS string plus our own span tags.
  pre.innerHTML = html;
  el.replaceChildren(pre);
  mode.value = "ascii";
}

function renderGpu(el: HTMLElement, img: HTMLImageElement): boolean {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2", { alpha: true, antialias: false, premultipliedAlpha: true, preserveDrawingBuffer: true });
  if (!gl) return false;
  try {
    const VERT =
      "#version 300 es\nout vec2 vUv; void main(){ vec2 p=vec2((gl_VertexID<<1)&2, gl_VertexID&2); vUv=p; gl_Position=vec4(p*2.0-1.0,0.0,1.0); }";
    const FRAG = `#version 300 es
      precision highp float; in vec2 vUv; out vec4 o;
      uniform sampler2D uPhoto, uGlyphs; uniform vec2 uGrid, uMouse; uniform float uN, uTime, uHover; uniform vec3 uDim, uHi, uHot;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
      float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),u.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x), u.y); }
      void main(){
        vec2 cell = floor(vUv * uGrid), local = fract(vUv * uGrid), c = (cell + .5) / uGrid;
        float d = distance(c * vec2(1., 1.5), uMouse * vec2(1., 1.5));
        float wave = sin(d * 38. - uTime * 7.) * exp(-d * 7.) * uHover;
        vec2 jitter = (vec2(noise(c * 9. + uTime), noise(c * 9. - uTime)) - .5) * .05 * abs(wave);
        float lum = smoothstep(.06, .92, texture(uPhoto, c + jitter).r);
        float idx = floor(clamp(lum + abs(wave) * .35, 0., 1.) * (uN - 1.) + .5);
        float a = texture(uGlyphs, vec2((idx + local.x) / uN, local.y)).r;
        vec3 ink = mix(uDim, uHi, smoothstep(.5, .7, lum));
        ink = mix(ink, uHot, smoothstep(.45, .8, abs(wave)));
        float grain = (hash(gl_FragCoord.xy + fract(uTime) * 91.) - .5) * .12;
        float alpha = a * (.55 + .45 * lum);
        o = vec4(clamp(ink + grain, 0., 1.) * alpha, alpha);
      }`;
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
      return s;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    gl.useProgram(program);

    const N = GLYPHS.length;
    const GW = 24;
    const GH = 36;
    const COLS = 36;
    const ROWS = 32;
    const atlas = document.createElement("canvas");
    atlas.width = GW * N;
    atlas.height = GH;
    const ax = atlas.getContext("2d")!;

    const texture = (unit: number, source: TexImageSource) => {
      const t = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return t;
    };
    const drawAtlas = () => {
      ax.clearRect(0, 0, atlas.width, atlas.height);
      ax.fillStyle = "#fff";
      ax.textBaseline = "middle";
      ax.textAlign = "center";
      ax.font = "700 30px 'JetBrains Mono', ui-monospace, monospace";
      for (let i = 0; i < N; i++) ax.fillText(GLYPHS[i], i * GW + GW / 2, GH / 2 + 1);
    };
    drawAtlas();
    texture(0, img);
    texture(1, atlas);
    const reuploadAtlas = () => {
      drawAtlas();
      gl.activeTexture(gl.TEXTURE1);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
    };
    // redraw the atlas once the mono face is ready so glyphs match the page
    (document.fonts ? document.fonts.load("700 30px 'JetBrains Mono'") : Promise.resolve()).then(reuploadAtlas, () => {});

    const css = getComputedStyle(document.documentElement);
    const u = (name: string) => gl.getUniformLocation(program, name);
    gl.uniform1i(u("uPhoto"), 0);
    gl.uniform1i(u("uGlyphs"), 1);
    gl.uniform2f(u("uGrid"), COLS, ROWS);
    gl.uniform1f(u("uN"), N);
    gl.uniform3fv(u("uDim"), hexToVec3(css.getPropertyValue("--green-dim")));
    gl.uniform3fv(u("uHi"), hexToVec3(css.getPropertyValue("--green")));
    gl.uniform3fv(u("uHot"), hexToVec3(css.getPropertyValue("--pink")));
    const uTime = u("uTime");
    const uMouse = u("uMouse");
    const uHover = u("uHover");
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    el.replaceChildren(canvas);
    const mouse = { x: 0.5, y: 0.5, h: 0 };
    const target = { x: 0.5, y: 0.5, h: 0 };
    const onMove = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      target.x = (e.clientX - b.left) / b.width;
      target.y = 1 - (e.clientY - b.top) / b.height;
      target.h = 1;
    };
    const onLeave = () => {
      target.h = 0;
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(el.clientWidth * dpr));
      const h = Math.max(1, Math.round(el.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener("resize", fit);
    fit();
    const t0 = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      mouse.x += (target.x - mouse.x) * 0.12;
      mouse.y += (target.y - mouse.y) * 0.12;
      mouse.h += (target.h - mouse.h) * 0.06;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, (now - t0) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uHover, mouse.h);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(loop);
    stop = () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
    mode.value = "gpu";
    return true;
  } catch {
    return false;
  }
}

onMounted(() => {
  const el = box.value;
  if (!el) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const img = new Image();
  img.onload = () => {
    if (reduced || !renderGpu(el, img)) renderAscii(el, img);
  };
  img.src = "/portrait.jpg";
});

onBeforeUnmount(() => stop());
</script>

<template>
  <div ref="box" class="face3" role="img" aria-label="ASCII portrait of Jacob Haflett" :data-face="mode" />
</template>
