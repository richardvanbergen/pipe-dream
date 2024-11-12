import { assertEquals } from "jsr:@std/assert";
import { createMatrixFromSeed, shortestContiguousPath } from "./matrix.ts";
import { getBlockValueFromPosition } from "./matrix.ts";
import { end, getBlockType, start } from "./block.ts";

Deno.test("create matrix", async () => {
  const matrix = await createMatrixFromSeed("1234567890", 10, 4);

  const {
    matrix: matrixBlocks,
    properties: { startPosition, endPosition },
  } = matrix;

  const startBlock = getBlockValueFromPosition(matrixBlocks, startPosition);
  const endBlock = getBlockValueFromPosition(matrixBlocks, endPosition);

  const startBlockType = getBlockType(startBlock);
  const endBlockType = getBlockType(endBlock);

  assertEquals(matrixBlocks.length, 11);
  assertEquals(matrixBlocks[0].length, 11);

  assertEquals(startBlockType, start);
  assertEquals(endBlockType, end);
});

Deno.test("should find path", () => {
  const matrix = [
    [0, 17, 17, 17, 0],
    [17, 36, 36, 70, 17],
    [17, 70, 70, 53, 17],
    [17, 53, 36, 36, 17],
    [0, 17, 338, 355, 0],
  ];

  const path = shortestContiguousPath(matrix, [4, 2], [4, 3]);
  assertEquals(path, [[4, 2], [3, 2], [3, 3], [4, 3]]);
});

Deno.test("should find longer path", () => {
  const matrix = [
    [0, 338, 17, 17, 0],
    [17, 36, 36, 70, 17],
    [17, 70, 36, 53, 17],
    [17, 53, 36, 36, 17],
    [0, 17, 17, 355, 0],
  ];

  const path = shortestContiguousPath(matrix, [0, 1], [4, 3]);
  assertEquals(path, [
    [0, 1],
    [1, 1],
    [1, 2],
    [2, 2],
    [3, 2],
    [3, 3],
    [4, 3],
  ]);
});

Deno.test("should not connect start directly to end", () => {
  const matrix = [
    [0, 17, 17, 17, 0],
    [17, 36, 36, 70, 17],
    [17, 70, 70, 53, 17],
    [17, 53, 70, 36, 17],
    [0, 17, 338, 355, 0],
  ];

  const path = shortestContiguousPath(matrix, [4, 2], [4, 3]);
  assertEquals(path, null);
});
