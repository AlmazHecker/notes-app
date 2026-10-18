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
})();
