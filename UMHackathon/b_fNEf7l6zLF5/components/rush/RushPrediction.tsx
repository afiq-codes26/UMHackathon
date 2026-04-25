"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  Users,
  Calendar,
  Zap,
  PartyPopper,
  TrendingUp,
  ChevronRight
} from "lucide-react"
import { weeklyTraffic, promotionalEvents } from "@/lib/mock-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, Cell } from "recharts"

export function RushPrediction() {
  const hourlyData = [
    { hour: '6AM', customers: 15, prep: 'Light' },
    { hour: '7AM', customers: 45, prep: 'Medium' },
    { hour: '8AM', customers: 65, prep: 'Heavy' },
    { hour: '9AM', customers: 35, prep: 'Medium' },
    { hour: '12PM', customers: 85, prep: 'Heavy' },
    { hour: '1PM', customers: 72, prep: 'Heavy' },
    { hour: '7PM', customers: 95, prep: 'Heavy' },
    { hour: '8PM', customers: 88, prep: 'Heavy' },
    { hour: '9PM', customers: 50, prep: 'Medium' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Rush Hour Prediction</h2>
          <p className="text-muted-foreground">AI-powered demand forecasting and traffic patterns</p>
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1 text-sm font-bold gap-2 animate-pulse">
          <Zap className="h-4 w-4 fill-current" />
          Next Peak: 7:00 PM Today
        </Badge>
      </div>

      {/* --- TOP 4 PEAK HOURS CARDS --- */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {hourlyData
          .filter(h => h.customers >= 65)
          .slice(0, 4)
          .map((hour, i) => {
            const isCritical = hour.customers >= 80;
            return (
              <Card key={i} className={`relative overflow-hidden transition-all border-l-4 shadow-sm hover:shadow-md ${
                isCritical ? 'border-l-red-500 bg-red-50/30' : 'border-l-amber-500 bg-amber-50/30'
              }`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-black tracking-tighter text-slate-900">{hour.hour}</p>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Peak Forecast</p>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center justify-end gap-1 font-black text-xl ${isCritical ? 'text-red-600' : 'text-amber-600'}`}>
                        <Users className="h-5 w-5" />
                        <span>{hour.customers}</span>
                      </div>
                      <Badge className={`mt-2 border-none font-black uppercase text-[9px] px-2 py-0.5 shadow-sm ${
                        isCritical ? 'bg-red-500 text-white' : 'bg-amber-500 text-black'
                      }`}>
                        {hour.prep} Prep
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {/* Today's Hourly Forecast Chart */}
      <Card className="overflow-hidden border-muted/40 shadow-lg">
        <CardHeader className="pb-2 bg-slate-50/50 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
              <Clock className="h-5 w-5 text-primary" />
              Hourly Demand Forecast
            </CardTitle>
            <div className="flex gap-2">
               <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-red-500" /><span className="text-[10px] font-bold text-muted-foreground uppercase">Rush</span></div>
               <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-amber-500" /><span className="text-[10px] font-bold text-muted-foreground uppercase">Medium</span></div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                {/* Defs for gradients */}
                <defs>
                  <linearGradient id="barRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="barAmber" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="barGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontWeight: 500, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const val = payload[0].value as number;
                      return (
                        <div className="bg-white/95 backdrop-blur-sm p-3 border rounded-xl shadow-xl">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-black text-slate-900">{val} Pax</span>
                            <Badge className={`text-[9px] uppercase font-black ${val >= 80 ? 'bg-red-500' : 'bg-emerald-500'}`}>
                                {val >= 80 ? 'CRITICAL' : 'STABLE'}
                            </Badge>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Bar dataKey="customers" radius={[6, 6, 0, 0]} barSize={28}>
                  {hourlyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.customers >= 80 ? 'url(#barRed)' : entry.customers >= 50 ? 'url(#barAmber)' : 'url(#barGreen)'} 
                      className="transition-all duration-300 hover:brightness-110 cursor-pointer"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Traffic & Events */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Traffic Pattern */}
        <Card className="shadow-sm border-muted/40">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
              <Calendar className="h-5 w-5 text-primary" />
              Weekly Traffic Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTraffic} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fontWeight: 500, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                  <Line type="monotone" dataKey="7am" name="7 AM" stroke="#10b981" strokeWidth={4} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="12pm" name="12 PM" stroke="#f59e0b" strokeWidth={4} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="7pm" name="7 PM" stroke="#ef4444" strokeWidth={4} dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Impact Events */}
        <Card className="shadow-sm border-muted/40">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
              <PartyPopper className="h-5 w-5 text-primary" />
              Upcoming Impact Events
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {promotionalEvents.map((event) => (
                <div key={event.id} className="group relative p-4 rounded-xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-md hover:border-primary/20">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                        <div className={`p-2 rounded-lg ${event.expectedImpact >= 150 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                            <TrendingUp className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-none mb-1">{event.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">{event.date}</p>
                          <p className="text-xs text-slate-600 line-clamp-1">{event.description}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <Badge className={`font-black ${event.expectedImpact >= 150 ? 'bg-red-500' : 'bg-amber-500'}`}>
                          +{event.expectedImpact - 100}% Pax
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-slate-300 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}