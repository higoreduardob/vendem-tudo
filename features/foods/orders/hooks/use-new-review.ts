import { create } from 'zustand'

type NewReviewState = {
  id?: string
  itemId?: string
  isOpen: boolean
  onOpen: (id: string, itemId: string) => void
  onClose: () => void
}

export const useNewReview = create<NewReviewState>((set) => ({
  id: undefined,
  itemId: undefined,
  isOpen: false,
  onOpen: (id: string, itemId: string) => set({ isOpen: true, id, itemId }),
  onClose: () => set({ isOpen: false, id: undefined, itemId: undefined }),
}))
