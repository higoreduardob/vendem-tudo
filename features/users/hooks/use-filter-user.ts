import { create } from 'zustand'

import { FilterStatus } from '@/constants'
import { UserRole } from '@prisma/client'

type FilterUserState = {
  status: string
  role?: UserRole
  onChange: (status?: string, role?: UserRole) => void
}

export const useFilterUser = create<FilterUserState>((set) => ({
  status: FilterStatus[0].value,
  role: undefined,
  onChange: (status, role) => set({ status, role }),
}))
