import type { Signal } from "@preact/signals";

interface InputProps {
  gridWidth: Signal<number>;
  gridHeight: Signal<number>;
  chaosFactor: Signal<number>;
  roundness: Signal<number>;
}

export default function Input(props: InputProps) {
  const { gridWidth, gridHeight, chaosFactor, roundness } = props;

  function handleChaosFactorChange(e: Event) {
    if (e.target) {
      chaosFactor.value = parseInt((e.target as HTMLInputElement).value);
    }
  }

  function handleGridWidthChange(e: Event) {
    if (e.target) {
      gridWidth.value = parseInt((e.target as HTMLInputElement).value);
    }
  }

  function handleGridHeightChange(e: Event) {
    if (e.target) {
      gridHeight.value = parseInt((e.target as HTMLInputElement).value);
    }
  }

  function handleRoundnessChange(e: Event) {
    if (e.target) {
      roundness.value = parseInt((e.target as HTMLInputElement).value);
    }
  }

  return (
    <div class="flex flex-col gap-4">
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
