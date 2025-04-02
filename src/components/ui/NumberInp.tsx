import React, { useState, useEffect } from "react";

export default function NumberInp({
  max,
  min,
  def,
  steps,
  onChange,
}: {
  max: number;
  min: number;
  def: number;
  steps: number;
  onChange?: (value: number) => void;
}) {
  const [value, setValue] = useState(def);

  useEffect(() => {
    setValue(def);
  }, [def]);

  const increment = () => {
    if (value < max) {
      const newValue = Math.min(max, value + steps);
      setValue(newValue);
      onChange?.(newValue);
    }
  };

  const decrement = () => {
    if (value > min) {
      const newValue = Math.max(min, value - steps);
      setValue(newValue);
      onChange?.(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const newValue = parseInt(inputValue);
    
    if (!isNaN(newValue)) {
      const clampedValue = Math.max(min, Math.min(max, newValue));
      setValue(clampedValue);
      onChange?.(clampedValue);
    } else if (inputValue === '') {
      setValue(min);
      onChange?.(min);
    }
  };

  return (
    <div className="max-w-xs mx-auto">
      <div className="relative flex items-center justify-around gap-1 max-w-[8rem]">
        <button
          type="button"
          onClick={decrement}
          className=""
          style={{
            borderRadius: "10px",
            border: "1px solid var(--borderCol)",
            padding: 10,
            cursor: "pointer",
          }}
        >
          <svg
            className="w-3 h-3 text-gray-900 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 2"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h16"
            />
          </svg>
        </button>
        <input
          type="text"
          id="quantity-input"
          value={value}
          onChange={handleInputChange}
          className="rounded-[10px] p-2.5 cursor-pointer w-10 text-center focus:outline-none h-9"
          style={{ border: "1px solid var(--borderCol)" }}
          required
        />
        <button
          type="button"
          onClick={increment}
          className=""
          style={{
            borderRadius: "10px",
            border: "1px solid var(--borderCol)",
            padding: 10,
            cursor: "pointer",
          }}
        >
          <svg
            className="w-3 h-3 text-gray-900 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 18"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 1v16M1 9h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
