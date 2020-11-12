import 'normalize.css';
import './index.css';

import initShaders from '../../../init-shaders';
import VSHADER_SOURCE from './point.vert';
import FSHADER_SOURCE from './point.frag';

interface Params {
  drawing: string;
  translateX: number;
  translateY: number;
}
const getParams = (
  drawingSelect: HTMLSelectElement,
  translateXInput: HTMLInputElement,
  translateYInput: HTMLInputElement
): Params => {
  return {
    drawing: drawingSelect.value,
    translateX: Number.parseFloat(translateXInput.value),
    translateY: Number.parseFloat(translateYInput.value),
  };
};

document.addEventListener('DOMContentLoaded', () => {
  const drawingSelect = document.getElementById('select') as HTMLSelectElement;
  if (!drawingSelect) {
    throw new Error('Failed to retrieve the <select> element');
  }

  const translateXInput = document.getElementById(
    'translate-x'
  ) as HTMLInputElement;
  if (!translateXInput) {
    throw new Error('Failed to retrieve the #translate-x element');
  }
  const translateYInput = document.getElementById(
    'translate-y'
  ) as HTMLInputElement;
  if (!translateYInput) {
    throw new Error('Failed to retrieve the #translate-y element');
  }

  const draw = () => {
    drawWithParams(getParams(drawingSelect, translateXInput, translateYInput));
  };
  draw();
  drawingSelect.onchange = draw;
  translateXInput.onchange = draw;
  translateYInput.onchange = draw;
});

const translate = (
  gl: WebGLRenderingContext,
  glProgram: WebGLProgram,
  translateX: number,
  translateY: number
): void => {
  const u_Translation = gl.getUniformLocation(glProgram, 'u_Translation');
  if (u_Translation === null) {
    throw new Error('Failed to get the storage location of u_Translation');
  }
  gl.uniform4f(u_Translation, translateX, translateY, 0.0, 0.0);
};

const drawWithParams = (params: Params) => {
  const { drawing, translateX, translateY } = params;
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

  translate(gl, glProgram, translateX, translateY);

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
