import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { AlertTriangle, TrendingUp, TrendingDown, Plus, Minus, Save, Package } from "lucide-react";
import { Label } from "./ui/label";

interface StockItem {
  id: string;
  name: string;
  current: number;
  optimal: number;
  min: number;
  unit: string;
  status: "good" | "warning" | "critical";
  trend: number;
  lastUpdated: string;
}

const initialStock: StockItem[] = [
  { id: "1", name: "Chicken", current: 45, optimal: 60, min: 30, unit: "kg", status: "warning", trend: -8, lastUpdated: "2 hours ago" },
  { id: "2", name: "Rice", current: 120, optimal: 100, min: 50, unit: "kg", status: "good", trend: 12, lastUpdated: "1 hour ago" },
  { id: "3", name: "Cooking Oil", current: 15, optimal: 25, min: 10, unit: "L", status: "critical", trend: -15, lastUpdated: "30 mins ago" },
  { id: "4", name: "Vegetables Mix", current: 35, optimal: 40, min: 20, unit: "kg", status: "warning", trend: -5, lastUpdated: "45 mins ago" },
  { id: "5", name: "Spices Mix", current: 80, optimal: 50, min: 25, unit: "kg", status: "good", trend: 20, lastUpdated: "3 hours ago" },
  { id: "6", name: "Noodles", current: 55, optimal: 60, min: 30, unit: "kg", status: "good", trend: 5, lastUpdated: "2 hours ago" },
];

