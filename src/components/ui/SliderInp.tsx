export default function SliderInp({
  min,
  max,
  def,
  steps,
  label,
  onChange,
}: {
  min: number;
  max: number;
  def: number;
  steps: number;
  label: string;
  onChange?: (value: number) => void;
}) {
  return (
    <div>
      <label
        htmlFor="minmax-range"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <input
        id="minmax-range"
        type="range"
        min={min}
        max={max}
        defaultValue={def}
        size={steps}
        onChange={() => onChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
    </div>
  );
}
