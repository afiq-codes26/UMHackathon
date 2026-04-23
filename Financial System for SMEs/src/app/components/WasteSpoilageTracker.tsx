import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Leaf, AlertTriangle, TrendingDown, Sparkles, Trash2,
  BarChart3, ThumbsUp, Clock, PackageX, RefreshCw
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

interface WasteItem {
  id: string;
  ingredient: string;
  category: string;
  wastedToday: number;
  unit: string;
  costPerUnit: number;
  shelfLife: number; // days remaining
  avgWeeklyWaste: number;
  trend: "improving" | "worsening" | "stable";
  aiSuggestion: string;
  wasteReason: string;
}

const COLORS = ["#EF4444", "#F97316", "#EAB308", "#22C55E", "#3B82F6", "#8B5CF6"];

const weeklyWasteTrend = [
  { day: "Mon", waste: 185, saved: 0 },
  { day: "Tue", waste: 210, saved: 0 },
  { day: "Wed", waste: 165, saved: 45 },
  { day: "Thu", waste: 140, saved: 70 },
  { day: "Fri", waste: 120, saved: 95 },
  { day: "Sat", waste: 98, saved: 110 },
  { day: "Sun", waste: 85, saved: 125 },
];

const wasteByCategoryData = [
  { name: "Vegetables", value: 38 },
  { name: "Proteins", value: 24 },
  { name: "Dairy", value: 18 },
  { name: "Bread/Carbs", value: 12 },
  { name: "Others", value: 8 },
];

const initialWasteItems: WasteItem[] = [
  {
    id: "1", ingredient: "Vegetables Mix", category: "Produce",
    wastedToday: 4.2, unit: "kg", costPerUnit: 5.50, shelfLife: 1,
    avgWeeklyWaste: 18.5, trend: "improving",
    aiSuggestion: "Order 20% less Mon–Wed. Vegetable demand drops 35% midweek based on last 4 weeks of data.",
    wasteReason: "Over-ordering midweek",
  },
  {
    id: "2", ingredient: "Chicken", category: "Protein",
    wastedToday: 1.8, unit: "kg", costPerUnit: 18.00, shelfLife: 0,
    avgWeeklyWaste: 8.2, trend: "worsening",
    aiSuggestion: "Critical: Switch to daily delivery for chicken. Current 2-day ordering creates excess during slow days. Save ~RM 148/week.",
    wasteReason: "2-day batch ordering with uneven demand",
  },
  {
    id: "3", ingredient: "Bread/Roti", category: "Carbs",
    wastedToday: 12, unit: "pcs", costPerUnit: 0.80, shelfLife: 0,
    avgWeeklyWaste: 52, trend: "stable",
    aiSuggestion: "Run a 4pm 'Roti Special' discount to clear daily surplus. This could reduce bread waste by 60% and add RM25/day in afternoon revenue.",
    wasteReason: "Afternoon surplus not sold",
  },
  {
    id: "4", ingredient: "Fresh Herbs", category: "Produce",
    wastedToday: 0.3, unit: "kg", costPerUnit: 22.00, shelfLife: 2,
    avgWeeklyWaste: 1.2, trend: "improving",
    aiSuggestion: "Good control. Consider ordering every 3 days instead of weekly to keep freshness and reduce average waste by 15%.",
    wasteReason: "Freshness loss over time",
  },
  {
    id: "5", ingredient: "Coconut Milk", category: "Dairy/Coconut",
    wastedToday: 2.5, unit: "L", costPerUnit: 6.00, shelfLife: 1,
    avgWeeklyWaste: 9.0, trend: "worsening",
    aiSuggestion: "Nasi Lemak sales are highest on weekends. Open coconut milk on Fri–Sun only; use UHT alternatives midweek to cut spoilage cost by RM54/week.",
    wasteReason: "Opened packs not fully used",
  },
];

const trendConfig: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  improving: { color: "text-green-600", label: "Improving ↓", icon: <TrendingDown className="w-4 h-4" /> },
  worsening: { color: "text-red-600", label: "Worsening ↑", icon: <AlertTriangle className="w-4 h-4" /> },
  stable: { color: "text-amber-600", label: "Stable →", icon: <BarChart3 className="w-4 h-4" /> },
};

