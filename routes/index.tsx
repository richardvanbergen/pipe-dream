import { useSignal } from "@preact/signals";

import { CanvasSvg } from "../islands/Canvas.tsx";
import Input from "../islands/Input.tsx";

export default function Home() {
  const encodedMatrix = useSignal(
    "5,5,2,2,2,4,1,4|-89,95,38;-74,100,41;-59,100,44;-44,100,47;-29,100,50;-14,100,53;1,100,56;16,100,59|346193920,346193937,346193937,346193937,346193920,346193937,346193973,346193990,346193973,346194019,346193937,346193956,346193973,346193973,346194002,346193937,346193956,346193973,346193973,346193937,346193920,346193937,346193937,346193937,346193920",
  );

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
