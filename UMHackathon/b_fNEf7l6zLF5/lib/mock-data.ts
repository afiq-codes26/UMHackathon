// Mock data for the Smart Vendor SME System

export interface StockItem {
  id: string
  name: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  unit: string
  lastUpdated: string
  predictedUsage: number
  riskLevel: 'low' | 'medium' | 'high'
  costPerUnit: number
  vendor: string
}

export interface Vendor {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  address: string
  leadTime: number
  items: string[]
  lastOrder: string
  totalOrders: number
  averageOrderValue: number
}

export interface Transaction {
  id: string
  timestamp: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  paymentMethod: string
  customerId?: string
}

export interface RushPrediction {
  hour: number
  day: string
  expectedCustomers: number
  peakItems: string[]
  confidence: number
}

export interface MenuItem {
  id: string
  name: string
  category: string
  currentPrice: number
  suggestedPrice: number
  costToMake: number
  popularity: number
  margin: number
  lastPriceUpdate: string
}

export interface WasteRecord {
  id: string
  item: string
  quantity: number
  unit: string
  reason: 'expired' | 'spoiled' | 'damaged' | 'overproduction' | 'other'
  date: string
  cost: number
}

export interface PromotionalEvent {
  id: string
  name: string
  date: string
  expectedImpact: number
  type: 'holiday' | 'festival' | 'local' | 'weather'
  description: string
}

// Stock Items
export const stockItems: StockItem[] = [
  { id: '1', name: 'Chicken Thigh', category: 'Meat', currentStock: 12, minStock: 10, maxStock: 50, unit: 'kg', lastUpdated: '2026-04-24T08:00:00', predictedUsage: 15, riskLevel: 'high', costPerUnit: 18.5, vendor: 'Fresh Farm Supplies' },
  { id: '2', name: 'Rice (Beras Super)', category: 'Grains', currentStock: 80, minStock: 20, maxStock: 100, unit: 'kg', lastUpdated: '2026-04-24T08:00:00', predictedUsage: 25, riskLevel: 'low', costPerUnit: 3.2, vendor: 'NSK Trading' },
  { id: '3', name: 'Cooking Oil', category: 'Oil', currentStock: 8, minStock: 10, maxStock: 30, unit: 'L', lastUpdated: '2026-04-24T08:00:00', predictedUsage: 5, riskLevel: 'high', costPerUnit: 8.5, vendor: 'NSK Trading' },
  { id: '4', name: 'Eggs', category: 'Protein', currentStock: 150, minStock: 100, maxStock: 300, unit: 'pcs', lastUpdated: '2026-04-24T08:00:00', predictedUsage: 80, riskLevel: 'low', costPerUnit: 0.55, vendor: 'Fresh Farm Supplies' },
  { id: '5', name: 'Sambal Paste', category: 'Condiments', currentStock: 3, minStock: 5, maxStock: 15, unit: 'kg', lastUpdated: '2026-04-24T08:00:00', predictedUsage: 2, riskLevel: 'high', costPerUnit: 25, vendor: 'Pasar Borong Selayang' },
  { id: '6', name: 'Ikan Bilis', category: 'Seafood', currentStock: 5, minStock: 3, maxStock: 10, unit: 'kg', lastUpdated: '2026-04-24T08:00:00', predictedUsage: 2, riskLevel: 'medium', costPerUnit: 45, vendor: 'Seafood Express' },
  { id: '7', name: 'Cucumber', category: 'Vegetables', currentStock: 25, minStock: 10, maxStock: 40, unit: 'pcs', lastUpdated: '2026-04-24T08:00:00', predictedUsage: 15, riskLevel: 'low', costPerUnit: 1.5, vendor: 'Cameron Highlands Farm' },
  { id: '8', name: 'Peanuts (Roasted)', category: 'Nuts', currentStock: 4, minStock: 5, maxStock: 20, unit: 'kg', lastUpdated: '2026-04-24T08:00:00', predictedUsage: 3, riskLevel: 'medium', costPerUnit: 22, vendor: 'NSK Trading' },
  { id: '9', name: 'Coconut Milk', category: 'Dairy', currentStock: 20, minStock: 15, maxStock: 50, unit: 'L', lastUpdated: '2026-04-24T08:00:00', predictedUsage: 10, riskLevel: 'low', costPerUnit: 6.5, vendor: 'Pasar Borong Selayang' },
  { id: '10', name: 'Kangkung', category: 'Vegetables', currentStock: 8, minStock: 10, maxStock: 25, unit: 'kg', lastUpdated: '2026-04-24T08:00:00', predictedUsage: 6, riskLevel: 'medium', costPerUnit: 5, vendor: 'Cameron Highlands Farm' },
]

