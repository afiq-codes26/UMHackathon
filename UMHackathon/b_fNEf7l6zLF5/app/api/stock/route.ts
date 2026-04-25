import { NextRequest, NextResponse } from 'next/server'
import { updateStock, getStore } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest) {
  const { id, delta } = await req.json()
  if (!id || typeof delta !== 'number') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  updateStock(id, delta)
  return NextResponse.json({ stockItems: getStore().stockItems, metrics: getStore().metrics })
}