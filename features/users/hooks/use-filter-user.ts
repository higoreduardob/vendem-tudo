import { create } from 'zustand'

import { FilterStatus } from '@/constants'

type FilterUserState = {
  status: string
  onChangeStatus: (status: string) => void
}

export const useFilterUser = create<FilterUserState>((set) => ({
  status: FilterStatus[0].value,
  onChangeStatus: (status) => set({ status }),
}))
