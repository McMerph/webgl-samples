import 'normalize.css';

import { Matrix4 } from 'matrix4';

import { initWebGl } from '../../../init-web-gl';
import VSHADER_SOURCE from './vert.glsl';
import FSHADER_SOURCE from './frag.glsl';

interface GetLocationArgs {
  gl: WebGLRenderingContext;
  glProgram: WebGLProgram;
  variableName: string;
}
const getAttribLocation = (args: GetLocationArgs): GLint => {
  const { gl, glProgram, variableName } = args;
  const location = gl.getAttribLocation(glProgram, variableName);
  if (location < 0) {
    throw new Error(`Failed to get the storage location of ${variableName}`);
  }

  return location;
};
const getUniformLocation = (args: GetLocationArgs): WebGLUniformLocation => {
  const { gl, glProgram, variableName } = args;
  const location = gl.getUniformLocation(glProgram, variableName);
  if (!location) {
    throw new Error(`Failed to get the storage location of ${variableName}`);
  }

  return location;
};

document.addEventListener('DOMContentLoaded', async () => {
  const { gl, glProgram } = initWebGl({
    vertexShaderSource: VSHADER_SOURCE,
    fragmentShaderSource: FSHADER_SOURCE,
  });

  // prettier-ignore
  const verticesAndColors = new Float32Array([
    // The back green one
    0.0,  0.5,  -0.4,      0.4,  1.0,  0.4,
    -0.5, -0.5, -0.4,      0.4,  1.0,  0.4,
    0.5,  -0.5, -0.4,      1.0,  0.4,  0.4, 
   
    // The middle yellow one
    0.5,  0.4,  -0.2,      1.0,  0.4,  0.4,
    -0.5, 0.4,  -0.2,      1.0,  1.0,  0.4,
    0.0,  -0.6, -0.2,      1.0,  1.0,  0.4, 

    // The front blue one
    0.0,  0.5,  0.0,       0.4,  0.4,  1.0,
    -0.5, -0.5, 0.0,       0.4,  0.4,  1.0,
    0.5,  -0.5, 0.0,       1.0,  0.4,  0.4, 
  ]);
  const FSIZE = verticesAndColors.BYTES_PER_ELEMENT;

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
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);

  const a_Color = getAttribLocation({
    gl,
    glProgram,
    variableName: 'a_Color',
  });
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  const matrix4 = new Matrix4();
  matrix4.setLookAt(0.2, 0.25, 0.25, 0, 0, 0, 0, 1, 0);
  const u_ViewMatrix = getUniformLocation({
    gl,
    glProgram,
    variableName: 'u_ViewMatrix',
  });
  gl.uniformMatrix4fv(u_ViewMatrix, false, matrix4.elements);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 9);
});
