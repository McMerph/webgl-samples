import 'normalize.css';

import { initWebGl } from '../../../init-web-gl';
import { getAttribLocation } from '../../../location';
import VSHADER_SOURCE from './vert.glsl';
import FSHADER_SOURCE from './frag.glsl';

const points: [number, number][] = [];
let draw = false;

document.addEventListener('DOMContentLoaded', () => {
  const { canvas, gl, glProgram } = initWebGl({
    vertexShaderSource: VSHADER_SOURCE,
    fragmentShaderSource: FSHADER_SOURCE,
  });

  const a_Position = getAttribLocation({
    gl,
    glProgram,
    variableName: 'a_Position',
  });

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
