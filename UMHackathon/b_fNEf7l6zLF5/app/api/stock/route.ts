// app/api/stock/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function mapToStockItem(item: any) {
  const maxStock = item.reorderLevel * 5
  const pct = item.quantity / maxStock

  let riskLevel: 'high' | 'medium' | 'low' = 'low'
  if (pct <= 0.2 || item.quantity <= item.reorderLevel) {
    riskLevel = 'high'
  } else if (pct <= 0.5) {
    riskLevel = 'medium'
  }

  return {
    id: item.id,
    name: item.name,
    currentStock: item.quantity,
    minStock: item.reorderLevel,
    maxStock,
    unit: item.unit,
    category: item.category ?? 'general',
    riskLevel,
    isLowStock: item.quantity <= item.reorderLevel,
    // vendor relation may not exist in generated client yet — safe fallback
    vendor: item.vendor?.name ?? 'Unknown',
    lastRestocked: item.lastRestocked?.toISOString() ?? null,
  }
}

// ─── GET /api/stock ───────────────────────────────────────────────────────────
export async function GET() {
  try {
    // Try with vendor relation first; fall back if client not regenerated yet
    let stocks: any[]
    try {
      stocks = await prisma.stock.findMany({
        orderBy: { name: 'asc' },
        include: { vendor: true },
      })
    } catch {
      // Prisma client hasn't been regenerated after adding vendor relation.
      // Run `npx prisma generate` to fix permanently.
      stocks = await prisma.stock.findMany({
        orderBy: { name: 'asc' },
      })
    }

    return NextResponse.json(stocks.map(mapToStockItem))
  } catch (error: any) {
    console.error('[GET /api/stock]', error?.message ?? error)
    return NextResponse.json(
      { error: 'Failed to fetch stock', details: error?.message },
      { status: 500 }
    )
  }
}

// ─── POST /api/stock ──────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, quantity, unit, category, reorderLevel, vendorId } = body

    if (!name || quantity === undefined || !unit) {
      return NextResponse.json(
        { error: 'name, quantity, and unit are required' },
        { status: 400 }
      )
    }

    const stock = await prisma.stock.create({
      data: {
        name,
        quantity: parseInt(quantity),
        unit,
        category: category ?? 'general',
        reorderLevel: reorderLevel ? parseInt(reorderLevel) : 10,
        lastRestocked: new Date(),
        ...(vendorId ? { vendorId } : {}),
      },
    })

    return NextResponse.json(mapToStockItem(stock), { status: 201 })
  } catch (error: any) {
    console.error('[POST /api/stock]', error?.message ?? error)
    return NextResponse.json({ error: 'Failed to create stock item' }, { status: 500 })
  }
}

// ─── PATCH /api/stock ─────────────────────────────────────────────────────────
// Body: { id: string, quantity: number, action: "add" | "subtract" | "set" }
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, quantity, action } = body

    if (!id || quantity === undefined || !action) {
      return NextResponse.json(
        { error: 'id, quantity, and action are required' },
        { status: 400 }
      )
    }

    const current = await prisma.stock.findUnique({ where: { id } })
    if (!current) {
      return NextResponse.json({ error: 'Stock item not found' }, { status: 404 })
    }

    const qty = parseInt(quantity)
    let newQuantity: number

    switch (action) {
      case 'add':
        newQuantity = current.quantity + qty
        break
      case 'subtract':
        newQuantity = Math.max(0, current.quantity - qty)
        break
      case 'set':
        newQuantity = Math.max(0, qty)
        break
      default:
        return NextResponse.json(
          { error: 'action must be "add", "subtract", or "set"' },
          { status: 400 }
        )
    }

    const updated = await prisma.stock.update({
      where: { id },
      data: {
        quantity: newQuantity,
        lastRestocked: action === 'add' ? new Date() : current.lastRestocked,
      },
    })

    return NextResponse.json(mapToStockItem(updated))
  } catch (error: any) {
    console.error('[PATCH /api/stock]', error?.message ?? error)
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 })
  }
}

// ─── DELETE /api/stock ────────────────────────────────────────────────────────
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }
    await prisma.stock.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[DELETE /api/stock]', error?.message ?? error)
    return NextResponse.json({ error: 'Failed to delete stock item' }, { status: 500 })
  }
}