import { create } from 'zustand'

import { FilterStatus } from '@/constants'

type FilterFoodState = {
  status: string
  onChangeStatus: (status: string) => void
}

export const useFilterFood = create<FilterFoodState>((set) => ({
  status: FilterStatus[0].value,
  onChangeStatus: (status) => set({ status }),
}))
