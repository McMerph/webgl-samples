import 'normalize.css';

import { initShaders } from '../../../init-shaders';
import VSHADER_SOURCE from './vert.glsl';
import FSHADER_SOURCE from './frag.glsl';

const points: [number, number, number, number, number, number][] = [];
let draw = false;

const getColor = (x: number, y: number): [number, number, number, number] => {
  if (x >= 0.0 && y >= 0.0) {
    return [1.0, 0.0, 0.0, 1.0];
  }
  if (x < 0.0 && y < 0.0) {
    return [0.0, 1.0, 0.0, 1.0];
  }
  return [1.0, 1.0, 1.0, 1.0];
};

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

  const a_Position = gl.getAttribLocation(glProgram, 'a_Position');
  if (a_Position < 0) {
    throw new Error('Failed to get the storage location of a_Position');
  }

  const u_FragColor = gl.getUniformLocation(glProgram, 'u_FragColor');
  if (u_FragColor === null) {
    throw new Error('Failed to get the storage location of u_FragColor');
  }

  canvas.onmousedown = () => {
    draw = true;
  };
  canvas.onmouseup = () => {
    draw = false;
  };
  canvas.onmouseleave = () => {
    draw = false;
  };
  canvas.onmousemove = (event) => {
    if (!draw) {
      return;
    }

    const { left, top } = canvas.getBoundingClientRect();
    const x = (event.clientX - left - canvas.width / 2) / (canvas.width / 2);
    const y = (canvas.height / 2 - (event.clientY - top)) / (canvas.height / 2);
    points.push([x, y, ...getColor(x, y)]);

    gl.clear(gl.COLOR_BUFFER_BIT);
    points.forEach(([x, y, ...color]) => {
      gl.vertexAttrib3f(a_Position, x, y, 0.0);
      gl.uniform4f(u_FragColor, ...color);
      gl.drawArrays(gl.POINTS, 0, 1);
    });
  };
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
});
