import { assertEquals } from "jsr:@std/assert";

import { applyChaos } from "./block.ts";

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
