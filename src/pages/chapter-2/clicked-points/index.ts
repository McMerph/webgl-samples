import 'normalize.css';

import initShaders from '../../../init-shaders';
import VSHADER_SOURCE from './point.vert';
import FSHADER_SOURCE from './point.frag';

const points: [number, number][] = [];
let draw = false;

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
    points.push([
      (event.clientX - left - canvas.width / 2) / (canvas.width / 2),
      (canvas.height / 2 - (event.clientY - top)) / (canvas.height / 2),
    ]);

    gl.clear(gl.COLOR_BUFFER_BIT);
    points.forEach(([x, y]) => {
      gl.vertexAttrib3f(a_Position, x, y, 0.0);
      gl.drawArrays(gl.POINTS, 0, 1);
    });
  };
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
});
