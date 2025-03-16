import React, { ChangeEvent } from "react";

interface SwitchProps {
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}

export default function Switch({
  checked = false,
  onChange,
  disabled = false,
  className = "",
}: SwitchProps) {
  return (
    <label className={`relative inline-block h-6 w-11 ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="opacity-0 w-0 h-0"
      />
      <span
        className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-200 ${
          checked ? "bg-blue-500" : "bg-gray-300"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span
          className={`absolute h-5 w-5 rounded-full bg-white transition-transform duration-200 transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          } top-0.5 left-0`}
        ></span>
      </span>
    </label>
  );
}
