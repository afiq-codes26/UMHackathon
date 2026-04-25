'use client'

import { createContext, useContext } from 'react'
import type { LiveData } from './use-live-data'

export const LiveDataContext = createContext<LiveData | null>(null)

export function useLiveDataContext() {
  return useContext(LiveDataContext)
}