// Vendors
export const vendors: Vendor[] = [
  { id: '1', name: 'Fresh Farm Supplies', contact: 'Ahmad Razak', email: 'ahmad@freshfarm.my', phone: '+60 12-345 6789', address: 'Lot 15, Jalan Pasar, Selayang', leadTime: 1, items: ['Chicken Thigh', 'Eggs', 'Duck Meat'], lastOrder: '2026-04-22', totalOrders: 156, averageOrderValue: 850 },
  { id: '2', name: 'NSK Trading', contact: 'Lee Wei Ming', email: 'weiming@nsk.com.my', phone: '+60 13-456 7890', address: '88 Jalan Ipoh, KL', leadTime: 2, items: ['Rice', 'Cooking Oil', 'Peanuts', 'Flour'], lastOrder: '2026-04-20', totalOrders: 89, averageOrderValue: 1200 },
  { id: '3', name: 'Pasar Borong Selayang', contact: 'Muthu Samy', email: 'muthu@pasarselayang.my', phone: '+60 14-567 8901', address: 'Pasar Borong Selayang, Gombak', leadTime: 1, items: ['Sambal Paste', 'Coconut Milk', 'Spices'], lastOrder: '2026-04-23', totalOrders: 234, averageOrderValue: 450 },
  { id: '4', name: 'Seafood Express', contact: 'Tan Ah Kow', email: 'ahkow@seafoodexpress.my', phone: '+60 16-789 0123', address: 'Port Klang Fish Market', leadTime: 1, items: ['Ikan Bilis', 'Prawns', 'Squid', 'Fish'], lastOrder: '2026-04-21', totalOrders: 78, averageOrderValue: 680 },
  { id: '5', name: 'Cameron Highlands Farm', contact: 'Rajesh Kumar', email: 'rajesh@cameronfarm.my', phone: '+60 17-890 1234', address: 'Brinchang, Cameron Highlands', leadTime: 2, items: ['Cucumber', 'Kangkung', 'Tomatoes', 'Lettuce'], lastOrder: '2026-04-23', totalOrders: 112, averageOrderValue: 320 },
]

// Transactions
export const transactions: Transaction[] = [
  { id: 'TXN001', timestamp: '2026-04-24T12:45:00', items: [{ name: 'Nasi Lemak Ayam', quantity: 2, price: 12 }, { name: 'Teh Tarik', quantity: 2, price: 3.5 }], total: 31, paymentMethod: 'Cash' },
  { id: 'TXN002', timestamp: '2026-04-24T12:38:00', items: [{ name: 'Mee Goreng Mamak', quantity: 1, price: 10 }, { name: 'Limau Ais', quantity: 1, price: 4 }], total: 14, paymentMethod: 'E-Wallet' },
  { id: 'TXN003', timestamp: '2026-04-24T12:30:00', items: [{ name: 'Nasi Lemak Special', quantity: 3, price: 15 }, { name: 'Kopi O', quantity: 3, price: 2.5 }], total: 52.5, paymentMethod: 'Card' },
  { id: 'TXN004', timestamp: '2026-04-24T12:22:00', items: [{ name: 'Roti Canai', quantity: 4, price: 2 }, { name: 'Dhall Curry', quantity: 1, price: 3 }], total: 11, paymentMethod: 'Cash' },
  { id: 'TXN005', timestamp: '2026-04-24T12:15:00', items: [{ name: 'Nasi Lemak Rendang', quantity: 1, price: 14 }], total: 14, paymentMethod: 'E-Wallet' },
  { id: 'TXN006', timestamp: '2026-04-24T12:08:00', items: [{ name: 'Char Kuey Teow', quantity: 2, price: 11 }, { name: 'Teh O Ais', quantity: 2, price: 3 }], total: 28, paymentMethod: 'Cash' },
  { id: 'TXN007', timestamp: '2026-04-24T11:55:00', items: [{ name: 'Nasi Lemak Ayam', quantity: 1, price: 12 }, { name: 'Nasi Lemak Telur', quantity: 1, price: 8 }], total: 20, paymentMethod: 'Card' },
  { id: 'TXN008', timestamp: '2026-04-24T11:42:00', items: [{ name: 'Laksa', quantity: 2, price: 9 }, { name: 'Sirap Bandung', quantity: 2, price: 4 }], total: 26, paymentMethod: 'E-Wallet' },
  { id: 'TXN009', timestamp: '2026-04-24T11:30:00', items: [{ name: 'Nasi Goreng Kampung', quantity: 1, price: 11 }, { name: 'Telur Mata', quantity: 1, price: 2.5 }], total: 13.5, paymentMethod: 'Cash' },
  { id: 'TXN010', timestamp: '2026-04-24T11:18:00', items: [{ name: 'Nasi Lemak Special', quantity: 2, price: 15 }, { name: 'Milo Ais', quantity: 2, price: 4.5 }], total: 39, paymentMethod: 'Card' },
]

