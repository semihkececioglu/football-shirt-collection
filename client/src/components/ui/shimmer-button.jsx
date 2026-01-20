import React from "react";

import { cn } from "@/lib/utils"

export const ShimmerButton = React.forwardRef((
  {
    shimmerColor,
    shimmerSize = "0.05em",
    shimmerDuration = "3s",
    borderRadius = "100px",
    background,
    className,
    children,
    ...props
  },
  ref
) => {
  return (
    <button
      style={
        {
          "--spread": "90deg",
          "--shimmer-color": shimmerColor,
          "--radius": borderRadius,
          "--speed": shimmerDuration,
          "--cut": shimmerSize,
          "--bg": background
        }
      }
      className={cn(
        "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] px-6 py-3 whitespace-nowrap",
        "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
        // Light mode: black bg, white text
        "bg-black text-white border border-white/10",
        // Dark mode: white bg, black text
        "dark:bg-white dark:text-black dark:border-black/10",
        // Override with CSS variable if provided
        background && "[background:var(--bg)]",
        className
      )}
      ref={ref}
      {...props}>
      {/* spark container */}
      <div
        className={cn(
          "-z-30 blur-[2px]",
          "[container-type:size] absolute inset-0 overflow-visible"
        )}>
        {/* spark */}
        <div
          className="animate-shimmer-slide absolute inset-0 [aspect-ratio:1] h-[100cqh] [border-radius:0] [mask:none]">
          {/* spark before */}
          <div
            className={cn(
              "animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0",
              // Light mode: white shimmer
              "[background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,#ffffff_var(--spread),transparent_var(--spread))]",
              // Dark mode: dark shimmer
              "dark:[background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,#000000_var(--spread),transparent_var(--spread))]",
              // Override with CSS variable if provided
              shimmerColor && "[background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]"
            )} />
        </div>
      </div>
      {children}
      {/* Highlight */}
      <div
        className={cn(
          "absolute inset-0 size-full",
          "rounded-2xl px-4 py-1.5 text-sm font-medium",
          // Light mode shadows
          "shadow-[inset_0_-8px_10px_#ffffff1f]",
          "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",
          "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]",
          // Dark mode shadows
          "dark:shadow-[inset_0_-8px_10px_#0000001f]",
          "dark:group-hover:shadow-[inset_0_-6px_10px_#0000003f]",
          "dark:group-active:shadow-[inset_0_-10px_10px_#0000003f]",
          // transition
          "transform-gpu transition-all duration-300 ease-in-out"
        )} />
      {/* backdrop */}
      <div
        className={cn(
          "absolute [inset:var(--cut)] -z-20 [border-radius:var(--radius)]",
          "bg-black dark:bg-white",
          background && "[background:var(--bg)]"
        )} />
    </button>
  );
})

ShimmerButton.displayName = "ShimmerButton"
