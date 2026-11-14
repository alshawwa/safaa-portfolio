/**
 * Content access layer.
 * Currently returns local mock data. Replace implementations with Laravel
 * REST calls later (GET /api/v1/home, /projects, /services, /about, etc.).
 */
import { designer, NAV_ITEMS } from "@/data/designer";
import type { DesignerProfile, NavItem } from "@/types";

export async function getDesigner(): Promise<DesignerProfile> {
  return designer;
}

export async function getNavItems(): Promise<NavItem[]> {
  return [...NAV_ITEMS];
}
