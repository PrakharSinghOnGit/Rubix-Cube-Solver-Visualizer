import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
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
  children,
  onClick,
  disabled = false,
  className = "",
  joinRight = false,
  joinLeft = false,
  selected = false,
  filled = false,
}: ButtonProps) {
  return (
    <button
      className={`
    relative text-white p-2 grow flex justify-center items-center cursor-pointer outline-none rounded-[15px] 
     ${joinLeft ? "rounded-l-none" : ""}
      ${disabled ? "cursor-not-allowed" : "cursor-pointer"} 
      ${joinRight ? "rounded-r-none" : ""}
      ${selected ? "bg-blue-500 hover:bg-blue-400" : " hover:bg-blue-600"}
      ${filled ? "bg-blue-500" : "border-blue-400 border-1"}
    ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
