// app/api/waste/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // CRITICAL: Ensure this is .waste and NOT .wasteRecord
    const records = await prisma.waste.findMany({
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(records);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const record = await prisma.waste.create({
      data: {
        item: body.item,
        quantity: parseFloat(body.quantity),
        unit: body.unit,
        reason: body.reason,
        cost: parseFloat(body.cost) || 0,
        date: new Date()
      }
    });
    return NextResponse.json(record);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}