"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Receipt,
  Search,
  Clock,
  DollarSign,
  CreditCard,
  Wallet,
  Banknote,
  TrendingUp,
  Calendar,
  Filter
} from "lucide-react"
import { transactions, type Transaction } from "@/lib/mock-data"
import { format, parseISO } from "date-fns"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [paymentFilter, setPaymentFilter] = useState<string>("all")

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesPayment = paymentFilter === "all" || txn.paymentMethod === paymentFilter
    return matchesSearch && matchesPayment
  })

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'Cash': return <Banknote className="h-4 w-4 text-success" />
      case 'Card': return <CreditCard className="h-4 w-4 text-primary" />
      case 'E-Wallet': return <Wallet className="h-4 w-4 text-accent" />
      default: return <DollarSign className="h-4 w-4" />
    }
  }

  const getPaymentColor = (method: string) => {
    switch (method) {
      case 'Cash': return 'bg-success/10 text-success border-success/20'
      case 'Card': return 'bg-primary/10 text-primary border-primary/20'
      case 'E-Wallet': return 'bg-accent/10 text-accent border-accent/20'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  // Calculate stats
  const totalSales = transactions.reduce((sum, txn) => sum + txn.total, 0)
  const avgTransaction = totalSales / transactions.length
  const paymentBreakdown = {
    Cash: transactions.filter(t => t.paymentMethod === 'Cash').reduce((sum, t) => sum + t.total, 0),
    Card: transactions.filter(t => t.paymentMethod === 'Card').reduce((sum, t) => sum + t.total, 0),
    'E-Wallet': transactions.filter(t => t.paymentMethod === 'E-Wallet').reduce((sum, t) => sum + t.total, 0),
  }

  // Hourly sales data
  const hourlySales = [
    { time: '11:00', sales: 39 },
    { time: '11:30', sales: 13.5 },
    { time: '12:00', sales: 26 },
    { time: '12:15', sales: 14 },
    { time: '12:30', sales: 52.5 },
    { time: '12:45', sales: 31 },
  ].reverse()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Transaction History</h2>
          <p className="text-muted-foreground">View and analyze recent sales transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Today
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-primary/10">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">RM {totalSales.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Total Sales</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-success/10">
              <Receipt className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{transactions.length}</p>
              <p className="text-sm text-muted-foreground">Transactions</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-warning/10">
              <TrendingUp className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">RM {avgTransaction.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Avg Transaction</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-accent/10">
              <Wallet className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {((paymentBreakdown['E-Wallet'] / totalSales) * 100).toFixed(0)}%
              </p>
              <p className="text-sm text-muted-foreground">E-Wallet Usage</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Trend and Payment Breakdown */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Sales Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlySales}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`RM ${value}`, 'Sales']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(paymentBreakdown).map(([method, amount]) => (
                <div key={method} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getPaymentIcon(method)}
                      <span className="font-medium">{method}</span>
                    </div>
                    <span className="font-bold">RM {amount.toFixed(2)}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${method === 'Cash' ? 'bg-success' : method === 'Card' ? 'bg-primary' : 'bg-accent'}`}
                      style={{ width: `${(amount / totalSales) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'Cash', 'Card', 'E-Wallet'].map((filter) => (
                  <Button
                    key={filter}
                    variant={paymentFilter === filter ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPaymentFilter(filter)}
                    className={paymentFilter === filter ? 'bg-primary text-primary-foreground' : ''}
                  >
                    {filter === 'all' ? 'All' : filter}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTransactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/30 cursor-pointer transition-colors"
                onClick={() => setSelectedTransaction(txn)}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-muted">
                    <Receipt className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{txn.id}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {format(parseISO(txn.timestamp), 'h:mm a')}
                      <span>•</span>
                      <span>{txn.items.length} item{txn.items.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={`gap-1 ${getPaymentColor(txn.paymentMethod)}`}>
                    {getPaymentIcon(txn.paymentMethod)}
                    {txn.paymentMethod}
                  </Badge>
                  <p className="font-bold text-lg text-foreground">RM {txn.total.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transaction Detail Dialog */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Transaction Details
            </DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm text-muted-foreground">Transaction ID</p>
                  <p className="font-mono font-bold">{selectedTransaction.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {format(parseISO(selectedTransaction.timestamp), 'h:mm:ss a')}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Items Purchased</h4>
                <div className="space-y-2">
                  {selectedTransaction.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">RM {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2">
                  <Badge className={getPaymentColor(selectedTransaction.paymentMethod)}>
                    {getPaymentIcon(selectedTransaction.paymentMethod)}
                    {selectedTransaction.paymentMethod}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold text-primary">RM {selectedTransaction.total.toFixed(2)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Print Receipt</Button>
                <Button variant="outline" className="flex-1">Send to Customer</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
