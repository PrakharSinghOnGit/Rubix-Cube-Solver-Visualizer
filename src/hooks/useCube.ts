import { useEffect, useState } from "react";
import Cube from "../core/cubeAPI";

type UseCubeResult =
  | { cube: null; isReady: false }
  | { cube: Cube; isReady: true };

export function useCube(size: number): UseCubeResult {
  const [cube, setCube] = useState<Cube | null>(null);

  useEffect(() => {
    let isCancelled = false;

    (async () => {
      const newCube = await Cube.create(size);
      if (!isCancelled) setCube(newCube);
    })();

    return () => {
      isCancelled = true;
      // Optional: destroy the previous cube if needed
    };
  }, [size]);

  if (cube === null) return { cube: null, isReady: false };
  return { cube, isReady: true };
}
