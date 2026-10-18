// Keep this script synchronous: the saved palette must apply before first paint.
(() => {
  let theme = "system";
  try {
    theme = localStorage.getItem("theme") || theme;
  } catch {
    // Use the system theme when browser storage is unavailable.
  }

  if (!["light", "dark", "forest", "cyberpunk"].includes(theme)) {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  document.documentElement.dataset.theme = theme;

  const hash = location.hash.replace(/^#/, "");
  if (new URL(hash || "/", location.origin).searchParams.has("noteId")) {
    document.documentElement.dataset.startupNote = "";
  }
  if (hash.split("?")[0] === "/settings") {
    document.documentElement.dataset.startupSettings = "";
  }

  try {
    const fontSize = Number(localStorage.getItem("fontSize") || "3");
    const scale = [0.75, 0.875, 1, 1.125, 1.25][fontSize - 1];
    if (scale) document.documentElement.style.fontSize = `${scale}rem`;
  } catch {
    // Keep the default size when browser storage is unavailable.
  }
})();
