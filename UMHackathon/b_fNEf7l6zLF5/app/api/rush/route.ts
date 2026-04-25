import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.rushOrder.findMany();

    // Create a map for all 24 hours
    const hourCounts: Record<string, number> = {};
    
    orders.forEach((order) => {
      // Get the hour (e.g., "14" for 2:00 PM)
      const hour = new Date(order.orderDate).getHours();
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = `${hour % 12 || 12}${ampm}`;
      
      hourCounts[displayHour] = (hourCounts[displayHour] || 0) + 1;
    });

    // Format for the chart
    const chartData = Object.entries(hourCounts).map(([hour, count]) => ({
      hour,
      customers: count,
      // Logic to determine prep intensity based on order volume
      prep: count > 10 ? "Heavy" : count > 5 ? "Medium" : "Light"
    }));

    return NextResponse.json(chartData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}