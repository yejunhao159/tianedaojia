import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BUILT_IN_TEMPLATES, validateTemplateImport, type PromptTemplate } from "@/lib/templates";

interface TemplateState {
  customTemplates: PromptTemplate[];
  activeTemplateId: string | null;

  getAllTemplates: () => PromptTemplate[];
  getTemplatesByCategory: (cat: PromptTemplate["category"]) => PromptTemplate[];
  getActiveTemplate: () => PromptTemplate | null;

  setActiveTemplate: (id: string | null) => void;
  importTemplate: (data: unknown) => { success: boolean; error?: string };
  importTemplateFromJSON: (json: string) => { success: boolean; error?: string };
  removeCustomTemplate: (id: string) => void;
}

export const useTemplateStore = create<TemplateState>()(
  persist(
    (set, get) => ({
      customTemplates: [],
      activeTemplateId: null,

      getAllTemplates: () => [...BUILT_IN_TEMPLATES, ...get().customTemplates],

      getTemplatesByCategory: (cat) =>
        get().getAllTemplates().filter((t) => t.category === cat),

      getActiveTemplate: () => {
        const { activeTemplateId } = get();
        if (!activeTemplateId) return null;
        return get().getAllTemplates().find((t) => t.id === activeTemplateId) ?? null;
      },

      setActiveTemplate: (id) => set({ activeTemplateId: id }),

      importTemplate: (data) => {
        const result = validateTemplateImport(data);
        if (!result.valid || !result.template) {
          return { success: false, error: result.error };
        }
        set((s) => ({ customTemplates: [...s.customTemplates, result.template!] }));
        return { success: true };
      },

      importTemplateFromJSON: (json) => {
        try {
          const data = JSON.parse(json);
          return get().importTemplate(data);
        } catch {
          return { success: false, error: "JSON 解析失败，请检查格式" };
        }
      },

      removeCustomTemplate: (id) =>
        set((s) => ({
          customTemplates: s.customTemplates.filter((t) => t.id !== id),
          activeTemplateId: s.activeTemplateId === id ? null : s.activeTemplateId,
        })),
    }),
    {
      name: "tianedaojia-templates",
      partialize: (s) => ({
        customTemplates: s.customTemplates,
        activeTemplateId: s.activeTemplateId,
      }),
    }
  )
);
