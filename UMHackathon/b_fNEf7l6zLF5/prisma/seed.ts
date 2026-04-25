import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helpers
const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const sample = <T>(arr: T[]) => arr[random(0, arr.length - 1)]

async function main() {
  console.log('🌱 Seeding database...')

  //////////////////////////////////////////////////////
  // 1. USER (ONLY ONE)
  //////////////////////////////////////////////////////
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      role: 'admin',
    },
  })

  console.log('✅ User ready')

  //////////////////////////////////////////////////////
  // 2. VENDORS (10)
  //////////////////////////////////////////////////////
  const vendorNames = [
    'Fresh Farm Supplies',
    'NSK Trading',
    'Pasar Borong Selayang',
    'Seafood Express',
    'Cameron Highlands Farm',
    'Beverage Distributor',
    'Packaging Solutions',
    'Frozen Goods Supplier',
    'Bakery Ingredients Co',
    'Gas & Utilities MY',
  ]

  const vendors = await Promise.all(
    vendorNames.map((name, i) =>
      prisma.vendor.create({
        data: {
          name,
          email: `vendor${i}@example.com`,
          phone: `+60123${100000 + i}`,
          category: sample(['food', 'supplies', 'services']),
          status: 'active',
          userId: user.id,
        },
      })
    )
  )

  console.log('✅ 10 Vendors created')

  //////////////////////////////////////////////////////
  // 3. STOCK (10) — LINKED TO VENDORS
  //////////////////////////////////////////////////////
  const stockNames = [
    'Chicken',
    'Rice',
    'Cooking Oil',
    'Eggs',
    'Milk',
    'Sugar',
    'Salt',
    'Flour',
    'Vegetables',
    'Fish',
  ]

  const stocks = await Promise.all(
    stockNames.map((name, i) =>
      prisma.stock.create({
        data: {
          name,
          quantity: random(5, 200),
          unit: sample(['kg', 'liters', 'pieces']),
          category: 'ingredients',
          reorderLevel: random(10, 30),
          lastRestocked: new Date(),
          vendorId: vendors[i % vendors.length].id, // 🔥 KEY RELATION
        },
      })
    )
  )

  console.log('✅ 10 Stock items created')

  //////////////////////////////////////////////////////
  // 4. TRANSACTIONS (10)
  //////////////////////////////////////////////////////
  await Promise.all(
    Array.from({ length: 10 }).map((_, i) => {
      const isExpense = Math.random() > 0.5

      return prisma.transaction.create({
        data: {
          amount: random(50, 3000),
          type: isExpense ? 'expense' : 'income',
          category: sample(['food', 'utilities', 'sales', 'supplies']),
          description: `Transaction ${i + 1}`,
          vendorId: isExpense
            ? vendors[i % vendors.length].id
            : null,
          userId: user.id,
          date: new Date(`2026-04-${10 + i}`),
          status: sample(['pending', 'completed']),
        },
      })
    })
  )

  console.log('✅ 10 Transactions created')

  //////////////////////////////////////////////////////
  // 5. WASTE (10)
  //////////////////////////////////////////////////////
  await Promise.all(
    Array.from({ length: 10 }).map((_, i) =>
      prisma.waste.create({
        data: {
          item: sample(stockNames),
          quantity: random(1, 10),
          unit: 'kg',
          reason: sample([
            'expired',
            'spoiled',
            'damaged',
            'overproduction',
          ]),
          cost: random(5, 50),
          date: new Date(`2026-04-${15 + i}`),
        },
      })
    )
  )

  console.log('✅ 10 Waste records created')

  //////////////////////////////////////////////////////
  // 6. RUSH ORDERS (10)
  //////////////////////////////////////////////////////
  const names = [
    'Ali',
    'Siti',
    'Ahmad',
    'Mei Ling',
    'Raj',
    'Kumar',
    'Aisyah',
    'Daniel',
    'Farah',
    'Jason',
  ]

  await Promise.all(
    names.map((name, i) =>
      prisma.rushOrder.create({
        data: {
          customerName: name,
          items: JSON.stringify([
            {
              name: sample(stockNames),
              quantity: random(1, 5),
            },
          ]),
          totalAmount: random(10, 100),
          status: sample(['pending', 'preparing', 'completed']),
          priority: sample(['normal', 'high', 'urgent']),
          notes: 'Auto-generated order',
          orderDate: new Date(`2026-04-${20 + i}T12:00:00`),
        },
      })
    )
  )

  console.log('✅ 10 Rush Orders created')

  //////////////////////////////////////////////////////
  console.log('🎉 Seeding completed successfully!')
}

// RUN
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })