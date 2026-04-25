import { NextResponse } from 'next/server'
import { getStore } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const store = getStore()
  return NextResponse.json({ transactions: store.transactions.slice(0, 50) })
}