export function WasteSpoilageTracker() {
  const [wasteItems, setWasteItems] = useState<WasteItem[]>(initialWasteItems);
  const [logMode, setLogMode] = useState<string | null>(null);
  const [logAmount, setLogAmount] = useState<number>(0);
  const [isAnalysing, setIsAnalysing] = useState(false);

  const totalDailyCost = wasteItems.reduce(
    (sum, item) => sum + item.wastedToday * item.costPerUnit, 0
  );
  const projectedMonthlyCost = totalDailyCost * 30;
  const potentialSavings = projectedMonthlyCost * 0.42; // ~42% reducible per AI

  const handleLog = (id: string) => {
    setWasteItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, wastedToday: item.wastedToday + logAmount }
          : item
      )
    );
    setLogMode(null);
    setLogAmount(0);
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl mb-2 tracking-tight flex items-center gap-3">
            <Leaf className="w-12 h-12 text-green-500" />
            Waste & Spoilage Tracker
          </h1>
          <p className="text-muted-foreground text-lg">
            AI-powered waste reduction to cut costs and improve sustainability
          </p>
        </div>
        <Button
          size="lg"
          className="gap-2 bg-green-600 hover:bg-green-700 text-white"
          onClick={() => { setIsAnalysing(true); setTimeout(() => setIsAnalysing(false), 2000); }}
          disabled={isAnalysing}
        >
          {isAnalysing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          {isAnalysing ? "Analysing..." : "AI Waste Analysis"}
        </Button>
      </div>

      {/* Cost Alert Banner */}
      <Card className="p-5 bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Trash2 className="w-8 h-8" />
            <div>
              <p className="font-semibold text-lg">Daily Waste Cost Today</p>
              <p className="text-sm opacity-90">GLM identified RM {potentialSavings.toFixed(0)}/month in recoverable savings</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">RM {totalDailyCost.toFixed(2)}</p>
            <p className="text-sm opacity-80">≈ RM {projectedMonthlyCost.toFixed(0)}/month</p>
          </div>
        </div>
      </Card>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 border-2 shadow-md bg-gradient-to-br from-red-50 to-rose-50">
          <p className="text-sm text-red-700 mb-1">Items Wasted Today</p>
          <p className="text-4xl text-red-900">{wasteItems.length}</p>
          <p className="text-xs text-red-600 mt-1">Categories tracked</p>
        </Card>
        <Card className="p-5 border-2 shadow-md bg-gradient-to-br from-amber-50 to-orange-50">
          <p className="text-sm text-amber-700 mb-1">Expiring Today</p>
          <p className="text-4xl text-amber-900">{wasteItems.filter(i => i.shelfLife === 0).length}</p>
          <p className="text-xs text-amber-600 mt-1">Needs immediate use</p>
        </Card>
        <Card className="p-5 border-2 shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
          <p className="text-sm text-green-700 mb-1">Potential Monthly Savings</p>
          <p className="text-2xl text-green-900">RM {potentialSavings.toFixed(0)}</p>
          <p className="text-xs text-green-600 mt-1">If AI suggestions applied</p>
        </Card>
        <Card className="p-5 border-2 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
          <p className="text-sm text-blue-700 mb-1">Weekly Waste Trend</p>
          <p className="text-2xl text-blue-900">-54%</p>
          <p className="text-xs text-blue-600 mt-1">vs 3 weeks ago</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 shadow-lg border-2">
          <h3 className="mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-green-600" />
            Weekly Waste Trend
            <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700">Improving</Badge>
          </h3>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={weeklyWasteTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" stroke="#6B7280" />
              <YAxis stroke="#6B7280" tickFormatter={(v) => `RM${v}`} />
              <Tooltip formatter={(v: number) => `RM ${v}`} />
              <Area type="monotone" dataKey="waste" stroke="#EF4444" fill="#FEE2E2" strokeWidth={2} name="Waste Cost" />
              <Area type="monotone" dataKey="saved" stroke="#22C55E" fill="#DCFCE7" strokeWidth={2} name="Cost Saved" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 shadow-lg border-2">
          <h3 className="mb-4 flex items-center gap-2">
            <PackageX className="w-5 h-5 text-red-600" />
            Waste by Category
          </h3>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie
                data={wasteByCategoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {wasteByCategoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip formatter={(v: number) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Waste Items */}
      <div>
        <h2 className="text-2xl mb-4">Ingredient Waste Log</h2>
        <div className="space-y-4">
          {wasteItems.map((item) => {
            const dailyLoss = item.wastedToday * item.costPerUnit;
            const trend = trendConfig[item.trend];

            return (
              <Card key={item.id} className={`p-6 border-2 shadow-md transition-all ${item.shelfLife === 0 ? "border-red-200 bg-red-50/30" : "hover:border-secondary"}`}>
                <div className="flex items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl">{item.ingredient}</h3>
                      <Badge variant="outline" className="text-xs">{item.category}</Badge>
                      {item.shelfLife === 0 && (
                        <Badge variant="destructive" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          Expires Today
                        </Badge>
                      )}
                      <span className={`flex items-center gap-1 text-xs font-medium ${trend.color}`}>
                        {trend.icon} {trend.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span>Wasted: <strong className="text-foreground">{item.wastedToday} {item.unit}</strong></span>
                      <span>@ RM {item.costPerUnit}/{item.unit}</span>
                      <span>Avg weekly waste: {item.avgWeeklyWaste} {item.unit}</span>
                    </div>

                    <div className="p-3 bg-secondary/5 border border-secondary/20 rounded-lg flex items-start gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-secondary">GLM Tip:</strong> {item.aiSuggestion}
                      </p>
                    </div>

                    {logMode === item.id ? (
                      <div className="flex items-center gap-2 mt-2">
                        <Label className="text-sm">Log waste ({item.unit}):</Label>
                        <Input
                          type="number"
                          value={logAmount}
                          onChange={(e) => setLogAmount(Number(e.target.value))}
                          className="w-24"
                          min={0}
                        />
                        <Button size="sm" onClick={() => handleLog(item.id)}>Log</Button>
                        <Button size="sm" variant="outline" onClick={() => setLogMode(null)}>Cancel</Button>
                      </div>
                    ) : (
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" onClick={() => setLogMode(item.id)}>
                          <Trash2 className="w-4 h-4 mr-1" />
                          Log Waste
                        </Button>
                        <Button size="sm" variant="outline" className="text-green-600 border-green-300 hover:bg-green-50">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Mark Recovered
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground mb-1">Today's Loss</p>
                    <p className="text-2xl font-bold text-red-600">RM {dailyLoss.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Shelf life: {item.shelfLife === 0 ? "Expired" : `${item.shelfLife}d left`}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
