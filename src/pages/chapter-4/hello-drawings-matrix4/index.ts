import 'normalize.css';
import './index.css';

import { Matrix4 } from 'matrix4';

import { initWebGl } from '../../../init-web-gl';
import vertexShaderSource from './vert.glsl';
import fragmentShaderSource from './frag.glsl';

interface Params {
  drawing: string;
  translateX: number;
  translateY: number;
  angle: number;
  scaleX: number;
  scaleY: number;
}
const getParams = (
  drawingSelect: HTMLSelectElement,
  translateXInput: HTMLInputElement,
  translateYInput: HTMLInputElement,
  angleInput: HTMLInputElement,
  scaleXInput: HTMLInputElement,
  scaleYInput: HTMLInputElement
): Params => {
  return {
    drawing: drawingSelect.value,
    translateX: Number.parseFloat(translateXInput.value),
    translateY: Number.parseFloat(translateYInput.value),
    angle: Number.parseInt(angleInput.value),
    scaleX: Number.parseFloat(scaleXInput.value),
    scaleY: Number.parseFloat(scaleYInput.value),
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

  const scaleXInput = document.getElementById('scale-x') as HTMLInputElement;
  if (!scaleXInput) {
    throw new Error('Failed to retrieve the #scale-x element');
  }
  const scaleYInput = document.getElementById('scale-y') as HTMLInputElement;
  if (!scaleYInput) {
    throw new Error('Failed to retrieve the #scale-y element');
  }

  const draw = () => {
    drawWithParams(
      getParams(
        drawingSelect,
        translateXInput,
        translateYInput,
        angleInput,
        scaleXInput,
        scaleYInput
      )
    );
  };
  draw();
  drawingSelect.onchange = draw;
  translateXInput.onchange = draw;
  translateYInput.onchange = draw;
  scaleXInput.onchange = draw;
  scaleYInput.onchange = draw;
  angleInput.onchange = draw;
});

const drawWithParams = ({
  drawing,
  translateX,
  translateY,
  angle,
  scaleX,
  scaleY,
}: Params) => {
  const { gl, getAttribLocation, getUniformLocation } = initWebGl({
    vertexShaderSource,
    fragmentShaderSource,
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
  const a_Position = getAttribLocation('a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  const matrix4 = new Matrix4();
  matrix4.setRotate(angle, 0, 0, 1);
  matrix4.scale(scaleX, scaleY, 0);
  matrix4.translate(translateX, translateY, 0);
  const u_matrix = getUniformLocation('u_matrix');
  gl.uniformMatrix4fv(u_matrix, false, matrix4.elements);

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
