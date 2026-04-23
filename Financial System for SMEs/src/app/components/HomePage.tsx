import { Card } from "./ui/card";
import { LayoutDashboard, Package, Users, Receipt, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const shortcuts = [
    {
      id: "dashboard",
      title: "Dashboard",
      description: "View your business performance & analytics",
      icon: LayoutDashboard,
      color: "from-blue-500 to-blue-600",
      stats: "6 insights available",
    },
    {
      id: "stock",
      title: "Stock Management",
      description: "Track inventory & predict stock needs",
      icon: Package,
      color: "from-amber-500 to-orange-600",
      stats: "3 items need attention",
      alert: true,
    },
    {
      id: "vendors",
      title: "Vendor Management",
      description: "Manage suppliers & track orders",
      icon: Users,
      color: "from-green-500 to-emerald-600",
      stats: "4 active vendors",
    },
    {
      id: "transactions",
      title: "Transactions",
      description: "View sales history & order details",
      icon: Receipt,
      color: "from-purple-500 to-purple-600",
      stats: "234 orders today",
    },
  ];

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-secondary to-primary p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -ml-48 -mb-48" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 animate-pulse" />
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              AI-Powered Platform
            </Badge>
          </div>
          <h1 className="text-6xl mb-4 tracking-tight">MindaFinancial</h1>
          <p className="text-xl opacity-90 mb-8 max-w-2xl">
            Smart financial management system designed for Malaysian SMEs in retail & F&B
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
              <p className="text-3xl mb-1">RM 6,847</p>
              <p className="text-sm opacity-80">Today's Revenue</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
              <p className="text-3xl mb-1">234</p>
              <p className="text-sm opacity-80">Orders Today</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
              <p className="text-3xl mb-1">+15.3%</p>
              <p className="text-sm opacity-80">Revenue Growth</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
              <p className="text-3xl mb-1">7:00 PM</p>
              <p className="text-sm opacity-80">Next Rush Hour</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div>
        <h2 className="text-3xl mb-6 flex items-center gap-2">
          Quick Access
          <TrendingUp className="w-6 h-6 text-secondary" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {shortcuts.map((shortcut) => (
            <Card
              key={shortcut.id}
              className="group relative overflow-hidden border-2 hover:border-secondary transition-all duration-300 hover:shadow-xl cursor-pointer"
              onClick={() => onNavigate(shortcut.id)}
            >
              <div className="p-6">
                {/* Icon with gradient background */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${shortcut.color} p-4 mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <shortcut.icon className="w-full h-full text-white" />
                </div>

                {/* Content */}
                <h3 className="mb-2 flex items-center gap-2">
                  {shortcut.title}
                  {shortcut.alert && (
                    <Badge variant="destructive" className="text-xs">Alert</Badge>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {shortcut.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{shortcut.stats}</span>
                  <ArrowRight className="w-5 h-5 text-secondary group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Promotional Alert */}
      <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="mb-2 text-amber-900">Upcoming Promotional Event</h3>
            <p className="text-amber-800 mb-3">
              <strong>Ramadan Special Sale</strong> - Starting May 1st, 2026. Prepare extra stock for high-demand items!
            </p>
            <div className="flex gap-3">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                View Preparation Guide
              </Button>
              <Button size="sm" variant="outline" className="border-amber-600 text-amber-700">
                Stock Recommendations
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Insights */}
      <Card className="p-6 border-2 shadow-lg">
        <h3 className="mb-4 flex items-center gap-2">
          Today's AI Insights
          <Badge variant="secondary">Powered by GLM</Badge>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-green-50 border-2 border-green-200">
            <p className="text-sm text-green-900 mb-1">💰 Cost Savings</p>
            <p className="text-sm text-green-800">Switch to bulk rice orders to save RM 450/month</p>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
            <p className="text-sm text-blue-900 mb-1">📈 Revenue Boost</p>
            <p className="text-sm text-blue-800">Add 2 staff at 7-9pm rush for 25% more orders</p>
          </div>
          <div className="p-4 rounded-xl bg-purple-50 border-2 border-purple-200">
            <p className="text-sm text-purple-900 mb-1">♻️ Waste Reduction</p>
            <p className="text-sm text-purple-800">Reduce vegetable orders by 15% on Mon-Wed</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
