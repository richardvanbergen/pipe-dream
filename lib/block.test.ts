import { assertEquals } from "jsr:@std/assert";
import { color1, color5 } from "./color.ts";

import {
  block1,
  block2,
  encodeBlock,
  getBlockColor,
  getBlockConnection,
  getBlockType,
  setBlockConnection,
} from "./block.ts";

Deno.test("encode block", () => {
  const test1 = encodeBlock(block1, color1);
  const test2 = encodeBlock(block2, color5);
  const test3 = encodeBlock(block2, color5, true);

  assertEquals(test1, 4);
  assertEquals(test2, 69);
  assertEquals(test3, 325);
});

Deno.test("set block connection", () => {
  const test1 = setBlockConnection(4, true);
  assertEquals(test1, 260);
});

Deno.test("get block type", () => {
  const value = getBlockType(4);
  assertEquals(value, block1);
});

Deno.test("get block color", () => {
  const value = getBlockColor(69);
  assertEquals(value, color5);
});

Deno.test("get block connection", () => {
  const isConnection = getBlockConnection(325);
  const isNotConnection = getBlockConnection(4);

  assertEquals(isConnection, true);
  assertEquals(isNotConnection, false);
});
