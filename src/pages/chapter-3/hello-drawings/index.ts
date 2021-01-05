import 'normalize.css';
import './index.css';

import { initShaders } from '../../../init-shaders';
import { getAttribLocation } from '../../../location';
import VSHADER_SOURCE from './vert.glsl';
import FSHADER_SOURCE from './frag.glsl';

interface Params {
  drawing: string;
  translateX: number;
  translateY: number;
  angle: number;
}
const getParams = (
  drawingSelect: HTMLSelectElement,
  translateXInput: HTMLInputElement,
  translateYInput: HTMLInputElement,
  angleInput: HTMLInputElement
): Params => {
  return {
    drawing: drawingSelect.value,
    translateX: Number.parseFloat(translateXInput.value),
    translateY: Number.parseFloat(translateYInput.value),
    angle: Number.parseInt(angleInput.value),
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

  const angleInput = document.getElementById('angle') as HTMLInputElement;
  if (!angleInput) {
    throw new Error('Failed to retrieve the #angle element');
  }

  const draw = () => {
    drawWithParams(
      getParams(drawingSelect, translateXInput, translateYInput, angleInput)
    );
  };
  draw();
  drawingSelect.onchange = draw;
  translateXInput.onchange = draw;
  translateYInput.onchange = draw;
  angleInput.onchange = draw;
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

const rotate = (
  gl: WebGLRenderingContext,
  glProgram: WebGLProgram,
  angle: number
): void => {
  const radian = (Math.PI * angle) / 180.0;
  const cosB = Math.cos(radian);
  const sinB = Math.sin(radian);
  const u_CosB = gl.getUniformLocation(glProgram, 'u_CosB');
  const u_SinB = gl.getUniformLocation(glProgram, 'u_SinB');
  if (u_CosB === null || u_SinB === null) {
    throw new Error('Failed to get the storage location of u_CosB or u_SinB');
  }
  gl.uniform1f(u_CosB, cosB);
  gl.uniform1f(u_SinB, sinB);
};

const drawWithParams = (params: Params) => {
  const { drawing, translateX, translateY, angle } = params;
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
  // prettier-ignore
  const vertices = new Float32Array([
    -0.5, 0.5,
    -0.5, -0.5,
    0.5, 0.5,
    0.5, -0.5,
  ]);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  const a_Position = getAttribLocation({
    gl,
    glProgram,
    variableName: 'a_Position',
  });
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  translate(gl, glProgram, translateX, translateY);
  rotate(gl, glProgram, angle);

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
