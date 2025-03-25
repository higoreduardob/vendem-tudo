import { create } from 'zustand'

import { UserRole } from '@prisma/client'

type FilterUserState = {
  status?: string
  role?: UserRole
  onChange: (status?: string, role?: UserRole) => void
}

export const useFilterUser = create<FilterUserState>((set) => ({
  status: undefined,
  role: undefined,
  onChange: (status, role) => set({ status, role }),
}))
