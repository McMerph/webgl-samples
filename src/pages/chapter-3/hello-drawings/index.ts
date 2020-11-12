import 'normalize.css';
import './index.css';

import initShaders from '../../../init-shaders';
import VSHADER_SOURCE from './point.vert';
import FSHADER_SOURCE from './point.frag';

document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('select') as HTMLSelectElement;
  if (!select) {
    throw new Error('Failed to retrieve the <select> element');
  }

  draw(select.value);
  select.onchange = () => {
    draw(select.value);
  };
});

const draw = (drawing: string) => {
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

  const vertexBuffer = gl.createBuffer();
  if (vertexBuffer === null) {
    throw new Error('Failed to create the buffer object');
  }
  const vertices = new Float32Array([
    -0.5,
    0.5,
    -0.5,
    -0.5,
    0.5,
    0.5,
    0.5,
    -0.5,
  ]);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  const a_Position = gl.getAttribLocation(glProgram, 'a_Position');
  if (a_Position < 0) {
    throw new Error('Failed to get the storage location of a_Position');
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  const MAPPING = new Map([
    ['LINES', gl.LINES],
    ['LINE_STRIP', gl.LINE_STRIP],
    ['LINE_LOOP', gl.LINE_LOOP],
    ['QUAD', gl.TRIANGLE_STRIP],
    ['QUAD_FAN', gl.TRIANGLE_FAN],
  ]);
  gl.drawArrays(MAPPING.get(drawing) || gl.TRIANGLES, 0, 4);
};
