import React from "react";

export function useContainerViewport({ id }: { id: string }) {
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    const container = document.getElementById(id);
    if (!container) return;
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      setWidth(entry.contentRect.width);
      setHeight(entry.contentRect.height);
    });
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [id]);

  return { width, height };
}
