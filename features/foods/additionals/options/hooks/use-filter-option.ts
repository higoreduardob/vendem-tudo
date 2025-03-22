import { create } from 'zustand'

import { FilterStatus } from '@/constants'

type FilterOptionState = {
  status: string
  onChangeStatus: (status: string) => void
}

export const useFilterOption = create<FilterOptionState>((set) => ({
  status: FilterStatus[0].value,
  onChangeStatus: (status) => set({ status }),
}))
