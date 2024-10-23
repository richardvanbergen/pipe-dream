import { Signal } from "@preact/signals";

import {
  color1,
  color2,
  color3,
  color4,
  color5,
  color6,
  color7,
  color8,
} from "../lib/color.ts";

import { decodeBlock } from "../lib/block.ts";

import {
  addConnections,
  createMatrix,
  shortestContiguousPath,
} from "../lib/matrix.ts";

interface CanvasProps {
  gridWidth: Signal<number>;
  gridHeight: Signal<number>;
}

// this tricks tailwind into compiling these colors
// bg-gray-100 bg-indigo-500 bg-pink-500 bg-green-500 bg-yellow-500 bg-purple-500
// text-gray-100 text-indigo-500 text-pink-500 text-green-500 text-yellow-500 text-purple-500

export const colorMap = {
  [color1]: "gray-100",
  [color2]: "gray-100",
  [color3]: "indigo-500",
  [color4]: "pink-500",
  [color5]: "green-500",
  [color6]: "yellow-500",
  [color7]: "purple-500",
  [color8]: "purple-500",
};

export function CanvasSvg(props: CanvasProps) {
  const { gridWidth, gridHeight } = props;

  const { matrix, startPosition, endPosition } = createMatrix(
    gridWidth.value,
    gridHeight.value,
  );

  const path = shortestContiguousPath(
    matrix,
    startPosition,
    endPosition,
  );

  addConnections(matrix, path);

  const squareSize = 500 / Math.max(matrix.length, matrix[0].length);

  return (
    <svg width="500" height="500" viewBox="0 0 500 500">
      {matrix.flat().map((value, index) => {
        const { color, isConnection } = decodeBlock(value);
        const row = Math.floor(index / matrix[0].length);
        const col = index % matrix[0].length;
        const x = col * squareSize;
        const y = row * squareSize;

        const gap = 4; // Define a gap size
        const adjustedSquareSize = squareSize - gap;
        return (
          <g key={index}>
            <rect
              x={x + gap / 2}
              y={y + gap / 2}
              width={adjustedSquareSize}
              height={adjustedSquareSize}
              rx={adjustedSquareSize / 8}
              ry={adjustedSquareSize / 8}
              class={`text-${colorMap[color]} fill-current`}
            />

            {isConnection && (
              <circle
                cx={x + adjustedSquareSize / 2 + gap / 2}
                cy={y + adjustedSquareSize / 2 + gap / 2}
                r={adjustedSquareSize / 8}
                class="fill-black"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function CanvasHtml(props: CanvasProps) {
  const { gridWidth, gridHeight } = props;

  const { matrix, startPosition, endPosition } = createMatrix(
    gridWidth.value,
    gridHeight.value,
  );

  const path = shortestContiguousPath(
    matrix,
    startPosition,
    endPosition,
  );

  addConnections(matrix, path);

  return (
    <div
      class="grid gap-2 w-[50vh] h-[50vh]"
      style={{
        gridTemplateRows: `repeat(${matrix.length}, 1fr)`,
        gridTemplateColumns: `repeat(${matrix[0].length}, 1fr)`,
      }}
    >
      {matrix.flat().map((value) => {
        const { color, isConnection } = decodeBlock(value);
        return (
          <div
            class={`w-full h-full flex justify-center items-center ${
              colorMap[color]
            }`}
          >
            {isConnection && (
              <div class={`w-1/4 h-1/4 rounded-full bg-black`}></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
