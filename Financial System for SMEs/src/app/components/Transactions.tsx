import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Receipt, Search, Calendar, X, Clock, CreditCard, Wallet } from "lucide-react";
import { Input } from "./ui/input";

interface TransactionItem {
  name: string;
  quantity: number;
  price: number;
}

interface Transaction {
  id: string;
  time: string;
  date: string;
  amount: number;
  items: TransactionItem[];
  payment: "Cash" | "Card" | "E-wallet";
  customerName?: string;
  status: "completed" | "pending" | "refunded";
}

const mockTransactions: Transaction[] = [
  {
    id: "TXN-1247",
    time: "2:34 PM",
    date: "April 23, 2026",
    amount: 45.50,
    items: [
      { name: "Nasi Lemak", quantity: 2, price: 12.00 },
      { name: "Teh Tarik", quantity: 2, price: 4.50 },
      { name: "Roti Canai", quantity: 3, price: 4.50 },
    ],
    payment: "Cash",
    customerName: "Ahmad bin Ali",
    status: "completed",
  },
  {
    id: "TXN-1246",
    time: "2:28 PM",
    date: "April 23, 2026",
    amount: 78.20,
    items: [
      { name: "Chicken Rice", quantity: 3, price: 15.00 },
      { name: "ABC Special", quantity: 2, price: 8.50 },
      { name: "Fried Noodles", quantity: 2, price: 12.00 },
    ],
    payment: "Card",
    status: "completed",
  },
  {
    id: "TXN-1245",
    time: "2:15 PM",
    date: "April 23, 2026",
    amount: 32.00,
    items: [
      { name: "Mee Goreng", quantity: 2, price: 10.00 },
      { name: "Ice Lemon Tea", quantity: 2, price: 6.00 },
    ],
    payment: "E-wallet",
    customerName: "Sarah Lee",
    status: "completed",
  },
  {
    id: "TXN-1244",
    time: "2:08 PM",
    date: "April 23, 2026",
    amount: 125.80,
    items: [
      { name: "Nasi Briyani", quantity: 5, price: 18.00 },
      { name: "Mango Lassi", quantity: 3, price: 7.50 },
      { name: "Samosa", quantity: 4, price: 3.00 },
    ],
    payment: "Card",
    status: "completed",
  },
  {
    id: "TXN-1243",
    time: "1:55 PM",
    date: "April 23, 2026",
    amount: 65.00,
    items: [
      { name: "Curry Laksa", quantity: 3, price: 14.00 },
      { name: "Iced Coffee", quantity: 2, price: 6.50 },
    ],
    payment: "Cash",
    status: "completed",
  },
  {
    id: "TXN-1242",
    time: "1:42 PM",
    date: "April 23, 2026",
    amount: 89.50,
    items: [
      { name: "Char Kway Teow", quantity: 4, price: 12.50 },
      { name: "Satay (10 sticks)", quantity: 2, price: 18.00 },
      { name: "Sugarcane Juice", quantity: 3, price: 5.00 },
    ],
    payment: "E-wallet",
    customerName: "Tan Wei Ming",
    status: "completed",
  },
];

