export default function ResizeHandle({
  vertical = false,
}: {
  vertical?: boolean;
}) {
  return (
    <div
      className={`bg-gray-600 ${vertical ? "w-8 h-0.5" : "w-0.5 h-8"}`}
    ></div>
  );
}
