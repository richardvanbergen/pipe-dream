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
  createMatrixFromSeed,
} from "../lib/matrix.ts";

interface CanvasProps {
  debug: Signal<boolean>;
  matrix: Signal<Awaited<ReturnType<typeof createMatrixFromSeed>> | null>;
  canvasSize: Signal<number>;
}

export function CanvasSvg(props: CanvasProps) {
  const { matrix, canvasSize, debug } = props;

  if (!matrix.value) {
    return null;
  }

  const colorMap = {
    [color1]: matrix.value.properties.themeColors[0],
    [color2]: matrix.value.properties.themeColors[1],
    [color3]: matrix.value.properties.themeColors[2],
    [color4]: matrix.value.properties.themeColors[3],
    [color5]: matrix.value.properties.themeColors[4],
    [color6]: matrix.value.properties.themeColors[5],
    [color7]: matrix.value.properties.themeColors[6],
    [color8]: matrix.value.properties.themeColors[7],
  };

  const roundnessMultiplier = matrix.value.properties.roundness / 10;

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
  }, [svgRef, matrix.value]);

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${canvasSize.value} ${canvasSize.value}`}
      ref={svgRef}
      class="w-full h-full"
      style={{ visibility: "hidden" }}
    >
      {matrix.value.matrix.flat().map(
        (
          {
            blockType,
            width,
            height,
            offsetX,
            offsetY,
            rotation,
            isConnection,
            position,
          },
          index,
        ) => {
          // make start and end blocks the same color
          const colorBlockType = blockType === 2 ? 3 : blockType;
          const fillColor = hslToString(
            colorMap[colorBlockType as keyof typeof colorMap],
          );

          return (
            <g key={index}>
              {(blockType !== 0)
                ? (
                  <rect
                    x={offsetX}
                    y={offsetY}
                    width={width}
                    height={height}
                    rx={width / 2 * roundnessMultiplier}
                    ry={height / 2 * roundnessMultiplier}
                    style={{
                      fill: fillColor,
                      transform: `rotate(${rotation}deg)`,
                      transformOrigin: `${offsetX + width / 2}px ${offsetY + height / 2
                        }px`,
                    }}
                  />
                )
                : debug.value && (
                  <rect
                    x={offsetX}
                    y={offsetY}
                    width={width}
                    height={height}
                    style={{
                      fill: "transparent",
                      stroke: "black",
                      strokeWidth: 3,
                    }}
                  />
                )}

              {isConnection && (
                <circle
                  cx={offsetX + width / 2}
                  cy={offsetY + height / 2}
                  r={width / 8}
                  style={{
                    fill: "black",
                    stroke: "black",
                  }}
                />
              )}

              {debug.value && (
                <text
                  x={offsetX + width / 2}
                  y={offsetY + height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: "16px",
                    fill: "black",
                  }}
                >
                  {`${position[0]},${position[1]}`}
                </text>
              )}
            </g>
          );
        },
      )}
    </svg>
  );
}