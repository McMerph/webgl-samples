declare module 'matrix4' {
  declare class Matrix4 {
    constructor();
  
    setTranslate(x: number, y: number, z: number): void;
    setRotate(angle: number, x: number, y: number, z: number): void;
    setScale(x: number, y: number, z: number): void;
    translate(x: number, y: number, z: number): void;
    rotate(angle: number, x: number, y: number, z: number): void;
    scale(x: number, y: number, z: number): void;

    setLookAt(
      eyeX: number,
      eyeY: number,
      eyeZ: number,
      centerX: number,
      centerY: number,
      centerZ: number,
      upX: number,
      upY: number,
      upZ: number
    ): void;
    lookAt(
      eyeX: number,
      eyeY: number,
      eyeZ: number,
      centerX: number,
      centerY: number,
      centerZ: number,
      upX: number,
      upY: number,
      upZ: number
    ): void;

    elements: Float32Array;
  }
}
