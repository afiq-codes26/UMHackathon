import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const stock = await prisma.stock.findMany();

    const formattedStock = stock.map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      currentStock: Number(item.quantity),
      unit: item.unit || "kg",
      // Hardcoded logic for the UI indicators
      isLow: item.quantity <= 5, 
      lastUpdated: item.updatedAt
    }));

    return NextResponse.json(formattedStock);
  } catch (error) {
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { id, amount, type } = await req.json();
    const current = await prisma.stock.findUnique({ where: { id } });
    if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const newQty = type === 'add' ? current.quantity + amount : Math.max(0, current.quantity - amount);

    await prisma.stock.update({
      where: { id },
      data: { quantity: newQty }
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}