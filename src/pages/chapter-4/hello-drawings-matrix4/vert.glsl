attribute vec4 a_Position;
uniform mat4 u_matrix;

void main() {
  gl_Position = u_matrix * a_Position;
}
