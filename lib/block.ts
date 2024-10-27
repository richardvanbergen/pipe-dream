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

const maxOffset = 20;
const maxRotation = 180;
const offsetRange = maxOffset * 2;

export function encodeBlock(
  block: Block,
  color: Color,
  isConnection = false,
  offsetX: number = 20,
  offsetY: number = 20,
  rotation: number = 0,
) {
  const connectionBit = isConnection ? 0b1 : 0b0;

  const encodedOffsetX = Math.max(
    0,
    Math.min(offsetRange, offsetX + maxOffset),
  );

  const encodedOffsetY = Math.max(
    0,
    Math.min(offsetRange, offsetY + maxOffset),
  );

  const encodedRotation = Math.max(0, Math.min(maxRotation, rotation));

  return (
    (encodedRotation << 24) |
    (encodedOffsetY << 18) |
    (encodedOffsetX << 12) |
    connectionBit << 8 |
    (color << 4) |
    block
  );
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
  const offsetX = getOffsetX(value);
  const offsetY = getOffsetY(value);
  const rotation = getRotation(value);

  return {
    color: color as Color,
    blockType: blockType as Block,
    isConnection,
    offsetX,
    offsetY,
    rotation,
  };
}

export function getOffsetX(value: number): number {
  return ((value >> 12) & 0b111111) - maxOffset; // Map back to -20 to 20
}

export function getOffsetY(value: number): number {
  return ((value >> 18) & 0b111111) - maxOffset; // Map back to -20 to 20
}

export function getRotation(value: number): number {
  return (value >> 24) & 0b1111111;
}

export function setOffsetX(value: number, encodedValue: number): number {
  const clampedValue = Math.max(0, Math.min(maxOffset, value));
  return (encodedValue & ~(0b11111 << 12)) | (clampedValue << 12);
}

export function setOffsetY(value: number, encodedValue: number): number {
  const clampedValue = Math.max(0, Math.min(maxOffset, value));
  return (encodedValue & ~(0b11111 << 18)) | (clampedValue << 18);
}

export function setRotation(value: number, encodedValue: number): number {
  const clampedValue = Math.max(0, Math.min(maxRotation, value));
  return (encodedValue & ~(0b1111111 << 24)) | (clampedValue << 24);
}

// export function decodeBlock(dna: string) {
//   if (dna.length < 15) {
//     throw new Error("DNA string must be at least 15 characters long.");
//   }

//   const rotation = parseInt(dna.slice(0, 2)) % 90;
//   const offsetX = parseInt(dna.slice(2, 4)) % 64;
//   const offsetY = parseInt(dna.slice(4, 6)) % 64;
//   const isConnection = parseInt(dna[6]) % 2 === 1;
//   const color = parseInt(dna.slice(7, 9)) % 8;
//   const blockType = parseInt(dna.slice(9, 11)) % 7;

//   return {
//     rotation,
//     offsetX,
//     offsetY,
//     isConnection,
//     color,
//     blockType,
//   };
// }
