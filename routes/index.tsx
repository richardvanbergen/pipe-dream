import { useSignal } from "@preact/signals";

import { CanvasSvg } from "../islands/Canvas.tsx";
import Input from "../islands/Input.tsx";

export default function Home() {
  const gridWidth = useSignal(4);
  const gridHeight = useSignal(4);

  return (
    <div class="flex h-screen">
      <div
        class={`flex-1 bg-gray-100 flex justify-center items-center`}
      >
        <CanvasSvg gridWidth={gridWidth} gridHeight={gridHeight} />
      </div>

      <div class="w-64 bg-white p-4 shadow-lg flex-shrink">
        <h2 class="text-xl font-bold mb-4">Grid Settings</h2>
        <Input gridWidth={gridWidth} gridHeight={gridHeight} />
      </div>
    </div>
  );
}
