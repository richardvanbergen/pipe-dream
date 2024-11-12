import { Block1Type, EndBlockType, StartBlockType, type BlockProperties } from "./block.ts";
import {
  generateMultipleColorsWithWarmth,
  generateWarmthFromChaos,
} from "./color.ts";

import { byteGenerator, seedToHash } from "./crypto.ts";

export type Position = [number, number];

class MatrixError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MatrixError";
  }
}

export function getBlockValueFromPosition(
  matrix: MatrixBlock[][],
  position: Position,
) {
  return matrix[position[1]][position[0]];
}

/**
 * Returns two random positions from the outer edges of a matrix, excluding corners.
 *
 * @param width - Width of the matrix (must be >= 3)
 * @param height - Height of the matrix (must be >= 3)
 * @returns Two different [x, y] positions from the edges
 * @throws {MatrixError} If matrix dimensions are invalid or not enough positions available
 */
async function getRandomEdgePositions(
  width: number,
  height: number,
  takeAByte: ReturnType<typeof byteGenerator>,
): Promise<[Position, Position]> {
  if (!Number.isInteger(width) || !Number.isInteger(height)) {
    throw new MatrixError("Width and height must be integers");
  }

  if (width < 3 || height < 3) {
    throw new MatrixError(
      "Matrix must be at least 3x3 to have non-corner edge positions",
    );
  }

  function getValidPositions(w: number, h: number): Position[] {
    const positions: Position[] = [];

    for (let x = 1; x < w - 1; x++) {
      positions.push([x, 0]);
    }

    for (let x = 1; x < w - 1; x++) {
      positions.push([x, h - 1]);
    }

    for (let y = 1; y < h - 1; y++) {
      positions.push([0, y]);
    }

    for (let y = 1; y < h - 1; y++) {
      positions.push([w - 1, y]);
    }

    return positions;
  }

  const validPositions = getValidPositions(width, height);

  if (validPositions.length < 2) {
    throw new MatrixError(
      "Not enough valid positions to select two different spots",
    );
  }

  const randomIndex1 = (await takeAByte(1))[0] % validPositions.length;
  const pos1 = validPositions[randomIndex1];

  validPositions.splice(randomIndex1, 1);
  const randomIndex2 = (await takeAByte(1))[0] % validPositions.length;
  const pos2 = validPositions[randomIndex2];

  return [pos1, pos2];
}

export async function generateMatrixBaseTraits(seed: string) {
  const hash = await seedToHash(seed);
  const takeAByte = byteGenerator(hash, 16);

  const width = (await takeAByte(1))[0] % 5 + 3;
  const height = (await takeAByte(1))[0] % 5 + 3;

  const [startPosition, endPosition] = await getRandomEdgePositions(
    width,
    height,
    takeAByte,
  );

  const chaosFactor = (await takeAByte(1))[0] % 10;
  const roundness = (await takeAByte(1))[0] % 10;

  const themeColors = generateMultipleColorsWithWarmth(
    generateWarmthFromChaos(chaosFactor),
    8,
  );

  return {
    width,
    height,
    startPosition,
    endPosition,
    chaosFactor,
    roundness,
    themeColors,
  };
}

function getBlockTypeMod(chaosFactor: number) {
  if (chaosFactor < 1) {
    return 1;
  }

  if (chaosFactor < 7) {
    return 2;
  }

  return 3;
}

function getRotationMod(chaosFactor: number) {
  if (chaosFactor < 1) {
    return 1;
  }

  if (chaosFactor < 2) {
    return 10;
  }

  if (chaosFactor < 3) {
    return 30;
  }

  if (chaosFactor < 5) {
    return 60;
  }

  if (chaosFactor < 7) {
    return 90;
  }

  if (chaosFactor < 9) {
    return 120;
  }

  return 180;
}

export async function generateBlocksFromMatrixProperties(
  seed: string,
  matrixProperties: Awaited<ReturnType<typeof generateMatrixBaseTraits>>,
) {
  const hash = await seedToHash(seed);
  const takeAByte = byteGenerator(hash, 16);

  const blocks: BlockProperties[] = [];

  for (let i = 0; i < matrixProperties.width * matrixProperties.height; i++) {
    const blockTypeMod = getBlockTypeMod(matrixProperties.chaosFactor);
    const blockType = (await takeAByte(1))[0] % blockTypeMod + Block1Type;

    const rotationMod = getRotationMod(matrixProperties.chaosFactor);
    const rotationNumber = (await takeAByte(1))[0] % rotationMod;
    const rotationSign = (await takeAByte(1))[0] % 2;

    const rotation = rotationSign === 0 ? rotationNumber : -rotationNumber;

    const offsetX = 0;
    const offsetY = 0;

    blocks.push({ blockType, offsetX, offsetY, rotation });
  }

  const start: BlockProperties = {
    blockType: StartBlockType,
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
  };

  const end: BlockProperties = {
    blockType: EndBlockType,
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
  };

  return {
    blocks,
    start,
    end,
  };
}

