import { create } from 'zustand'

type FilterOptionState = {
  status?: string
  onChangeStatus: (status: string) => void
}

export const useFilterOption = create<FilterOptionState>((set) => ({
  status: undefined,
  onChangeStatus: (status) => set({ status }),
}))
