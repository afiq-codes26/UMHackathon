"use client"

import { useState, useEffect } from "react"
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
  TrendingDown,
  ExternalLink
} from "lucide-react"
import { stockItems, type Vendor } from "@/lib/mock-data"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface PendingOrder {
  vendorId: string
  vendorName: string
  items: { name: string; quantity: number; unit: string; price: number }[]
  total: number
  notes: string
}

export function VendorManagement() {
  // --- DATABASE & UI STATE ---
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([])
  const [orderNotes, setOrderNotes] = useState("")
  const [orderItems, setOrderItems] = useState<{ [key: string]: number }>({})
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false)
  
  const DEMO_USER_ID = "cmoem7n5n0000n7hj8zbgpo3e"

  const [newVendor, setNewVendor] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    leadTime: "1",
    items: ""
  })

  // --- FETCH DATA FROM DB ---
  useEffect(() => {
    async function loadVendors() {
      try {
        const response = await fetch('/api/vendors')
        if (response.ok) {
          const data = await response.json()
          
          const formattedData = data.map((v: any) => {
            // Generate stable mock stats for the demo
            const mockOrders = (v.name.length * 3) % 20 + 5; 
            const mockValue = 150 + (v.name.length * 10);   
            
            return {
              ...v,
              contact: v.contact || "Primary Contact",
              address: v.address || "Warehouse A",
              leadTime: v.leadTime || 2,
              items: v.items || ["General Supplies"],
              totalOrders: mockOrders, 
              averageOrderValue: mockValue,
              lastOrder: "3 days ago"
            }
          })
          setVendors(formattedData)
        }
      } catch (err) {
        console.error("Fetch error:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadVendors()
  }, [])

  // --- SAVE TO DB ---
  const handleAddVendor = async () => {
    try {
      const response = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newVendor.name,
          email: newVendor.email,
          phone: newVendor.phone,
          category: "General",
          userId: DEMO_USER_ID
        }),
      })

      if (response.ok) {
        const saved = await response.json()
        const uiVendor: Vendor = {
          ...saved,
          contact: newVendor.contact,
          address: newVendor.address,
          leadTime: parseInt(newVendor.leadTime),
          items: newVendor.items.split(",").map(i => i.trim()),
          totalOrders: 0,
          averageOrderValue: 0,
          lastOrder: "Just now"
        }
        setVendors([uiVendor, ...vendors])
        setIsAddVendorOpen(false)
        setNewVendor({ name: "", contact: "", email: "", phone: "", address: "", leadTime: "1", items: "" })
      }
    } catch (error) {
      console.error(error)
    }
  }

  // --- LOGIC ---
  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vendor.contact && vendor.contact.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const orderVolumeData = vendors.map(v => ({
    name: v?.name || "Unknown",
    orders: v?.totalOrders || 0,
    value: v?.averageOrderValue || 0
  }))

  const totalOrderValue = vendors.reduce((sum, v) => sum + (v.totalOrders * v.averageOrderValue), 0)

  const getVendorItems = (vendor: Vendor | null) => {
    if (!vendor) return [];
    return stockItems.filter(item => item.vendor === vendor.name)
  }

  const handleCreateOrder = () => {
    if (!selectedVendor) return
    const itemsToOrder = Object.entries(orderItems)
      .filter(([_, qty]) => qty > 0)
      .map(([name, quantity]) => {
        const item = stockItems.find(i => i.name === name)
        return { name, quantity, unit: item?.unit || 'pcs', price: (item?.costPerUnit || 0) * quantity }
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
    setOrderItems({}); setOrderNotes(""); setIsOrderDialogOpen(false)
  }

  if (isLoading) return <div className="p-20 text-center font-bold">Syncing with Database...</div>

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
              <DialogDescription>Enter the supplier details to add them to your procurement network.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input id="name" placeholder="e.g. Fresh Catch Seafood"
                    value={newVendor.name} onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Person</Label>
                  <Input id="contact" placeholder="e.g. John Doe"
                    value={newVendor.contact} onChange={(e) => setNewVendor({ ...newVendor, contact: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="vendor@example.com"
                    value={newVendor.email} onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="+60 12-345 6789"
                    value={newVendor.phone} onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="items">Supplied Items (Comma separated)</Label>
                  <Input id="items" placeholder="Chicken, Beef, Eggs..."
                    value={newVendor.items} onChange={(e) => setNewVendor({ ...newVendor, items: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leadTime">Lead Time (Days)</Label>
                  <Input id="leadTime" type="number" min="1"
                    value={newVendor.leadTime} onChange={(e) => setNewVendor({ ...newVendor, leadTime: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Warehouse Address</Label>
                <Textarea id="address" placeholder="Full street address..."
                  value={newVendor.address} onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })} />
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
        <Card><CardContent className="flex items-center gap-4 pt-6">
          <div className="p-3 rounded-full bg-primary/10"><Users className="h-6 w-6 text-primary" /></div>
          <div><p className="text-2xl font-bold">{vendors.length}</p><p className="text-sm text-muted-foreground">Active Vendors</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 pt-6">
          <div className="p-3 rounded-full bg-green-500/10"><ShoppingCart className="h-6 w-6 text-green-500" /></div>
          <div><p className="text-2xl font-bold">{vendors.reduce((sum, v) => sum + v.totalOrders, 0)}</p><p className="text-sm text-muted-foreground">Total Orders</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 pt-6">
          <div className="p-3 rounded-full bg-yellow-500/10"><DollarSign className="h-6 w-6 text-yellow-500" /></div>
          <div><p className="text-2xl font-bold">RM {(totalOrderValue / 1000).toFixed(1)}k</p><p className="text-sm text-muted-foreground">Total Spend</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 pt-6">
          <div className="p-3 rounded-full bg-blue-500/10"><Clock className="h-6 w-6 text-blue-500" /></div>
          <div><p className="text-2xl font-bold">{pendingOrders.length}</p><p className="text-sm text-muted-foreground">Pending Orders</p></div>
        </CardContent></Card>
      </div>

      {/* --- ENHANCED CHART SECTION --- */}
      <Card className="overflow-hidden border-muted/40 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-green-500" />
            Order Volume by Vendor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[450px] w-full"> 
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={orderVolumeData}
                margin={{ top: 5, right: 30, left: 140, bottom: 5 }} // Increased left margin for text
              >
                <defs>
                  <linearGradient id="vendorGradient" x1="1" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.3} />
                  </linearGradient>
                </defs>

                <XAxis type="number" hide />
                
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  width={130}
                  tick={{ fontSize: 11, fontWeight: 600, fill: "hsl(var(--muted-foreground))" }}
                />

                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.04)" }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="text-xs font-bold text-gray-500 mb-1">{label}</p>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-sm font-black text-slate-900">
                              {payload[0].value} Orders
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Bar 
                  dataKey="orders" 
                  fill="url(#vendorGradient)" 
                  radius={[0, 4, 4, 0]} 
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Vendor Directory</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Lead Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <div className="font-medium">{vendor.name}</div>
                    <div className="text-xs text-muted-foreground">{vendor.email}</div>
                  </TableCell>
                  <TableCell>{vendor.phone}</TableCell>
                  <TableCell><Badge variant="secondary">{vendor.leadTime} days</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground"
                      onClick={() => {
                        setSelectedVendor(vendor);
                        setOrderItems({});
                        setIsOrderDialogOpen(true);
                      }}
                    >
                      <Package className="h-4 w-4 mr-2" /> Order
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- ORDER DIALOG --- */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Purchase Order: {selectedVendor?.name}</DialogTitle>
            <DialogDescription>
              Select items and quantities to order from this supplier.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="max-h-[300px] overflow-y-auto border rounded-md p-2">
              {getVendorItems(selectedVendor).length > 0 ? (
                getVendorItems(selectedVendor).map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">RM {item.costPerUnit} / {item.unit}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        min="0"
                        className="w-20"
                        placeholder="Qty"
                        value={orderItems[item.name] || ""}
                        onChange={(e) => setOrderItems({
                          ...orderItems,
                          [item.name]: parseInt(e.target.value) || 0
                        })}
                      />
                      <span className="text-sm w-12">{item.unit}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-10 text-muted-foreground">No stock items linked to this vendor.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Order Notes</Label>
              <Textarea
                placeholder="Delivery instructions, specific requirements..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleCreateOrder}
              disabled={!Object.values(orderItems).some(qty => qty > 0)}
            >
              Confirm Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}