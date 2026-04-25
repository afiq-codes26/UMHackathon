import {
  stockItems as initialStock,
  vendors as initialVendors,
  transactions as initialTransactions,
  menuItems as initialMenuItems,
  wasteRecords as initialWaste,
  dashboardMetrics as initialMetrics,
  salesData as initialSales,
  type StockItem,
  type Transaction,
  type MenuItem,
  type WasteRecord,
} from './mock-data'

const store = {
  stockItems: [...initialStock] as StockItem[],
  vendors: [...initialVendors],
  transactions: [...initialTransactions] as Transaction[],
  menuItems: [...initialMenuItems] as MenuItem[],
  wasteRecords: [...initialWaste] as WasteRecord[],
  metrics: { ...initialMetrics },
  salesData: [...initialSales],
  lastUpdated: new Date().toISOString(),
}

function simulateLiveSale() {
  const items = [
    { name: 'Nasi Lemak Ayam', price: 12 },
    { name: 'Teh Tarik', price: 3.5 },
    { name: 'Mee Goreng Mamak', price: 10 },
    { name: 'Char Kuey Teow', price: 11 },
    { name: 'Roti Canai', price: 2 },
    { name: 'Kopi O', price: 2.5 },
  ]
  const methods = ['Cash', 'E-Wallet', 'Card']
  const picked = items.slice(0, Math.floor(Math.random() * 3) + 1).map(i => ({
    ...i, quantity: Math.floor(Math.random() * 3) + 1,
  }))
  const total = picked.reduce((s, i) => s + i.price * i.quantity, 0)
  const newTx: Transaction = {
    id: `TXN${Date.now()}`,
    timestamp: new Date().toISOString(),
    items: picked,
    total,
    paymentMethod: methods[Math.floor(Math.random() * methods.length)],
  }
  store.transactions.unshift(newTx)
  store.metrics.todaySales += total
  store.metrics.totalTransactions += 1
  store.metrics.averageOrderValue = store.metrics.todaySales / store.metrics.totalTransactions
  store.lastUpdated = new Date().toISOString()
}

function simulateStockUsage() {
  store.stockItems = store.stockItems.map(item => {
    const newStock = Math.max(0, item.currentStock - Math.random() * 0.5)
    const pct = newStock / item.maxStock
    const riskLevel: StockItem['riskLevel'] = pct <= 0.2 ? 'high' : pct <= 0.5 ? 'medium' : 'low'
    return { ...item, currentStock: +newStock.toFixed(2), riskLevel, lastUpdated: new Date().toISOString() }
  })
  store.metrics.lowStockAlerts = store.stockItems.filter(i => i.riskLevel === 'high').length
  store.lastUpdated = new Date().toISOString()
}

let simRunning = false
function startSimulation() {
  if (simRunning) return
  simRunning = true
  setInterval(() => { simulateLiveSale(); simulateStockUsage() }, 30000)
}
startSimulation()

export function getStore() { return store }

export function updateStock(id: string, delta: number) {
  store.stockItems = store.stockItems.map(item => {
    if (item.id !== id) return item
    const newStock = Math.max(0, item.currentStock + delta)
    const pct = newStock / item.maxStock
    const riskLevel: StockItem['riskLevel'] = pct <= 0.2 ? 'high' : pct <= 0.5 ? 'medium' : 'low'
    return { ...item, currentStock: +newStock.toFixed(2), riskLevel, lastUpdated: new Date().toISOString() }
  })
  store.metrics.lowStockAlerts = store.stockItems.filter(i => i.riskLevel === 'high').length
  store.lastUpdated = new Date().toISOString()
}

export function addWasteRecord(record: Omit<WasteRecord, 'id'>) {
  const newRecord: WasteRecord = { ...record, id: `W${Date.now()}` }
  store.wasteRecords.unshift(newRecord)
  store.metrics.wasteThisWeek += record.cost
  store.lastUpdated = new Date().toISOString()
  return newRecord
}