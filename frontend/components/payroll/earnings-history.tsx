"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TrendingUp, DollarSign, Clock } from "lucide-react"
import { FinancialCalculator } from "@/lib/financial-utils"
import type { Earning } from "@/lib/types"

interface EarningsHistoryProps {
  earnings: Earning[]
}

export function EarningsHistory({ earnings }: EarningsHistoryProps) {
  const totalEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0)
  const todayEarnings = earnings.filter(
    (earning) => new Date(earning.earned_at).toDateString() === new Date().toDateString(),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <span>Earnings History</span>
        </CardTitle>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <DollarSign className="w-4 h-4" />
            <span>Total: {FinancialCalculator.formatCurrency(totalEarnings)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>Today: {todayEarnings.length} payments</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {earnings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No earnings yet</p>
                <p className="text-sm">Start a payroll stream to see your earnings here</p>
              </div>
            ) : (
              earnings.map((earning) => (
                <div key={earning.id} className="flex items-center justify-between p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">{FinancialCalculator.formatCurrency(earning.amount)}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(earning.earned_at).toLocaleString("vi-VN")}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {earning.transaction_type}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
