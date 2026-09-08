#version 300 es
precision mediump float;
in vec3 v_color;
out vec4 outColor;

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  float alpha = smoothstep(0.5, 0.0, dist);
  outColor = vec4(v_color, alpha);
}
