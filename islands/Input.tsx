import { type Signal, useSignal } from "@preact/signals";
import { createMatrix, decodeMatrix, encodeMatrix } from "../lib/matrix.ts";

interface InputProps {
  encodedMatrix: Signal<string>;
}

export default function Input(props: InputProps) {
  const { encodedMatrix } = props;

  const chaosFactor = useSignal(0);
  const roundness = useSignal(0);
  const gridWidth = useSignal(4);
  const gridHeight = useSignal(4);
  const fill = useSignal("fill");

  function handleChaosFactorChange(e: Event) {
    if (e.target) {
      chaosFactor.value = parseInt((e.target as HTMLInputElement).value);
      handleGenerateMatrix();
    }
  }

  function handleGridWidthChange(e: Event) {
    if (e.target) {
      gridWidth.value = parseInt((e.target as HTMLInputElement).value);
      handleGenerateMatrix();
    }
  }

  function handleGridHeightChange(e: Event) {
    if (e.target) {
      gridHeight.value = parseInt((e.target as HTMLInputElement).value);
      handleGenerateMatrix();
    }
  }

  function handleRoundnessChange(e: Event) {
    if (e.target) {
      roundness.value = parseInt((e.target as HTMLInputElement).value);
      handleGenerateMatrix();
    }
  }

  function handleFillChange(e: Event) {
    if (e.target) {
      fill.value = (e.target as HTMLInputElement).value;
      handleGenerateMatrix();
    }
  }

  function handleGenerateMatrix() {
    const { matrix, themeColors, startPosition, endPosition } = createMatrix(
      gridWidth.value,
      gridHeight.value,
      chaosFactor.value,
    );

    encodedMatrix.value = encodeMatrix(
      matrix,
      themeColors,
      chaosFactor.value,
      roundness.value,
      startPosition,
      endPosition,
    );
  }

  function handleEncodedMatrixChange(e: Event) {
    if (e.target) {
      const target = e.target as HTMLInputElement;
      try {
        encodedMatrix.value = target.value;

        const {
          matrix,
          chaosFactor: decodedChaosFactor,
          roundness: decodedRoundness,
        } = decodeMatrix(encodedMatrix.value);

        chaosFactor.value = decodedChaosFactor;
        roundness.value = decodedRoundness;
        gridWidth.value = matrix[0].length;
        gridHeight.value = matrix.length;
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div class="flex flex-col gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Block Style
        </label>
        <select value={fill.value} onInput={handleFillChange}>
          <option value="stroke">Stroke</option>
          <option value="fill">Fill</option>
          <option value="stroke-fill">Stroke & Fill</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          Matrix
        </label>

        <input
          type="text"
          value={encodedMatrix.value}
          onInput={handleEncodedMatrixChange}
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          Chaos Factor
        </label>

        <input
          type="range"
          value={chaosFactor.value}
          onInput={handleChaosFactorChange}
          min={0}
          max={10}
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          Roundness
        </label>
        <input
          type="range"
          value={roundness.value}
          onInput={handleRoundnessChange}
          min={0}
          max={10}
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Width</label>
        <input
          type="number"
          value={gridWidth.value}
          onInput={handleGridWidthChange}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Height</label>
        <input
          type="number"
          value={gridHeight.value}
          onInput={handleGridHeightChange}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
    </div>
  );
}
