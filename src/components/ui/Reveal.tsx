"use client";

import { useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { useReveal } from "@/lib/use-reveal";
import { useScrollFocus } from "@/lib/use-scroll-focus";

type RevealProps = {
  as?: ElementType;
  className: string;
  amount?: number;
  scrollable?: boolean;
  style?: CSSProperties;
  children: ReactNode;
  "aria-hidden"?: boolean;
};

export function Reveal({
  as: Tag = "div",
  className,
  amount,
  scrollable,
  children,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, amount);
  useScrollFocus(ref, scrollable);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