// Rush Predictions
export const rushPredictions: RushPrediction[] = [
  { hour: 7, day: 'Friday', expectedCustomers: 45, peakItems: ['Nasi Lemak Ayam', 'Teh Tarik', 'Roti Canai'], confidence: 92 },
  { hour: 8, day: 'Friday', expectedCustomers: 65, peakItems: ['Nasi Lemak Special', 'Kopi O', 'Mee Goreng'], confidence: 88 },
  { hour: 12, day: 'Friday', expectedCustomers: 85, peakItems: ['Nasi Lemak Rendang', 'Char Kuey Teow', 'Laksa'], confidence: 95 },
  { hour: 13, day: 'Friday', expectedCustomers: 72, peakItems: ['Nasi Lemak Ayam', 'Nasi Goreng Kampung'], confidence: 90 },
  { hour: 19, day: 'Friday', expectedCustomers: 95, peakItems: ['Nasi Lemak Special', 'Mee Goreng Mamak', 'Char Kuey Teow'], confidence: 94 },
  { hour: 20, day: 'Friday', expectedCustomers: 88, peakItems: ['Nasi Lemak Rendang', 'Laksa'], confidence: 91 },
]

// Hourly traffic data for the week
export const weeklyTraffic = [
  { day: 'Mon', '7am': 30, '8am': 45, '12pm': 65, '1pm': 55, '7pm': 70, '8pm': 60 },
  { day: 'Tue', '7am': 28, '8am': 42, '12pm': 60, '1pm': 50, '7pm': 65, '8pm': 55 },
  { day: 'Wed', '7am': 32, '8am': 48, '12pm': 68, '1pm': 58, '7pm': 72, '8pm': 62 },
  { day: 'Thu', '7am': 35, '8am': 52, '12pm': 72, '1pm': 62, '7pm': 78, '8pm': 68 },
  { day: 'Fri', '7am': 45, '8am': 65, '12pm': 85, '1pm': 72, '7pm': 95, '8pm': 88 },
  { day: 'Sat', '7am': 55, '8am': 75, '12pm': 90, '1pm': 80, '7pm': 85, '8pm': 75 },
  { day: 'Sun', '7am': 40, '8am': 55, '12pm': 70, '1pm': 60, '7pm': 65, '8pm': 55 },
]

// Menu Items for pricing
export const menuItems: MenuItem[] = [
  { id: '1', name: 'Nasi Lemak Ayam', category: 'Main', currentPrice: 12, suggestedPrice: 13, costToMake: 5.5, popularity: 95, margin: 54, lastPriceUpdate: '2026-03-01' },
  { id: '2', name: 'Nasi Lemak Special', category: 'Main', currentPrice: 15, suggestedPrice: 16.5, costToMake: 7, popularity: 88, margin: 53, lastPriceUpdate: '2026-03-01' },
  { id: '3', name: 'Nasi Lemak Rendang', category: 'Main', currentPrice: 14, suggestedPrice: 15, costToMake: 6.5, popularity: 82, margin: 54, lastPriceUpdate: '2026-03-01' },
  { id: '4', name: 'Mee Goreng Mamak', category: 'Main', currentPrice: 10, suggestedPrice: 11, costToMake: 4, popularity: 78, margin: 60, lastPriceUpdate: '2026-02-15' },
  { id: '5', name: 'Char Kuey Teow', category: 'Main', currentPrice: 11, suggestedPrice: 12, costToMake: 4.5, popularity: 85, margin: 59, lastPriceUpdate: '2026-02-15' },
  { id: '6', name: 'Laksa', category: 'Main', currentPrice: 9, suggestedPrice: 10.5, costToMake: 4, popularity: 72, margin: 56, lastPriceUpdate: '2026-01-20' },
  { id: '7', name: 'Roti Canai', category: 'Snack', currentPrice: 2, suggestedPrice: 2.5, costToMake: 0.6, popularity: 90, margin: 70, lastPriceUpdate: '2026-01-01' },
  { id: '8', name: 'Teh Tarik', category: 'Beverage', currentPrice: 3.5, suggestedPrice: 4, costToMake: 1, popularity: 92, margin: 71, lastPriceUpdate: '2026-02-01' },
  { id: '9', name: 'Kopi O', category: 'Beverage', currentPrice: 2.5, suggestedPrice: 3, costToMake: 0.7, popularity: 85, margin: 72, lastPriceUpdate: '2026-02-01' },
  { id: '10', name: 'Milo Ais', category: 'Beverage', currentPrice: 4.5, suggestedPrice: 5, costToMake: 1.5, popularity: 80, margin: 67, lastPriceUpdate: '2026-02-01' },
]

