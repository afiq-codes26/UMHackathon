import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // =========================
    // 1. USER
    // =========================
    const user = await prisma.user.create({
        data: {
            email: "demo@hackathon.com",
            name: "Demo User",
            role: "admin",
        },
    });

    // =========================
    // 2. VENDORS
    // =========================
    const vendors = await Promise.all([
        prisma.vendor.create({
            data: {
                name: "Fresh Foods",
                category: "food",
                email: "fresh@vendor.com",
                userId: user.id,
            },
        }),
        prisma.vendor.create({
            data: {
                name: "Restaurant Supply",
                category: "supplies",
                email: "supply@vendor.com",
                userId: user.id,
            },
        }),
        prisma.vendor.create({
            data: {
                name: "Utilities Co",
                category: "utilities",
                email: "utilities@vendor.com",
                userId: user.id,
            },
        }),
    ]);

    // =========================
    // 3. TRANSACTIONS
    // =========================
    await Promise.all([
        prisma.transaction.create({
            data: {
                amount: 120.5,
                type: "expense",
                category: "food",
                description: "Groceries purchase",
                vendorId: vendors[0].id,
                userId: user.id,
            },
        }),
        prisma.transaction.create({
            data: {
                amount: 300,
                type: "expense",
                category: "supplies",
                description: "Kitchen equipment",
                vendorId: vendors[1].id,
                userId: user.id,
            },
        }),
        prisma.transaction.create({
            data: {
                amount: 500,
                type: "income",
                category: "services",
                description: "Catering order payment",
                userId: user.id,
            },
        }),
    ]);

    // =========================
    // 4. STOCK (FIXED → now includes userId)
    // =========================
    await Promise.all([
        prisma.stock.create({
            data: {
                name: "Rice",
                quantity: 5,
                unit: "kg",
                category: "ingredients",
                reorderLevel: 10,
                userId: user.id,
            },
        }),
        prisma.stock.create({
            data: {
                name: "Cooking Oil",
                quantity: 2,
                unit: "liters",
                category: "ingredients",
                reorderLevel: 5,
                userId: user.id,
            },
        }),
        prisma.stock.create({
            data: {
                name: "Plates",
                quantity: 50,
                unit: "pieces",
                category: "supplies",
                reorderLevel: 20,
                userId: user.id,
            },
        }),
        prisma.stock.create({
            data: {
                name: "Napkins",
                quantity: 200,
                unit: "pieces",
                category: "supplies",
                reorderLevel: 50,
                userId: user.id,
            },
        }),
    ]);

    // =========================
    // 5. WASTE
    // =========================
    await Promise.all([
        prisma.waste.create({
            data: {
                item: "Rice",
                quantity: 2,
                unit: "kg",
                reason: "spoiled",
                cost: 15,
            },
        }),
        prisma.waste.create({
            data: {
                item: "Cooking Oil",
                quantity: 1,
                unit: "liter",
                reason: "expired",
                cost: 8,
            },
        }),
    ]);

    // =========================
    // 6. RUSH ORDERS
    // =========================
    await Promise.all([
        prisma.rushOrder.create({
            data: {
                customerName: "John Tan",
                items: JSON.stringify([{ item: "Burger", qty: 2 }]),
                totalAmount: 25,
                status: "pending",
                priority: "high",
                notes: "Fast delivery needed",
            },
        }),
        prisma.rushOrder.create({
            data: {
                customerName: "Sarah Lee",
                items: JSON.stringify([{ item: "Pizza", qty: 1 }]),
                totalAmount: 40,
                status: "preparing",
                priority: "urgent",
                notes: "VIP customer",
            },
        }),
    ]);

    console.log("✅ Seeding complete!");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error("❌ Seed error:", e);
        await prisma.$disconnect();
        process.exit(1);
    });