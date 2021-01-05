import { initShaders } from './init-shaders';

interface InitWebGlArgs {
  vertexShaderSource: string;
  fragmentShaderSource: string;
}
interface InitWebGlOutput {
  gl: WebGLRenderingContext;
  glProgram: WebGLProgram;
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

  return { gl, glProgram };
};
