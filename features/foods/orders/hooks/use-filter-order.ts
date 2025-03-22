import { create } from 'zustand'

import { FilterStatus } from '@/constants'

type FilterOrderState = {
  status: string
  onChangeStatus: (status: string) => void
}

export const useFilterOrder = create<FilterOrderState>((set) => ({
  status: FilterStatus[0].value,
  onChangeStatus: (status) => set({ status }),
}))
