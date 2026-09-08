// WebGLContext.js
export class WebGLContext {
  constructor(canvas) {
    this.canvas = canvas;
    const gl = canvas.getContext("webgl2", { antialias: true });
    if (!gl) throw new Error("WebGL2 not supported");
    this.gl = gl;
    this.programs = {};
    this.resizeCanvasToDisplaySize();
    window.addEventListener("resize", () => this.resizeCanvasToDisplaySize());
  }

  resizeCanvasToDisplaySize() {
    const canvas = this.canvas;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const width = Math.floor(canvas.clientWidth * dpr);
    const height = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  }

  compileProgram(vsSource, fsSource) {
    const gl = this.gl;
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      throw new Error("VS compile: " + gl.getShaderInfoLog(vs));
    }
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      throw new Error("FS compile: " + gl.getShaderInfoLog(fs));
    }
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error("Program link: " + gl.getProgramInfoLog(prog));
    }
    return prog;
  }

  getInstancedStarProgram() {
    if (this.programs.instancedStar) return this.programs.instancedStar;
    const vs = `#version 300 es
    layout(location=0) in vec3 a_position;
    layout(location=1) in vec3 a_color;
    layout(location=2) in float a_size;
    uniform mat4 u_viewProjection;
    out vec3 v_color;
    void main() {
      v_color = a_color;
      gl_Position = u_viewProjection * vec4(a_position, 1.0);
      gl_PointSize = a_size;
    }`;
    const fs = `#version 300 es
    precision mediump float;
    in vec3 v_color;
    out vec4 outColor;
    void main() {
      vec2 coord = gl_PointCoord - vec2(0.5);
      float d = length(coord);
      float alpha = smoothstep(0.5, 0.0, d);
      outColor = vec4(v_color, alpha);
    }`;
    const prog = this.compileProgram(vs, fs);
    const gl = this.gl;
    const buffer = gl.createBuffer();
    this.programs.instancedStar = {
      program: prog,
      buffer,
      attribs: { position: 0, color: 1, size: 2 },
      uniforms: { viewProjection: gl.getUniformLocation(prog, "u_viewProjection") }
    };
    return this.programs.instancedStar;
  }

  getNebulaProgram() {
    if (this.programs.nebula) return this.programs.nebula;
    const vs = `#version 300 es
    layout(location=0) in vec3 a_center;
    layout(location=1) in vec3 a_color;
    layout(location=2) in float a_radius;
    uniform mat4 u_viewProjection;
    out vec3 v_color;
    out float v_radius;
    void main() {
      v_color = a_color;
      v_radius = a_radius;
      // render as point at center; fragment shader will expand
      gl_Position = u_viewProjection * vec4(a_center, 1.0);
      gl_PointSize = a_radius * 2.0;
    }`;
    const fs = `#version 300 es
    precision mediump float;
    in vec3 v_color;
    in float v_radius;
    out vec4 outColor;
    void main() {
      vec2 coord = gl_PointCoord - vec2(0.5);
      float d = length(coord);
      float alpha = smoothstep(0.9, 0.0, d);
      // soft additive glow
      outColor = vec4(v_color * 0.6, alpha * 0.6);
    }`;
    const prog = this.compileProgram(vs, fs);
    const gl = this.gl;
    const buffer = gl.createBuffer();
    this.programs.nebula = {
      program: prog,
      buffer,
      attribs: { center: 0, color: 1, radius: 2 },
      uniforms: { viewProjection: gl.getUniformLocation(prog, "u_viewProjection") }
    };
    return this.programs.nebula;
  }
}
