import { assertEquals } from "jsr:@std/assert";
import { color1, color5 } from "./color.ts";

import {
  applyChaos,
  block1,
  block2,
  encodeBlock,
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

Deno.test("get offset X", () => {
  const encodedValue = encodeBlock(block1, color1, false, 10, 5, 45);
  const offsetX = getOffsetX(encodedValue);
  assertEquals(offsetX, 10);
});

Deno.test("get offset Y", () => {
  const encodedValue = encodeBlock(block1, color1, false, 10, 5, 45);
  const offsetY = getOffsetY(encodedValue);
  assertEquals(offsetY, 5);
});

Deno.test("get rotation", () => {
  const encodedValue = encodeBlock(block1, color1, false, 10, 5, 45);
  const rotation = getRotation(encodedValue);
  assertEquals(rotation, 45);
});

Deno.test("set offset X", () => {
  let encodedValue = encodeBlock(block1, color1, false, 10, 5, 45);
  encodedValue = setOffsetX(15, encodedValue);
  const offsetX = getOffsetX(encodedValue);
  assertEquals(offsetX, 15);
});

Deno.test("set offset Y", () => {
  let encodedValue = encodeBlock(block1, color1, false, 10, 5, 45);
  encodedValue = setOffsetY(18, encodedValue);
  const offsetY = getOffsetY(encodedValue);
  assertEquals(offsetY, 18);
});

Deno.test("set rotation", () => {
  let encodedValue = encodeBlock(block1, color1, false, 10, 5, 45);
  encodedValue = setRotation(90, encodedValue);
  const rotation = getRotation(encodedValue);
  assertEquals(rotation, 90);
});

Deno.test("apply chaos 0", () => {
  const chaosFactor = 0;
  const value = 10;
  const chaos = applyChaos(chaosFactor, value);
  assertEquals(chaos, 0);
});

Deno.test("apply chaos 255", () => {
  const chaosFactor = 255;
  const value = 10;
  const chaos = applyChaos(chaosFactor, value);
  assertEquals(chaos, value);
});

Deno.test("apply chaos", () => {
  const chaosFactor = 42;
  const value = 69;
  const chaos = applyChaos(chaosFactor, value);
  assertEquals(chaos, 26);
});
