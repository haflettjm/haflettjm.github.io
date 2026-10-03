<script setup lang="ts">
/*
 * Halftone drift field: WebGL2 fbm flow under a rotated dot screen, pulled toward the cursor.
 * Ported from the Open Design TTY build. Decorative only: hidden when WebGL2 is unavailable,
 * drawn once under reduced motion, paused when the tab is hidden.
 */
const cv = ref<HTMLCanvasElement | null>(null);
let stop = () => {};

onMounted(() => {
  const canvas = cv.value;
  if (!canvas) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gl = canvas.getContext("webgl2", { antialias: false });
  if (!gl) {
    canvas.hidden = true;
    return;
  }
  try {
    const VERT =
      "#version 300 es\nvoid main(){ vec2 p=vec2((gl_VertexID<<1)&2, gl_VertexID&2); gl_Position=vec4(p*2.0-1.0,0.0,1.0); }";
    const FRAG =
      "#version 300 es\nprecision highp float; out vec4 o; uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse;" +
      "mat2 rot(float a){ float c=cos(a),s=sin(a); return mat2(c,-s,s,c); } float hash(vec2 p){ return fract(sin(dot(p,vec2(41.3,289.1)))*43758.5453); }" +
      "float noise(vec2 p){ vec2 i=floor(p),f=fract(p); vec2 u=f*f*(3.0-2.0*f); return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y); }" +
      "float fbm(vec2 p){ float v=0.0,a=0.55; for(int i=0;i<5;i++){ v+=a*noise(p); p=rot(0.7)*p*1.9+7.0; a*=0.55; } return v; }" +
      "vec3 duo(float t){ vec3 ink=vec3(0.051), mid=vec3(0.17,0.54,0.32), hot=vec3(1.0,0.41,0.71); vec3 c=mix(ink,mid,smoothstep(0.15,0.6,t)); return mix(c,hot,smoothstep(0.8,1.05,t)*0.6); }" +
      "void main(){ vec2 uv=(gl_FragCoord.xy-0.5*u_res)/u_res.y; float t=u_time*0.05; vec2 m=(u_mouse-0.5)*vec2(u_res.x/u_res.y,1.0); vec2 pull=(m-uv); float grab=0.3/(dot(pull,pull)+0.3);" +
      "vec2 q=vec2(fbm(uv*1.3+vec2(0.0,t)), fbm(uv*1.3+vec2(4.0,-t))); float v=fbm(uv*1.3+2.4*q+grab*pull+t); v=smoothstep(0.15,0.95,v);" +
      "float cells=u_res.y/9.0; vec2 sc=rot(0.4)*(gl_FragCoord.xy/u_res.y)*cells; vec2 g=fract(sc)-0.5; float dotr=sqrt(v)*0.72; float dotm=smoothstep(dotr,dotr-0.09,length(g));" +
      "vec3 col=mix(duo(v)*0.3,duo(v),dotm); col*=0.7+0.5*smoothstep(1.4,0.1,length(uv)); col*=0.24; o=vec4(pow(max(col,0.0),vec3(0.9)),1.0); }";
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
    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const small = window.matchMedia("(max-width: 767px)").matches;
    const t0 = performance.now();
    let mouse = [0.5, 0.5];
    let target = [0.5, 0.5];
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target = [e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight];
    };
    const size = () => {
      const d = Math.min(window.devicePixelRatio || 1, 1) * (small ? 0.75 : 1);
      const w = Math.max(1, (window.innerWidth * d) | 0);
      const h = Math.max(1, (window.innerHeight * d) | 0);
      if (w !== canvas.width || h !== canvas.height) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    const draw = (now: number) => {
      size();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reduced ? 12 : (now - t0) / 1000);
      gl.uniform2f(uMouse, mouse[0], mouse[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    if (reduced) {
      draw(0);
      const redraw = () => draw(0);
      window.addEventListener("resize", redraw);
      stop = () => window.removeEventListener("resize", redraw);
      return;
    }
    window.addEventListener("pointermove", onMove);
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      mouse[0] += (target[0] - mouse[0]) * 0.06;
      mouse[1] += (target[1] - mouse[1]) * 0.06;
      draw(now);
    };
    raf = requestAnimationFrame(loop);
    stop = () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  } catch {
    canvas.hidden = true;
  }
});

onBeforeUnmount(() => stop());
</script>

<template>
  <canvas ref="cv" class="field" aria-hidden="true" />
</template>
