import {
  block1,
  block2,
  block3,
  edge,
  empty,
  encodeBlock,
  end,
  getBlockType,
  setBlockConnection,
  start,
} from "./block.ts";

import {
  color1,
  color2,
  color3,
  color4,
  color5,
  color6,
  color7,
} from "./color.ts";

export type Position = [number, number];

export function getBlockValueFromPosition(
  matrix: number[][],
  position: Position,
) {
  return matrix[position[0]][position[1]];
}

const generateUniqueRandom = (previousValue: number, max: number) => {
  let newValue: number;
  do {
    newValue = Math.floor(Math.random() * max);
  } while (newValue === previousValue);
  return newValue;
};

export function generateRandomStartAndEnd(totalEdges: number) {
  const startOffset = generateUniqueRandom(-1, totalEdges);
  const endOffset = generateUniqueRandom(startOffset, totalEdges);

  return { startOffset, endOffset };
}

export function createMatrix(width: number, height: number) {
  const gridTemplateHeight = height + 1;
  const gridTemplateWidth = width + 1;

  const { startOffset, endOffset } = generateRandomStartAndEnd(
    (width * 2) + (height * 2) - 4,
  );

  let edgesSeen = -1;
  let startPosition: Position = [-1, -1];
  let endPosition: Position = [-1, -1];

  const matrix = Array.from({ length: gridTemplateHeight }).map((_, xIndex) => {
    return Array.from({ length: gridTemplateWidth }).map((_, yIndex) => {
      const isHorizontalEdge =
        (xIndex === 0 || xIndex === gridTemplateHeight - 1) &&
        (yIndex > 0 && yIndex < gridTemplateWidth - 1);

      const isVerticalEdge =
        (yIndex === 0 || yIndex === gridTemplateWidth - 1) &&
        (xIndex > 0 && xIndex < gridTemplateHeight - 1);

      if (isHorizontalEdge || isVerticalEdge) {
        edgesSeen++;

        if (edgesSeen === startOffset) {
          startPosition = [xIndex, yIndex];
          return encodeBlock(start, color6);
        }

        if (edgesSeen === endOffset) {
          endPosition = [xIndex, yIndex];
          return encodeBlock(end, color7);
        }

        return encodeBlock(edge, color2);
      }

      const isInternal = xIndex > 0 &&
        xIndex < gridTemplateHeight - 1 &&
        yIndex > 0 &&
        yIndex < gridTemplateWidth - 1;

      if (isInternal) {
        const fillPiece = Math.floor(Math.random() * 3);

        if (fillPiece === 0) {
          return encodeBlock(block1, color3);
        }

        if (fillPiece === 1) {
          return encodeBlock(block2, color4);
        }

        return encodeBlock(block3, color5);
      }

      return encodeBlock(empty, color1);
    });
  }) as number[][];

  return { matrix, startPosition, endPosition };
}

export function shortestContiguousPath(
  matrix: number[][],
  startPosition: Position,
  endPosition: Position,
): Position[] | null {
  const rows = matrix.length;
  const cols = matrix[0].length;

  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  // BFS queue: stores [current Position, path taken, block type (null if not found)]
  const queue: [Position, Position[], number | null][] = [[
    startPosition,
    [startPosition],
    null,
  ]];

  const visited = new Set<string>();
  visited.add(`${startPosition[0]}-${startPosition[1]}`);

  while (queue.length > 0) {
    const [current, path, blockType] = queue.shift()!;
    const [x, y] = current;

    if (x === endPosition[0] && y === endPosition[1]) {
      return path;
    }

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;

      const isVisited = visited.has(`${newX}-${newY}`);
      const isInBounds = newX >= 0 && newX < rows && newY >= 0 && newY < cols;

      if (isInBounds && !isVisited) {
        const currentBlockType = getBlockType(matrix[newX][newY]);

        if (currentBlockType === edge) {
          continue;
        }

        if (currentBlockType >= block1 && currentBlockType <= block3) {
          if (blockType === null) {
            queue.push([
              [newX, newY],
              [...path, [newX, newY]],
              currentBlockType,
            ]);

            visited.add(`${newX}-${newY}`);
          } else if (currentBlockType === blockType) {
            queue.push([[newX, newY], [...path, [newX, newY]], blockType]);
            visited.add(`${newX}-${newY}`);
          }
        } else if (currentBlockType === empty) {
          queue.push([[newX, newY], [...path, [newX, newY]], blockType]);
          visited.add(`${newX}-${newY}`);
        } else if (blockType !== null && currentBlockType === end) {
          queue.push([[newX, newY], [...path, [newX, newY]], blockType]);
          visited.add(`${newX}-${newY}`);
        }
      }
    }
  }

  return null;
}

export function addConnections(matrix: number[][], path: Position[] | null) {
  if (path === null) {
    return;
  }

  for (const position of path) {
    const [x, y] = position;
    matrix[x][y] = setBlockConnection(matrix[x][y], true);
  }
}
