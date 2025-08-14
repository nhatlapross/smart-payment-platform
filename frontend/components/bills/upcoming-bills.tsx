"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, AlertTriangle, CreditCard, Zap } from "lucide-react"
import { FinancialCalculator } from "@/lib/financial-utils"
import type { Bill } from "@/lib/types"

interface UpcomingBillsProps {
  bills: Bill[]
  onPayNow?: (billId: string) => void
}

export function UpcomingBills({ bills, onPayNow }: UpcomingBillsProps) {
  const getNextDueDate = (dueDay: number) => {
    return FinancialCalculator.getNextBillDueDate(dueDay)
  }

  const getDaysUntilDue = (dueDay: number) => {
    const nextDue = getNextDueDate(dueDay)
    const today = new Date()
    const diffTime = nextDue.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Sort bills by days until due
  const sortedBills = bills
    .filter((bill) => bill.is_active)
    .map((bill) => ({
      ...bill,
      daysUntilDue: getDaysUntilDue(bill.due_date),
    }))
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue)
    .slice(0, 5) // Show only next 5 bills

  const totalUpcoming = sortedBills.reduce((sum, bill) => sum + bill.amount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-orange-600" />
          <span>Upcoming Bills</span>
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Total upcoming: {FinancialCalculator.formatCurrency(totalUpcoming)}
        </div>
      </CardHeader>
      <CardContent>
        {sortedBills.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 mx-auto mb-2 text-slate-400" />
            <p className="text-muted-foreground">No upcoming bills</p>
            <p className="text-sm text-muted-foreground">All bills are up to date</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedBills.map((bill) => {
              const isOverdue = bill.daysUntilDue < 0
              const isDueSoon = bill.daysUntilDue <= 3 && bill.daysUntilDue >= 0

              return (
                <div
                  key={bill.id}
                  className={`p-3 rounded-lg border ${
                    isOverdue
                      ? "bg-red-50 border-red-200"
                      : isDueSoon
                        ? "bg-amber-50 border-amber-200"
                        : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <div className="font-medium">{bill.bill_name}</div>
                        <div className="text-sm text-muted-foreground">
                          Due {getNextDueDate(bill.due_date).toLocaleDateString("vi-VN")}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="font-medium">{FinancialCalculator.formatCurrency(bill.amount)}</div>
                        <Badge
                          variant={isOverdue ? "destructive" : isDueSoon ? "secondary" : "outline"}
                          className="text-xs"
                        >
                          {isOverdue ? (
                            <>
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {Math.abs(bill.daysUntilDue)} days overdue
                            </>
                          ) : bill.daysUntilDue === 0 ? (
                            "Due today"
                          ) : (
                            `${bill.daysUntilDue} days`
                          )}
                        </Badge>
                      </div>

                      {bill.auto_pay ? (
                        <Badge variant="default" className="text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          Auto
                        </Badge>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => onPayNow?.(bill.id)}>
                          Pay Now
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
