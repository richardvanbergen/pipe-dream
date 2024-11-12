import { type Signal } from "@preact/signals";
import { createMatrixFromSeed } from "../lib/matrix.ts";
import { useEffect } from "preact/hooks";

interface InputProps {
  matrix: Signal<Awaited<ReturnType<typeof createMatrixFromSeed>> | null>;
  seed: Signal<string>;
  debug: Signal<boolean>;
  canvasSize: Signal<number>;
}

export default function Input(props: InputProps) {
  const { matrix, seed, canvasSize, debug } = props;

  function handleDebugChange(e: Event) {
    if (e.target) {
      debug.value = (e.target as HTMLInputElement).checked;
    }
  }

  async function handleSeedChange(e: Event) {
    if (e.target) {
      seed.value = (e.target as HTMLInputElement).value;
      matrix.value = await createMatrixFromSeed(
        seed.value,
        canvasSize.value,
        4,
      );
    }
  }

  useEffect(() => {
    (async () => {
      matrix.value = await createMatrixFromSeed(
        seed.value,
        canvasSize.value,
        4,
      );
    })();
  }, [seed]);

  return (
    <div class="flex flex-col gap-4">
      <div class="space-y-1.5">
        <label class="block text-sm text-gray-700 font-semibold" for="seed">
          Seed
        </label>

        <input
          type="text"
          id="seed"
          value={seed.value}
          onInput={handleSeedChange}
          class="border px-3 py-2"
        />
      </div>

      <div class="space-y-1.5">
        <label
          class="block text-sm text-gray-700 font-semibold"
          for="debug"
        >
          Debug
        </label>

        <input
          type="checkbox"
          id="debug"
          checked={debug.value}
          onInput={handleDebugChange}
        />
      </div>
    </div>
  );
}
