import 'normalize.css';

import skyImage from '../../../../resources/img/sky.jpg';
import circleImage from '../../../../resources/img/circle.gif';

import { initWebGl } from '../../../init-web-gl';
import { getAttribLocation, getUniformLocation } from '../../../location';
import { loadImage } from '../../../load-image';
import vertexShaderSource from './vert.glsl';
import fragmentShaderSource from './frag.glsl';

document.addEventListener('DOMContentLoaded', async () => {
  const { gl, glProgram } = initWebGl({
    vertexShaderSource,
    fragmentShaderSource,
  });

  // prettier-ignore
  const verticesAndTextureCoordinates = new Float32Array([
    -0.5, 0.5,     0.0, 1.0,
    -0.5, -0.5,    0.0, 0.0,
    0.5,  0.5,     1.0, 1.0,
    0.5,  -0.5,    1.0, 0.0,
  ]);
  const FSIZE = verticesAndTextureCoordinates.BYTES_PER_ELEMENT;

  const verticesAndTextureBuffer = gl.createBuffer();
  if (!verticesAndTextureBuffer) {
    throw new Error('Failed to create the buffer');
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, verticesAndTextureBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesAndTextureCoordinates, gl.STATIC_DRAW);

  const a_Position = getAttribLocation({
    gl,
    glProgram,
    variableName: 'a_Position',
  });
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
  gl.enableVertexAttribArray(a_Position);

  const a_TexCoord = getAttribLocation({
    gl,
    glProgram,
    variableName: 'a_TexCoord',
  });
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(a_TexCoord);

  const texture0 = gl.createTexture();
  const texture1 = gl.createTexture();
  if (!texture0 || !texture1) {
    throw new Error('Failed to create the texture object');
  }
  const u_Sampler0 = getUniformLocation({
    gl,
    glProgram,
    variableName: 'u_Sampler0',
  });
  const u_Sampler1 = getUniformLocation({
    gl,
    glProgram,
    variableName: 'u_Sampler1',
  });

  const [image0, image1] = await Promise.all([
    loadImage(skyImage),
    loadImage(circleImage),
  ]);

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture0);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image0);
  gl.uniform1i(u_Sampler0, 0);

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture1);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image1);
  gl.uniform1i(u_Sampler1, 1);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
});
