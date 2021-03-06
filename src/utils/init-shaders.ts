interface LoadShaderArgs {
  gl: WebGLRenderingContext;
  type: GLenum;
  source: string;
}
const loadShader = ({ gl, type, source }: LoadShaderArgs): WebGLShader => {
  const shader = gl.createShader(type);
  if (shader === null) {
    throw new Error('Unable to create shader');
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    const error = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    console.error(`Failed to compile ${type} shader`);
    throw error;
  }

  return shader;
};

interface InitShaderArgs {
  gl: WebGLRenderingContext;
  vertexShaderSource: string;
  fragmentShaderSource: string;
}

export const initShaders = ({ gl, vertexShaderSource, fragmentShaderSource }: InitShaderArgs): WebGLProgram => {
  const [vertexShader, fragmentShader] = ([
    [gl.VERTEX_SHADER, vertexShaderSource],
    [gl.FRAGMENT_SHADER, fragmentShaderSource],
  ] as [GLenum, string][]).map(([type, source]) =>
    loadShader({ gl, type, source })
  );
  const program = gl.createProgram();
  if (!program) {
    throw new Error('Unable to create program');
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    const error = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    console.error(`Failed to link program: ${error}`);
    throw error;
  }
  gl.useProgram(program);

  return program;
};
