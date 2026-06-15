import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create(
  persist(
    (set) => ({
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setDarkMode: (val) => set({ darkMode: val }),
    }),
    { name: 'theme-storage' }
  )
)

export default useThemeStore