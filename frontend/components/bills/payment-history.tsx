"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, CheckCircle, XCircle, Clock } from "lucide-react"
import { FinancialCalculator } from "@/lib/financial-utils"
import type { Bill, BillPayment } from "@/lib/types"

interface PaymentHistoryProps {
  payments: (BillPayment & { bill: Bill })[]
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  const totalPaid = payments
    .filter((payment) => payment.payment_status === "completed")
    .reduce((sum, payment) => sum + payment.amount, 0)

  const thisMonthPayments = payments.filter((payment) => {
    const paymentDate = new Date(payment.paid_at)
    const now = new Date()
    return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear()
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-amber-600" />
      default:
        return <Clock className="w-4 h-4 text-slate-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-800"
      case "failed":
        return "text-red-800"
      case "pending":
        return "text-amber-800"
      default:
        return "text-slate-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <History className="w-5 h-5 text-blue-600" />
          <span>Payment History</span>
        </CardTitle>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Total Paid</div>
            <div className="font-medium">{FinancialCalculator.formatCurrency(totalPaid)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">This Month</div>
            <div className="font-medium">{thisMonthPayments.length} payments</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <History className="w-12 h-12 mx-auto mb-2 text-slate-400" />
              <p className="text-muted-foreground">No payment history yet</p>
              <p className="text-sm text-muted-foreground">Payments will appear here once bills are paid</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(payment.payment_status)}
                    <div>
                      <div className="font-medium">{payment.bill.bill_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(payment.paid_at).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-medium">{FinancialCalculator.formatCurrency(payment.amount)}</div>
                    <Badge variant="outline" className={getStatusColor(payment.payment_status)}>
                      {payment.payment_status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
