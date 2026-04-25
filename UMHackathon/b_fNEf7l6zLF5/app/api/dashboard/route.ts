// app/api/dashboard/stats/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [vendors, txs, rush, wasteItems, stock] = await Promise.all([
      prisma.vendor.count(),
      prisma.transaction.findMany({ orderBy: { date: 'asc' } }),
      prisma.rushOrder.count(),
      prisma.waste.findMany(),
      prisma.stock.findMany(),
    ])

    const incomeTransactions = txs.filter((t: any) => t.type === 'income')
    const income = incomeTransactions.reduce((sum: number, t: any) => sum + Number(t.amount), 0)
    const expense = txs
      .filter((t: any) => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + Number(t.amount), 0)

    // Fix: waste table uses `cost` not `amount`
    const wasteCost = wasteItems.reduce((sum: number, w: any) => sum + Number(w.cost ?? 0), 0)

    const totalTransactions = incomeTransactions.length
    const averageOrderValue = totalTransactions > 0 ? income / totalTransactions : 0

    // Last 7 income transactions as chart history
    const history = incomeTransactions.slice(-7).map((t: any) => ({
      date: new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }),
      sales: Number(t.amount),
    }))

    // Stock alerts: items at or below reorder level
    const stockAlerts = stock.filter((s: any) => s.quantity <= s.reorderLevel).length

    // Yesterday's income (second-to-last day in sorted list, or 1 to avoid div/0)
    const uniqueDays = [...new Set(incomeTransactions.map((t: any) =>
      new Date(t.date).toDateString()
    ))]
    const yesterdayStr = uniqueDays[uniqueDays.length - 2]
    const yesterdaySales = yesterdayStr
      ? incomeTransactions
          .filter((t: any) => new Date(t.date).toDateString() === yesterdayStr)
          .reduce((sum: number, t: any) => sum + Number(t.amount), 0)
      : 1

    // Predicted rush time — static for now, can be ML-driven later
    const predictedRushTime = '12:30 PM'

    return NextResponse.json({
      vendors,
      income,
      expense,
      rush,
      wasteCost,
      totalTransactions,
      averageOrderValue,
      stockAlerts,
      history,
      yesterdaySales,
      predictedRushTime,
    })
  } catch (error: any) {
    console.error('[GET /api/dashboard/stats]', error?.message ?? error)
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 })
  }
}