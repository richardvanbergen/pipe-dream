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

export const colorMap = {
  [color1]: "bg-gray-100",
  [color2]: "bg-gray-100",
  [color3]: "bg-indigo-500",
  [color4]: "bg-pink-500",
  [color5]: "bg-green-500",
  [color6]: "bg-yellow-500",
  [color7]: "bg-purple-500",
  [color8]: "bg-purple-500",
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

        return (
          <g key={index}>
            <rect
              x={x}
              y={y}
              width={squareSize}
              height={squareSize}
              class={colorMap[color]}
            />
            {isConnection && (
              <rect
                x={x + squareSize / 4}
                y={y + squareSize / 4}
                width={squareSize / 2}
                height={squareSize / 2}
                class="fill-black"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function CanvasHtml(props: CanvasProps) {
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
