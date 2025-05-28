import { useEffect, useRef } from "react";
import { FACE_COLORS } from "../../types/types";
import parseKociembaFormat from "../../utils/parseFormat";

const RenderCube = ({ str }: { str: string }) => {
  const state = parseKociembaFormat(str);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const cellSize = 20;
    const gap = 2;
    const faceSize = state.size * (cellSize + gap);
    const totalWidth = faceSize * 4;
    const totalHeight = faceSize * 3;
    canvas.width = totalWidth;
    canvas.height = totalHeight;

    // Clear canvas
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw faces
    const drawFace = (x: number, y: number, face: string[][]) => {
      // Rotate face for correct orientation
      const rotatedFace = face.map((row, i) =>
        row.map((_, j) => face[j][face.length - 1 - i])
      );

      rotatedFace.forEach((row, i) => {
        row.forEach((color, j) => {
          const cellX = x + j * (cellSize + gap);
          const cellY = y + i * (cellSize + gap);

          // Draw cell background
          ctx.fillStyle = FACE_COLORS[color];
          ctx.fillRect(cellX, cellY, cellSize, cellSize);

          // Draw cell border
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 1;
          ctx.strokeRect(cellX, cellY, cellSize, cellSize);
        });
      });
    };

    // Draw all faces in a net layout
    drawFace(faceSize, 0, state.u); // Up face
    drawFace(0, faceSize, state.l); // Left face
    drawFace(faceSize, faceSize, state.f); // Front face
    drawFace(faceSize * 2, faceSize, state.r); // Right face
    drawFace(faceSize * 3, faceSize, state.b); // Back face
    drawFace(faceSize, faceSize * 2, state.d); // Down face
  }, [state]);

  return (
    <div className="flex justify-center items-center p-2">
      <canvas
        ref={canvasRef}
        className="border border-gray-700 rounded"
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  );
};

export default RenderCube;
