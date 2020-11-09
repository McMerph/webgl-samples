import 'normalize.css'

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('example') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error('Failed to retrieve the <canvas> element');
  }

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('No context!');
  }

  context.fillStyle = 'rgba(0, 0, 255, 1.0)';
  context.fillRect(120, 10, 150, 150);
});
