// Renderer.js
import { WebGLContext } from "./WebGLContext.js";
import { RenderSystem } from "./RenderSystem.js";
import { Camera } from "./Camera.js";

export class Renderer {
  constructor(canvas, ecs) {
    this.canvas = canvas;
    this.ecs = ecs;
    this.glctx = new WebGLContext(canvas);
    this.renderSystem = new RenderSystem(this.ecs);
    this.camera = new Camera();

    // GPU buffers for instancing
    this.starInstanceBuffer = this.glctx.gl.createBuffer();
    this.nebulaInstanceBuffer = this.glctx.gl.createBuffer();
  }

  render() {
    this.renderSystem.update(0);

    const gl = this.glctx.gl;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.02, 0.03, 0.06, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.drawNebulae();
    this.drawStars();
  }

  drawStars() {
    const gl = this.glctx.gl;
    const stars = this.renderSystem.stars;
    if (!stars || stars.length === 0) return;

    // LOD: filter by distance and limit instance count
    const cam = this.camera;
    const instances = [];
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const dx = s.transform.x - cam.x;
      const dy = s.transform.y - cam.y;
      const dz = s.transform.z - cam.z;
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
      // skip extremely far stars
      if (dist > 5000) continue;
      // compute size by distance
      const size = Math.max(1.0, 6.0 * (1.0 - Math.min(dist / 2000, 1.0)));
      instances.push({ pos: [s.transform.x, s.transform.y, s.transform.z], color: s.star.color, size });
    }

    // cap instances for performance
    const MAX_INST = 20000;
    if (instances.length > MAX_INST) instances.length = MAX_INST;

    // build interleaved buffer: x,y,z,r,g,b,size
    const data = new Float32Array(instances.length * 7);
    for (let i = 0; i < instances.length; i++) {
      const it = instances[i];
      const base = i * 7;
      data[base+0] = it.pos[0];
      data[base+1] = it.pos[1];
      data[base+2] = it.pos[2];
      data[base+3] = it.color[0];
      data[base+4] = it.color[1];
      data[base+5] = it.color[2];
      data[base+6] = it.size;
    }

    const progInfo = this.glctx.getInstancedStarProgram();
    gl.useProgram(progInfo.program);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.starInstanceBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);

    // position (vec3) at location 0
    const stride = 7 * 4;
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, 0);
    // color (vec3) at location 1
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, stride, 12);
    // size (float) at location 2
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 1, gl.FLOAT, false, stride, 24);

    // viewProjection
    const aspect = gl.canvas.width / gl.canvas.height;
    const proj = this.camera.projectionMatrix(aspect);
    const view = this.camera.viewMatrix();
    const viewProj = multiplyMatrices(proj, view);
    gl.uniformMatrix4fv(progInfo.uniforms.viewProjection, false, viewProj);

    gl.drawArrays(gl.POINTS, 0, instances.length);

    gl.disableVertexAttribArray(0);
    gl.disableVertexAttribArray(1);
    gl.disableVertexAttribArray(2);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.useProgram(null);
  }

  drawNebulae() {
    const gl = this.glctx.gl;
    const nebulae = this.renderSystem.nebulae;
    if (!nebulae || nebulae.length === 0) return;

    const instances = [];
    for (let i = 0; i < nebulae.length; i++) {
      const n = nebulae[i].nebula;
      const t = nebulae[i].transform;
      instances.push({ center: [t.x, t.y, t.z], color: n.color, radius: n.radius });
    }

    const data = new Float32Array(instances.length * 7);
    for (let i = 0; i < instances.length; i++) {
      const it = instances[i];
      const base = i * 7;
      data[base+0] = it.center[0];
      data[base+1] = it.center[1];
      data[base+2] = it.center[2];
      data[base+3] = it.color[0];
      data[base+4] = it.color[1];
      data[base+5] = it.color[2];
      data[base+6] = it.radius;
    }

    const progInfo = this.glctx.getNebulaProgram();
    gl.useProgram(progInfo.program);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.nebulaInstanceBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);

    const stride = 7 * 4;
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, stride, 12);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 1, gl.FLOAT, false, stride, 24);

    const aspect = gl.canvas.width / gl.canvas.height;
    const proj = this.camera.projectionMatrix(aspect);
    const view = this.camera.viewMatrix();
    const viewProj = multiplyMatrices(proj, view);
    gl.uniformMatrix4fv(progInfo.uniforms.viewProjection, false, viewProj);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.drawArrays(gl.POINTS, 0, instances.length);
    gl.disable(gl.BLEND);

    gl.disableVertexAttribArray(0);
    gl.disableVertexAttribArray(1);
    gl.disableVertexAttribArray(2);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.useProgram(null);
  }
}

function multiplyMatrices(a, b) {
  const out = new Float32Array(16);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) {
        sum += a[k * 4 + j] * b[i * 4 + k];
      }
      out[i * 4 + j] = sum;
    }
  }
  return out;
}
