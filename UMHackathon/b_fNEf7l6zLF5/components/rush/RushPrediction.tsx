"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  Users,
  TrendingUp,
  Calendar,
  Zap,
  Sun,
  CloudRain,
  PartyPopper,
  Utensils,
  AlertTriangle
} from "lucide-react"
import { rushPredictions, weeklyTraffic, promotionalEvents, stockItems, prepRecommendations } from "@/lib/mock-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, Cell } from "recharts"
import { format, addDays } from "date-fns"

export function RushPrediction() {

  const today = new Date()
  const nextWeek = Array.from({ length: 7 }, (_, i) => ({
    date: format(addDays(today, i), 'EEE'),
    fullDate: format(addDays(today, i), 'MMM d'),
    peak: Math.floor(Math.random() * 30) + 70,
  }))

  const RECIPE_MAP: Record<string, string> = {
    "Nasi Lemak Ayam": "Chicken Thigh",
    "Nasi Lemak Special": "Rice (Beras Super)",
    "Char Kuey Teow": "Eggs",
    "Sambal (Extra)": "Sambal Paste",
    "Chicken Marinade": "Chicken Thigh", // Both use Chicken Thigh!
  };

  const hourlyData = [
    { hour: '6AM', customers: 15, prep: 'Light' },
    { hour: '7AM', customers: 45, prep: 'Medium' },
    { hour: '8AM', customers: 65, prep: 'Heavy' },
    { hour: '9AM', customers: 35, prep: 'Medium' },
    { hour: '10AM', customers: 25, prep: 'Light' },
    { hour: '11AM', customers: 40, prep: 'Medium' },
    { hour: '12PM', customers: 85, prep: 'Heavy' },
    { hour: '1PM', customers: 72, prep: 'Heavy' },
    { hour: '2PM', customers: 45, prep: 'Medium' },
    { hour: '3PM', customers: 30, prep: 'Light' },
    { hour: '4PM', customers: 25, prep: 'Light' },
    { hour: '5PM', customers: 35, prep: 'Medium' },
    { hour: '6PM', customers: 55, prep: 'Medium' },
    { hour: '7PM', customers: 95, prep: 'Heavy' },
    { hour: '8PM', customers: 88, prep: 'Heavy' },
    { hour: '9PM', customers: 50, prep: 'Medium' },
    { hour: '10PM', customers: 25, prep: 'Light' },
  ]

  const peakHours = hourlyData.filter(h => h.customers >= 70)

  const prepRecommendations = [
    { item: 'Nasi Lemak Ayam', quantity: '80 portions', timing: 'Prep by 6:30 AM', reason: 'Best seller, morning rush' },
    { item: 'Nasi Lemak Special', quantity: '50 portions', timing: 'Prep by 11:00 AM', reason: 'Lunch rush item' },
    { item: 'Char Kuey Teow', quantity: '40 portions', timing: 'Prep by 6:00 PM', reason: 'Dinner favorite' },
    { item: 'Sambal (Extra)', quantity: '5 kg', timing: 'Prep by 6:00 AM', reason: 'High demand expected' },
    { item: 'Chicken Marinade', quantity: '15 kg', timing: 'Prep by 5:00 AM', reason: 'For all chicken dishes' },
  ]

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'festival': return <PartyPopper className="h-5 w-5 text-accent" />
      case 'weather': return <CloudRain className="h-5 w-5 text-blue-500" />
      case 'holiday': return <Sun className="h-5 w-5 text-warning" />
      case 'local': return <Zap className="h-5 w-5 text-primary" />
      default: return <Calendar className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Rush Hour Prediction</h2>
          <p className="text-muted-foreground">AI-powered demand forecasting and prep recommendations</p>
        </div>
        <Badge className="bg-primary text-primary-foreground w-fit gap-2">
          <Zap className="h-4 w-4" />
          Next Rush: 7:00 PM Today
        </Badge>
      </div>

      {/* Peak Hours Summary */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {peakHours.slice(0, 4).map((hour, i) => {
          const isCritical = hour.customers >= 80;
          const isModerate = hour.customers >= 50 && hour.customers < 80;

          return (
            <Card key={i} className={`
        transition-all border-l-4 
        ${isCritical ? 'border-l-danger bg-danger/5' : isModerate ? 'border-l-warning bg-warning/5' : 'border-l-success bg-success/5'}
      `}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-black text-foreground tracking-tighter">{hour.hour}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Expected Peak</p>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center justify-end gap-1 font-black ${isCritical ? 'text-danger' : isModerate ? 'text-warning' : 'text-success'}`}>
                      <Users className="h-4 w-4" />
                      <span>{hour.customers}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`mt-1 border-none font-bold uppercase text-[10px] ${isCritical ? 'bg-danger text-white' : isModerate ? 'bg-warning text-black' : 'bg-success text-white'}`}
                    >
                      {hour.prep}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Today's Hourly Forecast - UPDATED UI */}
      <Card className="overflow-hidden border-muted/40 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Clock className="h-5 w-5 text-primary" />
              Hourly Demand Forecast
            </CardTitle>
            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter">
              Live AI Simulation
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                {/* STEP 1: DEFINING VIBRANT GRADIENTS THAT MATCH STATUS COLORS */}
                <defs>
                  {/* Optimal / Good - Green */}
                  <linearGradient id="barGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.2} />
                  </linearGradient>
                  {/* Warning / Medium - Orange */}
                  <linearGradient id="barOrange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.2} />
                  </linearGradient>
                  {/* Critical / Heavy - Red */}
                  <linearGradient id="barRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.3} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.2} />
                <XAxis
                  dataKey="hour"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const val = payload[0].value as number;
                      const isCritical = val >= 80;
                      const isWarning = val >= 50 && val < 80;

                      return (
                        <div className="bg-background/95 backdrop-blur-md border border-border p-3 rounded-xl shadow-2xl">
                          <p className="text-[10px] font-black text-muted-foreground uppercase mb-2 tracking-widest">{label}</p>
                          <div className="space-y-1">
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-black tabular-nums">{val}</span>
                              <span className="text-[10px] font-bold text-muted-foreground uppercase">pax</span>
                            </div>
                            <Badge className={`
                        w-full justify-center text-[9px] font-black uppercase border-none
                        ${isCritical ? 'bg-danger text-white' : isWarning ? 'bg-warning text-black' : 'bg-success text-white'}
                      `}>
                              {isCritical ? 'Critical Rush' : isWarning ? 'Moderate' : 'Optimal'}
                            </Badge>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Bar dataKey="customers" radius={[4, 4, 0, 0]} barSize={24}>
                  {hourlyData.map((entry, index) => {
                    const val = entry.customers;

                    /* STEP 2: LINKING THE GRADIENT ID TO THE VALUE */
                    const fillUrl = val >= 80 ? 'url(#barRed)' : val >= 50 ? 'url(#barOrange)' : 'url(#barGreen)';
                    const strokeColor = val >= 80 ? '#ef4444' : val >= 50 ? '#f59e0b' : '#22c55e';

                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={fillUrl}
                        stroke={strokeColor}
                        strokeWidth={1}
                        strokeOpacity={0.5}
                        className="transition-all duration-300 hover:brightness-110"
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* MATCHING LEGEND STYLE */}
          <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-dashed border-muted">
            {[
              { label: "Critical", range: "80+", color: "bg-danger", text: "text-danger" },
              { label: "Warning", range: "50-80", color: "bg-warning", text: "text-warning" },
              { label: "Optimal", range: "0-50", color: "bg-success", text: "text-success" }
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <div className={`h-1.5 w-1.5 rounded-full ${s.color}`} />
                  <span className={`text-[10px] font-black uppercase tracking-tighter ${s.text}`}>{s.label}</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-bold">{s.range} pax</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Overview and Events */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Traffic Heatmap */}
        <Card className="overflow-hidden border-muted/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Calendar className="h-5 w-5 text-primary" />
              Weekly Traffic Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTraffic} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                  {/* Subtle Grid Lines */}
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={true}
                    horizontal={true}
                    stroke="#e2e8f0" // A light gray that is guaranteed to show on white/off-white backgrounds
                    strokeOpacity={1} // Force full visibility
                    strokeWidth={1}
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  {/* ENHANCED HOVER TOOLTIP */}
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background/95 backdrop-blur-md border border-border p-4 rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200 min-w-[180px]">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 border-b pb-1">
                              {label} Activity
                            </p>
                            <div className="space-y-3">
                              {payload.map((entry, index) => (
                                <div key={index} className="flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                    <span className="text-[11px] font-bold text-muted-foreground italic">{entry.name}</span>
                                  </div>
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-black tracking-tight text-foreground">{entry.value}</span>
                                    <span className="text-[9px] font-medium text-muted-foreground uppercase">pax</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <Legend
                    verticalAlign="top"
                    height={36}
                    content={({ payload }) => (
                      <div className="flex justify-center gap-6 mb-4">
                        {payload?.map((entry: any, index: number) => (
                          <div key={index} className="flex items-center gap-1.5">
                            <div className="h-1.5 w-4 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
                              {entry.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  />

                  {/* COLOR CODED LINES */}
                  <Line
                    type="monotone"
                    dataKey="7am"
                    name="7 AM"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#22c55e", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="12pm"
                    name="12 PM"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="7pm"
                    name="7 PM"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#ef4444", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events Impact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PartyPopper className="h-5 w-5 text-accent" />
              Upcoming Events & Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {promotionalEvents.map((event) => (
                <div key={event.id} className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getEventIcon(event.type)}
                      <div>
                        <p className="font-medium text-foreground">{event.name}</p>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                      </div>
                    </div>
                    <Badge className={event.expectedImpact >= 150 ? 'bg-danger text-white' : event.expectedImpact >= 120 ? 'bg-warning text-foreground' : 'bg-success text-white'}>
                      +{event.expectedImpact - 100}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prep Recommendations */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5 text-primary" />
            AI Prep Recommendations for Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {prepRecommendations.map((rec, i) => {
              // 1. Map the ingredient
              const ingredientName = RECIPE_MAP[rec.item] || rec.item;
              const stock = stockItems.find(s => s.name === ingredientName);

              // 2. NEW: Hardcoded targets since they aren't in your mock data
              const TARGET_MAP: Record<string, number> = {
                "Chicken Thigh": 100,
                "Rice (Beras Super)": 50,
                "Eggs": 200,
                "Sambal Paste": 20,
                "Cooking Oil": 50
              };

              // 3. Calculate using the Hardcoded Target
              const current = stock?.currentStock || 0;
              const target = TARGET_MAP[ingredientName] || 100; // Default to 100 if not in map
              const progressPercent = Math.min(Math.round((current / target) * 100), 100);

              // 4. Update the color check
              // Even at 82kg, it will stay RED if the riskLevel in your mock-data is still "high"
              const isCritical = stock?.riskLevel === 'high' || progressPercent < 30;

              return (
                // ... UI continues
                <div key={i} className={`p-4 rounded-xl border bg-card transition-all ${isCritical ? 'border-danger/40 bg-danger/[0.02]' : 'border-border'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-foreground">{rec.item}</p>
                      {isCritical && (
                        <Badge variant="destructive" className="h-5 px-1.5 animate-bounce">
                          <AlertTriangle className="h-3 w-3" />
                        </Badge>
                      )}
                    </div>
                    <Badge variant={isCritical ? "destructive" : "secondary"}>{rec.quantity}</Badge>
                  </div>

                  {/* KEEPING YOUR DETAIL: The Reason text */}
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight mb-3">
                    {rec.reason}
                  </p>

                  {/* SYNCED PROGRESS BAR - UPDATED FOR LIVE SYNC */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                      <span className="text-muted-foreground">Ingredient Readiness</span>
                      {/* This shows the actual calculated number */}
                      <span className={isCritical ? "text-danger" : "text-success"}>
                        {progressPercent}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-muted/20">
                      <div
                        className={`h-full transition-all duration-1000 ${isCritical ? 'bg-danger' : 'bg-success'}`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-dashed">
                    <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase">
                      <Clock className="h-3.5 w-3.5" />
                      {rec.timing}
                    </div>
                    {isCritical && (
                      <span className="text-[9px] font-black text-danger uppercase animate-pulse">
                        Shortage: {current}{stock?.unit} left
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stock Readiness Check: REMOVED .slice(0, 2) to show all critical items */}
          <div className="mt-6 p-4 rounded-lg bg-card border">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Stock Readiness for Rush Hours
            </h4>
            <div className="grid gap-3 md:grid-cols-2">
              {stockItems.filter(i => i.riskLevel === 'high').map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 rounded bg-danger/10 border border-danger/20">
                  <span className="text-sm font-medium">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-danger">{item.currentStock} {item.unit}</span>
                    <Badge variant="destructive" className="text-xs">Low</Badge>
                  </div>
                </div>
              ))}
              {/* Only slice the 'Ready' items to keep the list clean */}
              {stockItems.filter(i => i.riskLevel === 'low').slice(0, 2).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 rounded bg-success/10 border border-success/20">
                  <span className="text-sm font-medium">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-success">{item.currentStock} {item.unit}</span>
                    <Badge className="text-xs bg-success text-white">Ready</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
