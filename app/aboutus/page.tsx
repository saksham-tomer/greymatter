"use client"
import { HoverEffect } from "@/components/ui/card-hover-effect";
import Image from "next/image";
import {WobbleCardDemo} from "./o"
export default function CardHoverEffectDemo() {
  return (
    <div className=" px-10 bg-gradient-to-b from-neutral-950 to-neutral-900   w-screen min-h-screen ">
        <div className=" ">
        <h1
    style={{
        fontSize: "300px"
    }}
    className="text-6xl text-white"
>
    ABOUT
</h1>
<div className="gap-10 flex ">
<span
    style={{
        fontSize: "300px"
    }}
    className="text-6xl   text-white"
>
    US
</span>

<Image width={820} src="/dem1.png" className=" rounded-xl hover:cursor-pointer hover:scale-110" height={700}/>

</div>


<div className=" mt-20">
<h1  className=" text-6xl text-white ">Our Patners</h1>

        <WobbleCardDemo/>

        </div>

            <div className=" flex">

                <div className=" w-[200px] border-white border-2 h-[300px]">

                </div>

            </div>

        </div>
        <div className=" flex">
        <div className="  max-w-5xl ">

        <HoverEffect className="  " items={projects} />
        </div>
        <div className=" ">


        </div>



        </div>


       
    </div>
  );
}
export const projects = [
  {
    title: "Binance",
    description:
      "A technology company that builds economic infrastructure for the internet.",
    link: "https://stripe.com",
  },
  {
    title: "Solana",
    description:
      "A streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.",
    link: "https://netflix.com",
  },
  {
    title: "Etherium",
    description:
      "A multinational technology company that specializes in Internet-related services and products.",
    link: "https://google.com",
  },
  {
    title: "Meta",
    description:
      "A technology company that focuses on building products that advance Facebook's mission of bringing the world closer together.",
    link: "https://meta.com",
  },
];
