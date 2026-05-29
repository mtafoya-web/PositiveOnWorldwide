import { Slot } from "@/components/store/slot";
import { cn } from "@/lib/utils";

type ShimmerButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};

export function ShimmerButton({ asChild, className, children, type = "button", ...props }: ShimmerButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-none bg-ink px-6 text-sm font-black uppercase tracking-normal text-chalk transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2",
        "bg-[linear-gradient(110deg,#111111,45%,#3a3a3a,55%,#111111)] bg-[length:220%_100%] animate-shimmer",
        className
      )}
      type={asChild ? undefined : type}
      {...props}
    >
      {children}
    </Comp>
  );
}