export type MatrixBlock = {
  position: Position;
  blockType: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  width: number;
  height: number;
  isConnection: boolean;
};

/**
 * Creates a matrix from a seed string.
 *
 * @param seed - A 256-bit hex string
 * @returns A matrix with a theme color and chaos factor derived from the seed
 */
export async function createMatrixFromSeed(
  seed: string,
  canvasSize: number,
  gap: number,
) {
  const matrixProperties = await generateMatrixBaseTraits(seed);

  const { blocks, start, end } = await generateBlocksFromMatrixProperties(
    seed,
    matrixProperties,
  );

  const squareSize = canvasSize /
    Math.max(matrixProperties.height, matrixProperties.width);

  const matrix: MatrixBlock[][] = Array.from({
    length: matrixProperties.height,
  }).map((_, yIndex) => {
    return Array.from({ length: matrixProperties.width }).map((_, xIndex) => {
      const position: Position = [xIndex, yIndex];
      const width = squareSize - gap;
      const height = squareSize - gap;
      const baseOffsetX = xIndex * (squareSize + gap);
      const baseOffsetY = yIndex * (squareSize + gap);

      // overridden later by pathing code
      const isConnection = false;

      if (
        matrixProperties.startPosition[0] === xIndex &&
        matrixProperties.startPosition[1] === yIndex
      ) {
        return {
          position,
          ...start,
          width,
          height,
          isConnection,
          offsetX: baseOffsetX + start.offsetX,
          offsetY: baseOffsetY + start.offsetY,
        };
      }

      if (
        matrixProperties.endPosition[0] === xIndex &&
        matrixProperties.endPosition[1] === yIndex
      ) {
        return {
          position,
          ...end,
          width,
          height,
          isConnection,
          offsetX: baseOffsetX + end.offsetX,
          offsetY: baseOffsetY + end.offsetY,
        };
      }

      if (
        xIndex > 0 &&
        xIndex < matrixProperties.width - 1 &&
        yIndex > 0 &&
        yIndex < matrixProperties.height - 1
      ) {
        const block = blocks.pop()!;

        return {
          position,
          ...block,
          width,
          height,
          isConnection,
          offsetX: baseOffsetX + block.offsetX,
          offsetY: baseOffsetY + block.offsetY,
        };
      }

      return {
        position,
        blockType: 0,
        offsetX: baseOffsetX,
        offsetY: baseOffsetY,
        rotation: 0,
        width,
        height,
        isConnection,
      };
    });
  });

  const path = shortestContiguousPath(
    matrix,
    matrixProperties.startPosition,
    matrixProperties.endPosition,
  );

  addConnections(matrix, path);

  return {
    matrix,
    properties: matrixProperties,
  };
}

export function shortestContiguousPath(
  matrix: MatrixBlock[][],
  startPosition: Position,
  endPosition: Position,
): Position[] | null {
  const visited = new Set<string>();
  const queue: { position: Position; path: Position[] }[] = [{
    position: startPosition,
    path: [startPosition],
  }];

  let targetType: number | null = null;

  while (queue.length > 0) {
    const { position: [x, y], path } = queue.shift()!;

    const directions = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];

    for (const [nextX, nextY] of directions) {
      if (nextX === endPosition[0] && nextY === endPosition[1]) {
        path.push(endPosition);
        return path;
      }

      if (
        nextX < 0 ||
        nextX > matrix[0].length - 1 ||
        nextY < 0 ||
        nextY > matrix.length - 1
      ) {
        continue;
      }

      const posKey = `${nextY},${nextX}`;
      if (visited.has(posKey)) {
        continue;
      }

      visited.add(posKey);

      // matrix addressing is [y][x]
      // ignore empty, start, and edge blocks
      const nextBlock = matrix[nextY][nextX];
      if (nextBlock.blockType < 3) {
        continue;
      }

      // set the target block type to follow if we haven't yet
      if (targetType === null) {
        targetType = nextBlock.blockType;
      }

      if (nextBlock.blockType === targetType) {
        queue.push({
          position: [nextX, nextY],
          path: [...path, [nextX, nextY]],
        });
      }
    }
  }

  return null;
}

export function addConnections(
  matrix: MatrixBlock[][],
  path: Position[] | null,
) {
  if (path === null) {
    return;
  }

  for (const position of path) {
    const [x, y] = position;
    matrix[y][x] = {
      ...matrix[y][x],
      isConnection: true,
    };
  }
}