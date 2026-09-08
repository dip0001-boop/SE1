// Camera.js
export class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.z = 200;
    this.fov = 60;
    this.near = 0.1;
    this.far = 10000;
  }

  projectionMatrix(aspect) {
    const fovy = (this.fov * Math.PI) / 180;
    const f = 1.0 / Math.tan(fovy / 2);
    const nf = 1 / (this.near - this.far);
    const out = new Float32Array(16);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;

    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;

    out[8] = 0;
    out[9] = 0;
    out[10] = (this.far + this.near) * nf;
    out[11] = -1;

    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * this.far * this.near) * nf;
    out[15] = 0;
    return out;
  }

  viewMatrix() {
    // simple translation-only view (no rotation) for prototype
    const out = new Float32Array(16);
    out[0] = 1; out[1] = 0; out[2] = 0; out[3] = 0;
    out[4] = 0; out[5] = 1; out[6] = 0; out[7] = 0;
    out[8] = 0; out[9] = 0; out[10] = 1; out[11] = 0;
    out[12] = -this.x; out[13] = -this.y; out[14] = -this.z; out[15] = 1;
    return out;
  }
}
