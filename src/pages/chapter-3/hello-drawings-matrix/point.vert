attribute vec4 a_Position;
uniform mat4 u_translation_matrix;
uniform mat4 u_rotation_matrix;
uniform mat4 u_scale_matrix;

void main() {
  gl_Position = u_translation_matrix * u_rotation_matrix * u_scale_matrix * a_Position;
}
