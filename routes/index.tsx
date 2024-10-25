import { useSignal } from "@preact/signals";

import { CanvasSvg } from "../islands/Canvas.tsx";
import Input from "../islands/Input.tsx";

export default function Home() {
  const encodedMatrix = useSignal("");

  return (
    <div class="flex h-screen">
      <div
        class={`flex-1 bg-gray-100 flex justify-center items-center`}
      >
        <CanvasSvg encodedMatrix={encodedMatrix} />
      </div>

      <div class="w-64 bg-white p-4 shadow-lg flex-shrink">
        <h2 class="text-xl font-bold mb-4">Grid Settings</h2>
        <Input encodedMatrix={encodedMatrix} />
      </div>
    </div>
  );
}
