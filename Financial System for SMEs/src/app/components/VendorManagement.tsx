import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Users, Phone, Mail, MapPin, Calendar, Package, Edit } from "lucide-react";
import { Label } from "./ui/label";

interface Vendor {
  id: string;
  name: string;
  category: string;
  contact: string;
  email: string;
  address: string;
  lastOrder: string;
  nextDelivery: string;
  status: "active" | "pending" | "inactive";
  items: string[];
  totalSpent: number;
  orderHistory: number;
}

const initialVendors: Vendor[] = [
  {
    id: "1",
    name: "Fresh Farms Supply",
    category: "Vegetables & Produce",
    contact: "+60 12-345 6789",
    email: "orders@freshfarms.my",
    address: "Lot 23, Jalan Pasar, Cheras, KL",
    lastOrder: "2 days ago",
    nextDelivery: "Tomorrow, 8:00 AM",
    status: "active",
    items: ["Vegetables Mix", "Tomatoes", "Onions", "Cabbage"],
    totalSpent: 12450,
    orderHistory: 45,
  },
  {
    id: "2",
    name: "Prime Meats Co.",
    category: "Chicken & Meat",
    contact: "+60 16-789 1234",
    email: "sales@primemeats.com.my",
    address: "No 89, Jalan Industri 5, Shah Alam",
    lastOrder: "1 day ago",
    nextDelivery: "Today, 6:00 PM",
    status: "active",
    items: ["Chicken", "Beef", "Lamb"],
    totalSpent: 28900,
    orderHistory: 72,
  },
  {
    id: "3",
    name: "Golden Rice Trading",
    category: "Grains & Rice",
    contact: "+60 19-234 5678",
    email: "info@goldenrice.my",
    address: "Warehouse 12, Port Klang",
    lastOrder: "5 days ago",
    nextDelivery: "In 3 days",
    status: "pending",
    items: ["Rice", "Flour", "Noodles"],
    totalSpent: 18600,
    orderHistory: 38,
  },
  {
    id: "4",
    name: "Spice Kingdom",
    category: "Spices & Condiments",
    contact: "+60 11-876 5432",
    email: "contact@spicekingdom.my",
    address: "Plaza Low Yat, Bukit Bintang, KL",
    lastOrder: "3 days ago",
    nextDelivery: "Next week",
    status: "active",
    items: ["Spices Mix", "Curry Powder", "Chili Paste"],
    totalSpent: 8750,
    orderHistory: 29,
  },
];

export function VendorManagement() {
  const [vendors] = useState<Vendor[]>(initialVendors);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl mb-2 tracking-tight flex items-center gap-3">
            <Users className="w-12 h-12 text-secondary" />
            Vendor Management
          </h1>
          <p className="text-muted-foreground text-lg">Manage suppliers and track order details</p>
        </div>
        <Button size="lg" className="gap-2">
          <Users className="w-5 h-5" />
          Add New Vendor
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 border-2 shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
          <p className="text-sm text-green-700 mb-1">Active Vendors</p>
          <p className="text-4xl text-green-900">{vendors.filter(v => v.status === "active").length}</p>
        </Card>
        <Card className="p-5 border-2 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
          <p className="text-sm text-blue-700 mb-1">Total Suppliers</p>
          <p className="text-4xl text-blue-900">{vendors.length}</p>
        </Card>
        <Card className="p-5 border-2 shadow-md bg-gradient-to-br from-purple-50 to-violet-50">
          <p className="text-sm text-purple-700 mb-1">Total Spent (MTD)</p>
          <p className="text-3xl text-purple-900">RM {vendors.reduce((sum, v) => sum + v.totalSpent, 0).toLocaleString()}</p>
        </Card>
        <Card className="p-5 border-2 shadow-md bg-gradient-to-br from-amber-50 to-orange-50">
          <p className="text-sm text-amber-700 mb-1">Pending Orders</p>
          <p className="text-4xl text-amber-900">{vendors.filter(v => v.status === "pending").length}</p>
        </Card>
      </div>

      {/* Vendor Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {vendors.map((vendor) => (
          <Card
            key={vendor.id}
            className="p-6 border-2 hover:border-secondary transition-all duration-200 shadow-md cursor-pointer"
            onClick={() => setSelectedVendor(vendor)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl mb-1">{vendor.name}</h3>
                <p className="text-sm text-muted-foreground">{vendor.category}</p>
              </div>
              <Badge variant={
                vendor.status === 'active' ? 'secondary' :
                vendor.status === 'pending' ? 'outline' :
                'destructive'
              }>
                {vendor.status}
              </Badge>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{vendor.contact}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="truncate">{vendor.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs">{vendor.address}</span>
              </div>
            </div>

            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                  <Calendar className="w-3 h-3" />
                  Last Order
                </Label>
                <p className="text-sm font-medium">{vendor.lastOrder}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                  <Package className="w-3 h-3" />
                  Next Delivery
                </Label>
                <p className="text-sm font-medium">{vendor.nextDelivery}</p>
              </div>
            </div>

            {/* Items Supplied */}
            <div className="mb-4">
              <Label className="text-xs text-muted-foreground mb-2 block">Items Supplied</Label>
              <div className="flex flex-wrap gap-2">
                {vendor.items.map((item, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-xs text-muted-foreground">Total Spent</p>
                <p className="text-lg font-medium">RM {vendor.totalSpent.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Orders</p>
                <p className="text-lg font-medium">{vendor.orderHistory}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <Button className="flex-1">Place Order</Button>
              <Button variant="outline" size="icon">
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Vendor Details Modal (Simple version) */}
      {selectedVendor && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedVendor(null)}
        >
          <Card
            className="max-w-2xl w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl mb-2">{selectedVendor.name}</h2>
            <p className="text-muted-foreground mb-6">{selectedVendor.category}</p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg mb-3">Order Details</h3>
                <div className="space-y-4">
                  {selectedVendor.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <Label className="text-sm mb-2 block">{item}</Label>
                        <Input type="number" placeholder="Quantity" className="w-32" />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">Last Price</p>
                        <p className="font-medium">RM 25.00/kg</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1">Submit Order</Button>
                <Button variant="outline" onClick={() => setSelectedVendor(null)}>
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
