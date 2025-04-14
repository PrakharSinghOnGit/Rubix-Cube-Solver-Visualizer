import { ReactNode } from "react";

interface ButtonProps {
  size?: "small" | "medium";
  children: ReactNode;
  color?: "blue" | "red" | "green" | "gray" | "purple" | "yellow";
  variant?: "contained" | "outlined" | "text";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  joinRight?: boolean;
  joinLeft?: boolean;
  selected?: boolean;
  filled?: boolean;
}

export default function Button({
  size = "medium",
  children,
  onClick,
  color = "blue",
  disabled = false,
  className = "",
  joinRight = false,
  joinLeft = false,
  selected = false,
  filled = false,
}: ButtonProps) {
  // Define color mappings for different states
  const colorClasses = {
    blue: {
      bg: "bg-blue-500",
      bgHover: "hover:bg-blue-400",
      border: "border-blue-400",
      outlinedHover: "hover:bg-blue-600",
    },
    red: {
      bg: "bg-red-500",
      bgHover: "hover:bg-red-400",
      border: "border-red-400",
      outlinedHover: "hover:bg-red-600",
    },
    green: {
      bg: "bg-green-500",
      bgHover: "hover:bg-green-400",
      border: "border-green-400",
      outlinedHover: "hover:bg-green-600",
    },
    gray: {
      bg: "bg-gray-500",
      bgHover: "hover:bg-gray-400",
      border: "border-gray-400",
      outlinedHover: "hover:bg-gray-600",
    },
    purple: {
      bg: "bg-purple-500",
      bgHover: "hover:bg-purple-400",
      border: "border-purple-400",
      outlinedHover: "hover:bg-purple-600",
    },
    yellow: {
      bg: "bg-yellow-500",
      bgHover: "hover:bg-yellow-400",
      border: "border-yellow-400",
      outlinedHover: "hover:bg-yellow-600",
    },
  };

  // Size classes
  const sizeClasses =
    size === "small" ? "p-1 rounded-md text-sm" : "p-2 rounded-xl";

  // Join classes
  const joinClasses = `
    ${joinLeft ? "rounded-l-none" : ""} 
    ${joinRight ? "rounded-r-none" : ""}
  `;

  // Get the appropriate colors based on state
  const { bg, bgHover, border, outlinedHover } = colorClasses[color];

  let bgClasses = "";
  if (selected) {
    bgClasses = `${bg} ${bgHover}`;
  } else if (filled) {
    bgClasses = disabled ? "bg-gray-700" : `${bg} ${disabled ? "" : bgHover}`;
  } else {
    bgClasses = disabled
      ? "hover:bg-gray-700 border border-gray-400"
      : `border ${border} ${outlinedHover}`;
  }

  // Cursor classes
  const cursorClasses = disabled ? "cursor-not-allowed" : "cursor-pointer";

  return (
    <button
      aria-disabled={disabled}
      className={`
        relative text-white grow flex justify-center items-center outline-none
        ${sizeClasses}
        ${joinClasses}
        ${bgClasses}
        ${cursorClasses}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
