"use client"

import { useState, useEffect, useCallback } from "react"
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
  Plus, Minus, Search, RefreshCw, Loader2,
} from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts"

// ─── Types ────────────────────────────────────────────────────────────────────

interface StockItem {
  id: string
  name: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  unit: string
  riskLevel: "low" | "medium" | "high"
  isLowStock: boolean
  vendor: string
  lastRestocked: string | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRiskColor(risk: string) {
  if (risk === "high") return "bg-red-500 text-white"
  if (risk === "medium") return "bg-yellow-400 text-black"
  return "bg-green-500 text-white"
}

function getRiskIcon(risk: string) {
  if (risk === "high") return <AlertTriangle className="h-3.5 w-3.5" />
  if (risk === "medium") return <AlertCircle className="h-3.5 w-3.5" />
  return <CheckCircle className="h-3.5 w-3.5" />
}

function getProgressColor(pct: number) {
  if (pct <= 20) return "bg-red-500"
  if (pct <= 50) return "bg-yellow-400"
  return "bg-green-500"
}

// ⚠️ Recharts renders SVG — CSS vars like hsl(var(--danger)) don't resolve in SVG.
// Always use hardcoded hex colors for Recharts fills.
function getBarFill(risk: string) {
  if (risk === "high") return "#ef4444"    // red-500
  if (risk === "medium") return "#eab308"  // yellow-500
  return "#22c55e"                         // green-500
}

// ─── Component ────────────────────────────────────────────────────────────────

export function StockManagement() {
  const [stockItems, setStockItems] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [adjustAmount, setAdjustAmount] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  // ── Fetch ───────────────────────────────────────────────────────────────────

  const fetchStock = useCallback(async () => {
    try {
      setError(null)
      const res = await fetch("/api/stock")
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.details ?? body?.error ?? `HTTP ${res.status}`)
      }
      const data: StockItem[] = await res.json()
      setStockItems(data)
    } catch (err: any) {
      console.error("[StockManagement] fetch error:", err?.message ?? err)
      setError(err?.message ?? "Failed to load stock data.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchStock() }, [fetchStock])

  // ── Adjust ──────────────────────────────────────────────────────────────────

  const handleAdjust = async (action: "add" | "subtract") => {
    if (!selectedItem || !adjustAmount) return
    setIsUpdating(true)
    try {
      const res = await fetch("/api/stock", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedItem.id, quantity: Number(adjustAmount), action }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const updated: StockItem = await res.json()
      setStockItems(prev => prev.map(i => i.id === updated.id ? updated : i))
    } catch (err) {
      console.error("[StockManagement] update error:", err)
    } finally {
      setIsUpdating(false)
      setDialogOpen(false)
      setAdjustAmount("")
      setSelectedItem(null)
    }
  }

  const openDialog = (item: StockItem) => {
    setSelectedItem(item); setAdjustAmount(""); setDialogOpen(true)
  }
  const closeDialog = () => {
    setDialogOpen(false); setSelectedItem(null); setAdjustAmount("")
  }

  // ── Derived ─────────────────────────────────────────────────────────────────

  const filtered = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const highRisk = stockItems.filter(i => i.riskLevel === "high")
  const medRisk  = stockItems.filter(i => i.riskLevel === "medium")
  const lowRisk  = stockItems.filter(i => i.riskLevel === "low")

  const chartData = stockItems.map(item => ({
    name: item.name.length > 10 ? item.name.slice(0, 10) + "…" : item.name,
    stock: item.currentStock,
    fill: getBarFill(item.riskLevel),
  }))

  // ── States ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm">Loading inventory…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-center px-4">
        <AlertTriangle className="h-10 w-10 text-red-500" />
        <div className="space-y-1">
          <p className="font-medium text-foreground">Failed to load stock</p>
          <p className="text-sm text-muted-foreground font-mono bg-muted px-3 py-1 rounded">{error}</p>
          <p className="text-xs text-muted-foreground">
            If this is a relation error, run{" "}
            <code className="bg-muted px-1 rounded">npx prisma generate</code>
          </p>
        </div>
        <Button variant="outline" onClick={fetchStock}>
          <RefreshCw className="h-4 w-4 mr-2" /> Retry
        </Button>
      </div>
    )
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Stock Management</h2>
          <p className="text-muted-foreground text-sm">
            Real-time inventory · {stockItems.length} items tracked
          </p>
        </div>
        <div className="flex items-center gap-2">
          {highRisk.length > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1.5 animate-pulse">
              <AlertTriangle className="h-3.5 w-3.5" />
              {highRisk.length} Critical
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={fetchStock}>
            <RefreshCw className="h-4 w-4 mr-1.5" /> Refresh
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Items", value: stockItems.length, icon: Package,       color: "text-primary"    },
          { label: "Critical",    value: highRisk.length,   icon: AlertTriangle, color: "text-red-500"    },
          { label: "Medium Risk", value: medRisk.length,    icon: AlertCircle,   color: "text-yellow-500" },
          { label: "Healthy",     value: lowRisk.length,    icon: CheckCircle,   color: "text-green-500"  },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 pt-6">
              <Icon className={`h-8 w-8 ${color} shrink-0`} />
              <div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bar chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="h-4 w-4 text-primary" />
            Stock Level Overview
          </CardTitle>
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-red-500 inline-block" /> Critical
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-yellow-400 inline-block" /> Medium
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-green-500 inline-block" /> Healthy
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [value, "In stock"]}
                />
                <Bar dataKey="stock" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Inventory table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">Inventory Items</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9 h-9"
                placeholder="Search by name, category, vendor…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
              No items match &ldquo;{searchTerm}&rdquo;
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(item => {
                    const pct = Math.min(100, (item.currentStock / item.maxStock) * 100)
                    return (
                      <TableRow
                        key={item.id}
                        className={item.riskLevel === "high" ? "bg-red-500/5" : ""}
                      >
                        <TableCell className="font-medium">{item.name}</TableCell>

                        <TableCell>
                          <Badge variant="outline" className="capitalize text-xs">
                            {item.category}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1 min-w-[130px]">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">
                                {item.currentStock} {item.unit}
                              </span>
                              <span>max {item.maxStock}</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${getProgressColor(pct)}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge className={`flex items-center gap-1 w-fit text-xs capitalize ${getRiskColor(item.riskLevel)}`}>
                            {getRiskIcon(item.riskLevel)}
                            {item.riskLevel}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-sm text-muted-foreground">
                          {item.vendor}
                        </TableCell>

                        <TableCell className="text-right">
                          <Dialog
                            open={dialogOpen && selectedItem?.id === item.id}
                            onOpenChange={open => { if (!open) closeDialog() }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => openDialog(item)}>
                                <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Adjust
                              </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-sm">
                              <DialogHeader>
                                <DialogTitle>Adjust Stock</DialogTitle>
                                <DialogDescription>
                                  <span className="font-medium text-foreground">{selectedItem?.name}</span>
                                  {" "}· Current:{" "}
                                  <span className="font-medium text-foreground">
                                    {selectedItem?.currentStock} {selectedItem?.unit}
                                  </span>
                                </DialogDescription>
                              </DialogHeader>

                              <div className="py-2 space-y-2">
                                <Label htmlFor="adjust-amount">Amount ({selectedItem?.unit})</Label>
                                <Input
                                  id="adjust-amount"
                                  type="number"
                                  min="1"
                                  placeholder="e.g. 10"
                                  value={adjustAmount}
                                  onChange={e => setAdjustAmount(e.target.value)}
                                />
                              </div>

                              <DialogFooter className="gap-2">
                                <Button
                                  variant="outline"
                                  className="flex-1 gap-1.5"
                                  disabled={isUpdating || !adjustAmount || Number(adjustAmount) <= 0}
                                  onClick={() => handleAdjust("subtract")}
                                >
                                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Minus className="h-4 w-4" />}
                                  Remove
                                </Button>
                                <Button
                                  className="flex-1 gap-1.5"
                                  disabled={isUpdating || !adjustAmount || Number(adjustAmount) <= 0}
                                  onClick={() => handleAdjust("add")}
                                >
                                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                  Add Stock
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reorder recommendations */}
      {highRisk.length > 0 && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-red-500 flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4" />
              Reorder Recommendations
              <Badge variant="destructive" className="ml-auto">
                {highRisk.length} urgent
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {highRisk.map(item => (
                <div key={item.id} className="p-4 rounded-lg bg-card border border-red-500/20 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <p className="font-medium text-sm leading-tight">{item.name}</p>
                    <Badge variant="destructive" className="text-xs shrink-0">Urgent</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {item.currentStock} {item.unit} remaining · min {item.minStock} {item.unit}
                  </p>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-red-500"
                      style={{ width: `${Math.min(100, (item.currentStock / item.maxStock) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Vendor: <span className="font-medium text-foreground">{item.vendor}</span>
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}