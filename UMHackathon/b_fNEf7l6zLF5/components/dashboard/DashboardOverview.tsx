"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, AlertTriangle,
  Clock, Package, Trash2, Users, Zap
} from "lucide-react"
import { promotionalEvents } from "@/lib/mock-data"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Sector } from "recharts"
import { format } from "date-fns"

export function DashboardOverview() {
  
  // --- DATABASE STATE LINKAGE ---
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAllStats() {
      try {
        // Direct link to your route.ts path
        const response = await fetch('/api/dashboard/stats', {
          method: 'GET',
          cache: 'no-store'
        });

        if (response.ok) {
          const data = await response.json();
          console.log("DATABASE CONNECTED:", data); // Check Console for this!
          setDashboardData(data);
        } else {
          console.error("Route found but server error:", response.status);
        }
      } catch (error) {
        console.error("Browser cannot reach the API path:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllStats();
  }, []);

  // --- DERIVED METRICS FROM DATABASE ---
  // Use the JSON keys you just sent me
  const todaySales = dashboardData?.income ?? 0
  const activeVendors = dashboardData?.vendors ?? 0
  const pendingRushOrders = dashboardData?.rush ?? 0
  const totalWaste = dashboardData?.wasteCost ?? 0
  const salesHistory = dashboardData?.history ?? []
  const totalTransactions = 17 // Since your JSON doesn't have this, we'll hardcode or add to API
  const yesterdaySales = dashboardData?.yesterdaySales ?? 1 // Avoid div by zero
  const salesChange = (((todaySales - yesterdaySales) / yesterdaySales) * 100).toFixed(1)
  const isPositive = Number(salesChange) >= 0

  const lowStockCount = dashboardData?.stockAlerts ?? 0
  const upcomingEvents = promotionalEvents.slice(0, 3)

  if (loading) {
    return <div className="p-10 text-center animate-pulse text-muted-foreground">Syncing with Database...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Top Row Metrics */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              RM {todaySales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className={`flex items-center text-xs mt-1 ${isPositive ? "text-green-500" : "text-red-500"}`}>
              {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
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
            {/* This matches the new key in your API */}
            <div className="text-2xl font-bold text-foreground">
              {dashboardData?.totalTransactions ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg: RM {(dashboardData?.averageOrderValue ?? 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Next Rush Hour</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{dashboardData?.predictedRushTime ?? "12:30 PM"}</div>
            <p className="text-xs text-muted-foreground mt-1">Based on historical data</p>
          </CardContent>
        </Card>

        <Card className={`${lowStockCount > 0 ? "border-red-500/50 bg-red-500/5 shadow-sm" : "shadow-sm"}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stock Alerts</CardTitle>
            <Package className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Items need restocking</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-1"> {/* Changed to 1 col or keep as 3 and span 3 */}
  {/* Weekly Trend - Now full width or centered */}
  <Card className="lg:col-span-3 overflow-hidden shadow-sm border-muted/40">
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center gap-2 text-lg font-semibold">
        <TrendingUp className="h-5 w-5 text-primary" />
        Weekly Sales Trend
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-[350px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="hsl(var(--muted-foreground))" opacity={0.1} />
            <XAxis dataKey="date" axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickFormatter={(v) => `RM ${v}`} />
            <Tooltip cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1 }} content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-background/95 backdrop-blur-sm border border-border p-3 rounded-lg shadow-xl">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">{label}</p>
                    <p className="text-sm font-bold text-primary">RM {payload[0].value?.toLocaleString()}</p>
                  </div>
                );
              }
              return null;
            }} />
            <Area dataKey="sales" type="monotone" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#salesGradient)" isAnimationActive={true} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>

       
      </div>

      {/* Linked Quick Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="bg-secondary/50 shadow-sm border-none">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
            <div>
              {/* Changed from .activeVendors to .vendors */}
              <p className="text-2xl font-bold text-foreground">{dashboardData?.vendors ?? 0}</p>
              <p className="text-sm text-muted-foreground">Active Vendors</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/50 shadow-sm border-none">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-orange-500/10"><Package className="h-5 w-5 text-orange-500" /></div>
            <div>
              {/* Changed from .pendingOrders to .rush */}
              <p className="text-2xl font-bold text-foreground">{dashboardData?.rush ?? 0}</p>
              <p className="text-sm text-muted-foreground">Rush Orders</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/50 shadow-sm border-none">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-red-500/10"><Trash2 className="h-5 w-5 text-red-500" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">RM {(dashboardData?.wasteCost ?? 0).toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Total Waste</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/50 shadow-sm border-none">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-green-500/10"><DollarSign className="h-5 w-5 text-green-500" /></div>
            <div>
              {/* Changed from .todaySales to .income */}
              <p className="text-2xl font-bold text-foreground">RM {(dashboardData?.income ?? 0).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Live Revenue</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}