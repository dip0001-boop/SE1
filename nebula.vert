#version 300 es
layout(location=0) in vec3 a_center;
layout(location=1) in vec3 a_color;
layout(location=2) in float a_radius;
uniform mat4 u_viewProjection;
out vec3 v_color;
out float v_radius;
void main() {
  v_color = a_color;
  v_radius = a_radius;
  gl_Position = u_viewProjection * vec4(a_center, 1.0);
  // point size scaled by radius and screen DPI
  gl_PointSize = max(8.0, a_radius * 2.0);
}
