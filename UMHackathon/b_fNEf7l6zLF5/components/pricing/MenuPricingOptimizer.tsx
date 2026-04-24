"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Target,
  BarChart3,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Check,
  AlertCircle
} from "lucide-react"
import { menuItems as initialMenuItems, type MenuItem } from "@/lib/mock-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis } from "recharts"

export function MenuPricingOptimizer() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [targetMargin, setTargetMargin] = useState([55])
  const [isOptimizing, setIsOptimizing] = useState(false)

  const avgMargin = menuItems.reduce((sum, item) => sum + item.margin, 0) / menuItems.length
  const potentialRevenue = menuItems.reduce((sum, item) => {
    const diff = item.suggestedPrice - item.currentPrice
    return sum + (diff > 0 ? diff * item.popularity : 0)
  }, 0)

  const marginData = menuItems.map(item => ({
    name: item.name.length > 12 ? item.name.substring(0, 12) + '...' : item.name,
    margin: item.margin,
    target: targetMargin[0]
  }))

  const priceVsPopularity = menuItems.map(item => ({
    name: item.name,
    price: item.currentPrice,
    popularity: item.popularity,
    margin: item.margin,
    category: item.category
  }))

  const handleOptimize = () => {
    setIsOptimizing(true)
    setTimeout(() => {
      setMenuItems(prev => prev.map(item => ({
        ...item,
        suggestedPrice: Math.round((item.costToMake / (1 - targetMargin[0] / 100)) * 2) / 2
      })))
      setIsOptimizing(false)
    }, 1500)
  }

  const handleApplyPrice = (itemId: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, currentPrice: item.suggestedPrice, lastPriceUpdate: new Date().toISOString().split('T')[0] }
        : item
    ))
  }

  const getPriceChangeStatus = (item: MenuItem) => {
    const diff = item.suggestedPrice - item.currentPrice
    if (diff > 0) return { type: 'increase', icon: <ArrowUp className="h-4 w-4" />, color: 'text-success' }
    if (diff < 0) return { type: 'decrease', icon: <ArrowDown className="h-4 w-4" />, color: 'text-danger' }
    return { type: 'same', icon: <Check className="h-4 w-4" />, color: 'text-muted-foreground' }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent" />
            AI Menu Pricing Optimizer
          </h2>
          <p className="text-muted-foreground">Optimize your menu prices for maximum profitability</p>
        </div>
        <Button 
          onClick={handleOptimize} 
          disabled={isOptimizing}
          className="gap-2 bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
        >
          {isOptimizing ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {isOptimizing ? 'Analyzing...' : 'Run AI Optimization'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-primary/20">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{avgMargin.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Avg Margin</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-success/10">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">RM {potentialRevenue.toFixed(0)}</p>
              <p className="text-sm text-muted-foreground">Potential Gain/Day</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-warning/10">
              <AlertCircle className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{menuItems.filter(i => i.margin < 50).length}</p>
              <p className="text-sm text-muted-foreground">Below Target</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-accent/10">
              <BarChart3 className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{menuItems.length}</p>
              <p className="text-sm text-muted-foreground">Menu Items</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Target Margin Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Target Profit Margin
          </CardTitle>
          <CardDescription>Set your desired profit margin percentage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center gap-8">
              <div className="flex-1">
                <Slider
                  value={targetMargin}
                  onValueChange={setTargetMargin}
                  max={80}
                  min={30}
                  step={5}
                  className="w-full"
                />
              </div>
              <div className="w-20 text-center">
                <span className="text-3xl font-bold text-primary">{targetMargin[0]}%</span>
              </div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Conservative (30%)</span>
              <span>Balanced (50%)</span>
              <span>Aggressive (80%)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Margin by Item */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Profit Margin by Item
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marginData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" domain={[0, 80]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`${value}%`, 'Margin']}
                  />
                  <Bar dataKey="margin" radius={[0, 4, 4, 0]}>
                    {marginData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.margin >= targetMargin[0] ? '#22c55e' : entry.margin >= targetMargin[0] - 10 ? '#f59e0b' : '#ef4444'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Price vs Popularity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Price vs Popularity Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    type="number" 
                    dataKey="price" 
                    name="Price" 
                    unit="RM"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    label={{ value: 'Price (RM)', position: 'bottom', fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="popularity" 
                    name="Popularity"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    label={{ value: 'Popularity', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <ZAxis type="number" dataKey="margin" range={[50, 200]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number, name: string) => [
                      name === 'Price' ? `RM ${value}` : `${value}%`,
                      name
                    ]}
                  />
                  <Scatter data={priceVsPopularity} fill="hsl(var(--primary))" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Bubble size indicates profit margin
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Menu Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Menu Price Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Current Price</TableHead>
                  <TableHead>AI Suggested</TableHead>
                  <TableHead>Margin</TableHead>
                  <TableHead>Popularity</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menuItems.map((item) => {
                  const status = getPriceChangeStatus(item)
                  return (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">RM {item.costToMake.toFixed(2)}</TableCell>
                      <TableCell className="font-medium">RM {item.currentPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1 font-bold ${status.color}`}>
                          {status.icon}
                          RM {item.suggestedPrice.toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={item.margin >= targetMargin[0] ? 'bg-success text-white' : item.margin >= targetMargin[0] - 10 ? 'bg-warning text-foreground' : 'bg-danger text-white'}>
                          {item.margin}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary"
                              style={{ width: `${item.popularity}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{item.popularity}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.suggestedPrice !== item.currentPrice ? (
                          <Button 
                            size="sm" 
                            onClick={() => handleApplyPrice(item.id)}
                            className="gap-1 bg-primary text-primary-foreground"
                          >
                            <Check className="h-3 w-3" />
                            Apply
                          </Button>
                        ) : (
                          <Badge variant="secondary">Current</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            AI Pricing Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 rounded-lg bg-card border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <span className="font-semibold text-foreground">High Performer</span>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Teh Tarik</span> has 92% popularity with 71% margin. 
                Consider a RM 0.50 price increase - customers are unlikely to notice.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card border">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                <span className="font-semibold text-foreground">Underpriced Item</span>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Laksa</span> at RM 9 is below market average. 
                Competitors charge RM 11-13. Raising to RM 10.50 won&apos;t affect demand.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card border">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">Bundle Opportunity</span>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Roti Canai + Teh Tarik</span> combo at RM 5 
                would increase average order value while maintaining 65% margin.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
