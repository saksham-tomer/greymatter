import { ArrowRightIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import AnimatedShinyText from "@/components/ui/animated-shiny-text";

export async function HeroButton() {
  return (
    <div
      className={cn(
        "group rounded-full border  text-base text-white transition-all ease-in hover:cursor-pointer border-white/20 mt-16 bg-neutral-900 hover:bg-neutral-800"
      )}
    >
      <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out text-neutral-300 hover:duration-300 hover:text-neutral-400">
        <span>✨ Get Best Prices</span>
        <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
      </AnimatedShinyText>
    </div>
  );
}
