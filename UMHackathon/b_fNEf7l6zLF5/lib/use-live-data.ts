'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { StockItem, Vendor, Transaction, MenuItem, WasteRecord } from './mock-data'

export interface LiveData {
  stockItems: StockItem[]
  vendors: Vendor[]
  transactions: Transaction[]
  menuItems: MenuItem[]
  wasteRecords: WasteRecord[]
  metrics: {
    todaySales: number
    yesterdaySales: number
    weeklyAverage: number
    monthlyTotal: number
    totalTransactions: number
    averageOrderValue: number
    topSellingItem: string
    lowStockAlerts: number
    wasteThisWeek: number
    predictedRushTime: string
    activeVendors: number
    pendingOrders: number
  }
  salesData: { date: string; sales: number; orders: number }[]
  lastUpdated: string
}

export function useLiveData(pollInterval = 15000) {
  const [data, setData] = useState<LiveData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const lastUpdated = useRef<string | null>(null)

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setIsRefreshing(true)
    try {
      const res = await fetch('/api/data', { cache: 'no-store' })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const json: LiveData = await res.json()
      if (json.lastUpdated !== lastUpdated.current) {
        lastUpdated.current = json.lastUpdated
        setData(json)
      }
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => { fetchData(false) }, [fetchData])

  useEffect(() => {
    const interval = setInterval(() => fetchData(true), pollInterval)
    return () => clearInterval(interval)
  }, [fetchData, pollInterval])

  return { data, loading, error, isRefreshing, refresh: () => fetchData(false) }
}