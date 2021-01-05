import 'normalize.css';

import { initWebGl } from '../../../init-web-gl';
import vertexShaderSource from './vert.glsl';
import fragmentShaderSource from './frag.glsl';

document.addEventListener('DOMContentLoaded', () => {
  const { gl, getAttribLocation, createBuffer } = initWebGl({
    vertexShaderSource,
    fragmentShaderSource,
  });

  const vertexBuffer = createBuffer();
  const vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  const a_Position = getAttribLocation('a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, 3);
});
