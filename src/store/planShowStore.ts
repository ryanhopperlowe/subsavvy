import { create } from "zustand";

import { Identifier } from "@/model";

interface PlanShowStore {
  updatedPlan: Identifier | null;
  updatedBillOption: Identifier | null;
  setUpdatedPlan: (id: Identifier | null) => void;
  setUpdatedBillOption: (id: Identifier | null) => void;
  clear: () => void;
}

export const usePlanShowStore = create<PlanShowStore>()((set) => ({
  updatedPlan: null,
  updatedBillOption: null,
  setUpdatedPlan: (id) => set({ updatedPlan: id }),
  setUpdatedBillOption: (id) => set({ updatedBillOption: id }),
  clear: () => set({ updatedPlan: null, updatedBillOption: null }),
}));
