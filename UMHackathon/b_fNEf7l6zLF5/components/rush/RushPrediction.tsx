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
  Utensils
} from "lucide-react"
import { rushPredictions, weeklyTraffic, promotionalEvents, stockItems } from "@/lib/mock-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, Cell } from "recharts"
import { format, addDays } from "date-fns"

export function RushPrediction() {
  const today = new Date()
  const nextWeek = Array.from({ length: 7 }, (_, i) => ({
    date: format(addDays(today, i), 'EEE'),
    fullDate: format(addDays(today, i), 'MMM d'),
    peak: Math.floor(Math.random() * 30) + 70,
  }))

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
        {peakHours.slice(0, 4).map((hour, i) => (
          <Card key={i} className={`${i === 2 ? 'border-primary bg-primary/5' : ''}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{hour.hour}</p>
                  <p className="text-sm text-muted-foreground">Peak Hour</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-primary">
                    <Users className="h-4 w-4" />
                    <span className="font-bold">{hour.customers}</span>
                  </div>
                  <Badge variant="secondary" className="mt-1">{hour.prep}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Hourly Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Today&apos;s Hourly Customer Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="hour" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [value, 'Customers']}
                />
                <Bar dataKey="customers" radius={[4, 4, 0, 0]}>
                  {hourlyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.customers >= 80 ? '#ef4444' : entry.customers >= 50 ? '#f59e0b' : '#22c55e'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-sm text-muted-foreground">Light (&lt;50)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning" />
              <span className="text-sm text-muted-foreground">Medium (50-80)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-danger" />
              <span className="text-sm text-muted-foreground">Heavy (80+)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Overview and Events */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Traffic Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Weekly Traffic Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTraffic}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="7am" name="7 AM" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="12pm" name="12 PM" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="7pm" name="7 PM" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
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
            {prepRecommendations.map((rec, i) => (
              <div key={i} className="p-4 rounded-lg bg-card border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-foreground">{rec.item}</p>
                  <Badge variant="outline">{rec.quantity}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Clock className="h-4 w-4" />
                  {rec.timing}
                </div>
                <p className="text-sm text-muted-foreground mt-2">{rec.reason}</p>
              </div>
            ))}
          </div>

          {/* Stock Readiness Check */}
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
