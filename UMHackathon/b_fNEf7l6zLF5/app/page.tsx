"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  LayoutDashboard, 
  Package, 
  Clock, 
  Users, 
  Receipt,
  DollarSign,
  Trash2,
  Menu,
  X,
  Bell,
  Settings,
  ChefHat
} from "lucide-react"
import { DashboardOverview } from "@/components/dashboard/DashboardOverview"
import { StockManagement } from "@/components/stock/StockManagement"
import { RushPrediction } from "@/components/rush/RushPrediction"
import { VendorManagement } from "@/components/vendors/VendorManagement"
import { TransactionHistory } from "@/components/transactions/TransactionHistory"
import { MenuPricingOptimizer } from "@/components/pricing/MenuPricingOptimizer"
import { WasteSpoilageTracker } from "@/components/waste/WasteSpoilageTracker"

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, shortcut: 'D' },
  { id: 'stock', label: 'Stock', icon: Package, shortcut: 'S', badge: 4 },
  { id: 'rush', label: 'Rush Prediction', icon: Clock, shortcut: 'R' },
  { id: 'vendors', label: 'Vendors', icon: Users, shortcut: 'V' },
  { id: 'transactions', label: 'Transactions', icon: Receipt, shortcut: 'T' },
  { id: 'pricing', label: 'AI Pricing', icon: DollarSign, shortcut: 'P' },
  { id: 'waste', label: 'Waste Tracker', icon: Trash2, shortcut: 'W' },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-foreground">MindaFinancial</h1>
                <p className="text-xs text-muted-foreground">Smart Vendor SME System</p>
              </div>
            </div>

            {/* Desktop Navigation Shortcuts */}
            <div className="hidden lg:flex items-center gap-2">
              {navItems.slice(0, 4).map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(item.id)}
                  className={`gap-2 ${activeTab === item.id ? 'bg-primary text-primary-foreground' : ''}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {item.badge && (
                    <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-danger animate-pulse" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-16 left-0 right-0 z-50 bg-card border-b shadow-lg p-4">
            <nav className="grid gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={`justify-start gap-3 ${activeTab === item.id ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => {
                    setActiveTab(item.id)
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                  {item.badge && (
                    <Badge variant="destructive" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation - Desktop */}
          <TabsList className="hidden lg:inline-flex h-auto p-1 bg-muted/50 rounded-xl w-full justify-start overflow-x-auto">
            {navItems.map((item) => (
              <TabsTrigger
                key={item.id}
                value={item.id}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.badge && (
                  <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Mobile Tab Pills */}
          <div className="lg:hidden overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex gap-2 w-max">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(item.id)}
                  className={`gap-2 shrink-0 ${activeTab === item.id ? 'bg-primary text-primary-foreground' : ''}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {item.badge && (
                    <Badge variant={activeTab === item.id ? "secondary" : "destructive"} className="ml-1 h-5 px-1.5 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <TabsContent value="dashboard" className="mt-0">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="stock" className="mt-0">
            <StockManagement />
          </TabsContent>

          <TabsContent value="rush" className="mt-0">
            <RushPrediction />
          </TabsContent>

          <TabsContent value="vendors" className="mt-0">
            <VendorManagement />
          </TabsContent>

          <TabsContent value="transactions" className="mt-0">
            <TransactionHistory />
          </TabsContent>

          <TabsContent value="pricing" className="mt-0">
            <MenuPricingOptimizer />
          </TabsContent>

          <TabsContent value="waste" className="mt-0">
            <WasteSpoilageTracker />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-4 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              MindaFinancial © 2026 • Powered by AI for Malaysian SMEs
            </p>
            <div className="flex items-center gap-4">
              <Button variant="link" size="sm" className="text-muted-foreground">Help</Button>
              <Button variant="link" size="sm" className="text-muted-foreground">Documentation</Button>
              <Button variant="link" size="sm" className="text-muted-foreground">Support</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
