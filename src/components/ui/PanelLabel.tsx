export default function PanelLabel({
  title,
  left = false,
}: {
  title: string;
  left?: boolean;
}) {
  return (
    <div
      style={{
        borderTop: "1px solid var(--frontground)",
        borderLeft: "1px solid var(--frontground)",
        backgroundColor: "var(--background)",
      }}
      className={
        "absolute top-0 left-0 p-2.5 rounded-br-[15px] rounded-tl-[15px] font-bold" +
        (left ? " rounded-tl-none" : "")
      }
    >
      <h3>{title}</h3>
    </div>
  );
}
