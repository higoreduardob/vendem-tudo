import { create } from 'zustand'

import { FilterStatus } from '@/constants'

type FilterAdditionalState = {
  status: string
  onChangeStatus: (status: string) => void
}

export const useFilterAdditional = create<FilterAdditionalState>((set) => ({
  status: FilterStatus[0].value,
  onChangeStatus: (status) => set({ status }),
}))
