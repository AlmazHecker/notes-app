import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { buttonVariants } from "./button";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

function Link({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"a"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Link, buttonVariants };
