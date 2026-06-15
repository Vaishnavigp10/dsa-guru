import { useState, useEffect, useRef, useCallback } from 'react'

export default function useVisualizer() {
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(600)
  const [isLoading, setIsLoading] = useState(false)
  const intervalRef = useRef(null)

  // Auto play logic
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, speed)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isPlaying, speed, steps.length])

  const play = useCallback(() => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0)
    }
    setIsPlaying(true)
  }, [currentStep, steps.length])

  const pause = useCallback(() => setIsPlaying(false), [])

  const reset = useCallback(() => {
    setIsPlaying(false)
    setCurrentStep(0)
  }, [])

  const nextStep = useCallback(() => {
    setIsPlaying(false)
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
  }, [steps.length])

  const prevStep = useCallback(() => {
    setIsPlaying(false)
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }, [])

  const loadSteps = useCallback((newSteps) => {
    setSteps(newSteps)
    setCurrentStep(0)
    setIsPlaying(false)
  }, [])

  const currentStepData = steps[currentStep] || null

  return {
    steps,
    currentStep,
    currentStepData,
    isPlaying,
    speed,
    isLoading,
    setSpeed,
    setIsLoading,
    play,
    pause,
    reset,
    nextStep,
    prevStep,
    loadSteps,
    totalSteps: steps.length,
    progress: steps.length > 0 ? (currentStep / (steps.length - 1)) * 100 : 0,
  }
}