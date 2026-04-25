import { NextResponse } from 'next/server'
import { getStore } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const store = getStore()
  return NextResponse.json({
    stockItems: store.stockItems,
    vendors: store.vendors,
    transactions: store.transactions.slice(0, 50),
    menuItems: store.menuItems,
    wasteRecords: store.wasteRecords,
    metrics: store.metrics,
    salesData: store.salesData,
    lastUpdated: store.lastUpdated,
  })
}
