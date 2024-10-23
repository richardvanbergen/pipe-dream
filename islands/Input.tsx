import type { Signal } from "@preact/signals";

interface InputProps {
  gridWidth: Signal<number>;
  gridHeight: Signal<number>;
}

export default function Input(props: InputProps) {
  const { gridWidth, gridHeight } = props;

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

  return (
    <>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Width</label>
        <input
          type="number"
          value={gridWidth.value}
          onInput={handleGridWidthChange}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Height</label>
        <input
          type="number"
          value={gridHeight.value}
          onInput={handleGridHeightChange}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
    </>
  );
}
