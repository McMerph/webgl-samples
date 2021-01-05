import 'normalize.css';

import { initShaders } from '../../../init-shaders';
import { getAttribLocation } from '../../../location';
import VSHADER_SOURCE from './vert.glsl';
import FSHADER_SOURCE from './frag.glsl';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('webgl') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error('Failed to retrieve the <canvas> element');
  }

  const gl = canvas.getContext('webgl');
  if (!gl) {
    throw new Error('Failed to get the rendering context for WebGL');
  }

  const glProgram = initShaders({
    gl,
    vertexShaderSource: VSHADER_SOURCE,
    fragmentShaderSource: FSHADER_SOURCE,
  });

  // prettier-ignore
  const verticesAndColors = new Float32Array([
    0.0,  0.5,   1.0,  0.0,  0.0, 
    -0.5, -0.5,  0.0,  1.0,  0.0, 
     0.5, -0.5,  0.0,  0.0,  1.0, 
  ]);

  const verticesAndColorsBuffer = gl.createBuffer();
  if (!verticesAndColorsBuffer) {
    throw new Error('Failed to create the buffer');
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, verticesAndColorsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesAndColors, gl.STATIC_DRAW);

  const a_Position = getAttribLocation({
    gl,
    glProgram,
    variableName: 'a_Position',
  });
  const FSIZE = verticesAndColors.BYTES_PER_ELEMENT;
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
  gl.enableVertexAttribArray(a_Position);

  const a_Color = getAttribLocation({
    gl,
    glProgram,
    variableName: 'a_Color',
  });
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
  gl.enableVertexAttribArray(a_Color);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
});
