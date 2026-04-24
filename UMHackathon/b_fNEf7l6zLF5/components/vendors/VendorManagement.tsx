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
  const [vendors] = useState<Vendor[]>(initialVendors)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([])
  const [orderNotes, setOrderNotes] = useState("")
  const [orderItems, setOrderItems] = useState<{ [key: string]: number }>({})

  const filteredVendors = vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.contact.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const orderVolumeData = vendors.map(v => ({
    name: v.name.length > 12 ? v.name.substring(0, 12) + '...' : v.name,
    orders: v.totalOrders,
    value: v.averageOrderValue
  }))

  const totalOrderValue = vendors.reduce((sum, v) => sum + (v.totalOrders * v.averageOrderValue), 0)

  const getVendorItems = (vendor: Vendor) => {
    return stockItems.filter(item => item.vendor === vendor.name)
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
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 w-fit">
          <Plus className="h-4 w-4" />
          Add New Vendor
        </Button>
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Order Volume by Vendor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderVolumeData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => [
                    name === 'orders' ? value : `RM ${value}`,
                    name === 'orders' ? 'Total Orders' : 'Avg Order Value'
                  ]}
                />
                <Bar dataKey="orders" name="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
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
