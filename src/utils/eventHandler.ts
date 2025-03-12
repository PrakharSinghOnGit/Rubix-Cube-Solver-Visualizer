export function handleResize(
  callback: () => void,
  parentRef?: React.RefObject<HTMLElement>
) {
  function updateSize() {
    if (parentRef?.current) {
      callback();
    }
  }

  window.addEventListener("resize", updateSize);

  return () => {
    window.removeEventListener("resize", updateSize);
  };
}

export function glowEdges(e: boolean) {}
