import React from "react";
import styles from "./Util.module.css";
export default function PanelLabel({
  title,
  left = false,
}: {
  title: string;
  left?: boolean;
}) {
  return (
    <div
      style={left ? { borderRadius: "0 0 var(--borderRadius) 0" } : {}}
      className={styles.PanelLabel}
    >
      <h3>{title}</h3>
    </div>
  );
}
