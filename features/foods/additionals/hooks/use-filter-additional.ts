import { create } from 'zustand'

type FilterAdditionalState = {
  status?: string
  onChangeStatus: (status: string) => void
}

export const useFilterAdditional = create<FilterAdditionalState>((set) => ({
  status: undefined,
  onChangeStatus: (status) => set({ status }),
}))
