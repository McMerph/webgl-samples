import 'normalize.css';

import { initWebGl } from '../../../init-web-gl';
import vertexShaderSource from './vert.glsl';
import fragmentShaderSource from './frag.glsl';

document.addEventListener('DOMContentLoaded', () => {
  const { gl, getAttribLocation } = initWebGl({
    vertexShaderSource,
    fragmentShaderSource,
  });

  // prettier-ignore
  const verticesAndSizes = new Float32Array([
    0.0,  0.5,  10.0,
    -0.5, -0.5, 20.0,
    0.5,  -0.5, 30.0
  ]);

  const verticesAndSizesBuffer = gl.createBuffer();
  if (!verticesAndSizesBuffer) {
    throw new Error('Failed to create the buffer');
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, verticesAndSizesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesAndSizes, gl.STATIC_DRAW);

  const a_Position = getAttribLocation('a_Position');
  const FSIZE = verticesAndSizes.BYTES_PER_ELEMENT;
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);
  gl.enableVertexAttribArray(a_Position);

  const a_PointSize = getAttribLocation('a_PointSize');
  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2);
  gl.enableVertexAttribArray(a_PointSize);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, 3);
});
