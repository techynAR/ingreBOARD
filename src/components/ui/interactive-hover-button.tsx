import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  variant?: 'primary' | 'secondary';
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", variant = 'primary', className, ...props }, ref) => {
  const isPrimary = variant === 'primary';
  return (
    <button
      ref={ref}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-full border px-8 py-3 text-center font-semibold whitespace-nowrap min-w-fit shadow-lg shadow-emerald-500/20",
        isPrimary 
          ? "border-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950"
          : "border-emerald-400/40 bg-transparent text-emerald-200",
        className,
      )}
      {...props}
    >
      <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        {text}
      </span>
      <div className={cn(
        "absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center gap-2 translate-x-full opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100",
        isPrimary ? "text-slate-950" : "text-emerald-200"
      )}>
        <span>{text}</span>
        <ArrowRight className="h-5 w-5" />
      </div>
      <div className={cn(
        "absolute left-[20%] top-[40%] h-0 w-0 scale-[1] rounded-full transition-all duration-300 group-hover:left-0 group-hover:top-0 group-hover:h-full group-hover:w-full group-hover:scale-[1.6]",
        isPrimary ? "bg-white/40" : "bg-emerald-400/10"
      )}></div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };