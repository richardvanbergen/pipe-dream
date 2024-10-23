import type { Color } from "./color.ts";

export const empty = 0b0000;
export const edge = 0b0001;
export const start = 0b0010;
export const end = 0b0011;
export const block1 = 0b0100;
export const block2 = 0b0101;
export const block3 = 0b0110;

export type Block =
  | typeof empty
  | typeof edge
  | typeof start
  | typeof end
  | typeof block1
  | typeof block2
  | typeof block3;

export const connection = 0b1;
export const noConnection = 0b0;

export function encodeBlock(
  block: Block,
  color: Color,
  isConnection = false,
) {
  const connectionBit = isConnection ? 0b1 : 0b0;
  return (connectionBit << 8) | (color << 4) | block;
}

export function setBlockConnection(value: number, isConnection: boolean) {
  const connectionBit = isConnection ? 0b1 : 0b0;
  return (connectionBit << 8) | value;
}

export function getBlockType(value: number): Block {
  return (value & 0b1111) as Block;
}

export function getBlockColor(value: number): Color {
  return ((value >> 4) & 0b1111) as Color;
}

export function getBlockConnection(value: number): boolean {
  return ((value >> 8) & 0b1) === 0b1;
}

export function decodeBlock(value: number) {
  const blockType = getBlockType(value);
  const color = getBlockColor(value);
  const isConnection = getBlockConnection(value);

  return { color: color as Color, blockType: blockType as Block, isConnection };
}
