import 'normalize.css'

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('webgl') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error('Failed to retrieve the <canvas> element');
  }

  const context = canvas.getContext('webgl');
  if (!context) {
    throw new Error('Failed to get the rendering context for WebGL');
  }

  context.clearColor(0.0, 0.0, 0.0, 1.0);
  context.clear(context.COLOR_BUFFER_BIT);
});
