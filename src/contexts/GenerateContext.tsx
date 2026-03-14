"use client";

/**
 * @deprecated Use useGenerateStore from @/stores/generateStore directly.
 * This file is kept for backward compatibility during migration.
 */

import { type ReactNode } from "react";
import { useGenerateStore } from "@/stores/generateStore";

export function GenerateProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useGenerate() {
  return useGenerateStore();
}
