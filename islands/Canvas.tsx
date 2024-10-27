import { Signal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";

import {
  color1,
  color2,
  color3,
  color4,
  color5,
  color6,
  color7,
  color8,
  hslToString,
} from "../lib/color.ts";

import {
  decodeBlock,
  edge,
  empty,
  setOffsetX,
  setOffsetY,
  setRotation,
} from "../lib/block.ts";

import {
  addConnections,
  decodeMatrix,
  shortestContiguousPath,
} from "../lib/matrix.ts";

interface CanvasProps {
  encodedMatrix: Signal<string>;
}

export function CanvasSvg(props: CanvasProps) {
  const { encodedMatrix } = props;

  if (!encodedMatrix.value) {
    return null;
  }

  const {
    matrix,
    themeColors,
    chaosFactor,
    roundness,
    startPosition,
    endPosition,
  } = decodeMatrix(
    encodedMatrix.value,
  );

  const path = shortestContiguousPath(
    matrix,
    startPosition,
    endPosition,
  );

  addConnections(matrix, path);

  const squareSize = 700 / Math.max(matrix.length, matrix[0].length);

  const colorMap = {
    [color1]: themeColors[0],
    [color2]: themeColors[1],
    [color3]: themeColors[2],
    [color4]: themeColors[3],
    [color5]: themeColors[4],
    [color6]: themeColors[5],
    [color7]: themeColors[6],
    [color8]: themeColors[7],
  };

  const getOffsetAndRotation = (value: number, chaosFactor: number) => {
    const { blockType } = decodeBlock(value);

    if (blockType === empty || blockType === edge) {
      return { offsetX: 0, offsetY: 0, rotation: 0 };
    }

    const chaosScale = chaosFactor / 10;

    const randomOffset = (max: number) =>
      Math.floor(Math.random() * max * chaosScale);
    const randomRotation = () => Math.floor(Math.random() * 180 * chaosScale);

    return {
      offsetX: randomOffset(20),
      offsetY: randomOffset(20),
      rotation: randomRotation(),
    };
  };

  const blockOffsets = matrix.map((row, rowIndex) => {
    return row.map((value, colIndex) => {
      const chaos = getOffsetAndRotation(value, chaosFactor);

      value = setOffsetX(chaos.offsetX, value);
      value = setOffsetY(chaos.offsetY, value);
      value = setRotation(chaos.rotation, value);

      const { color, isConnection, blockType } = decodeBlock(value);

      const x = colIndex * squareSize;
      const y = rowIndex * squareSize;

      const gap = 4;
      const adjustedSquareSize = squareSize - gap;

      const offsetXCalculated = x + gap / 2 + chaos.offsetX;
      const offsetYCalculated = y + gap / 2 + chaos.offsetY;

      const width = adjustedSquareSize;
      const height = adjustedSquareSize;

      const transform = `rotate(${chaos.rotation}deg)`;
      const transformOrigin = `${offsetXCalculated + width / 2}px ${
        offsetYCalculated + height / 2
      }px`;

      return {
        value,
        color,
        isConnection,
        blockType,
        offsetXCalculated,
        offsetYCalculated,
        width,
        height,
        transform,
        transformOrigin,
        row: rowIndex,
        col: colIndex,
      };
    });
  });

  const pathOffsets = path && path.map((position) => {
    const current = blockOffsets[position[0]][position[1]];

    return {
      x1: current.offsetXCalculated + current.width / 2,
      y1: current.offsetYCalculated + current.height / 2,
    };
  }).filter(Boolean) as { x1: number; y1: number }[];

  const roundnessMultiplier = roundness / 10;

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      const boundingBox = svgRef.current.getBBox();
      svgRef.current.setAttribute(
        "viewBox",
        `${boundingBox.x} ${boundingBox.y} ${boundingBox.width} ${boundingBox.height}`,
      );

      svgRef.current.style.visibility = "visible";
    }
  }, [svgRef, encodedMatrix.value]);

  return (
    <svg
      width="700"
      height="700"
      viewBox="0 0 700 700"
      ref={svgRef}
      style={{ visibility: "hidden" }}
    >
      {blockOffsets.flat().map(
        (
          {
            blockType,
            color,
            isConnection,
            offsetXCalculated,
            offsetYCalculated,
            width,
            height,
            transform,
            transformOrigin,
          },
          index,
        ) => {
          const rx = width / 2 * ((roundness - 5) / 5);
          const ry = height / 2 * ((roundness - 5) / 5);

          return (
            <g key={index}>
              {(blockType !== empty && blockType !== edge) && (
                <rect
                  x={offsetXCalculated}
                  y={offsetYCalculated}
                  width={width}
                  height={height}
                  rx={rx}
                  ry={ry}
                  style={{
                    fill: hslToString(colorMap[color]),
                    transform,
                    transformOrigin,
                  }}
                />
              )}

              {isConnection && (
                <circle
                  cx={offsetXCalculated + width / 2}
                  cy={offsetYCalculated + height / 2}
                  r={width / 8}
                  style={{
                    fill: "black",
                    stroke: "black",
                  }}
                />
              )}
            </g>
          );
        },
      )}

      {pathOffsets?.map((pathOffset, index) => {
        if (pathOffsets[index + 1]) {
          const x1 = pathOffset.x1;
          const y1 = pathOffset.y1;
          const x2 = pathOffsets[index + 1].x1;
          const y2 = pathOffsets[index + 1].y1;

          return (
            <path
              key={index}
              d={`M ${x1} ${y1} L ${x2} ${y2}`}
              fill="none"
              stroke="black"
              stroke-width={3}
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          );
        }
        return null;
      })}
    </svg>
  );
}

// export function CanvasHtml(props: CanvasProps) {
//   const { gridWidth, gridHeight } = props;

//   const { matrix, startPosition, endPosition } = createMatrix(
//     gridWidth.value,
//     gridHeight.value,
//   );

//   const path = shortestContiguousPath(
//     matrix,
//     startPosition,
//     endPosition,
//   );

//   addConnections(matrix, path);

//   return (
//     <div
//       class="grid gap-2 w-[50vh] h-[50vh]"
//       style={{
//         gridTemplateRows: `repeat(${matrix.length}, 1fr)`,
//         gridTemplateColumns: `repeat(${matrix[0].length}, 1fr)`,
//       }}
//     >
//       {matrix.flat().map((value) => {
//         const { color, isConnection } = decodeBlock(value);
//         return (
//           <div
//             class={`w-full h-full flex justify-center items-center`}
//             style={{
//               backgroundColor: colorMap[color],
//             }}
//           >
//             {isConnection && (
//               <div class={`w-1/4 h-1/4 rounded-full bg-black`}></div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }
