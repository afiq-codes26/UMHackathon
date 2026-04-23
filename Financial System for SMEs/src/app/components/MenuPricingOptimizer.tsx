import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  ChefHat, TrendingUp, TrendingDown, Sparkles, DollarSign,
  AlertCircle, CheckCircle, BarChart3, Percent, RefreshCw
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  currentPrice: number;
  ingredientCost: number;
  avgDailySales: number;
  popularityScore: number;
  suggestedPrice?: number;
  aiAction?: "increase" | "decrease" | "maintain" | "bundle";
  aiReason?: string;
  profitMargin: number;
  potentialRevenue?: number;
}

interface ProfitScenario {
  scenario: string;
  revenue: number;
  cost: number;
  profit: number;
}

const initialMenuItems: MenuItem[] = [
  {
    id: "1", name: "Nasi Lemak", category: "Rice Dishes",
    currentPrice: 12.00, ingredientCost: 4.50, avgDailySales: 45,
    popularityScore: 95, profitMargin: 62.5,
    suggestedPrice: 13.50, aiAction: "increase",
    aiReason: "High demand with 95% popularity. Customers are price-insensitive for this item — a RM1.50 increase won't reduce sales.",
    potentialRevenue: 607.5,
  },
  {
    id: "2", name: "Char Kway Teow", category: "Noodles",
    currentPrice: 12.50, ingredientCost: 6.20, avgDailySales: 28,
    popularityScore: 72, profitMargin: 50.4,
    suggestedPrice: 12.50, aiAction: "maintain",
    aiReason: "Competitive pricing. Ingredient costs rose 8%, but lowering would hurt volume. Maintain and optimize prep time instead.",
    potentialRevenue: 350,
  },
  {
    id: "3", name: "Curry Laksa", category: "Noodles",
    currentPrice: 14.00, ingredientCost: 8.50, avgDailySales: 22,
    popularityScore: 68, profitMargin: 39.3,
    suggestedPrice: 12.50, aiAction: "decrease",
    aiReason: "Below-average popularity at current price. Reducing RM1.50 could boost daily sales by ~35% based on historical data, increasing net profit.",
    potentialRevenue: 337.5,
  },
  {
    id: "4", name: "Roti Canai", category: "Breakfast",
    currentPrice: 4.50, ingredientCost: 1.20, avgDailySales: 85,
    popularityScore: 98, profitMargin: 73.3,
    suggestedPrice: 5.00, aiAction: "increase",
    aiReason: "Most popular item. Paired frequently with Teh Tarik — bundle pricing could boost average order value by 18%.",
    potentialRevenue: 425,
  },
  {
    id: "5", name: "Nasi Briyani", category: "Rice Dishes",
    currentPrice: 18.00, ingredientCost: 9.80, avgDailySales: 18,
    popularityScore: 55, profitMargin: 45.6,
    suggestedPrice: 15.90, aiAction: "bundle",
    aiReason: "Low volume but high margin. Bundle with a drink at RM19.90 to improve perceived value and increase trial rate.",
    potentialRevenue: 358.2,
  },
  {
    id: "6", name: "Teh Tarik", category: "Beverages",
    currentPrice: 4.50, ingredientCost: 0.80, avgDailySales: 120,
    popularityScore: 99, profitMargin: 82.2,
    suggestedPrice: 5.00, aiAction: "increase",
    aiReason: "Highest volume item with minimal cost. Even RM0.50 increase adds RM60/day in pure profit with negligible impact on orders.",
    potentialRevenue: 600,
  },
];

const radarData = [
  { metric: "Profitability", current: 65, optimized: 82 },
  { metric: "Volume", current: 78, optimized: 85 },
  { metric: "Competitiveness", current: 70, optimized: 78 },
  { metric: "Customer Value", current: 72, optimized: 88 },
  { metric: "Waste Reduction", current: 60, optimized: 74 },
];

const actionColors: Record<string, string> = {
  increase: "bg-green-100 text-green-800 border-green-300",
  decrease: "bg-blue-100 text-blue-800 border-blue-300",
  maintain: "bg-gray-100 text-gray-700 border-gray-300",
  bundle: "bg-purple-100 text-purple-800 border-purple-300",
};

const actionIcons: Record<string, React.ReactNode> = {
  increase: <TrendingUp className="w-4 h-4" />,
  decrease: <TrendingDown className="w-4 h-4" />,
  maintain: <CheckCircle className="w-4 h-4" />,
  bundle: <Sparkles className="w-4 h-4" />,
};

