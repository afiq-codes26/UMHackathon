import { Card } from "./ui/card";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Clock, Sparkles, Calendar, Zap } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const rushHourData = [
  { time: "7am", orders: 12, revenue: 240, predicted: 15 },
  { time: "9am", orders: 28, revenue: 560, predicted: 25 },
  { time: "11am", orders: 45, revenue: 900, predicted: 42 },
  { time: "1pm", orders: 78, revenue: 1560, predicted: 75 },
  { time: "3pm", orders: 35, revenue: 700, predicted: 38 },
  { time: "5pm", orders: 52, revenue: 1040, predicted: 50 },
  { time: "7pm", orders: 95, revenue: 1900, predicted: 90 },
  { time: "9pm", orders: 42, revenue: 840, predicted: 45 },
];

const weeklyRevenue = [
  { day: "Mon", actual: 4500, predicted: 4200, events: 0 },
  { day: "Tue", actual: 3800, predicted: 3900, events: 0 },
  { day: "Wed", actual: 5200, predicted: 4800, events: 0 },
  { day: "Thu", actual: 4900, predicted: 5100, events: 0 },
  { day: "Fri", actual: 6800, predicted: 6500, events: 1 },
  { day: "Sat", actual: 7200, predicted: 7000, events: 1 },
  { day: "Sun", actual: 5500, predicted: 5800, events: 0 },
];

const upcomingEvents = [
  {
    name: "Friday Night Special",
    date: "Every Friday",
    expectedIncrease: "+25%",
    color: "from-purple-500 to-indigo-600",
    impact: "high",
  },
  {
    name: "Weekend Brunch Rush",
    date: "Sat-Sun, 10am-2pm",
    expectedIncrease: "+40%",
    color: "from-orange-500 to-red-600",
    impact: "critical",
  },
  {
    name: "Ramadan Special (Upcoming)",
    date: "Starts May 1st",
    expectedIncrease: "+60%",
    color: "from-green-500 to-emerald-600",
    impact: "critical",
  },
];

export function DashboardPage() {
  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl mb-2 tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-lg">Real-time business performance & predictions</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Today's Date</p>
          <p className="text-lg">Thursday, April 23, 2026</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-secondary via-secondary to-secondary/80 text-white border-0 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-sm opacity-90 mb-1">Today's Revenue</p>
            <p className="text-4xl">RM 6,847</p>
            <p className="text-sm mt-2 opacity-80">+15.3% from yesterday</p>
          </div>
        </Card>

        <Card className="p-6 border-2 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="w-8 h-8 text-blue-600" />
            <span className="text-2xl text-blue-900">234</span>
          </div>
          <p className="text-blue-700 mb-1">Orders Today</p>
          <p className="text-sm text-blue-600">Peak: 7pm (95 orders)</p>
        </Card>

        <Card className="p-6 border-2 shadow-md bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-amber-600" />
            <Zap className="w-5 h-5 text-amber-600 animate-pulse" />
          </div>
          <p className="text-amber-700 mb-1">Next Rush Hour</p>
          <p className="text-2xl text-amber-900">7:00 PM</p>
          <p className="text-sm text-amber-600">~95 orders expected</p>
        </Card>

        <Card className="p-6 border-2 shadow-md bg-gradient-to-br from-purple-50 to-violet-50">
          <div className="flex items-center justify-between mb-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-purple-700 mb-1">AI Accuracy</p>
          <p className="text-2xl text-purple-900">94.3%</p>
          <p className="text-sm text-purple-600">Prediction rate</p>
        </Card>
      </div>

      {/* Promotional Events Alert */}
      <Card className="p-6 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-white border-0 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl -ml-48 -mb-48" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 animate-pulse" />
            <h2 className="text-3xl">Upcoming Promotional Events</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingEvents.map((event, idx) => (
              <div key={idx} className="p-5 bg-white/15 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="secondary" className="bg-white/30 text-white border-0">
                    {event.impact === "critical" ? "🔥 High Impact" : "⚡ Moderate"}
                  </Badge>
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-xl mb-2">{event.name}</h3>
                <p className="text-sm opacity-90 mb-3">{event.date}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-80">Expected Increase</span>
                  <span className="text-2xl">{event.expectedIncrease}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="secondary" className="bg-white text-orange-600 hover:bg-white/90">
              View Event Calendar
            </Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Stock Preparation Guide
            </Button>
          </div>
        </div>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rush Hour Prediction */}
        <Card className="p-6 shadow-lg border-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2">
              Rush Hour Prediction
              <Badge variant="secondary" className="ml-2">AI-Powered</Badge>
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <span>Actual</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary/30" />
                <span>Predicted</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={rushHourData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="time" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                formatter={(value: number) => `${value} orders`}
              />
              <Bar dataKey="predicted" fill="#E5E7EB" radius={[8, 8, 0, 0]} />
              <Bar dataKey="orders" fill="#06A77D" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
            <p className="text-sm text-amber-900">
              <strong>⚡ Peak Alert:</strong> 7pm rush hour approaching! Prepare extra staff and stock for high-demand items.
            </p>
          </div>
        </Card>

        {/* Weekly Performance */}
        <Card className="p-6 shadow-lg border-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2">
              Weekly Performance
              <Badge variant="secondary" className="ml-2">Forecast vs Actual</Badge>
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={weeklyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                formatter={(value: number) => `RM ${value}`}
              />
              <Area type="monotone" dataKey="predicted" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.1} strokeWidth={2} strokeDasharray="5 5" />
              <Area type="monotone" dataKey="actual" stroke="#06A77D" fill="#06A77D" fillOpacity={0.3} strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 rounded-lg border-2 border-green-200">
              <p className="text-xs text-green-700 mb-1">Best Day</p>
              <p className="text-lg text-green-900">Saturday</p>
              <p className="text-sm text-green-600">RM 7,200</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
              <p className="text-xs text-blue-700 mb-1">Average Daily</p>
              <p className="text-lg text-blue-900">RM 5,414</p>
              <p className="text-sm text-blue-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12% vs last week
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="p-6 shadow-lg border-2 bg-gradient-to-br from-primary via-primary to-primary/90 text-white">
        <h3 className="mb-4 flex items-center gap-2 text-white text-2xl">
          <Sparkles className="w-7 h-7" />
          AI-Powered Business Insights
          <Badge variant="secondary" className="ml-auto">GLM Model Analysis</Badge>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-white/10 backdrop-blur border border-white/20 hover:bg-white/15 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <Badge variant="secondary" className="bg-green-500/30 text-white border-0">Save RM 450/mo</Badge>
            </div>
            <p className="font-medium mb-2">Cost Optimization</p>
            <p className="text-sm opacity-90">Switching to bulk orders for rice can reduce costs by 12%</p>
          </div>
          <div className="p-5 rounded-xl bg-white/10 backdrop-blur border border-white/20 hover:bg-white/15 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <Badge variant="secondary" className="bg-blue-500/30 text-white border-0">+25% Revenue</Badge>
            </div>
            <p className="font-medium mb-2">Revenue Opportunity</p>
            <p className="text-sm opacity-90">Add 2 staff during 7-9pm rush hours to increase capacity</p>
          </div>
          <div className="p-5 rounded-xl bg-white/10 backdrop-blur border border-white/20 hover:bg-white/15 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <Badge variant="secondary" className="bg-purple-500/30 text-white border-0">-15% Waste</Badge>
            </div>
            <p className="font-medium mb-2">Waste Reduction</p>
            <p className="text-sm opacity-90">Reduce vegetable orders by 15% on Mon-Wed to minimize spoilage</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
