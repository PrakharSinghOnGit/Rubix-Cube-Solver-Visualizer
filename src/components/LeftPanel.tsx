import React from "react";
import styles from "../App.module.css";
import "./Panel.css";

export default function LeftPanel() {
  return (
    <div className={`${styles.panal} ${styles.leftPan}`}>
      <h1 className="title">Rubix Cube Solver</h1>
    </div>
  );
}
