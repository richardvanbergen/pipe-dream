import { assertEquals } from "@std/assert";
import { byteGenerator, seedToHash } from "./crypto.ts";

Deno.test("can generate bytes from a hash", async () => {
  const hash = await seedToHash("1234567890");
  const takeAByte = byteGenerator(hash, 16);

  const byte1 = await takeAByte(1);
  const byte2 = await takeAByte(1);

  assertEquals(byte1, new Uint8Array([199]));
  assertEquals(byte2, new Uint8Array([117]));
});

Deno.test("generates new hash when bytes run low", async () => {
  const hash = await seedToHash("1234567890");
  const takeAByte = byteGenerator(hash, 16);

  // Take enough bytes to force a new hash generation
  const bytes1 = await takeAByte(20);
  const bytes2 = await takeAByte(20);
  const bytes3 = await takeAByte(20);

  // Bytes should be different since a new hash was generated
  assertEquals(bytes1.length, 20);
  assertEquals(bytes2.length, 20);
  assertEquals(bytes3.length, 20);

  // Check bytes are different between generations
  assertEquals(bytes1.every((b, i) => b === bytes2[i]), false);
  assertEquals(bytes2.every((b, i) => b === bytes3[i]), false);
  assertEquals(bytes1.every((b, i) => b === bytes3[i]), false);

  // Check bytes are different from original input
  const inputBytes = new TextEncoder().encode("1234567890");
  assertEquals(bytes1.every((b, i) => b === inputBytes[i]), false);
  assertEquals(bytes2.every((b, i) => b === inputBytes[i]), false);
  assertEquals(bytes3.every((b, i) => b === inputBytes[i]), false);
});
