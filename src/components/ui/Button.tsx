import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "contained" | "outlined" | "text";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export default function Button({
  children,
  variant = "contained",
  className = "",
  onClick,
  disabled = false,
  startIcon,
  endIcon,
}: ButtonProps) {
  const baseStyles =
    "px-4 py-2 rounded font-medium focus:outline-none transition-colors duration-200 flex items-center justify-center";

  let variantStyles = "";
  if (variant === "contained") {
    variantStyles =
      "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300";
  } else if (variant === "outlined") {
    variantStyles =
      "border border-blue-500 text-blue-500 hover:bg-blue-50 disabled:border-gray-300 disabled:text-gray-300";
  } else {
    variantStyles = "text-blue-500 hover:bg-blue-50 disabled:text-gray-300";
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className} ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="mr-2">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-2">{endIcon}</span>}
    </button>
  );
}
