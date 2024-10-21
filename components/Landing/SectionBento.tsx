import { CalendarIcon, FileTextIcon, PersonIcon } from "@radix-ui/react-icons";
import { BellIcon, Share2Icon, Shield, Wallet } from "lucide-react";

import { cn } from "@/lib/utils";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import Image from "next/image";

const features = [
  {
    Icon: FileTextIcon,
    name: "Real-Time Analytics",
    description: "We automatically save your files as you type.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Image src={"/dem1.png"} alt="" width={1920} height={1080} className="" />
    ),
  },
  {
    Icon: Shield,
    name: "Advanced Security",
    description: "Get notified when something happens.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: (
      <Image src={"/dem2.png"} alt="" width={1920} height={1080} className="" />
    ),
  },
  {
    Icon: PersonIcon,
    name: "Ecosystem and Partnerships",
    description: "Supports 100+ integrations and counting.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: (
      <Image src={"/dem3.png"} alt="" width={1920} height={1080} className="" />
    ),
  },
  {
    Icon: Wallet,
    name: "Multi-Token Support",
    description: "Use the calendar to filter your files by date.",
    className: "col-span-3 lg:col-span-1",
    href: "#",
    cta: "Learn more",
    background: (
      <Image src={"/dem4.png"} alt="" width={1920} height={1080} className="" />
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