export function Transactions() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactions.filter(
    (txn) =>
      txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = transactions.reduce((sum, txn) => sum + txn.amount, 0);
  const avgTransaction = totalRevenue / transactions.length;

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl mb-2 tracking-tight flex items-center gap-3">
            <Receipt className="w-12 h-12 text-secondary" />
            Transactions
          </h1>
          <p className="text-muted-foreground text-lg">View and manage all sales transactions</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Today's Date</p>
          <p className="text-lg">April 23, 2026</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 border-2 shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
          <p className="text-sm text-green-700 mb-1">Total Revenue</p>
          <p className="text-3xl text-green-900">RM {totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-green-600 mt-1">From {transactions.length} transactions</p>
        </Card>
        <Card className="p-5 border-2 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
          <p className="text-sm text-blue-700 mb-1">Total Orders</p>
          <p className="text-4xl text-blue-900">{transactions.length}</p>
          <p className="text-xs text-blue-600 mt-1">Completed today</p>
        </Card>
        <Card className="p-5 border-2 shadow-md bg-gradient-to-br from-purple-50 to-violet-50">
          <p className="text-sm text-purple-700 mb-1">Average Order</p>
          <p className="text-3xl text-purple-900">RM {avgTransaction.toFixed(2)}</p>
          <p className="text-xs text-purple-600 mt-1">Per transaction</p>
        </Card>
        <Card className="p-5 border-2 shadow-md bg-gradient-to-br from-amber-50 to-orange-50">
          <p className="text-sm text-amber-700 mb-1">Cash Payments</p>
          <p className="text-4xl text-amber-900">
            {transactions.filter(t => t.payment === "Cash").length}
          </p>
          <p className="text-xs text-amber-600 mt-1">
            RM {transactions.filter(t => t.payment === "Cash").reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
          </p>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4 border-2 shadow-md">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by transaction ID or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {searchTerm && (
            <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </Card>

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredTransactions.map((txn) => (
          <Card
            key={txn.id}
            className="p-5 border-2 hover:border-secondary transition-all duration-200 shadow-md cursor-pointer group"
            onClick={() => setSelectedTransaction(txn)}
          >
            <div className="flex items-center justify-between">
              {/* Left: Transaction Info */}
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Receipt className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-medium text-lg">{txn.id}</p>
                    <Badge variant={
                      txn.status === 'completed' ? 'secondary' :
                      txn.status === 'pending' ? 'outline' :
                      'destructive'
                    }>
                      {txn.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {txn.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {txn.date}
                    </span>
                    <span className="flex items-center gap-1">
                      {txn.payment === "Cash" ? (
                        <Wallet className="w-4 h-4" />
                      ) : txn.payment === "Card" ? (
                        <CreditCard className="w-4 h-4" />
                      ) : (
                        <Wallet className="w-4 h-4" />
                      )}
                      {txn.payment}
                    </span>
                  </div>
                  {txn.customerName && (
                    <p className="text-sm mt-1">Customer: <span className="font-medium">{txn.customerName}</span></p>
                  )}
                </div>
              </div>

              {/* Right: Amount & Items */}
              <div className="text-right">
                <p className="text-3xl mb-1 text-secondary">RM {txn.amount.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">{txn.items.length} items</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTransaction(null)}
        >
          <Card
            className="max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl mb-2">Transaction Details</h2>
                <p className="text-muted-foreground">{selectedTransaction.id}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedTransaction(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Transaction Info */}
            <div className="grid grid-cols-2 gap-6 mb-6 p-5 bg-muted/30 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date & Time</p>
                <p className="font-medium">{selectedTransaction.date}</p>
                <p className="text-sm">{selectedTransaction.time}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                <Badge variant="secondary" className="mt-1">{selectedTransaction.payment}</Badge>
              </div>
              {selectedTransaction.customerName && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Customer Name</p>
                    <p className="font-medium">{selectedTransaction.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <Badge variant="secondary" className="mt-1">{selectedTransaction.status}</Badge>
                  </div>
                </>
              )}
            </div>

            {/* Items */}
            <div className="mb-6">
              <h3 className="text-xl mb-4">Order Items</h3>
              <div className="space-y-3">
                {selectedTransaction.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">RM {(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">@ RM {item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg">Subtotal</p>
                <p className="text-lg">RM {selectedTransaction.amount.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">Tax (6% SST)</p>
                <p className="text-sm text-muted-foreground">RM {(selectedTransaction.amount * 0.06).toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between text-2xl pt-4 border-t">
                <p className="font-medium">Total Amount</p>
                <p className="font-medium text-secondary">RM {(selectedTransaction.amount * 1.06).toFixed(2)}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1">Print Receipt</Button>
              <Button variant="outline" className="flex-1">Export</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
