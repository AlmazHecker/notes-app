const divider = document.getElementById("divider");
const leftPane = document.getElementById("noteList");
const rightPane = document.getElementById("currentNote");

function enableTransitions() {
  leftPane.classList.add("transition-all", "duration-300", "ease-in-out");
  rightPane.classList.add("transition-all", "duration-300", "ease-in-out");
  divider.classList.add("transition-opacity", "duration-300");
}

function disableTransitions() {
  leftPane.classList.remove("transition-all", "duration-300", "ease-in-out");
  rightPane.classList.remove("transition-all", "duration-300", "ease-in-out");
  divider.classList.remove("transition-opacity", "duration-300");
}

enableTransitions();

let isDragging = false;

divider.addEventListener("mousedown", () => {
  isDragging = true;
  document.body.style.cursor = "col-resize";

  disableTransitions();
});

document.addEventListener("mouseup", () => {
  if (isDragging) {
    isDragging = false;
    document.body.style.cursor = "default";

    enableTransitions();
  }
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const newWidth = e.clientX;
  if (newWidth > 150 && newWidth < window.innerWidth * 0.8) {
    leftPane.style.width = `${newWidth}px`;
  }
});
