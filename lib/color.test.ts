import { assertEquals } from "@std/assert";
import { generateMultipleColorsWithWarmth } from "./color.ts";

Deno.test("generate multiple colors", () => {
  const warmth = 8;
  const numColors = 5;

  const multipleColors = generateMultipleColorsWithWarmth(warmth, numColors);

  assertEquals(multipleColors, [
    "hsl(48, 92%, 50%)",
    "hsl(120, 92%, 50%)",
    "hsl(192, 92%, 50%)",
    "hsl(264, 92%, 50%)",
    "hsl(336, 92%, 50%)",
  ]);
});
