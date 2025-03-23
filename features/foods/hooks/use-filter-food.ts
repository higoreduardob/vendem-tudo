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

type SearchFoodState = {
  categoryId?: string
  search?: string
  onChange: (categoryId?: string, search?: string) => void
  clear: () => void
}

export const useSearchFood = create<SearchFoodState>((set) => ({
  categoryId: undefined,
  search: undefined,
  onChange: (categoryId?: string, search?: string) =>
    set({ categoryId, search }),
  clear: () => set({ search: undefined, categoryId: undefined }),
}))
