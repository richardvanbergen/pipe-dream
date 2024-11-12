import { useSignal } from "@preact/signals";

import { CanvasSvg } from "../islands/Canvas.tsx";
import Input from "../islands/Input.tsx";
import type { createMatrixFromSeed } from "../lib/matrix.ts";

export default function Home() {
  const seed = useSignal("123456");
  const debug = useSignal(false);

  const canvasSize = useSignal(700);

  const matrix = useSignal<
    Awaited<ReturnType<typeof createMatrixFromSeed>> | null
  >(null);

  return (
    <div class="flex h-screen">
      <div
        class={`flex-1 bg-gray-100 flex justify-center items-center`}
      >
        <div class="max-w-3/4 max-h-full p-5">
          <CanvasSvg
            matrix={matrix}
            canvasSize={canvasSize}
            debug={debug}
          />
        </div>
      </div>

      <div class="w-64 bg-white p-4 shadow-lg flex-shrink">
        <h2 class="text-xl font-bold mb-4">Grid Settings</h2>
        <Input
          matrix={matrix}
          seed={seed}
          debug={debug}
          canvasSize={canvasSize}
        />
      </div>
    </div>
  );
}
