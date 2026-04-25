import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [vendors, txs, rush, waste, stock] = await Promise.all([
      prisma.vendor.count(),
      prisma.transaction.findMany({
        orderBy: { date: 'asc' } // Get them in order initially
      }),
      prisma.rushOrder.count(),
      prisma.waste.findMany(),
      prisma.stock.findMany(),
    ]);

    // 1. Filter Transactions by type
    const incomeTransactions = txs.filter((t: any) => t.type === 'income');
    const expenseTransactions = txs.filter((t: any) => t.type === 'expense');

    // 2. Perform Math
    const income = incomeTransactions.reduce((sum: number, t: any) => sum + Number(t.amount), 0);
    const expense = expenseTransactions.reduce((s: number, t: any) => s + Number(t.amount || 0), 0);
    const wasteCost = waste.reduce((s: number, w: any) => s + Number(w.amount || 0), 0);

    // 3. New Dashboard Metrics
    const totalTransactions = incomeTransactions.length;
    const averageOrderValue = totalTransactions > 0 ? income / totalTransactions : 0;

    // 4. Chart History (Oldest to Newest)
    // We use .slice().reverse() if the DB was descending, 
    // but since we want chronological flow for Recharts:
    const history = incomeTransactions.slice(-7).map((t: any) => ({
      date: new Date(t.date).toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: '2-digit' 
      }),
      sales: Number(t.amount)
    }));

    return NextResponse.json({
      vendors,
      income,
      expense,
      rush,
      wasteCost,
      totalTransactions,   // Matches UI
      averageOrderValue,   // Matches UI
      lowStock: stock.filter((s: any) => s.quantity <= (s.minStock || 5)).length,
      history: history     // Now flows correctly for the AreaChart
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}