import 'normalize.css';

import { initWebGl } from '../../../init-web-gl';
import vertexShaderSource from './vert.glsl';
import fragmentShaderSource from './frag.glsl';

document.addEventListener('DOMContentLoaded', () => {
  const { gl, getAttribLocation, getUniformLocation, createBuffer } = initWebGl({
    vertexShaderSource,
    fragmentShaderSource,
  });

  // prettier-ignore
  const vertices = new Float32Array([
    0.0, 0.5,
    -0.5, -0.5,
    0.5, -0.5,
  ]);

  const verticesBuffer = createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const a_Position = getAttribLocation('a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  const u_Width = getUniformLocation('u_Width');
  gl.uniform1f(u_Width, gl.drawingBufferWidth);

  const u_Height = getUniformLocation('u_Height');
  gl.uniform1f(u_Height, gl.drawingBufferHeight);

  gl.enableVertexAttribArray(a_Position);

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
});
