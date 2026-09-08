#version 300 es
layout(location = 0) in vec3 a_position;
layout(location = 1) in vec3 a_color;
out vec3 v_color;
uniform mat4 u_viewProjection;

void main() {
  v_color = a_color;
  gl_Position = u_viewProjection * vec4(a_position, 1.0);
  gl_PointSize = 2.0;
}
