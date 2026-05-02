// FILE: frontend/src/store/uiStore.js
import { create } from 'zustand'

export const useUIStore = create((set) => ({
  sidebarCollapsed: false,
  activeModal: null,
  modalData: null,
  toasts: [],
  isSyncing: false,

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),

  openModal: (modalName, data = null) => set({ activeModal: modalName, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  addToast: (toast) =>
    set((s) => ({
      toasts: [...s.toasts, { id: Date.now(), ...toast }],
    })),
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  setIsSyncing: (isSyncing) => set({ isSyncing }),
}))
