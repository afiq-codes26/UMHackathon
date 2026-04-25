/*import { NextResponse } from 'next/server'
import { getStore } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const store = getStore()
  return NextResponse.json({ transactions: store.transactions.slice(0, 50) })
}*/

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
 
// GET /api/transactions - Get all transactions
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // filter by type
    const category = searchParams.get('category') // filter by category
 
    const where: any = {}
    if (type) where.type = type
    if (category) where.category = category
 
    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        vendor: {
          select: {
            name: true,
            category: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    })
 
    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}
 
// POST /api/transactions - Create a new transaction
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, type, category, description, vendorId, userId, date } = body
 
    if (!amount || !type || !category || !userId) {
      return NextResponse.json(
        { error: 'Amount, type, category, and userId are required' },
        { status: 400 }
      )
    }
 
    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        type,
        category,
        description,
        vendorId,
        userId,
        date: date ? new Date(date) : new Date(),
      },
      include: {
        vendor: {
          select: {
            name: true,
          },
        },
      },
    })
 
    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}