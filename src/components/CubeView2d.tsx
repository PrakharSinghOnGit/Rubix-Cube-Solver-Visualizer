import React, { useRef } from "react";
import { CubeType } from "../types";
import P5 from "p5";
import { useEffect } from "react";
import { FACE_COLORS } from "../types";

export default function CubeView2d({ cubeState }: { cubeState: CubeType }) {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let p5Instance: P5;

    const sketch = (p: P5) => {
      let zoom = 1;
      let panX = 0,
        panY = 0;
      let isDragging = false;
      let lastMouseX = 0,
        lastMouseY = 0;

      const n = cubeState.size;
      const cellSize = 50;
      const gap = 5;
      const faceSize = n * (cellSize + gap);

      p.setup = () => {
        p.createCanvas(600, 400).parent(canvasRef.current!);
        p.rectMode(p.CORNER);
      };

      p.draw = () => {
        p.background(30);
        p.translate(p.width / 2 + panX, p.height / 2 + panY);
        p.scale(zoom);
        drawCubeProjection();
      };

      function drawFace(x: number, y: number, face: string[][]) {
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            p.fill(FACE_COLORS[face[i][j]]);
            p.stroke(0);
            p.rect(
              x + j * (cellSize + gap),
              y + i * (cellSize + gap),
              cellSize,
              cellSize
            );
          }
        }
      }

      function drawCubeProjection() {
        const startX = -faceSize * 1.5;
        const startY = -faceSize * 1.5;

        drawFace(startX + faceSize, startY, cubeState.u);
        drawFace(startX, startY + faceSize, cubeState.l);
        drawFace(startX + faceSize, startY + faceSize, cubeState.f);
        drawFace(startX + 2 * faceSize, startY + faceSize, cubeState.r);
        drawFace(startX + faceSize, startY + 2 * faceSize, cubeState.d);
        drawFace(startX + 3 * faceSize, startY + faceSize, cubeState.b);
      }

      p.mousePressed = () => {
        isDragging = true;
        lastMouseX = p.mouseX;
        lastMouseY = p.mouseY;
      };

      p.mouseReleased = () => {
        isDragging = false;
      };

      p.mouseDragged = () => {
        if (
          p.mouseX > 0 &&
          p.mouseX < p.width &&
          p.mouseY > 0 &&
          p.mouseY < p.height
        ) {
          if (isDragging) {
            panX += p.mouseX - lastMouseX;
            panY += p.mouseY - lastMouseY;
            lastMouseX = p.mouseX;
            lastMouseY = p.mouseY;
          }
        }
      };

      p.mouseWheel = (event: any) => {
        if (
          p.mouseX > 0 &&
          p.mouseX < p.width &&
          p.mouseY > 0 &&
          p.mouseY < p.height
        ) {
          zoom *= event.delta > 0 ? 0.9 : 1.1;
        }
      };
    };

    if (canvasRef.current) {
      p5Instance = new P5(sketch);
    }

    return () => {
      if (p5Instance) p5Instance.remove();
    };
  }, [cubeState]);

  return <div ref={canvasRef} />;
}
