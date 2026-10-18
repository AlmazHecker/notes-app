// id, label, icon, bg are used in settings to display theme options
// Theme palettes live in src/styles/themes.css so they apply before React starts.
export interface ThemeDefinition {
  id: string;
  label: string;
  icon: React.ReactNode;
  bg: string;
}
