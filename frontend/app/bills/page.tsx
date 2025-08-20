"use client"

import { useState } from "react"
import { BillSetup } from "@/components/bills/bill-setup"
import { BillList } from "@/components/bills/bill-list"
import { PaymentHistory } from "@/components/bills/payment-history"
import { UpcomingBills } from "@/components/bills/upcoming-bills"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Bill, BillPayment } from "@/lib/types"

// Extend BillPayment type to include bill info
type BillPaymentWithBill = BillPayment & { bill: Bill }

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([
    {
      id: "1",
      user_id: "user-1",
      bill_name: "Electric Bill",
      amount: 800000,
      due_date: 15,
      category: "utilities",
      is_active: true,
      auto_pay: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      user_id: "user-1",
      bill_name: "Internet",
      amount: 500000,
      due_date: 5,
      category: "internet",
      is_active: true,
      auto_pay: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      user_id: "user-1",
      bill_name: "Netflix",
      amount: 180000,
      due_date: 20,
      category: "subscription",
      is_active: true,
      auto_pay: false,
      created_at: new Date().toISOString(),
    },
  ])

  // Mock payment history
  const paymentHistory: BillPaymentWithBill[] = [
    {
      id: "1",
      bill_id: "1",
      amount: 800000,
      paid_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      payment_status: "completed",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      bill: bills[0],
    },
    {
      id: "2",
      bill_id: "2",
      amount: 500000,
      paid_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
      payment_status: "completed",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
      bill: bills[1],
    },
    {
      id: "3",
      bill_id: "3",
      amount: 180000,
      paid_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
      payment_status: "failed",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      bill: bills[2],
    },
  ]

  const handleBillCreated = (bill: Bill) => {
    setBills([...bills, bill])
  }

  const handleToggleAutoPay = (billId: string, autoPay: boolean) => {
    setBills(bills.map((bill) => (bill.id === billId ? { ...bill, auto_pay: autoPay } : bill)))
  }

  const handleToggleActive = (billId: string, isActive: boolean) => {
    setBills(bills.map((bill) => (bill.id === billId ? { ...bill, is_active: isActive } : bill)))
  }

  const handlePayNow = (billId: string) => {
    // In real app, this would trigger payment processing
    console.log("Processing payment for bill:", billId)
  }

  return (
    <div className="min-h-screen">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Bill Management */}
          <div className="lg:col-span-2 space-y-6">
            <BillSetup onBillCreated={handleBillCreated} />

            <BillList bills={bills} onToggleAutoPay={handleToggleAutoPay} onToggleActive={handleToggleActive} />
          </div>

          {/* Right Column - Upcoming Bills & History */}
          <div className="space-y-6">
            <UpcomingBills bills={bills} onPayNow={handlePayNow} />

            <PaymentHistory payments={paymentHistory} />
          </div>
        </div>
      </main>
    </div>
  )
}
