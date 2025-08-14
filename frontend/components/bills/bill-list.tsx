"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { CreditCard, Calendar, AlertCircle, CheckCircle, Settings } from "lucide-react"
import { FinancialCalculator } from "@/lib/financial-utils"
import type { Bill } from "@/lib/types"

interface BillListProps {
  bills: Bill[]
  onToggleAutoPay?: (billId: string, autoPay: boolean) => void
  onToggleActive?: (billId: string, isActive: boolean) => void
}

const CATEGORY_ICONS: Record<string, string> = {
  utilities: "⚡",
  rent: "🏠",
  internet: "🌐",
  phone: "📱",
  insurance: "🛡️",
  subscription: "📺",
  loan: "💳",
  other: "📄",
}

export function BillList({ bills, onToggleAutoPay, onToggleActive }: BillListProps) {
  const totalMonthlyBills = bills.filter((bill) => bill.is_active).reduce((sum, bill) => sum + bill.amount, 0)

  const autoPaidBills = bills.filter((bill) => bill.auto_pay && bill.is_active)

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-purple-600" />
          <span>Your Bills</span>
        </CardTitle>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Total Monthly</div>
            <div className="font-medium">{FinancialCalculator.formatCurrency(totalMonthlyBills)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Auto-Pay Enabled</div>
            <div className="font-medium">
              {autoPaidBills.length} of {bills.length}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {bills.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 mx-auto mb-2 text-slate-400" />
            <p className="text-muted-foreground">No bills added yet</p>
            <p className="text-sm text-muted-foreground">Add your first bill to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bills.map((bill) => {
              const daysUntilDue = getDaysUntilDue(bill.due_date)
              const isOverdue = daysUntilDue < 0
              const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0

              return (
                <div
                  key={bill.id}
                  className={`p-4 rounded-lg border ${
                    !bill.is_active
                      ? "bg-slate-50 border-slate-200"
                      : isOverdue
                        ? "bg-red-50 border-red-200"
                        : isDueSoon
                          ? "bg-amber-50 border-amber-200"
                          : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{CATEGORY_ICONS[bill.category] || "📄"}</div>
                      <div>
                        <h4 className="font-medium">{bill.bill_name}</h4>
                        <p className="text-sm text-muted-foreground capitalize">{bill.category.replace("_", " ")}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{FinancialCalculator.formatCurrency(bill.amount)}</div>
                      <div className="text-sm text-muted-foreground">Due {bill.due_date}th</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Badge
                        variant={
                          isOverdue ? "destructive" : isDueSoon ? "secondary" : bill.auto_pay ? "default" : "outline"
                        }
                        className="flex items-center space-x-1"
                      >
                        {isOverdue ? (
                          <AlertCircle className="w-3 h-3" />
                        ) : bill.auto_pay ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <Calendar className="w-3 h-3" />
                        )}
                        <span>
                          {isOverdue
                            ? `${Math.abs(daysUntilDue)} days overdue`
                            : isDueSoon
                              ? `Due in ${daysUntilDue} days`
                              : bill.auto_pay
                                ? "Auto-pay enabled"
                                : "Manual payment"}
                        </span>
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Auto-pay</span>
                        <Switch
                          checked={bill.auto_pay}
                          onCheckedChange={(checked) => onToggleAutoPay?.(bill.id, checked)}
                          disabled={!bill.is_active}
                        />
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => onToggleActive?.(bill.id, !bill.is_active)}>
                        <Settings className="w-4 h-4" />
                      </Button>
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