export function MenuPricingOptimizer() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(true);
  const [appliedCount, setAppliedCount] = useState(0);

  const currentDailyRevenue = menuItems.reduce(
    (sum, item) => sum + item.currentPrice * item.avgDailySales, 0
  );
  const optimizedDailyRevenue = menuItems.reduce(
    (sum, item) => sum + (item.suggestedPrice || item.currentPrice) * item.avgDailySales, 0
  );

  const profitScenarios: ProfitScenario[] = [
    { scenario: "Current", revenue: currentDailyRevenue, cost: currentDailyRevenue * 0.42, profit: currentDailyRevenue * 0.58 },
    { scenario: "AI Optimized", revenue: optimizedDailyRevenue, cost: optimizedDailyRevenue * 0.38, profit: optimizedDailyRevenue * 0.62 },
    { scenario: "Conservative", revenue: currentDailyRevenue * 1.08, cost: currentDailyRevenue * 0.40, profit: currentDailyRevenue * 0.68 },
  ];

  const runAnalysis = () => {
    setIsAnalysing(true);
    setAnalysisComplete(false);
    setTimeout(() => {
      setIsAnalysing(false);
      setAnalysisComplete(true);
    }, 2200);
  };

  const applyAllSuggestions = () => {
    setMenuItems(items =>
      items.map(item => ({
        ...item,
        currentPrice: item.suggestedPrice || item.currentPrice,
      }))
    );
    setAppliedCount(menuItems.filter(i => i.suggestedPrice !== i.currentPrice).length);
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl mb-2 tracking-tight flex items-center gap-3">
            <ChefHat className="w-12 h-12 text-secondary" />
            Menu Pricing Optimizer
          </h1>
          <p className="text-muted-foreground text-lg">
            AI-driven pricing recommendations to maximise revenue & margins
          </p>
        </div>
        <Button
          size="lg"
          className="gap-2"
          onClick={runAnalysis}
          disabled={isAnalysing}
        >
          {isAnalysing ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          {isAnalysing ? "Analysing..." : "Re-run AI Analysis"}
        </Button>
      </div>

      {/* GLM Analysis Banner */}
      {analysisComplete && (
        <Card className="p-5 bg-gradient-to-r from-secondary to-primary text-white border-0 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sparkles className="w-8 h-8 animate-pulse" />
              <div>
                <p className="font-semibold text-lg">GLM Pricing Analysis Complete</p>
                <p className="text-sm opacity-90">
                  Analysed {menuItems.length} items · Factored demand elasticity, competitor pricing & seasonal trends
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Projected daily gain</p>
              <p className="text-3xl font-bold">
                +RM {(optimizedDailyRevenue - currentDailyRevenue).toFixed(0)}
              </p>
              <p className="text-xs opacity-70">≈ RM {((optimizedDailyRevenue - currentDailyRevenue) * 30).toFixed(0)}/month</p>
            </div>
          </div>
        </Card>
      )}

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 border-2 shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
          <p className="text-sm text-green-700 mb-1">Current Daily Revenue</p>
          <p className="text-3xl text-green-900">RM {currentDailyRevenue.toFixed(0)}</p>
          <p className="text-xs text-green-600 mt-1">From {menuItems.length} menu items</p>
        </Card>
        <Card className="p-5 border-2 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
          <p className="text-sm text-blue-700 mb-1">Optimised Revenue</p>
          <p className="text-3xl text-blue-900">RM {optimizedDailyRevenue.toFixed(0)}</p>
          <p className="text-xs text-blue-600 mt-1">
            +{(((optimizedDailyRevenue - currentDailyRevenue) / currentDailyRevenue) * 100).toFixed(1)}% uplift
          </p>
        </Card>
        <Card className="p-5 border-2 shadow-md bg-gradient-to-br from-purple-50 to-violet-50">
          <p className="text-sm text-purple-700 mb-1">Price Increases</p>
          <p className="text-4xl text-purple-900">
            {menuItems.filter(i => i.aiAction === "increase").length}
          </p>
          <p className="text-xs text-purple-600 mt-1">Items recommended</p>
        </Card>
        <Card className="p-5 border-2 shadow-md bg-gradient-to-br from-amber-50 to-orange-50">
          <p className="text-sm text-amber-700 mb-1">Bundle Opportunities</p>
          <p className="text-4xl text-amber-900">
            {menuItems.filter(i => i.aiAction === "bundle").length}
          </p>
          <p className="text-xs text-amber-600 mt-1">Upsell combos identified</p>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 shadow-lg border-2">
          <h3 className="mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-secondary" />
            Revenue Scenario Comparison
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={profitScenarios}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="scenario" stroke="#6B7280" />
              <YAxis stroke="#6B7280" tickFormatter={(v) => `RM${v}`} />
              <Tooltip formatter={(v: number) => `RM ${v.toFixed(0)}`} />
              <Bar dataKey="cost" fill="#FCA5A5" name="Costs" radius={[0, 0, 4, 4]} stackId="a" />
              <Bar dataKey="profit" fill="#06A77D" name="Profit" radius={[4, 4, 0, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 shadow-lg border-2">
          <h3 className="mb-4 flex items-center gap-2">
            <Percent className="w-5 h-5 text-secondary" />
            Business Health Radar
            <Badge variant="secondary" className="ml-auto">After AI Optimisation</Badge>
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <Radar name="Current" dataKey="current" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.2} />
              <Radar name="Optimised" dataKey="optimized" stroke="#06A77D" fill="#06A77D" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Menu Items with AI Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl">AI Pricing Recommendations</h2>
          <Button onClick={applyAllSuggestions} className="gap-2 bg-secondary hover:bg-secondary/90">
            <CheckCircle className="w-4 h-4" />
            Apply All Suggestions
            {appliedCount > 0 && <Badge variant="secondary">{appliedCount} applied</Badge>}
          </Button>
        </div>

        <div className="space-y-4">
          {menuItems.map((item) => (
            <Card
              key={item.id}
              className={`p-6 border-2 transition-all duration-200 shadow-md cursor-pointer hover:border-secondary ${selectedItem?.id === item.id ? "border-secondary shadow-xl" : ""}`}
              onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
            >
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl">{item.name}</h3>
                    <Badge variant="outline" className="text-xs">{item.category}</Badge>
                    {item.aiAction && (
                      <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border font-medium ${actionColors[item.aiAction]}`}>
                        {actionIcons[item.aiAction]}
                        {item.aiAction.charAt(0).toUpperCase() + item.aiAction.slice(1)} Price
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span>Popularity: <strong className="text-foreground">{item.popularityScore}%</strong></span>
                    <span>Daily Sales: <strong className="text-foreground">{item.avgDailySales}</strong></span>
                    <span>Margin: <strong className="text-foreground">{item.profitMargin}%</strong></span>
                  </div>
                </div>

                <div className="text-center px-6 border-l border-r">
                  <p className="text-xs text-muted-foreground mb-1">Current</p>
                  <p className="text-2xl">RM {item.currentPrice.toFixed(2)}</p>
                </div>

                {item.suggestedPrice && item.suggestedPrice !== item.currentPrice && (
                  <div className="text-center px-6">
                    <p className="text-xs text-muted-foreground mb-1">Suggested</p>
                    <p className={`text-2xl font-bold ${item.aiAction === "increase" ? "text-green-600" : "text-blue-600"}`}>
                      RM {item.suggestedPrice.toFixed(2)}
                    </p>
                    <p className={`text-xs ${item.aiAction === "increase" ? "text-green-500" : "text-blue-500"}`}>
                      {item.aiAction === "increase" ? "+" : ""}
                      {(((item.suggestedPrice - item.currentPrice) / item.currentPrice) * 100).toFixed(0)}%
                    </p>
                  </div>
                )}
              </div>

              {/* Expanded AI reason */}
              {selectedItem?.id === item.id && (
                <div className="mt-4 pt-4 border-t space-y-3">
                  <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-lg flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-secondary mb-1">GLM Analysis</p>
                      <p className="text-sm text-muted-foreground">{item.aiReason}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground">Ingredient Cost</p>
                      <p className="text-lg">RM {item.ingredientCost.toFixed(2)}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground">Daily Revenue (current)</p>
                      <p className="text-lg">RM {(item.currentPrice * item.avgDailySales).toFixed(0)}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs text-green-600">Potential Daily Revenue</p>
                      <p className="text-lg text-green-800">RM {item.potentialRevenue?.toFixed(0)}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button size="sm" className="flex-1" onClick={() => {
                      if (item.suggestedPrice) {
                        setMenuItems(items => items.map(i =>
                          i.id === item.id ? { ...i, currentPrice: item.suggestedPrice! } : i
                        ));
                      }
                    }}>
                      Apply This Suggestion
                    </Button>
                    <Button size="sm" variant="outline">Override Price</Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* AI Summary Card */}
      <Card className="p-6 bg-gradient-to-br from-primary to-primary/80 text-white border-0 shadow-xl">
        <h3 className="text-2xl mb-4 flex items-center gap-2">
          <DollarSign className="w-6 h-6" />
          Monthly Revenue Impact Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/10 rounded-xl border border-white/20">
            <AlertCircle className="w-6 h-6 mb-2" />
            <p className="font-medium mb-1">Without Optimisation</p>
            <p className="text-3xl">RM {(currentDailyRevenue * 30).toFixed(0)}</p>
            <p className="text-sm opacity-80">/ month at current pricing</p>
          </div>
          <div className="p-4 bg-white/10 rounded-xl border border-white/20">
            <Sparkles className="w-6 h-6 mb-2 animate-pulse" />
            <p className="font-medium mb-1">With AI Optimisation</p>
            <p className="text-3xl">RM {(optimizedDailyRevenue * 30).toFixed(0)}</p>
            <p className="text-sm opacity-80">/ month projected</p>
          </div>
          <div className="p-4 bg-green-500/30 rounded-xl border border-green-300/30">
            <TrendingUp className="w-6 h-6 mb-2" />
            <p className="font-medium mb-1">Additional Revenue</p>
            <p className="text-3xl">RM {((optimizedDailyRevenue - currentDailyRevenue) * 30).toFixed(0)}</p>
            <p className="text-sm opacity-80">/ month additional profit</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
