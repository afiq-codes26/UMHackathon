"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Package, AlertTriangle, CheckCircle, AlertCircle,
  Plus, Minus, Search, RefreshCw, TrendingUp, TrendingDown,
} from "lucide-react"
import { useLiveDataContext } from "@/app/page"
import { stockItems as fallbackStock, type StockItem } from "@/lib/mock-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

export function StockManagement() {
  const liveData = useLiveDataContext()
  const stockItems: StockItem[] = liveData?.stockItems ?? fallbackStock

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null)
  const [adjustmentAmount, setAdjustmentAmount] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const filteredItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "bg-success text-white"
      case "medium": return "bg-warning text-foreground"
      case "high": return "bg-danger text-white"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "low": return <CheckCircle className="h-4 w-4" />
      case "medium": return <AlertCircle className="h-4 w-4" />
      case "high": return <AlertTriangle className="h-4 w-4" />
      default: return null
    }
  }

  const getStockPercentage = (item: StockItem) => Math.min(100, (item.currentStock / item.maxStock) * 100)
  const getProgressColor = (item: StockItem) => {
    const pct = getStockPercentage(item)
    if (pct <= 20) return "bg-danger"
    if (pct <= 50) return "bg-warning"
    return "bg-success"
  }

  const handleAdjustStock = async (delta: number) => {
    if (!selectedItem) return
    setIsUpdating(true)
    try {
      await fetch("/api/stock", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedItem.id, delta }),
      })
    } finally {
      setIsUpdating(false)
      setIsDialogOpen(false)
      setAdjustmentAmount("")
    }
  }

  const highRiskItems = stockItems.filter(i => i.riskLevel === "high")
  const chartData = stockItems.map(item => ({
    name: item.name.length > 10 ? item.name.substring(0, 10) + "…" : item.name,
    stock: item.currentStock,
    min: item.minStock,
    fill: item.riskLevel === "high" ? "hsl(var(--danger))" : item.riskLevel === "medium" ? "hsl(var(--warning))" : "hsl(var(--success))",
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Stock Management</h2>
          <p className="text-muted-foreground">Real-time inventory tracking with AI predictions</p>
        </div>
        {highRiskItems.length > 0 && (
          <Badge variant="destructive" className="flex items-center gap-2 w-fit animate-pulse">
            <AlertTriangle className="h-4 w-4" />
            {highRiskItems.length} Critical Items
          </Badge>
        )}
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Items", value: stockItems.length, icon: Package, color: "text-primary" },
          { label: "Critical", value: stockItems.filter(i => i.riskLevel === "high").length, icon: AlertTriangle, color: "text-danger" },
          { label: "Medium Risk", value: stockItems.filter(i => i.riskLevel === "medium").length, icon: AlertCircle, color: "text-warning" },
          { label: "Healthy", value: stockItems.filter(i => i.riskLevel === "low").length, icon: CheckCircle, color: "text-success" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 pt-6">
              <Icon className={`h-8 w-8 ${color}`} />
              <div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Stock Level Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                />
                <Bar dataKey="stock" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Inventory Items</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search items..." value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cost/Unit</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map(item => (
                  <TableRow key={item.id} className={item.riskLevel === "high" ? "bg-danger/5" : ""}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                    <TableCell>
                      <div className="space-y-1 min-w-[120px]">
                        <div className="flex justify-between text-xs">
                          <span>{item.currentStock} {item.unit}</span>
                          <span className="text-muted-foreground">/{item.maxStock}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${getProgressColor(item)}`}
                            style={{ width: `${getStockPercentage(item)}%` }} />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`flex items-center gap-1 w-fit ${getRiskColor(item.riskLevel)}`}>
                        {getRiskIcon(item.riskLevel)}
                        {item.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>RM {item.costPerUnit.toFixed(2)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{item.vendor}</TableCell>
                    <TableCell>
                      <Dialog open={isDialogOpen && selectedItem?.id === item.id}
                        onOpenChange={open => { setIsDialogOpen(open); if (!open) setSelectedItem(null) }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => { setSelectedItem(item); setIsDialogOpen(true) }}>
                            <RefreshCw className="h-4 w-4 mr-1" /> Adjust
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Adjust Stock: {item.name}</DialogTitle>
                            <DialogDescription>
                              Current stock: {item.currentStock} {item.unit}. Changes sync live.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4 space-y-2">
                            <Label>Adjustment Amount ({item.unit})</Label>
                            <Input type="number" placeholder="e.g. 10" value={adjustmentAmount}
                              onChange={e => setAdjustmentAmount(e.target.value)} />
                          </div>
                          <DialogFooter className="gap-2">
                            <Button variant="outline" className="gap-2" disabled={isUpdating}
                              onClick={() => handleAdjustStock(-Number(adjustmentAmount))}>
                              <Minus className="h-4 w-4" /> Remove
                            </Button>
                            <Button className="gap-2" disabled={isUpdating}
                              onClick={() => handleAdjustStock(Number(adjustmentAmount))}>
                              <Plus className="h-4 w-4" /> Add Stock
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

      {highRiskItems.length > 0 && (
        <Card className="border-danger/30 bg-danger/5">
          <CardHeader>
            <CardTitle className="text-danger flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Reorder Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {highRiskItems.map(item => (
                <div key={item.id} className="p-4 rounded-lg bg-card border border-danger/20 space-y-2">
                  <div className="flex justify-between items-start">
                    <p className="font-medium">{item.name}</p>
                    <Badge variant="destructive" className="text-xs">Urgent</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Only {item.currentStock} {item.unit} left • Min: {item.minStock} {item.unit}
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Order from: <strong>{item.vendor}</strong></span>
                    <span className="text-danger font-medium">RM {(item.costPerUnit * (item.maxStock - item.currentStock)).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