export function StockManagement() {
  const [stockItems, setStockItems] = useState<StockItem[]>(initialStock);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<number>(0);

  const updateStock = (id: string, newValue: number) => {
    setStockItems(items =>
      items.map(item => {
        if (item.id === id) {
          const status =
            newValue <= item.min ? "critical" :
            newValue < item.optimal ? "warning" : "good";
          return { ...item, current: newValue, status, lastUpdated: "Just now" };
        }
        return item;
      })
    );
    setEditingId(null);
  };

  const quickAdjust = (id: string, delta: number) => {
    const item = stockItems.find(i => i.id === id);
    if (item) {
      updateStock(id, Math.max(0, item.current + delta));
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl mb-2 tracking-tight flex items-center gap-3">
            <Package className="w-12 h-12 text-secondary" />
            Stock Management
          </h1>
          <p className="text-muted-foreground text-lg">Track and update your inventory in real-time</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Last Sync</p>
          <p className="text-lg">Just now</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 border-2 shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
          <p className="text-sm text-green-700 mb-1">Good Stock</p>
          <p className="text-4xl text-green-900">{stockItems.filter(i => i.status === "good").length}</p>
          <p className="text-xs text-green-600 mt-1">Items at optimal levels</p>
        </Card>
        <Card className="p-5 border-2 shadow-md bg-gradient-to-br from-amber-50 to-yellow-50">
          <p className="text-sm text-amber-700 mb-1">Low Stock</p>
          <p className="text-4xl text-amber-900">{stockItems.filter(i => i.status === "warning").length}</p>
          <p className="text-xs text-amber-600 mt-1">Need ordering soon</p>
        </Card>
        <Card className="p-5 border-2 shadow-md bg-gradient-to-br from-red-50 to-rose-50">
          <p className="text-sm text-red-700 mb-1">Critical</p>
          <p className="text-4xl text-red-900">{stockItems.filter(i => i.status === "critical").length}</p>
          <p className="text-xs text-red-600 mt-1">Urgent action needed</p>
        </Card>
        <Card className="p-5 border-2 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
          <p className="text-sm text-blue-700 mb-1">Total Items</p>
          <p className="text-4xl text-blue-900">{stockItems.length}</p>
          <p className="text-xs text-blue-600 mt-1">Being tracked</p>
        </Card>
      </div>

      {/* Stock Items */}
      <div className="space-y-4">
        <h2 className="text-2xl">Inventory Items</h2>

        {stockItems.map((item) => (
          <Card key={item.id} className="p-6 border-2 hover:border-secondary transition-all duration-200 shadow-md">
            <div className="flex items-start gap-6">
              {/* Traffic Light Indicator */}
              <div className="flex flex-col gap-2 pt-1">
                <div
                  className={`w-5 h-5 rounded-full transition-all duration-300 ${
                    item.status === 'good'
                      ? 'bg-success shadow-lg shadow-success/50 animate-pulse'
                      : 'bg-gray-200'
                  }`}
                />
                <div
                  className={`w-5 h-5 rounded-full transition-all duration-300 ${
                    item.status === 'warning'
                      ? 'bg-warning shadow-lg shadow-warning/50 animate-pulse'
                      : 'bg-gray-200'
                  }`}
                />
                <div
                  className={`w-5 h-5 rounded-full transition-all duration-300 ${
                    item.status === 'critical'
                      ? 'bg-destructive shadow-lg shadow-destructive/50 animate-pulse'
                      : 'bg-gray-200'
                  }`}
                />
              </div>

              {/* Item Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl mb-1">{item.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Last updated: {item.lastUpdated}</span>
                      <div className="flex items-center gap-1">
                        {item.trend > 0 ? (
                          <TrendingUp className="w-4 h-4 text-success" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-destructive" />
                        )}
                        <span className={item.trend > 0 ? "text-success" : "text-destructive"}>
                          {Math.abs(item.trend)}% trend
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={
                    item.status === 'good' ? 'secondary' :
                    item.status === 'warning' ? 'outline' :
                    'destructive'
                  }>
                    {item.status === 'good' ? '✓ Good' :
                     item.status === 'warning' ? '⚠ Low' :
                     '⚠ Critical'}
                  </Badge>
                </div>

                {/* Stock Levels */}
                <div className="grid grid-cols-3 gap-6 mb-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Current Stock</Label>
                    <p className="text-2xl">
                      {item.current} <span className="text-base text-muted-foreground">{item.unit}</span>
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Optimal Level</Label>
                    <p className="text-2xl text-muted-foreground">
                      {item.optimal} <span className="text-base">{item.unit}</span>
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Minimum Level</Label>
                    <p className="text-2xl text-muted-foreground">
                      {item.min} <span className="text-base">{item.unit}</span>
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        item.status === 'good' ? 'bg-success' :
                        item.status === 'warning' ? 'bg-warning' :
                        'bg-destructive'
                      }`}
                      style={{ width: `${Math.min((item.current / item.optimal) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0 {item.unit}</span>
                    <span>{item.optimal} {item.unit}</span>
                  </div>
                </div>

                {/* Manual Input Controls */}
                <div className="flex items-center gap-3">
                  {editingId === item.id ? (
                    <>
                      <Input
                        type="number"
                        value={tempValue}
                        onChange={(e) => setTempValue(Number(e.target.value))}
                        className="w-32"
                        placeholder="Enter amount"
                      />
                      <Button size="sm" onClick={() => updateStock(item.id, tempValue)}>
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => quickAdjust(item.id, -5)}
                      >
                        <Minus className="w-4 h-4 mr-1" />
                        Take 5
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => quickAdjust(item.id, 5)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add 5
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setEditingId(item.id);
                          setTempValue(item.current);
                        }}
                      >
                        Manual Update
                      </Button>
                    </>
                  )}
                </div>

                {/* Alerts */}
                {item.status === 'critical' && (
                  <div className="mt-4 p-3 bg-red-50 border-2 border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-800">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span><strong>Critical:</strong> Stock below minimum! Order immediately to avoid rush delivery costs.</span>
                  </div>
                )}
                {item.status === 'warning' && (
                  <div className="mt-4 p-3 bg-amber-50 border-2 border-amber-200 rounded-lg text-sm text-amber-800">
                    <span><strong>Warning:</strong> Stock running low. Order within 2 days to maintain optimal levels.</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
