import { useCallback } from 'react'
import useAuthStore from '../store/useAuthStore'
import axios from 'axios'

const BASE = 'http://127.0.0.1:8000/api'

export default function useProgress() {
  const { isAuthenticated, accessToken } = useAuthStore()

  const trackProgress = useCallback(async (category, topic, operation) => {
    if (!isAuthenticated) return
    try {
      await axios.post(
        `${BASE}/progress/update/`,
        {
          category,
          topic,
          operation,
          status:             'in_progress',
          time_spent_minutes: 1,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
    } catch (err) {
      console.log('Progress tracking failed silently')
    }
  }, [isAuthenticated, accessToken])

  const toggleBookmark = useCallback(async (topic, category, operation = '') => {
    if (!isAuthenticated) return { bookmarked: false, requiresLogin: true }
    try {
      const res = await axios.post(
        `${BASE}/bookmarks/toggle/`,
        { topic, category, operation },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      return { bookmarked: res.data.bookmarked, requiresLogin: false }
    } catch (err) {
      return { bookmarked: false, requiresLogin: false }
    }
  }, [isAuthenticated, accessToken])

  return { trackProgress, toggleBookmark }
}