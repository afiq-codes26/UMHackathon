/*import { NextRequest, NextResponse } from 'next/server'
import { updateStock, getStore } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest) {
  const { id, delta } = await req.json()
  if (!id || typeof delta !== 'number') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  updateStock(id, delta)
  return NextResponse.json({ stockItems: getStore().stockItems, metrics: getStore().metrics })
}*/

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
 
// GET /api/stock - Get all stock items
export async function GET() {
  try {
    const stock = await prisma.stock.findMany({
      orderBy: {
        name: 'asc',
      },
    })
 
    // Add low stock indicator
    const stockWithAlerts = stock.map(item => ({
      ...item,
      isLowStock: item.quantity <= item.reorderLevel,
    }))
 
    return NextResponse.json(stockWithAlerts)
  } catch (error) {
    console.error('Error fetching stock:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stock' },
      { status: 500 }
    )
  }
}
 
// POST /api/stock - Create a new stock item
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, quantity, unit, category, reorderLevel } = body
 
    if (!name || quantity === undefined || !unit) {
      return NextResponse.json(
        { error: 'Name, quantity, and unit are required' },
        { status: 400 }
      )
    }
 
    const stock = await prisma.stock.create({
      data: {
        name,
        quantity: parseInt(quantity),
        unit,
        category,
        reorderLevel: reorderLevel ? parseInt(reorderLevel) : 10,
        lastRestocked: new Date(),
      },
    })
 
    return NextResponse.json(stock, { status: 201 })
  } catch (error) {
    console.error('Error creating stock item:', error)
    return NextResponse.json(
      { error: 'Failed to create stock item' },
      { status: 500 }
    )
  }
}
 
// PATCH /api/stock - Update stock quantity
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, quantity, action } = body // action: "add" | "subtract" | "set"
 
    if (!id || quantity === undefined) {
      return NextResponse.json(
        { error: 'ID and quantity are required' },
        { status: 400 }
      )
    }
 
    const currentStock = await prisma.stock.findUnique({
      where: { id },
    })
 
    if (!currentStock) {
      return NextResponse.json(
        { error: 'Stock item not found' },
        { status: 404 }
      )
    }
 
    let newQuantity = parseInt(quantity)
    if (action === 'add') {
      newQuantity = currentStock.quantity + parseInt(quantity)
    } else if (action === 'subtract') {
      newQuantity = Math.max(0, currentStock.quantity - parseInt(quantity))
    }
 
    const updatedStock = await prisma.stock.update({
      where: { id },
      data: {
        quantity: newQuantity,
        lastRestocked: action === 'add' ? new Date() : currentStock.lastRestocked,
      },
    })
 
    return NextResponse.json(updatedStock)
  } catch (error) {
    console.error('Error updating stock:', error)
    return NextResponse.json(
      { error: 'Failed to update stock' },
      { status: 500 }
    )
  }
}