// Waste Records
export const wasteRecords: WasteRecord[] = [
  { id: '1', item: 'Chicken Thigh', quantity: 2, unit: 'kg', reason: 'expired', date: '2026-04-23', cost: 37 },
  { id: '2', item: 'Kangkung', quantity: 1.5, unit: 'kg', reason: 'spoiled', date: '2026-04-23', cost: 7.5 },
  { id: '3', item: 'Nasi Lemak', quantity: 5, unit: 'portions', reason: 'overproduction', date: '2026-04-22', cost: 27.5 },
  { id: '4', item: 'Eggs', quantity: 8, unit: 'pcs', reason: 'damaged', date: '2026-04-22', cost: 4.4 },
  { id: '5', item: 'Sambal', quantity: 0.5, unit: 'kg', reason: 'spoiled', date: '2026-04-21', cost: 12.5 },
  { id: '6', item: 'Cucumber', quantity: 4, unit: 'pcs', reason: 'expired', date: '2026-04-21', cost: 6 },
  { id: '7', item: 'Rice', quantity: 3, unit: 'kg', reason: 'overproduction', date: '2026-04-20', cost: 9.6 },
  { id: '8', item: 'Coconut Milk', quantity: 2, unit: 'L', reason: 'expired', date: '2026-04-20', cost: 13 },
]

// Promotional Events
export const promotionalEvents: PromotionalEvent[] = [
  { id: '1', name: 'Hari Raya Aidilfitri', date: '2026-04-30', expectedImpact: 150, type: 'festival', description: 'Major Muslim festival - expect 150% increase in traditional dishes' },
  { id: '2', name: 'School Holiday Start', date: '2026-05-15', expectedImpact: 130, type: 'holiday', description: 'Families dining out more - 30% increase expected' },
  { id: '3', name: 'Concert at Bukit Jalil', date: '2026-04-26', expectedImpact: 180, type: 'local', description: 'Major concert nearby - expect surge in dinner orders' },
  { id: '4', name: 'Heavy Rain Forecast', date: '2026-04-25', expectedImpact: 120, type: 'weather', description: 'Rain increases delivery orders by 20%, walk-ins decrease' },
  { id: '5', name: 'Wesak Day', date: '2026-05-05', expectedImpact: 115, type: 'holiday', description: 'Public holiday - moderate increase in family dining' },
]

// Dashboard metrics
export const dashboardMetrics = {
  todaySales: 2450.50,
  yesterdaySales: 2180.00,
  weeklyAverage: 2300.00,
  monthlyTotal: 68500.00,
  totalTransactions: 187,
  averageOrderValue: 13.10,
  topSellingItem: 'Nasi Lemak Ayam',
  lowStockAlerts: 4,
  wasteThisWeek: 117.50,
  predictedRushTime: '7:00 PM',
  activeVendors: 5,
  pendingOrders: 2,
}

// Sales data for charts
export const salesData = [
  { date: 'Apr 18', sales: 2100, orders: 165 },
  { date: 'Apr 19', sales: 2250, orders: 178 },
  { date: 'Apr 20', sales: 1980, orders: 155 },
  { date: 'Apr 21', sales: 2400, orders: 192 },
  { date: 'Apr 22', sales: 2650, orders: 210 },
  { date: 'Apr 23', sales: 2180, orders: 175 },
  { date: 'Apr 24', sales: 2450, orders: 187 },
]

// Category breakdown
export const categoryBreakdown = [
  { name: 'Main Dishes', value: 65, color: 'var(--chart-1)' },
  { name: 'Beverages', value: 20, color: 'var(--chart-2)' },
  { name: 'Snacks', value: 10, color: 'var(--chart-3)' },
  { name: 'Add-ons', value: 5, color: 'var(--chart-4)' },
]
