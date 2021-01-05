import 'normalize.css';

import skyImage from '../../../../resources/img/sky.jpg';

import { initWebGl } from '../../../init-web-gl';
import { loadImage } from '../../../load-image';
import vertexShaderSource from './vert.glsl';
import fragmentShaderSource from './frag.glsl';

document.addEventListener('DOMContentLoaded', async () => {
  const { gl, getAttribLocation, getUniformLocation, createBuffer } = initWebGl({
    vertexShaderSource,
    fragmentShaderSource,
  });

  // prettier-ignore
  const verticesAndTextureCoordinates = new Float32Array([
    -0.5, 0.5,     -0.3, 1.7,
    -0.5, -0.5,    -0.3, -0.2,
    0.5,  0.5,     1.7,  1.7,
    0.5,  -0.5,    1.7,  -0.2,
  ]);
  const FSIZE = verticesAndTextureCoordinates.BYTES_PER_ELEMENT;

  const verticesAndTextureBuffer = createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, verticesAndTextureBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesAndTextureCoordinates, gl.STATIC_DRAW);

  const a_Position = getAttribLocation('a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
  gl.enableVertexAttribArray(a_Position);

  const a_TexCoord = getAttribLocation('a_TexCoord');
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(a_TexCoord);

  const texture = gl.createTexture();
  if (!texture) {
    throw new Error('Failed to create the texture object');
  }
  const u_Sampler = getUniformLocation('u_Sampler');

  const image = await loadImage(skyImage);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler, 0);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
});
