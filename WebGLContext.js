export class WebGLContext {
  constructor(canvas) {
    this.canvas = canvas;
    const gl = canvas.getContext("webgl2", { antialias: true });
    if (!gl) throw new Error("WebGL2 not supported");
    this.gl = gl;
    this.pointProgramInfo = null;
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

  getOrCreatePointProgram() {
    if (this.pointProgramInfo) return this.pointProgramInfo;
    const gl = this.gl;

    const vsSource = `#version 300 es
    in vec3 a_position;
    in vec3 a_color;
    out vec3 v_color;
    void main() {
      v_color = a_color;
      gl_Position = vec4(a_position * 0.01, 1.0);
      gl_PointSize = 2.0;
    }`;

    const fsSource = `#version 300 es
    precision mediump float;
    in vec3 v_color;
    out vec4 outColor;
    void main() {
      outColor = vec4(v_color, 1.0);
    }`;

    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(vs));
      throw new Error("Vertex shader compile error");
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(fs));
      throw new Error("Fragment shader compile error");
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      throw new Error("Program link error");
    }

    const buffer = gl.createBuffer();
    const posLoc = gl.getAttribLocation(prog, "a_position");
    const colLoc = gl.getAttribLocation(prog, "a_color");

    this.pointProgramInfo = {
      program: prog,
      buffer,
      attribs: { position: posLoc, color: colLoc }
    };
    return this.pointProgramInfo;
  }
}
