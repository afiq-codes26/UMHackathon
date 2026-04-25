"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart,
  AlertTriangle, Clock, Package, Trash2, Users,
} from "lucide-react"
import { promotionalEvents } from "@/lib/mock-data"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { format } from "date-fns"

interface DashboardData {
  vendors: number
  income: number
  expense: number
  rush: number
  wasteCost: number
  totalTransactions: number
  averageOrderValue: number
  stockAlerts: number
  history: { date: string; sales: number }[]
  yesterdaySales: number
  predictedRushTime: string
}

export function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/dashboard", { cache: "no-store" })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setData(d) })
      .catch(err => console.error("[Dashboard] fetch error:", err))
      .finally(() => setLoading(false))
  }, [])

  // ── Derived ─────────────────────────────────────────────────────────────────

  const income           = data?.income ?? 0
  const yesterdaySales   = data?.yesterdaySales ?? 1
  const salesChange      = (((income - yesterdaySales) / Math.max(yesterdaySales, 1)) * 100).toFixed(1)
  const isPositive       = Number(salesChange) >= 0
  const stockAlerts      = data?.stockAlerts ?? 0
  const history          = data?.history ?? []

  if (loading) {
    return (
      <div className="p-10 text-center animate-pulse text-muted-foreground">
        Syncing with Database…
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
          <p className="text-muted-foreground">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
        </div>
        {stockAlerts > 0 && (
          <Badge variant="destructive" className="flex items-center gap-2 w-fit animate-pulse">
            <AlertTriangle className="h-4 w-4" />
            {stockAlerts} Low Stock Alerts
          </Badge>
        )}
      </div>

      {/* Top metrics */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              RM {income.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className={`flex items-center text-xs mt-1 ${isPositive ? "text-green-500" : "text-red-500"}`}>
              {isPositive
                ? <TrendingUp className="h-3 w-3 mr-1" />
                : <TrendingDown className="h-3 w-3 mr-1" />
              }
              {isPositive ? "+" : ""}{salesChange}% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {data?.totalTransactions ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg: RM {(data?.averageOrderValue ?? 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Next Rush Hour</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {data?.predictedRushTime ?? "12:30 PM"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Based on historical data</p>
          </CardContent>
        </Card>

        <Card className={`shadow-sm ${stockAlerts > 0 ? "border-red-500/50 bg-red-500/5" : ""}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stock Alerts</CardTitle>
            <Package className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stockAlerts}</div>
            <p className="text-xs text-muted-foreground mt-1">Items need restocking</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Sales Trend */}
      <Card className="overflow-hidden shadow-sm border-muted/40">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <TrendingUp className="h-5 w-5 text-primary" />
            Weekly Sales Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="h-[350px] flex items-center justify-center text-muted-foreground text-sm">
              No sales data yet — add income transactions to see the chart.
            </div>
          ) : (
            <div className="h-[350px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={v => `RM ${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                    formatter={(v: number) => [`RM ${v.toLocaleString()}`, "Sales"]}
                  />
                  <Area
                    dataKey="sales"
                    type="monotone"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fill="url(#salesGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: Users,
            iconColor: "text-primary",
            bgColor: "bg-primary/10",
            value: data?.vendors ?? 0,
            label: "Active Vendors",
          },
          {
            icon: Package,
            iconColor: "text-orange-500",
            bgColor: "bg-orange-500/10",
            value: data?.rush ?? 0,
            label: "Rush Orders",
          },
          {
            icon: Trash2,
            iconColor: "text-red-500",
            bgColor: "bg-red-500/10",
            value: `RM ${(data?.wasteCost ?? 0).toFixed(2)}`,
            label: "Total Waste Cost",
          },
          {
            icon: DollarSign,
            iconColor: "text-green-500",
            bgColor: "bg-green-500/10",
            value: `RM ${(data?.income ?? 0).toLocaleString()}`,
            label: "Live Revenue",
          },
        ].map(({ icon: Icon, iconColor, bgColor, value, label }) => (
          <Card key={label} className="bg-secondary/50 shadow-sm border-none">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className={`p-3 rounded-full ${bgColor}`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}