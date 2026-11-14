export type Language = "en" | "ar";
export type Direction = "ltr" | "rtl";

export type NavItemId = "home" | "works" | "services" | "skills" | "contact";

export interface NavItem {
  id: NavItemId;
  href: string;
}

export interface DesignerProfile {
  name: string;
  role: string;
}

export type TranslationValue = string | { [key: string]: TranslationValue };
export type TranslationDict = Record<string, TranslationValue>;
