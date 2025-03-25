import { create } from 'zustand'

type FilterOrderState = {
  from?: string
  to?: string
  status?: string

  onChangeFilterDate: (from: string, to: string) => void
  onClearFilterDate: () => void
  onChangeStatus: (status: string) => void
}

export const useFilterOrder = create<FilterOrderState>((set) => ({
  from: undefined,
  to: undefined,
  status: undefined,

  onChangeFilterDate: (from: string, to: string) =>
    set((state) => ({ ...state, from, to })),
  onClearFilterDate: () =>
    set((state) => ({ ...state, from: undefined, to: undefined })),
  onChangeStatus: (status) => set((state) => ({ ...state, status })),
}))
