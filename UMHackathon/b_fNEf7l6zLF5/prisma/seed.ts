import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // 1. Create a demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      role: 'admin',
    },
  })

  console.log('✅ Created user:', user.email)

  // 2. VENDORS
  const moreVendorsData = [
    { name: 'Seafood Supplier', category: 'food' },
    { name: 'Beverage Distributor', category: 'food' },
    { name: 'Packaging Solutions', category: 'supplies' },
    { name: 'Cleaning Services MY', category: 'services' },
    { name: 'Frozen Goods Supplier', category: 'food' },
    { name: 'Bakery Ingredients Co', category: 'food' },
    { name: 'Gas & Utilities MY', category: 'services' },
  ]

  const allVendors = await Promise.all(
    moreVendorsData.map((v, i) =>
      prisma.vendor.create({
        data: {
          name: v.name,
          email: `vendor${i + 4}@example.com`,
          phone: `+60123${100000 + i}`,
          category: v.category,
          userId: user.id,
        },
      })
    )
  )

  console.log(`✅ Total vendors: ${allVendors.length}`)

  // 3. TRANSACTIONS
  const moreTransactionsData = [
    { amount: 300, type: 'expense', category: 'utilities', desc: 'Electricity bill' },
    { amount: 220, type: 'expense', category: 'food', desc: 'Vegetables restock' },
    { amount: 1800, type: 'income', category: 'sales', desc: 'Weekend sales' },
    { amount: 95, type: 'expense', category: 'supplies', desc: 'Cleaning supplies' },
    { amount: 670, type: 'expense', category: 'food', desc: 'Seafood purchase' },
    { amount: 2500, type: 'income', category: 'sales', desc: 'Event catering' },
    { amount: 400, type: 'expense', category: 'services', desc: 'Maintenance' },
  ]

  await Promise.all(
    moreTransactionsData.map((t, i) =>
      prisma.transaction.create({
        data: {
          amount: t.amount,
          type: t.type,
          category: t.category,
          description: t.desc,
          vendorId: t.type === 'expense' ? allVendors[i % allVendors.length].id : null,
          userId: user.id,
          date: new Date(`2026-04-${10 + i}`),
        },
      })
    )
  )

  console.log(`✅ Transactions created`)

  // 4. STOCK
  const moreStockData = [
    { name: 'Sugar', qty: 30, unit: 'kg' },
    { name: 'Salt', qty: 20, unit: 'kg' },
    { name: 'Flour', qty: 40, unit: 'kg' },
    { name: 'Eggs', qty: 200, unit: 'pieces' },
    { name: 'Milk', qty: 25, unit: 'liters' },
    { name: 'Plastic Containers', qty: 100, unit: 'pieces' },
  ]

  await Promise.all(
    moreStockData.map((s) =>
      prisma.stock.create({
        data: {
          name: s.name,
          quantity: s.qty,
          unit: s.unit,
          category: 'ingredients',
          reorderLevel: 15,
          lastRestocked: new Date(),
        },
      })
    )
  )

  console.log('✅ Stock entries expanded')

  // 5. WASTE
  const moreWasteData = [
    { item: 'Milk', qty: 2, reason: 'expired', cost: 10 },
    { item: 'Chicken', qty: 1, reason: 'spoiled', cost: 18 },
    { item: 'Rice', qty: 3, reason: 'damaged', cost: 9 },
    { item: 'Eggs', qty: 12, reason: 'broken', cost: 6 },
    { item: 'Bread', qty: 5, reason: 'expired', cost: 7 },
    { item: 'Fish', qty: 2, reason: 'spoiled', cost: 20 },
    { item: 'Sauce', qty: 1, reason: 'expired', cost: 5 },
    { item: 'Vegetables', qty: 2, reason: 'spoiled', cost: 8 },
  ]

  await Promise.all(
    moreWasteData.map((w, i) =>
      prisma.waste.create({
        data: {
          item: w.item,
          quantity: w.qty,
          unit: 'kg',
          reason: w.reason,
          cost: w.cost,
          date: new Date(`2026-04-${15 + i}`),
        },
      })
    )
  )

  console.log('✅ Waste entries expanded')

  // 6. RUSH ORDERS
  const moreOrdersData = [
    { name: 'Ali', total: 20, status: 'completed', priority: 'normal' },
    { name: 'Siti', total: 35, status: 'pending', priority: 'urgent' },
    { name: 'Ahmad', total: 18, status: 'completed', priority: 'normal' },
    { name: 'Mei Ling', total: 50, status: 'preparing', priority: 'high' },
    { name: 'Raj', total: 22, status: 'completed', priority: 'normal' },
    { name: 'Kumar', total: 40, status: 'pending', priority: 'high' },
    { name: 'Aisyah', total: 27, status: 'preparing', priority: 'urgent' },
    { name: 'Daniel', total: 60, status: 'completed', priority: 'normal' },
  ]

  await Promise.all(
    moreOrdersData.map((o, i) =>
      prisma.rushOrder.create({
        data: {
          customerName: o.name,
          items: JSON.stringify([{ name: 'Mixed Order', quantity: 2 }]),
          totalAmount: o.total,
          status: o.status,
          priority: o.priority,
          orderDate: new Date(`2026-04-${20 + i}T12:00:00`),
        },
      })
    )
  )

  console.log('✅ Rush orders expanded')
  console.log('🎉 Seeding completed successfully!')
}

// CRITICAL: Call the function and handle cleanup
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })