import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { buttonVariants } from "./button";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";
import { Link as RouterLink } from "react-router-dom";
function Link({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<typeof RouterLink> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : RouterLink;

  return (
    <Comp
      data-slot="a"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Link, buttonVariants };
