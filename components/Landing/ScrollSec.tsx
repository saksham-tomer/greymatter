import { VelocityScroll } from "@/components/ui/scroll-based-velocity";

export function ScrollBasedVelocityDemo() {
  return (
    <VelocityScroll
      text="Grey Matter"
      default_velocity={5}
      className="font-display text-center text-4xl font-bold tracking-[-0.02em]  drop-shadow-sm text-transparent bg-clip-text bg-gradient-to-tr from-neutral-400 mt-4 to-neutral-800  [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)] md:text-7xl md:leading-[5rem]"
    />
  );
}
