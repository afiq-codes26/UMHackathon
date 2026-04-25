"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  Phone,
  Mail,
  MapPin,
  Package,
  Clock,
  DollarSign,
  Plus,
  Search,
  ShoppingCart,
  TrendingUp,
  ExternalLink
} from "lucide-react"
import { vendors as initialVendors, stockItems, type Vendor } from "@/lib/mock-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface PendingOrder {
  vendorId: string
  vendorName: string
  items: { name: string; quantity: number; unit: string; price: number }[]
  total: number
  notes: string
}

export function VendorManagement() {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([])
  const [orderNotes, setOrderNotes] = useState("")
  const [orderItems, setOrderItems] = useState<{ [key: string]: number }>({})

  // Add Vendor State
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false)
  const [newVendor, setNewVendor] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    leadTime: "1",
    items: ""
  })

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.contact.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const orderVolumeData = vendors.map(v => ({
    name: v.name,
    orders: v.totalOrders,
    value: v.averageOrderValue
  }))

  const totalOrderValue = vendors.reduce((sum, v) => sum + (v.totalOrders * v.averageOrderValue), 0)

  const getVendorItems = (vendor: Vendor) => {
    return stockItems.filter(item => item.vendor === vendor.name)
  }

  const handleAddVendor = () => {
    const id = `v-${vendors.length + 1}`
    const vendorToAdd: Vendor = {
      id,
      name: newVendor.name,
      contact: newVendor.contact,
      email: newVendor.email,
      phone: newVendor.phone,
      address: newVendor.address,
      leadTime: parseInt(newVendor.leadTime) || 1,
      items: newVendor.items.split(",").map(i => i.trim()).filter(i => i !== ""),
      totalOrders: 0,
      averageOrderValue: 0,
      lastOrder: "Never"
    }
    
    setVendors([vendorToAdd, ...vendors])
    setIsAddVendorOpen(false)
    setNewVendor({ name: "", contact: "", email: "", phone: "", address: "", leadTime: "1", items: "" })
  }

  const handleCreateOrder = () => {
    if (!selectedVendor) return

    const itemsToOrder = Object.entries(orderItems)
      .filter(([_, qty]) => qty > 0)
      .map(([name, quantity]) => {
        const item = stockItems.find(i => i.name === name)
        return {
          name,
          quantity,
          unit: item?.unit || 'pcs',
          price: (item?.costPerUnit || 0) * quantity
        }
      })

    if (itemsToOrder.length === 0) return

    const newOrder: PendingOrder = {
      vendorId: selectedVendor.id,
      vendorName: selectedVendor.name,
      items: itemsToOrder,
      total: itemsToOrder.reduce((sum, item) => sum + item.price, 0),
      notes: orderNotes
    }

    setPendingOrders([...pendingOrders, newOrder])
    setOrderItems({})
    setOrderNotes("")
    setIsOrderDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Vendor Management</h2>
          <p className="text-muted-foreground">Manage supplier relationships and orders</p>
        </div>
        
        <Dialog open={isAddVendorOpen} onOpenChange={setIsAddVendorOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 w-fit">
              <Plus className="h-4 w-4" />
              Add New Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Register New Vendor</DialogTitle>
              <DialogDescription>
                Enter the supplier details to add them to your procurement network.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input id="name" placeholder="e.g. Fresh Catch Seafood" 
                    value={newVendor.name} onChange={(e) => setNewVendor({...newVendor, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Person</Label>
                  <Input id="contact" placeholder="e.g. John Doe" 
                    value={newVendor.contact} onChange={(e) => setNewVendor({...newVendor, contact: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="vendor@example.com" 
                    value={newVendor.email} onChange={(e) => setNewVendor({...newVendor, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="+60 12-345 6789" 
                    value={newVendor.phone} onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="items">Supplied Items (Comma separated)</Label>
                  <Input id="items" placeholder="Chicken, Beef, Eggs..." 
                    value={newVendor.items} onChange={(e) => setNewVendor({...newVendor, items: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leadTime">Lead Time (Days)</Label>
                  <Input id="leadTime" type="number" min="1"
                    value={newVendor.leadTime} onChange={(e) => setNewVendor({...newVendor, leadTime: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Warehouse Address</Label>
                <Textarea id="address" placeholder="Full street address..." 
                  value={newVendor.address} onChange={(e) => setNewVendor({...newVendor, address: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddVendorOpen(false)}>Cancel</Button>
              <Button onClick={handleAddVendor} className="bg-primary text-primary-foreground">Save Vendor</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{vendors.length}</p>
              <p className="text-sm text-muted-foreground">Active Vendors</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-success/10">
              <ShoppingCart className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{vendors.reduce((sum, v) => sum + v.totalOrders, 0)}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-warning/10">
              <DollarSign className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">RM {(totalOrderValue / 1000).toFixed(1)}k</p>
              <p className="text-sm text-muted-foreground">Total Spend</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-accent/10">
              <Clock className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingOrders.length}</p>
              <p className="text-sm text-muted-foreground">Pending Orders</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Volume Chart */}
      <Card className="border border-muted/20 shadow-lg bg-card/50 backdrop-blur">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Order Volume by Vendor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={orderVolumeData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={1} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#e2e8f0"
                  opacity={0.8}
                />

                <XAxis type="number" hide />

                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  width={140}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  cursor={{ fill: '#f1f5f9', opacity: 0.5 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white/95 backdrop-blur-md p-4 border border-slate-200 rounded-xl shadow-2xl min-w-[200px]">
                          <p className="font-extrabold text-slate-800 text-base border-b pb-2 mb-2">
                            {payload[0].payload.name}
                          </p>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Orders</span>
                              <span className="font-mono font-black text-blue-600 text-lg">{payload[0].value}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Avg Value</span>
                              <span className="font-mono font-black text-emerald-600 text-lg">RM {payload[0].payload.value}</span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />

                <Bar
                  dataKey="orders"
                  fill="url(#barGradient)"
                  radius={[0, 10, 10, 0]}
                  barSize={32}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Search and Vendor List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Vendor Directory</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Vendor</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Items Supplied</TableHead>
                  <TableHead>Lead Time</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{vendor.name}</p>
                        <p className="text-sm text-muted-foreground">{vendor.contact}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {vendor.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {vendor.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {vendor.items.slice(0, 3).map((item, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{item}</Badge>
                        ))}
                        {vendor.items.length > 3 && (
                          <Badge variant="secondary" className="text-xs">+{vendor.items.length - 3}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="h-3 w-3" />
                        {vendor.leadTime} day{vendor.leadTime > 1 ? 's' : ''}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{vendor.lastOrder}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedVendor(vendor)}>
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{vendor.name}</DialogTitle>
                              <DialogDescription>Vendor details and order history</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-muted-foreground">Contact Person</Label>
                                  <p className="font-medium">{vendor.contact}</p>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-muted-foreground">Phone</Label>
                                  <p className="font-medium">{vendor.phone}</p>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-muted-foreground">Email</Label>
                                  <p className="font-medium">{vendor.email}</p>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-muted-foreground">Lead Time</Label>
                                  <p className="font-medium">{vendor.leadTime} day{vendor.leadTime > 1 ? 's' : ''}</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-muted-foreground flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  Address
                                </Label>
                                <p className="font-medium">{vendor.address}</p>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-muted-foreground">Items Supplied</Label>
                                <div className="flex flex-wrap gap-2">
                                  {vendor.items.map((item, i) => (
                                    <Badge key={i} variant="secondary">{item}</Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                                <div>
                                  <p className="text-sm text-muted-foreground">Total Orders</p>
                                  <p className="text-2xl font-bold">{vendor.totalOrders}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Avg Order Value</p>
                                  <p className="text-2xl font-bold">RM {vendor.averageOrderValue}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Dialog open={isOrderDialogOpen && selectedVendor?.id === vendor.id} onOpenChange={(open) => {
                          setIsOrderDialogOpen(open)
                          if (open) setSelectedVendor(vendor)
                        }}>
                          <DialogTrigger asChild>
                            <Button size="sm" className="gap-1 bg-primary text-primary-foreground">
                              <Package className="h-4 w-4" />
                              Order
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Create Order - {vendor.name}</DialogTitle>
                              <DialogDescription>
                                Select items and quantities to order
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                              {getVendorItems(vendor).map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
                                  <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      RM {item.costPerUnit}/{item.unit} • Stock: {item.currentStock} {item.unit}
                                    </p>
                                  </div>
                                  <Input
                                    type="number"
                                    min="0"
                                    className="w-20"
                                    placeholder="0"
                                    value={orderItems[item.name] || ''}
                                    onChange={(e) => setOrderItems({
                                      ...orderItems,
                                      [item.name]: parseInt(e.target.value) || 0
                                    })}
                                  />
                                </div>
                              ))}
                              {getVendorItems(vendor).length === 0 && (
                                <p className="text-center text-muted-foreground py-4">
                                  No items linked to this vendor in inventory
                                </p>
                              )}
                              <div className="space-y-2">
                                <Label>Order Notes</Label>
                                <Textarea
                                  placeholder="Add any special instructions..."
                                  value={orderNotes}
                                  onChange={(e) => setOrderNotes(e.target.value)}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleCreateOrder} className="bg-primary text-primary-foreground">
                                Create Order
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pending Orders */}
      {pendingOrders.length > 0 && (
        <Card className="border-warning/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <Clock className="h-5 w-5" />
              Pending Orders ({pendingOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingOrders.map((order, i) => (
                <div key={i} className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">{order.vendorName}</p>
                      <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">RM {order.total.toFixed(2)}</p>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item, j) => (
                      <Badge key={j} variant="outline">
                        {item.name}: {item.quantity} {item.unit}
                      </Badge>
                    ))}
                  </div>
                  {order.notes && (
                    <p className="text-sm text-muted-foreground mt-2 italic">&quot;{order.notes}&quot;</p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="bg-primary text-primary-foreground">
                      Send to Vendor
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => {
                      setPendingOrders(pendingOrders.filter((_, idx) => idx !== i))
                    }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}