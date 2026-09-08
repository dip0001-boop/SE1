import { WebGLContext } from "./WebGLContext.js";
import { RenderSystem } from "./RenderSystem.js";

export class Renderer {
  constructor(canvas, ecs) {
    this.canvas = canvas;
    this.ecs = ecs;
    this.glctx = new WebGLContext(canvas);
    this.renderSystem = new RenderSystem(this.ecs);
  }

  render() {
    this.renderSystem.update(0);

    const gl = this.glctx.gl;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.02, 0.03, 0.06, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.drawStars();
  }

  drawStars() {
    const gl = this.glctx.gl;
    const stars = this.renderSystem.stars;
    if (!stars || stars.length === 0) return;

    const data = new Float32Array(stars.length * 6);
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const t = s.transform;
      const c = s.star.color;
      const base = i * 6;
      data[base + 0] = t.x;
      data[base + 1] = t.y;
      data[base + 2] = t.z;
      data[base + 3] = c[0];
      data[base + 4] = c[1];
      data[base + 5] = c[2];
    }

    const progInfo = this.glctx.getOrCreatePointProgram();
    gl.useProgram(progInfo.program);

    gl.bindBuffer(gl.ARRAY_BUFFER, progInfo.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);

    const posLoc = progInfo.attribs.position;
    const colLoc = progInfo.attribs.color;

    if (posLoc >= 0) {
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 24, 0);
    }
    if (colLoc >= 0) {
      gl.enableVertexAttribArray(colLoc);
      gl.vertexAttribPointer(colLoc, 3, gl.FLOAT, false, 24, 12);
    }

    gl.drawArrays(gl.POINTS, 0, stars.length);

    if (posLoc >= 0) gl.disableVertexAttribArray(posLoc);
    if (colLoc >= 0) gl.disableVertexAttribArray(colLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.useProgram(null);
  }
}
