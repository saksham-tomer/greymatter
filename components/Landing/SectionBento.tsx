import { CalendarIcon, FileTextIcon, PersonIcon } from "@radix-ui/react-icons";
import { BellIcon, Book, Share2Icon, Shield, Wallet } from "lucide-react";

import { cn } from "@/lib/utils";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import Image from "next/image";

const features = [
  {
    Icon: FileTextIcon,
    name: "Real-Time Analytics",
    description: "Access live data to stay ahead. From tracking multi-chain portfolios to capturing market shifts, Grey Matter gives you the insights you need, when you need them",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Image src={"/dem1.png"} alt="" width={1920} height={1080} className="" />
    ),
  },
  {
    Icon: CalendarIcon,
    name: "Backed by SOON",
    description: "our platform employs multi-layer encryption to safeguard your assets across blockchains. Move funds securely without compromise. Ecosystem and Partnerships",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: (
      <Image src={"/epic7.png"} alt="" width={1920} height={1080} className="" />
    ),
  },
  {
    Icon: Shield,
    name: "Ecosystem and Partnerships",
    description: "Our partnerships power a thriving DeFi ecosystem. We connect you to top-tier opportunities through innovative collaborations and strong community engagement. Multi-Currency Support.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 text-wrap lg:col-span-2 ",
    background: (
      <Image src={"/epic6.png"} alt="" width={1000} height={190} className=" pb-20" />
    ),
  },
  {
    Icon: Wallet,
    name: "Multi-Currency Support",
    description: "Seamlessly manage and trade assets across a broad spectrum of blockchains. Grey Matter, supports all major tokens, giving you complete flexibility in your DeFi operations.",
    className: "col-span-3 lg:col-span-1",
    href: "#",
    cta: "Learn more",
    background: (
      <Image src={"/dem4.png"} alt="" width={1920} height={1080} className=" " />
    ),
  },
];

export function BentoDemo() {
  return (
    <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  );
}
