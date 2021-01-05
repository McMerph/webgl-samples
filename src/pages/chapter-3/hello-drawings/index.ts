import 'normalize.css';
import './index.css';

import { initWebGl } from '../../../init-web-gl';
import vertexShaderSource from './vert.glsl';
import fragmentShaderSource from './frag.glsl';

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
  getUniformLocation: (variableName: string) => WebGLUniformLocation,
  translateX: number,
  translateY: number
): void => {
  const u_Translation = getUniformLocation('u_Translation');
  gl.uniform4f(u_Translation, translateX, translateY, 0.0, 0.0);
};

const rotate = (
  gl: WebGLRenderingContext,
  getUniformLocation: (variableName: string) => WebGLUniformLocation,
  angle: number
): void => {
  const radian = (Math.PI * angle) / 180.0;
  const cosB = Math.cos(radian);
  const sinB = Math.sin(radian);
  const u_CosB = getUniformLocation('u_CosB');
  const u_SinB = getUniformLocation('u_SinB');
  gl.uniform1f(u_CosB, cosB);
  gl.uniform1f(u_SinB, sinB);
};

const drawWithParams = ({ drawing, translateX, translateY, angle }: Params) => {
  const { gl, getAttribLocation, getUniformLocation, createBuffer } = initWebGl({
    vertexShaderSource,
    fragmentShaderSource,
  });

  const vertexBuffer = createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // prettier-ignore
  const vertices = new Float32Array([
    -0.5, 0.5,
    -0.5, -0.5,
    0.5, 0.5,
    0.5, -0.5,
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  const a_Position = getAttribLocation('a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  translate(gl, getUniformLocation, translateX, translateY);
  rotate(gl, getUniformLocation, angle);

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
