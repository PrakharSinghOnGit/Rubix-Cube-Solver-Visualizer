import { useState } from "react";

export default function SliderInp({
  min,
  max,
  def,
  steps,
}: {
  min: number;
  max: number;
  def?: number;
  steps?: number;
}) {
  const [value, setValue] = useState(def || 0);

  function handleValue(newValue: number) {
    window.localStorage.setItem("anim", newValue.toString());
    setValue(newValue);
  }

  return (
    <>
      <div
        className="grow h-11.5 rounded-[15px] p-2.5 flex items-center"
        style={{
          width: "calc(100% - 80px)",
          border: "1px solid var(--borderCol)",
        }}
      >
        <input
          className="cursor-pointer w-full"
          type="range"
          min={min}
          max={max}
          defaultValue={def || 0}
          step={steps || 1}
          onChange={(e) => handleValue(parseInt(e.target.value))}
        ></input>
      </div>
      <div
        style={{
          border: "1px solid var(--borderCol)",
        }}
        className="focus:outline-none rounded-[15px] min-w-20 p-2.5"
      >
        {value} ms
      </div>
    </>
  );
}
