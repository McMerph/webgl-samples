import 'normalize.css';

import { initWebGl } from '../../../init-web-gl';
import vertexShaderSource from './vert.glsl';
import fragmentShaderSource from './frag.glsl';

document.addEventListener('DOMContentLoaded', () => {
  const { gl, getAttribLocation } = initWebGl({
    vertexShaderSource,
    fragmentShaderSource,
  });

  const a_Position = getAttribLocation('a_Position');
  const a_PointSize = getAttribLocation('a_PointSize');
  gl.vertexAttrib3f(a_Position, 0.5, 0.5, 0.0);
  gl.vertexAttrib1f(a_PointSize, 5.0);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, 1);
});
