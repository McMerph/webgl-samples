import 'normalize.css'

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('webgl') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error('Failed to retrieve the <canvas> element');
  }

  const gl = canvas.getContext('webgl');
  if (!gl) {
    throw new Error('Failed to get the rendering context for WebGL');
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
});
