import { create } from 'zustand'

const useDSAStore = create((set) => ({
  // Visualizer state
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 500,
  isLoading: false,

  // Actions
  setSteps: (steps) => set({ steps, currentStep: 0 }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setIsPlaying: (val) => set({ isPlaying: val }),
  setSpeed: (speed) => set({ speed }),
  setIsLoading: (val) => set({ isLoading: val }),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, state.steps.length - 1),
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 0),
    })),

  reset: () => set({ steps: [], currentStep: 0, isPlaying: false }),
}))

export default useDSAStore