import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
 
// GET /api/vendors - Get all vendors
export async function GET() {
  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            transactions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
 
    return NextResponse.json(vendors)
  } catch (error) {
    console.error('Error fetching vendors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vendors' },
      { status: 500 }
    )
  }
}
 
// POST /api/vendors - Create a new vendor
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, category, userId } = body
 
    if (!name || !userId) {
      return NextResponse.json(
        { error: 'Name and userId are required' },
        { status: 400 }
      )
    }
 
    const vendor = await prisma.vendor.create({
      data: {
        name,
        email,
        phone,
        category,
        userId,
      },
    })
 
    return NextResponse.json(vendor, { status: 201 })
  } catch (error) {
    console.error('Error creating vendor:', error)
    return NextResponse.json(
      { error: 'Failed to create vendor' },
      { status: 500 }
    )
  }
}