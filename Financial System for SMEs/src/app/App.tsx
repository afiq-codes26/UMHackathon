import { useState } from "react";
import { HomePage } from "./components/HomePage";
import { DashboardPage } from "./components/DashboardPage";
import { StockManagement } from "./components/StockManagement";
import { VendorManagement } from "./components/VendorManagement";
import { Transactions } from "./components/Transactions";
import { Button } from "./components/ui/button";
import { Home, LayoutDashboard, Package, Users, Receipt, Menu, X } from "lucide-react";

type Page = "home" | "dashboard" | "stock" | "vendors" | "transactions";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigationItems = [
    { id: "home" as Page, label: "Home", icon: Home },
    { id: "dashboard" as Page, label: "Dashboard", icon: LayoutDashboard },
    { id: "stock" as Page, label: "Stock", icon: Package },
    { id: "vendors" as Page, label: "Vendors", icon: Users },
    { id: "transactions" as Page, label: "Transactions", icon: Receipt },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={(page) => setCurrentPage(page as Page)} />;
      case "dashboard":
        return <DashboardPage />;
      case "stock":
        return <StockManagement />;
      case "vendors":
        return <VendorManagement />;
      case "transactions":
        return <Transactions />;
      default:
        return <HomePage onNavigate={(page) => setCurrentPage(page as Page)} />;
    }
  };

  return (
    <div className="size-full overflow-hidden flex">
      {/* Sidebar Navigation - Desktop */}
      <div className="hidden lg:flex lg:flex-col w-72 bg-sidebar border-r border-sidebar-border shadow-lg">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <h2 className="text-2xl text-sidebar-foreground font-display">MindaFinancial</h2>
          <p className="text-xs text-sidebar-foreground/60 mt-1">AI-Powered Finance Platform</p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={currentPage === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 h-12 ${
                currentPage === item.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
              onClick={() => setCurrentPage(item.id)}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="p-4 bg-sidebar-accent rounded-lg">
            <p className="text-xs text-sidebar-accent-foreground/80 mb-2">AI Model Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-sidebar-accent-foreground">GLM Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border shadow-lg">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl text-sidebar-foreground font-display">MindaFinancial</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-sidebar-foreground"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="bg-sidebar border-t border-sidebar-border p-4 space-y-2">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  currentPage === item.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground"
                }`}
                onClick={() => {
                  setCurrentPage(item.id);
                  setMenuOpen(false);
                }}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto lg:mt-0 mt-16">
        {renderPage()}
      </div>
    </div>
  );
}