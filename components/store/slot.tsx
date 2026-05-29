"use client";

import { cloneElement, isValidElement } from "react";

type SlotProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
};

export function Slot({ children, ...props }: SlotProps) {
  if (!isValidElement(children)) {
    return null;
  }

  const childProps = children.props as Record<string, unknown>;
  return cloneElement(children, {
    ...props,
    className: [props.className, childProps.className].filter(Boolean).join(" ")
  } as Record<string, unknown>);
}
