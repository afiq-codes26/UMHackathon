"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Trash2,
  Plus,
  TrendingDown,
  AlertTriangle,
  Calendar,
  DollarSign,
  Package,
  Leaf,
  Target,
  BarChart3
} from "lucide-react"
import { wasteRecords as initialWasteRecords, stockItems, type WasteRecord } from "@/lib/mock-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts"
import { format } from "date-fns"

export function WasteSpoilageTracker() {
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>(initialWasteRecords)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newWaste, setNewWaste] = useState({
    item: '',
    quantity: '',
    unit: 'kg',
    reason: 'expired' as WasteRecord['reason'],
    cost: ''
  })

  const totalWasteCost = wasteRecords.reduce((sum, r) => sum + r.cost, 0)
  const wasteByReason = {
    expired: wasteRecords.filter(r => r.reason === 'expired').reduce((sum, r) => sum + r.cost, 0),
    spoiled: wasteRecords.filter(r => r.reason === 'spoiled').reduce((sum, r) => sum + r.cost, 0),
    damaged: wasteRecords.filter(r => r.reason === 'damaged').reduce((sum, r) => sum + r.cost, 0),
    overproduction: wasteRecords.filter(r => r.reason === 'overproduction').reduce((sum, r) => sum + r.cost, 0),
    other: wasteRecords.filter(r => r.reason === 'other').reduce((sum, r) => sum + r.cost, 0),
  }

  const pieData = Object.entries(wasteByReason)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      percentage: ((value / totalWasteCost) * 100).toFixed(1)
    }))

  const COLORS = ['#ef4444', '#f59e0b', '#8b5cf6', '#3b82f6', '#6b7280']

  const dailyWaste = [
    { date: 'Apr 20', waste: 22.6, target: 15 },
    { date: 'Apr 21', waste: 18.5, target: 15 },
    { date: 'Apr 22', waste: 31.9, target: 15 },
    { date: 'Apr 23', waste: 44.5, target: 15 },
    { date: 'Apr 24', waste: 0, target: 15 },
  ]

  const topWastedItems = [
    { item: 'Chicken Thigh', cost: 37, count: 1 },
    { item: 'Nasi Lemak', cost: 27.5, count: 1 },
    { item: 'Coconut Milk', cost: 13, count: 1 },
    { item: 'Sambal', cost: 12.5, count: 1 },
    { item: 'Rice', cost: 9.6, count: 1 },
  ]

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'expired': return 'bg-danger text-white'
      case 'spoiled': return 'bg-warning text-foreground'
      case 'damaged': return 'bg-purple-500 text-white'
      case 'overproduction': return 'bg-primary text-primary-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case 'expired': return '⏰'
      case 'spoiled': return '🔴'
      case 'damaged': return '💥'
      case 'overproduction': return '📈'
      default: return '❓'
    }
  }

  const handleAddWaste = () => {
    if (!newWaste.item || !newWaste.quantity || !newWaste.cost) return

    const record: WasteRecord = {
      id: Date.now().toString(),
      item: newWaste.item,
      quantity: parseFloat(newWaste.quantity),
      unit: newWaste.unit,
      reason: newWaste.reason,
      date: format(new Date(), 'yyyy-MM-dd'),
      cost: parseFloat(newWaste.cost)
    }

    setWasteRecords([record, ...wasteRecords])
    setNewWaste({ item: '', quantity: '', unit: 'kg', reason: 'expired', cost: '' })
    setIsAddDialogOpen(false)
  }

  // Calculate waste reduction percentage (mock)
  const lastWeekWaste = 180
  const wasteReduction = ((lastWeekWaste - totalWasteCost) / lastWeekWaste * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Leaf className="h-6 w-6 text-success" />
            AI Waste & Spoilage Tracker
          </h2>
          <p className="text-muted-foreground">Track, analyze, and reduce food waste</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 w-fit">
              <Plus className="h-4 w-4" />
              Log Waste
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Waste/Spoilage</DialogTitle>
              <DialogDescription>Record any food waste or spoiled items</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Item</Label>
                <Select value={newWaste.item} onValueChange={(v) => setNewWaste({...newWaste, item: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    {stockItems.map(item => (
                      <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>
                    ))}
                    <SelectItem value="Nasi Lemak">Nasi Lemak (Prepared)</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Quantity</Label>
                  <Input 
                    type="number"
                    min="0"
                    step="0.1"
                    value={newWaste.quantity}
                    onChange={(e) => setNewWaste({...newWaste, quantity: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Unit</Label>
                  <Select value={newWaste.unit} onValueChange={(v) => setNewWaste({...newWaste, unit: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="pcs">pieces</SelectItem>
                      <SelectItem value="L">liters</SelectItem>
                      <SelectItem value="portions">portions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Reason</Label>
                <Select value={newWaste.reason} onValueChange={(v) => setNewWaste({...newWaste, reason: v as WasteRecord['reason']})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expired">⏰ Expired</SelectItem>
                    <SelectItem value="spoiled">🔴 Spoiled</SelectItem>
                    <SelectItem value="damaged">💥 Damaged</SelectItem>
                    <SelectItem value="overproduction">📈 Overproduction</SelectItem>
                    <SelectItem value="other">❓ Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Estimated Cost (RM)</Label>
                <Input 
                  type="number"
                  min="0"
                  step="0.01"
                  value={newWaste.cost}
                  onChange={(e) => setNewWaste({...newWaste, cost: e.target.value})}
                  placeholder="0.00"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddWaste} className="bg-primary text-primary-foreground">Save Record</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-danger/30 bg-danger/5">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-danger/20">
              <Trash2 className="h-6 w-6 text-danger" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">RM {totalWasteCost.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Total Waste (Week)</p>
            </div>
          </CardContent>
        </Card>

        <Card className={Number(wasteReduction) > 0 ? "border-success/30 bg-success/5" : ""}>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-success/20">
              <TrendingDown className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{wasteReduction}%</p>
              <p className="text-sm text-muted-foreground">Reduction vs Last Week</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-warning/20">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{wasteRecords.length}</p>
              <p className="text-sm text-muted-foreground">Waste Events</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-primary/20">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">RM 15/day</p>
              <p className="text-sm text-muted-foreground">Daily Target</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Waste by Reason Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Waste by Reason
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`RM ${value.toFixed(2)}`, 'Cost']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Daily Waste Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Daily Waste vs Target
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyWaste}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`RM ${value}`, '']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="waste" 
                    name="Actual Waste"
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    name="Daily Target"
                    stroke="#22c55e" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Wasted Items and Recent Records */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Wasted Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-danger" />
              Top Wasted Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topWastedItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-muted-foreground">#{i + 1}</span>
                    <span className="font-medium">{item.item}</span>
                  </div>
                  <Badge variant="destructive">RM {item.cost.toFixed(2)}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Waste Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Waste Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {wasteRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getReasonIcon(record.reason)}</span>
                    <div>
                      <p className="font-medium">{record.item}</p>
                      <p className="text-sm text-muted-foreground">
                        {record.quantity} {record.unit} • {record.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getReasonColor(record.reason)}>
                      {record.reason}
                    </Badge>
                    <span className="font-bold text-danger">-RM {record.cost.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="border-success/20 bg-gradient-to-br from-success/5 to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-success" />
            AI Waste Reduction Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 rounded-lg bg-card border">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <span className="font-semibold text-foreground">High Spoilage Alert</span>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Chicken Thigh</span> accounts for 31% of waste. 
                Consider reducing daily order by 2kg or improving cold storage.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-5 w-5 text-success" />
                <span className="font-semibold text-foreground">Prep Optimization</span>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Nasi Lemak overproduction</span> detected. 
                Based on Tuesday traffic, prepare 15% fewer portions on weekdays.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card border">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">FIFO Reminder</span>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">3 items</span> expiring within 2 days. 
                Use Coconut Milk and Sambal first to prevent spoilage.
              </p>
            </div>
          </div>

          {/* Sustainability Score */}
          <div className="mt-6 p-4 rounded-lg bg-card border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold text-foreground">Sustainability Score</h4>
                <p className="text-sm text-muted-foreground">Based on waste reduction performance</p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-bold text-success">72</span>
                <span className="text-muted-foreground">/100</span>
              </div>
            </div>
            <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-danger via-warning to-success" style={{ width: '72%' }} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Poor</span>
              <span>Average</span>
              <span>Good</span>
              <span>Excellent</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
