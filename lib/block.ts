export type BlockProperties = {
  blockType: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
};

export const EmptyBlockType = 0;
export const EdgeBlockType = 1;
export const StartBlockType = 2;
export const EndBlockType = 3;
export const Block1Type = 4;
export const Block2Type = 5;
export const Block3Type = 6;

export type BlockTypes =
  | typeof EmptyBlockType
  | typeof EdgeBlockType
  | typeof StartBlockType
  | typeof EndBlockType
  | typeof Block1Type
  | typeof Block2Type
  | typeof Block3Type;

/**
 * Modulates a number based on a chaos factor.
 * @param chaosFactor - Number between 0-255 that determines how much chaos to apply
 * @param value - The number to be modulated (0-255)
 * @returns A number modulated based on the chaos factor
 */
export function applyChaos(chaosFactor: number, value: number): number {
  chaosFactor = Math.max(0, Math.min(255, Math.floor(chaosFactor)));
  value = Math.max(0, Math.min(255, Math.floor(value)));

  if (chaosFactor === 0) return 0;

  return value % (chaosFactor + 1);
}