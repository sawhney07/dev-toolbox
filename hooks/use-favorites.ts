"use client"

import { useState, useEffect, useCallback } from "react"

const FAVORITES_KEY = "devtoolbox-favorites"
const RECENT_KEY = "devtoolbox-recent"
const MAX_RECENT = 10

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY)
    if (stored) {
      try {
        setFavorites(JSON.parse(stored))
      } catch {
        setFavorites([])
      }
    }
    setIsLoaded(true)
  }, [])

  const toggleFavorite = useCallback((toolId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId]
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites))
      return newFavorites
    })
  }, [])

  const isFavorite = useCallback(
    (toolId: string) => favorites.includes(toolId),
    [favorites]
  )

  return { favorites, toggleFavorite, isFavorite, isLoaded }
}

export function useRecentTools() {
  const [recent, setRecent] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_KEY)
    if (stored) {
      try {
        setRecent(JSON.parse(stored))
      } catch {
        setRecent([])
      }
    }
    setIsLoaded(true)
  }, [])

  const addRecent = useCallback((toolId: string) => {
    setRecent((prev) => {
      const filtered = prev.filter((id) => id !== toolId)
      const newRecent = [toolId, ...filtered].slice(0, MAX_RECENT)
      localStorage.setItem(RECENT_KEY, JSON.stringify(newRecent))
      return newRecent
    })
  }, [])

  return { recent, addRecent, isLoaded }
}
