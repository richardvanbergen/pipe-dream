import { assertEquals } from "jsr:@std/assert";
import { createMatrixFromSeed, shortestContiguousPath } from "./matrix.ts";
import { getBlockValueFromPosition } from "./matrix.ts";
import { StartBlockType, EndBlockType } from "./block.ts";

Deno.test("create matrix", async () => {
  const matrix = await createMatrixFromSeed("123456", 700, 4);

  const {
    matrix: matrixBlocks,
    properties: { startPosition, endPosition },
  } = matrix;

  const startBlock = getBlockValueFromPosition(matrixBlocks, startPosition);
  const endBlock = getBlockValueFromPosition(matrixBlocks, endPosition);

  assertEquals(startBlock.blockType, StartBlockType);
  assertEquals(endBlock.blockType, EndBlockType);
});

Deno.test("should find path", async () => {
  const matrix = await createMatrixFromSeed("123456", 700, 4);

  const path = shortestContiguousPath(matrix.matrix, [1, 2], [3, 1]);
  assertEquals(path, [[1, 2], [1, 1], [2, 1], [3, 1]]);
});

Deno.test("should find longer path", async () => {
  const matrix = await createMatrixFromSeed("ken", 700, 4);

  const path = shortestContiguousPath(matrix.matrix, [1, 0], [2, 3]);
  assertEquals(path, [
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [2, 3],
  ]);
});

