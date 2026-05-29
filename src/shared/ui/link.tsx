import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "./button";

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

export { buttonVariants, Link };
