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
  const vertices = new Float32Array([
    0.0, 0.5,
    -0.5, -0.5,
    0.5, -0.5,
  ]);

  const verticesBuffer = gl.createBuffer();
  if (!verticesBuffer) {
    throw new Error('Failed to create the buffer');
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const a_Position = getAttribLocation({
    gl,
    glProgram,
    variableName: 'a_Position',
  });
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  const u_Width = gl.getUniformLocation(glProgram, 'u_Width');
  if (!u_Width) {
    throw new Error('Failed to get the storage location of u_Width');
  }
  gl.uniform1f(u_Width, gl.drawingBufferWidth);

  const u_Height = gl.getUniformLocation(glProgram, 'u_Height');
  if (!u_Height) {
    throw new Error('Failed to get the storage location of u_Height');
  }
  gl.uniform1f(u_Height, gl.drawingBufferHeight);

  gl.enableVertexAttribArray(a_Position);

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
});
