precision mediump float;

uniform float u_Width;
uniform float u_Height;
varying vec4 v_Color;

void main() {
  gl_FragColor = vec4(0.0, gl_FragCoord.x/u_Width, gl_FragCoord.y/u_Height, 1.0);
}
