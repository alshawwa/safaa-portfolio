import type { DesignerProfile } from "@/types";

export const designer: DesignerProfile = {
  name: "Safaa",
  role: "Graphic Designer",
};

export const NAV_ITEMS = [
  { id: "home", href: "#home" },
  { id: "works", href: "#works" },
  { id: "services", href: "#services" },
  { id: "skills", href: "#skills" },
] as const;
