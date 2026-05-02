/**
 * Algoritmo avançado para geração de blobs SVG.
 */

export interface Point {
  x: number;
  y: number;
}

export function generateBlobPoints(
  complexity: number,
  contrast: number,
  seed: number,
  size: number = 400
): Point[] {
  const center = size / 2;
  const radius = size / 3;
  const points: Point[] = [];
  const angleStep = (Math.PI * 2) / complexity;

  const random = (i: number) => {
    const x = Math.sin(seed + i) * 10000;
    return x - Math.floor(x);
  };

  for (let i = 0; i < complexity; i++) {
    const angle = i * angleStep;
    const variation = random(i) * contrast * 25;
    const r = radius + variation;
    const x = center + Math.cos(angle) * r;
    const y = center + Math.sin(angle) * r;
    points.push({ x, y });
  }

  return points;
}

export function pointsToPath(points: Point[], targetSegments: number = 0): string {
  if (points.length === 0) return "";
  
  const size = points.length;
  const getMid = (p1: Point, p2: Point) => ({
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  });

  if (targetSegments > 0) {
    const resampled: Point[] = [];
    
    for (let i = 0; i < targetSegments; i++) {
      const tGlobal = i / targetSegments;
      const pointIndex = Math.floor(tGlobal * size);
      const tLocal = (tGlobal * size) % 1;

      const pPrev = points[(pointIndex + size - 1) % size];
      const pCurr = points[pointIndex % size];
      const pNext = points[(pointIndex + 1) % size];

      const startMid = getMid(pPrev, pCurr);
      const endMid = getMid(pCurr, pNext);

      // Quadratic Bezier interpolation
      const x = Math.pow(1 - tLocal, 2) * startMid.x + 2 * (1 - tLocal) * tLocal * pCurr.x + Math.pow(tLocal, 2) * endMid.x;
      const y = Math.pow(1 - tLocal, 2) * startMid.y + 2 * (1 - tLocal) * tLocal * pCurr.y + Math.pow(tLocal, 2) * endMid.y;
      
      resampled.push({ x, y });
    }

    let path = `M ${resampled[0].x} ${resampled[0].y}`;
    for (let i = 1; i < resampled.length; i++) {
      path += ` L ${resampled[i].x} ${resampled[i].y}`;
    }
    return path + " Z";
  }

  const firstMid = getMid(points[size - 1], points[0]);
  let path = `M ${firstMid.x} ${firstMid.y}`;
  for (let i = 0; i < size; i++) {
    const pCurr = points[i];
    const pNext = points[(i + 1) % size];
    const nextMid = getMid(pCurr, pNext);
    path += ` Q ${pCurr.x} ${pCurr.y} ${nextMid.x} ${nextMid.y}`;
  }
  return path + " Z";
}

export function generateVariations(complexity: number, contrast: number, seed: number, count: number = 4) {
  return Array.from({ length: count }).map((_, i) => ({
    complexity: Math.max(3, complexity + (Math.random() - 0.5) * 2),
    contrast: Math.max(0, contrast + (Math.random() - 0.5) * 4),
    seed: seed + Math.random() * 100,
  }));
}
