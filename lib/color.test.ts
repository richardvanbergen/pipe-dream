import { assertEquals } from "@std/assert";
import { generateMultipleColorsWithWarmth } from "./color.ts";

Deno.test("generate multiple colors", () => {
  const warmth = 8;
  const numColors = 5;

  const multipleColors = generateMultipleColorsWithWarmth(warmth, numColors);

  assertEquals(multipleColors, [
    { h: 48, s: 80, l: 43 },
    { h: 72, s: 85, l: 46 },
    { h: 96, s: 90, l: 49 },
    { h: 120, s: 95, l: 52 },
    { h: 144, s: 100, l: 55 }
  ]);
});
