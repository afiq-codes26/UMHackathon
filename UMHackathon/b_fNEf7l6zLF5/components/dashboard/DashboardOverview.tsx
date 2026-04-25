"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, AlertTriangle,
  Clock, Package, Trash2, Users, Zap,
} from "lucide-react"
import { promotionalEvents } from "@/lib/mock-data"
import { useLiveDataContext } from "@/lib/live-data-context"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { format } from "date-fns"

const categoryData = [
  { name: "Main", value: 65, color: "#22c55e" },
  { name: "Drinks", value: 20, color: "#3b82f6" },
  { name: "Snacks", value: 10, color: "#f59e0b" },
  { name: "Add-ons", value: 5, color: "#8b5cf6" },
]

export function DashboardOverview() {
  const liveData = useLiveDataContext()
  const metrics = liveData?.metrics
  const salesData = liveData?.salesData ?? []
  const stockItems = liveData?.stockItems ?? []

  const todaySales = metrics?.todaySales ?? 0
  const yesterdaySales = metrics?.yesterdaySales ?? 1
  const salesChange = (((todaySales - yesterdaySales) / yesterdaySales) * 100).toFixed(1)
  const isPositive = Number(salesChange) > 0
  const lowStockItems = stockItems.filter((i) => i.riskLevel === "high")
  const upcomingEvents = promotionalEvents.slice(0, 3)

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
          <p className="text-muted-foreground">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
        </div>
        {lowStockItems.length > 0 && (
          <Badge variant="destructive" className="flex items-center gap-2 w-fit animate-pulse">
            <AlertTriangle className="h-4 w-4" />
            {lowStockItems.length} Low Stock Alerts
          </Badge>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today&apos;s Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              RM {todaySales.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
            <div className={`flex items-center text-xs mt-1 ${isPositive ? "text-success" : "text-danger"}`}>
              {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {isPositive ? "+" : ""}{salesChange}% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics?.totalTransactions ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg: RM {(metrics?.averageOrderValue ?? 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Next Rush Hour</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics?.predictedRushTime ?? "—"}</div>
            <p className="text-xs text-muted-foreground mt-1">~95 customers expected</p>
          </CardContent>
        </Card>

        <Card className={lowStockItems.length > 0 ? "border-danger/50 bg-danger/5" : ""}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stock Alerts</CardTitle>
            <Package className="h-4 w-4 text-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics?.lowStockAlerts ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Items need restocking</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Weekly Sales Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                    formatter={(v: number) => [`RM ${v}`, "Sales"]}
                  />
                  <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" fill="url(#salesGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Sales by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                    formatter={(v: number) => [`${v}%`, "Share"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Events */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-danger">
              <AlertTriangle className="h-5 w-5" />
              Critical Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-danger/10 border border-danger/20">
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.currentStock} {item.unit} remaining (Min: {item.minStock})
                    </p>
                  </div>
                  <Badge variant="destructive">Order Now</Badge>
                </div>
              ))}
              {lowStockItems.length === 0 && (
                <p className="text-center text-muted-foreground py-4">All stock levels are healthy!</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-warning" />
              Upcoming Events & Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{event.name}</p>
                      <Badge variant={event.type === "festival" ? "default" : "outline"}>{event.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${event.expectedImpact > 100 ? "text-success" : "text-foreground"}`}>
                      +{event.expectedImpact - 100}%
                    </p>
                    <p className="text-xs text-muted-foreground">Impact</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="bg-secondary/50">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">{metrics?.activeVendors ?? 0}</p>
              <p className="text-sm text-muted-foreground">Active Vendors</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/50">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-warning/10"><Package className="h-5 w-5 text-warning" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">{metrics?.pendingOrders ?? 0}</p>
              <p className="text-sm text-muted-foreground">Pending Orders</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/50">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-danger/10"><Trash2 className="h-5 w-5 text-danger" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">RM {(metrics?.wasteThisWeek ?? 0).toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Waste This Week</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/50">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-success/10"><DollarSign className="h-5 w-5 text-success" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">RM {(metrics?.monthlyTotal ?? 0).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}