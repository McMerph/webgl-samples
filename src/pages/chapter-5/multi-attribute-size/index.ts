import 'normalize.css';

import { initWebGl } from '../../../init-web-gl';
import { getAttribLocation } from '../../../location';
import vertexShaderSource from './vert.glsl';
import fragmentShaderSource from './frag.glsl';

document.addEventListener('DOMContentLoaded', () => {
  const { gl, glProgram } = initWebGl({
    vertexShaderSource,
    fragmentShaderSource,
  });

  // prettier-ignore
  const vertices = new Float32Array([
    0.0,  0.5,
    -0.5, -0.5,
    0.5,  -0.5
  ]);
  const sizes = new Float32Array([
    10.0, 20.0, 30.0
  ]);

  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    throw new Error('Failed to create the vertex buffer');
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  const a_Position = getAttribLocation({
    gl,
    glProgram,
    variableName: 'a_Position',
  });
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  const sizeBuffer = gl.createBuffer();
  if (!sizeBuffer) {
    throw new Error('Failed to create the size buffer');
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
  const a_PointSize = getAttribLocation({
    gl,
    glProgram,
    variableName: 'a_PointSize',
  });
  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_PointSize);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, 3);
});
