import { useEffect } from "react";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";

export const LAYOUT_SELECTORS = {
  divider: "divider",
  left: "noteList",
  right: "currentNote",
};

export default function DraggableLayout() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (isMobile) return;

    const divider = document.getElementById(LAYOUT_SELECTORS.divider)!;
    const leftPane = document.getElementById(LAYOUT_SELECTORS.left)!;
    const rightPane = document.getElementById(LAYOUT_SELECTORS.right)!;

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

        divider.classList.add("dark:bg-border");
        divider.classList.remove("bg-zinc-300");

        enableTransitions();
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      divider.classList.remove("dark:bg-border");
      divider.classList.add("bg-zinc-300");

      // divider.style.background = "blue";
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
  }, [isMobile]);

  return null;
}
