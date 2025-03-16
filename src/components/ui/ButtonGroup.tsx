import React, { ReactNode } from "react";

interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}

export default function ButtonGroup({
  children,
  className = "",
  "aria-label": ariaLabel,
}: ButtonGroupProps) {
  return (
    <div
      className={`inline-flex rounded overflow-hidden ${className}`}
      role="group"
      aria-label={ariaLabel}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(
            child as React.ReactElement<{ className?: string }>,
            {
              className: `${
                (child.props as React.HTMLProps<HTMLElement>).className || ""
              } rounded-none ${index === 0 ? "rounded-l" : ""} ${
                index === React.Children.count(children) - 1 ? "rounded-r" : ""
              } border-r border-white/20 last:border-r-0`,
            }
          );
        }
        return child;
      })}
    </div>
  );
}
