import { ReactNode } from "react";

interface ButtonProps {
  size?: "small" | "medium";
  children: ReactNode;
  mainColor?: string;
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
  mainColor = "blue",
  disabled = false,
  className = "",
  joinRight = false,
  joinLeft = false,
  selected = false,
  filled = false,
}: ButtonProps) {
  return (
    <button
      aria-disabled={disabled}
      className={`
    relative text-white grow flex justify-center items-center cursor-pointer outline-none border-1
     ${size === "small" ? "p-1 rounded-[5px] text-sm" : "p-2 rounded-[15px]"}
     ${joinLeft ? "rounded-l-none" : ""}
     ${joinRight ? "rounded-r-none" : ""}
     ${selected ? `bg-${mainColor}-500 hover:bg-${mainColor}-400` : ``}
     ${
       filled
         ? disabled
           ? "bg-gray-700"
           : `bg-${mainColor}-500`
         : disabled
         ? "hover:bg-gray-700 border-gray-400"
         : `border-${mainColor}-400 hover:bg-${mainColor}-600`
     }
     ${disabled ? "cursor-not-allowed" : "cursor-pointer"} 
     ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
