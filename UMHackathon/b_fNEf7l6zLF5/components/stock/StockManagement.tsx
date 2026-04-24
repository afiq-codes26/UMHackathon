"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Minus,
  Search,
  RefreshCw,
  TrendingUp,
  TrendingDown
} from "lucide-react"
import { stockItems as initialStockItems, type StockItem } from "@/lib/mock-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

export function StockManagement() {
  const [stockItems, setStockItems] = useState<StockItem[]>(initialStockItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null)
  const [adjustmentAmount, setAdjustmentAmount] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredItems = stockItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-success text-white'
      case 'medium': return 'bg-warning text-foreground'
      case 'high': return 'bg-danger text-white'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <CheckCircle className="h-4 w-4" />
      case 'medium': return <AlertCircle className="h-4 w-4" />
      case 'high': return <AlertTriangle className="h-4 w-4" />
      default: return null
    }
  }

  const getStockPercentage = (item: StockItem) => {
    return Math.min(100, (item.currentStock / item.maxStock) * 100)
  }

  const getProgressColor = (item: StockItem) => {
    const percentage = getStockPercentage(item)
    if (percentage <= 20) return 'bg-danger'
    if (percentage <= 50) return 'bg-warning'
    return 'bg-success'
  }

  const handleStockAdjustment = (type: 'add' | 'remove') => {
    if (!selectedItem || !adjustmentAmount) return
    
    const amount = parseFloat(adjustmentAmount)
    if (isNaN(amount) || amount <= 0) return

    setStockItems(prev => prev.map(item => {
      if (item.id === selectedItem.id) {
        const newStock = type === 'add' 
          ? Math.min(item.maxStock, item.currentStock + amount)
          : Math.max(0, item.currentStock - amount)
        
        const newRiskLevel = newStock <= item.minStock ? 'high' 
          : newStock <= item.minStock * 1.5 ? 'medium' 
          : 'low'

        return {
          ...item,
          currentStock: newStock,
          riskLevel: newRiskLevel as 'low' | 'medium' | 'high',
          lastUpdated: new Date().toISOString()
        }
      }
      return item
    }))
    
    setAdjustmentAmount("")
    setIsDialogOpen(false)
  }

  const stockStats = {
    total: stockItems.length,
    low: stockItems.filter(i => i.riskLevel === 'low').length,
    medium: stockItems.filter(i => i.riskLevel === 'medium').length,
    high: stockItems.filter(i => i.riskLevel === 'high').length,
  }

  const chartData = stockItems.map(item => ({
    name: item.name.length > 10 ? item.name.substring(0, 10) + '...' : item.name,
    current: item.currentStock,
    predicted: item.predictedUsage,
    risk: item.riskLevel
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Stock Management</h2>
          <p className="text-muted-foreground">Monitor and manage inventory levels with AI predictions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Sync POS
          </Button>
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Traffic Light Summary */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-muted">
              <Package className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stockStats.total}</p>
              <p className="text-sm text-muted-foreground">Total Items</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-success/30 bg-success/5">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-success/20">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{stockStats.low}</p>
              <p className="text-sm text-muted-foreground">Healthy Stock</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-warning/20">
              <AlertCircle className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">{stockStats.medium}</p>
              <p className="text-sm text-muted-foreground">Monitor</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-danger/30 bg-danger/5">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-danger/20">
              <AlertTriangle className="h-6 w-6 text-danger" />
            </div>
            <div>
              <p className="text-2xl font-bold text-danger">{stockStats.high}</p>
              <p className="text-sm text-muted-foreground">Critical</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock vs Predicted Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Current Stock vs Predicted Daily Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis dataKey="name" type="category" width={80} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="current" name="Current Stock" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.risk === 'high' ? '#ef4444' : entry.risk === 'medium' ? '#f59e0b' : '#22c55e'} 
                    />
                  ))}
                </Bar>
                <Bar dataKey="predicted" name="Predicted Usage" fill="#94a3b8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Search and Stock Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Inventory Items</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Predicted Usage</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{item.currentStock} {item.unit}</span>
                          <span className="text-muted-foreground">Max: {item.maxStock}</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getProgressColor(item)} transition-all duration-300`}
                            style={{ width: `${getStockPercentage(item)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`gap-1 ${getRiskColor(item.riskLevel)}`}>
                        {getRiskIcon(item.riskLevel)}
                        {item.riskLevel === 'high' ? 'Critical' : item.riskLevel === 'medium' ? 'Monitor' : 'Good'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {item.predictedUsage > item.currentStock ? (
                          <TrendingDown className="h-4 w-4 text-danger" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-success" />
                        )}
                        <span>{item.predictedUsage} {item.unit}/day</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.vendor}</TableCell>
                    <TableCell className="text-right">
                      <Dialog open={isDialogOpen && selectedItem?.id === item.id} onOpenChange={(open) => {
                        setIsDialogOpen(open)
                        if (open) setSelectedItem(item)
                        else setSelectedItem(null)
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Update Stock
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update Stock: {item.name}</DialogTitle>
                            <DialogDescription>
                              Current stock: {item.currentStock} {item.unit}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="amount">Amount ({item.unit})</Label>
                              <Input
                                id="amount"
                                type="number"
                                min="0"
                                step="0.1"
                                value={adjustmentAmount}
                                onChange={(e) => setAdjustmentAmount(e.target.value)}
                                placeholder="Enter amount"
                              />
                            </div>
                          </div>
                          <DialogFooter className="gap-2">
                            <Button 
                              variant="outline" 
                              onClick={() => handleStockAdjustment('remove')}
                              className="gap-2"
                            >
                              <Minus className="h-4 w-4" />
                              Remove
                            </Button>
                            <Button 
                              onClick={() => handleStockAdjustment('add')}
                              className="gap-2 bg-primary text-primary-foreground"
                            >
                              <Plus className="h-4 w-4" />
                              Add
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            AI Stock Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-card border">
              <p className="font-medium text-foreground">Urgent: Order Chicken Thigh Today</p>
              <p className="text-sm text-muted-foreground mt-1">
                Based on your predicted usage of 15kg/day and current stock of 12kg, you&apos;ll run out by tomorrow evening. 
                Recommended order: 30kg from Fresh Farm Supplies (1-day lead time).
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card border">
              <p className="font-medium text-foreground">Cooking Oil Running Low</p>
              <p className="text-sm text-muted-foreground mt-1">
                Current stock (8L) is below minimum threshold (10L). With Hari Raya coming (+50% expected demand), 
                recommend ordering 20L from NSK Trading before Friday.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card border">
              <p className="font-medium text-foreground">Optimize Sambal Paste Orders</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your sambal usage peaks on weekends. Consider ordering 5kg on Thursdays to ensure freshness 
                and reduce spoilage risk.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
