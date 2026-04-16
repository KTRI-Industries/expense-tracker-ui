// Shared theme metadata used by both the main Angular app and the Keycloak
// theme app so they stay aligned on naming, persistence, and defaults.
export const UI_THEMES = ['navy', 'slate', 'terracotta'] as const;

export type UiTheme = (typeof UI_THEMES)[number];

export const DEFAULT_UI_THEME: UiTheme = 'navy';
export const UI_THEME_ATTRIBUTE = 'data-theme';
export const UI_THEME_STORAGE_KEY = 'expense-tracker-ui-theme';

export function isUiTheme(value: string | null | undefined): value is UiTheme {
  return (
    typeof value === 'string' &&
    (UI_THEMES as readonly string[]).includes(value)
  );
}
