"use client";
import React from "react";
import { PinContainer } from "../ui/3d-pin";

export function AnimatedPinDemo() {
  return (
    <div className="h-[40rem] w-full flex items-center justify-center ">
      <PinContainer title="twitter/DevDose" href="https://x.com/SakshamDevDose">
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
          Grey Matter Support
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-500 ">Reach Out For Support</span>
          </div>
          <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-neutral-500 via-neutral-700 to-neutral-800">
          <img src="https://goctienao.com/wp-content/uploads/2022/05/image-108.png" alt="" className="object-cover rounded-lg min-w-full min-h-full" />
          </div>
        </div>
      </PinContainer>
    </div>
  );
}
