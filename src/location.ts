interface GetLocationArgs {
  gl: WebGLRenderingContext;
  glProgram: WebGLProgram;
  variableName: string;
}

export const getAttribLocation = (args: GetLocationArgs): GLint => {
  const { gl, glProgram, variableName } = args;
  const location = gl.getAttribLocation(glProgram, variableName);
  if (location < 0) {
    throw new Error(`Failed to get the storage location of ${variableName}`);
  }

  return location;
};

export const getUniformLocation = (
  args: GetLocationArgs
): WebGLUniformLocation => {
  const { gl, glProgram, variableName } = args;
  const location = gl.getUniformLocation(glProgram, variableName);
  if (!location) {
    throw new Error(`Failed to get the storage location of ${variableName}`);
  }

  return location;
};
