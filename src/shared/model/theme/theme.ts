// id, label, icon, bg are used in settings to display theme options
// variables are used to apply theme to the app
export interface ThemeDefinition {
  id: string;
  label: string;
  icon: React.ReactNode;
  bg: string;
  variables?: Partial<Record<(typeof THEME_VARIABLE_KEYS)[number], string>>;
}

export const THEME_VARIABLE_KEYS = [
  "--background",
  "--foreground",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--destructive",
  "--border",
  "--input",
  "--ring",
  "--info",
  "--info-foreground",
  "--warning",
  "--warning-foreground",
  "--success",
  "--success-foreground",
  "background-image",
  "background-size",
] as const;
