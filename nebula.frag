#version 300 es
precision highp float;
in vec3 v_color;
in float v_radius;
out vec4 outColor;

// 2D noise helper (cheap)
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float d = length(uv);
  // soft falloff
  float alpha = smoothstep(0.9, 0.0, d);
  // add subtle noise for volumetric look
  float n = hash21(gl_FragCoord.xy * 0.01);
  float glow = pow(1.0 - d, 2.0) * (0.6 + 0.4 * n);
  vec3 col = v_color * (0.6 + 0.6 * n);
  // additive blending expected
  outColor = vec4(col * glow, alpha * 0.9);
}
