import 'normalize.css';
import './index.css';

import { initWebGl } from '../../../init-web-gl';
import { getAttribLocation, getUniformLocation } from '../../../location';
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

const translate = (
  gl: WebGLRenderingContext,
  glProgram: WebGLProgram,
  translateX: number,
  translateY: number
): void => {
  // prettier-ignore
  // Note: WebGL is column major order
  const translationMatrix = new Float32Array([
           1.0,        0.0, 0.0, 0.0,
           0.0,        1.0, 0.0, 0.0,
           0.0,        0.0, 1.0, 0.0,
    translateX, translateY, 0.0, 1.0
 ]);
  const u_translation_matrix = getUniformLocation({
    gl,
    glProgram,
    variableName: 'u_translation_matrix',
  });
  gl.uniformMatrix4fv(u_translation_matrix, false, translationMatrix);
};

const rotate = (
  gl: WebGLRenderingContext,
  glProgram: WebGLProgram,
  angle: number
): void => {
  const radian = (Math.PI * angle) / 180.0;
  const cosB = Math.cos(radian);
  const sinB = Math.sin(radian);
  // prettier-ignore
  // Note: WebGL is column major order
  const rotationMatrix = new Float32Array([
    cosB, sinB, 0.0, 0.0,
   -sinB, cosB, 0.0, 0.0,
     0.0,  0.0, 1.0, 0.0,
     0.0,  0.0, 0.0, 1.0
 ]);
  const u_rotation_matrix = getUniformLocation({
    gl,
    glProgram,
    variableName: 'u_rotation_matrix',
  });
  gl.uniformMatrix4fv(u_rotation_matrix, false, rotationMatrix);
};

const scale = (
  gl: WebGLRenderingContext,
  glProgram: WebGLProgram,
  scaleX: number,
  scaleY: number
): void => {
  // prettier-ignore
  // Note: WebGL is column major order
  const scaleMatrix = new Float32Array([
    scaleX,    0.0, 0.0, 0.0,
       0.0, scaleY, 0.0, 0.0,
       0.0,    0.0, 0.0, 0.0,
       0.0,    0.0, 0.0, 1.0
 ]);
  const u_scale_matrix = getUniformLocation({
    gl,
    glProgram,
    variableName: 'u_scale_matrix',
  });
  gl.uniformMatrix4fv(u_scale_matrix, false, scaleMatrix);
};

const drawWithParams = ({ drawing, translateX, translateY, angle, scaleX, scaleY }: Params) => {
  const { gl, glProgram } = initWebGl({
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
  const a_Position = getAttribLocation({
    gl,
    glProgram,
    variableName: 'a_Position',
  });
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  translate(gl, glProgram, translateX, translateY);
  rotate(gl, glProgram, angle);
  scale(gl, glProgram, scaleX, scaleY);

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
