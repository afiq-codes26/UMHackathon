import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function mapToStockItem(item: any) {
  // Logic: Max stock is 5x the reorder level
  const maxStock = item.reorderLevel * 5
  const pct = item.quantity / maxStock

  // Define Risk Level based on percentage of "Full" capacity
  let riskLevel: 'high' | 'medium' | 'low' = 'low'
  if (pct <= 0.2 || item.quantity <= item.reorderLevel) {
    riskLevel = 'high' // Critical
  } else if (pct <= 0.5) {
    riskLevel = 'medium' // Warning
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
    vendor: item.vendor?.name ?? 'Unknown',
    lastRestocked: item.lastRestocked?.toISOString() ?? null,
  }
}

export async function GET() {
  try {
    const stocks = await prisma.stock.findMany({
      orderBy: { name: 'asc' },
      include: { vendor: true },
    })
    return NextResponse.json(stocks.map(mapToStockItem))
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
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
      include: { vendor: true },
    })

    return NextResponse.json(mapToStockItem(stock), { status: 201 })
  } catch (error) {
    console.error('[POST /api/stock]', error)
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
      include: { vendor: true },
    })

    return NextResponse.json(mapToStockItem(updated))
  } catch (error) {
    console.error('[PATCH /api/stock]', error)
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 })
  }
}

// ─── DELETE /api/stock ────────────────────────────────────────────────────────
// Body: { id: string }
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    await prisma.stock.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/stock]', error)
    return NextResponse.json({ error: 'Failed to delete stock item' }, { status: 500 })
  }
}