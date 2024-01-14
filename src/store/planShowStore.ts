import { create } from "zustand";

import { BillOption, Identifier } from "@/model";

interface PlanShowStore {
  updatedPlan: Identifier | null;
  updatedBillOption: Identifier | null;
  addedBillOption: BillOption | null;
  setUpdatedPlan: (id: Identifier | null) => void;
  setUpdatedBillOption: (id: Identifier | null) => void;
  setAddedBillOption: (billOption: BillOption) => void;
  clear: () => void;
  isPlanLoading: (id: Identifier) => boolean;
  isBillOptionLoading: (id: Identifier) => boolean;
  isLoading: () => boolean;
}

export const usePlanShowStore = create<PlanShowStore>()((set, get) => ({
  updatedPlan: null,
  updatedBillOption: null,
  addedBillOption: null,

  setUpdatedPlan: (id) => set({ updatedPlan: id }),
  setUpdatedBillOption: (id) => set({ updatedBillOption: id }),
  setAddedBillOption: (billOption) =>
    set({ addedBillOption: billOption, updatedBillOption: billOption?.id }),
  clear: () =>
    set({ updatedPlan: null, updatedBillOption: null, addedBillOption: null }),

  isPlanLoading: (id) => get().updatedPlan === id,
  isBillOptionLoading: (id) => get().updatedBillOption === id,
  isLoading: () => !!get().updatedPlan || !!get().updatedBillOption,
}));

export function usePlanLoadState(id: Identifier) {
  return usePlanShowStore((state) => ({
    isLoading: state.isPlanLoading(id),
    initiateLoading: () => state.setUpdatedPlan(id),
    cancelLoading: () => state.setUpdatedPlan(null),
    addBillOption: state.setAddedBillOption,
    addedBillOption: state.addedBillOption,
  }));
}

export function useBillOptionLoadState(id: Identifier) {
  return usePlanShowStore((state) => ({
    isLoading: state.isBillOptionLoading(id),
    initiateLoading: () => state.setUpdatedBillOption(id),
    cancelLoading: () => state.setUpdatedBillOption(null),
  }));
}
