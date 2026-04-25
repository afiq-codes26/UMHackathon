"use client"

import React, { useState } from "react" // Added useState
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, AlertTriangle,
  Clock, Package, Trash2, Users, Zap, CheckCircle
} from "lucide-react"
import { promotionalEvents } from "@/lib/mock-data"
import { useLiveDataContext } from "@/lib/live-data-context"
// Added 'Sector' to the Recharts imports
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Sector } from "recharts"
import { format } from "date-fns"

const categoryData = [
  { name: "Main", value: 65, color: "#22c55e" },
  { name: "Drinks", value: 20, color: "#3b82f6" },
  { name: "Snacks", value: 10, color: "#f59e0b" },
  { name: "Add-ons", value: 5, color: "#8b5cf6" },
]

// Custom shape for the hover "pop" effect
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  )
}

export function DashboardOverview() {
  const liveData = useLiveDataContext()
  const [activeIndex, setActiveIndex] = useState<number | null>(null) // State for hover tracking

  const metrics = liveData?.metrics
  const salesData = liveData?.salesData ?? []
  const stockItems = liveData?.stockItems ?? []

  const todaySales = metrics?.todaySales ?? 0
  const yesterdaySales = metrics?.yesterdaySales ?? 1
  const salesChange = (((todaySales - yesterdaySales) / yesterdaySales) * 100).toFixed(1)
  const isPositive = Number(salesChange) > 0
  const lowStockItems = stockItems.filter((i) => i.riskLevel === "high")
  const lowStockCount = lowStockItems.length
  const upcomingEvents = promotionalEvents.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Header & Key Metrics remain the same... */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
          <p className="text-muted-foreground">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
        </div>
        {lowStockCount > 0 && (
          <Badge variant="destructive" className="flex items-center gap-2 w-fit animate-pulse">
            <AlertTriangle className="h-4 w-4" />
            {lowStockCount} Low Stock Alerts
          </Badge>
        )}
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* ... (Metrics Cards Code) ... */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Sales</CardTitle>
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
        {/* (Repeat for other 3 metric cards) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics?.totalTransactions ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Avg: RM {(metrics?.averageOrderValue ?? 0).toFixed(2)}</p>
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
        <Card className={lowStockCount > 0 ? "border-danger/50 bg-danger/5" : ""}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stock Alerts</CardTitle>
            <Package className="h-4 w-4 text-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Items need restocking</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Sales Trend Card */}
        <Card className="lg:col-span-2 overflow-hidden shadow-sm border-muted/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <TrendingUp className="h-5 w-5 text-primary" />
              Weekly Sales Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  {/* The "Pro" Grid: Using subtle strokes for a blueprint feel */}
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={true}
                    stroke="hsl(var(--muted-foreground))"
                    opacity={0.1}
                  />

                  <XAxis
                    dataKey="date"
                    axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    dy={10}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    tickFormatter={(v) => `RM ${v}`}
                  />

                  <Tooltip
                    cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1 }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background/95 backdrop-blur-sm border border-border p-3 rounded-lg shadow-2xl animate-in fade-in zoom-in duration-200">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">{label}</p>
                            <p className="text-sm font-bold text-primary">RM {payload[0].value?.toLocaleString()}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    fill="url(#salesGradient)"
                    isAnimationActive={true}
                    animationDuration={1500}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* IMPROVISED Pie Chart Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Sales by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-[200px]">
              {/* Smooth Label Container */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span
                  className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest transition-all duration-500 ease-out"
                  style={{
                    opacity: activeIndex !== null ? 1 : 0.7,
                    transform: activeIndex !== null ? 'translateY(0)' : 'translateY(2px)'
                  }}
                >
                  {activeIndex !== null ? categoryData[activeIndex].name : "Total Revenue"}
                </span>

                <span
                  className="text-3xl font-black text-foreground tabular-nums transition-all duration-300 ease-out"
                  style={{
                    transform: activeIndex !== null ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {activeIndex !== null ? `${categoryData[activeIndex].value}%` : "100%"}
                </span>
              </div>

              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex ?? undefined}
                    activeShape={renderActiveShape}
                    data={categoryData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    stroke="none"
                    // Smoothly animate the pie segments themselves
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {categoryData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.color}
                        className="transition-opacity duration-300 outline-none"
                        style={{ opacity: activeIndex === null || activeIndex === i ? 1 : 0.4 }}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend Grid with Hover Sync */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((item, index) => (
                <div
                  key={item.name}
                  className={`flex items-center gap-2 p-1 rounded transition-colors cursor-default ${activeIndex === index ? 'bg-secondary' : ''}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className={`text-xs ${activeIndex === index ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rest of the UI (Alerts, Quick Stats) remains the same... */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ... Critical Stock Alerts & Upcoming Events ... */}
        <Card className="h-full border-danger/30 bg-danger/5 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-danger flex items-center gap-2 text-lg font-bold">
              <AlertTriangle className="h-5 w-5" />
              Reorder Recommendations
            </CardTitle>
            <p className="text-xs text-muted-foreground italic">
              Automated replenishment suggestions based on current inventory levels.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-background border border-danger/20 hover:border-danger/40 transition-colors shadow-sm"
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-foreground">{item.name}</p>
                    <Badge variant="destructive" className="text-[10px] uppercase font-bold animate-pulse">
                      Urgent
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3">
                    Only <span className="font-bold text-danger">{item.currentStock.toFixed(2)} {item.unit}</span> left • Min: {item.minStock} {item.unit}
                  </p>

                  <div className="flex justify-between items-end border-t pt-2 mt-2 border-dashed border-muted">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Preferred Vendor</p>
                      <p className="text-sm font-medium">{item.vendor || "Market Supplier"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Est. Cost</p>
                      <p className="text-sm font-bold text-danger">
                        RM {((item.maxStock - item.currentStock) * (item.costPerUnit || 5.5)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {lowStockItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-muted rounded-xl bg-background/50">
                  <CheckCircle className="h-8 w-8 text-success mb-2 opacity-50" />
                  <p className="text-sm font-medium text-muted-foreground">Inventory Levels Optimal</p>
                </div>
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

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* ... Quick Stats Cards ... */}
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