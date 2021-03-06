import { initShaders } from './init-shaders';
import { getAttribLocation, getUniformLocation } from './location';

interface InitWebGlArgs {
  vertexShaderSource: string;
  fragmentShaderSource: string;
}
interface InitWebGlOutput {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  glProgram: WebGLProgram;
  getAttribLocation: (variableName: string) => GLint;
  getUniformLocation: (variableName: string) => WebGLUniformLocation;
  createBuffer: () => WebGLBuffer;
  createTexture: () => WebGLTexture;
}

export const initWebGl = ({
  vertexShaderSource,
  fragmentShaderSource,
}: InitWebGlArgs): InitWebGlOutput => {
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
    vertexShaderSource,
    fragmentShaderSource,
  });

  return {
    canvas,
    gl,
    glProgram,
    getAttribLocation: (variableName) =>
      getAttribLocation({ gl, glProgram, variableName }),
    getUniformLocation: (variableName) =>
      getUniformLocation({ gl, glProgram, variableName }),
    createBuffer: () => {
      const buffer = gl.createBuffer();
      if (buffer === null) {
        throw new Error('Failed to create the buffer');
      }

      return buffer;
    },
    createTexture: () => {
      const texture = gl.createTexture();
      if (texture === null) {
        throw new Error('Failed to create the texture');
      }

      return texture;
    },
  };
};
