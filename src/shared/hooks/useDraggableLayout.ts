import { useEffect } from "react";

export const LAYOUT_SELECTORS = {
  divider: "divider",
  left: "noteList",
  right: "currentNote",
};

export default function useDraggableLayout() {
  useEffect(() => {
    const divider = document.getElementById(LAYOUT_SELECTORS.divider);
    const leftPane = document.getElementById(LAYOUT_SELECTORS.left);
    const rightPane = document.getElementById(LAYOUT_SELECTORS.right);

    if (!divider || !leftPane || !rightPane) return;

    function enableTransitions() {
      leftPane.classList.add("transition-all", "duration-300", "ease-in-out");
      rightPane.classList.add("transition-all", "duration-300", "ease-in-out");
      divider.classList.add("transition-opacity", "duration-300");
    }

    function disableTransitions() {
      leftPane.classList.remove(
        "transition-all",
        "duration-300",
        "ease-in-out"
      );
      rightPane.classList.remove(
        "transition-all",
        "duration-300",
        "ease-in-out"
      );
      divider.classList.remove("transition-opacity", "duration-300");
    }

    enableTransitions();

    let isDragging = false;

    const onMouseDown = () => {
      isDragging = true;
      document.body.style.cursor = "col-resize";
      disableTransitions();
    };

    const onMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.cursor = "default";
        enableTransitions();
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newWidth = e.clientX;
      if (newWidth > 150 && newWidth < window.innerWidth * 0.8) {
        leftPane.style.width = `${newWidth}px`;
      }
    };

    divider.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);

    return () => {
      divider.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return null;
}
