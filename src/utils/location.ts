interface GetLocationArgs {
  gl: WebGLRenderingContext;
  glProgram: WebGLProgram;
  variableName: string;
}

export const getAttribLocation = ({
  gl,
  glProgram,
  variableName,
}: GetLocationArgs): GLint => {
  const location = gl.getAttribLocation(glProgram, variableName);
  if (location < 0) {
    throw new Error(`Failed to get the storage location of ${variableName}`);
  }

  return location;
};

export const getUniformLocation = ({
  gl,
  glProgram,
  variableName,
}: GetLocationArgs): WebGLUniformLocation => {
  const location = gl.getUniformLocation(glProgram, variableName);
  if (!location) {
    throw new Error(`Failed to get the storage location of ${variableName}`);
  }

  return location;
};
