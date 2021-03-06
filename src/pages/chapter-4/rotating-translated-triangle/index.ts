import 'normalize.css';
import './index.css';

import { Matrix4 } from 'matrix4';

import { initWebGl } from '../../../utils/init-web-gl';
import vertexShaderSource from './vert.glsl';
import fragmentShaderSource from './frag.glsl';

document.addEventListener('DOMContentLoaded', () => {
  const speedInput = document.getElementById('angle') as HTMLInputElement;
  if (!speedInput) {
    throw new Error('Failed to retrieve the #angle element');
  }
  const getSpeed = () => {
    const raw = Number.parseInt(speedInput.value) || 0;
    return Math.max(0, raw);
  };
  const { gl, getAttribLocation, getUniformLocation, createBuffer } = initWebGl({
    vertexShaderSource,
    fragmentShaderSource,
  });

  const vertexBuffer = createBuffer();
  // prettier-ignore
  const vertices = new Float32Array([
      -0.5, 0.5,
      -0.5, -0.5,
      0.5, 0.5,
    ]);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  const a_Position = getAttribLocation('a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  const u_matrix = getUniformLocation('u_matrix');
  animate(getSpeed, gl, u_matrix);
});

const animate = (
  getSpeed: () => number,
  gl: WebGLRenderingContext,
  u_matrix: WebGLUniformLocation
) => {
  const matrix4 = new Matrix4();
  let angle = 0;
  let startInMs: number | null = null;
  const tick = (timestampInMs: number) => {
    if (startInMs === null) startInMs = timestampInMs;
    const deltaInMs = timestampInMs - startInMs;
    startInMs = timestampInMs;
    angle += ((getSpeed() * deltaInMs) / 1000.0) % 360;
    matrix4.setRotate(angle, 0, 0, 1);
    matrix4.translate(0.3, 0, 0);
    draw(gl, u_matrix, matrix4);
    window.requestAnimationFrame(tick);
  };

  window.requestAnimationFrame(tick);
};

const draw = (
  gl: WebGLRenderingContext,
  u_matrix: WebGLUniformLocation,
  matrix4: Matrix4
) => {
  gl.uniformMatrix4fv(u_matrix, false, matrix4.elements);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};
