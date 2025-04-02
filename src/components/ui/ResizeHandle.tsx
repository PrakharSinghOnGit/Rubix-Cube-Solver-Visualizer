import styles from "./Util.module.css";

export default function ResizeHandle({
  vertical = false,
}: {
  vertical?: boolean;
}) {
  return (
    <div
      className={`${styles.resizeHandle} ${vertical ? styles.vertical : ""}`}
    ></div>
  );
}
