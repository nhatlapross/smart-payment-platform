"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, PiggyBank, TrendingUp, Wallet, DollarSign } from "lucide-react"
import { FinancialCalculator } from "@/lib/financial-utils"
import type { AllocationRule } from "@/lib/types"

interface AllocationFlowProps {
  rule: AllocationRule
  recentEarning?: number
}

export function AllocationFlow({ rule, recentEarning = 125000 }: AllocationFlowProps) {
  const allocation = FinancialCalculator.applyAllocationRules(recentEarning, rule)

  const flowItems = [
    {
      label: "Earnings",
      amount: recentEarning,
      icon: <DollarSign className="w-4 h-4" />,
      color: "bg-slate-100 text-slate-700",
    },
    {
      label: "Savings",
      amount: allocation.savings,
      icon: <PiggyBank className="w-4 h-4" />,
      color: "bg-green-100 text-green-700",
      percentage: rule.savings_percentage,
    },
    {
      label: "Investment",
      amount: allocation.investment,
      icon: <TrendingUp className="w-4 h-4" />,
      color: "bg-blue-100 text-blue-700",
      percentage: rule.investment_percentage,
    },
    {
      label: "Spending",
      amount: allocation.spending,
      icon: <Wallet className="w-4 h-4" />,
      color: "bg-amber-100 text-amber-700",
      percentage: rule.spending_percentage,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Allocation Flow</CardTitle>
        <p className="text-sm text-muted-foreground">
          How your latest earning of {FinancialCalculator.formatCurrency(recentEarning)} was automatically allocated
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between space-x-2 overflow-x-auto scrollbar-hide pb-2">
          {flowItems.map((item, index) => (
            <div key={item.label} className="flex items-center space-x-2 min-w-0">
              <div className="flex flex-col items-center space-y-2 min-w-[120px]">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.color}`}>
                  {item.icon}
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{item.label}</div>
                  {item.percentage && (
                    <Badge variant="outline" className="text-xs mb-1">
                      {item.percentage}%
                    </Badge>
                  )}
                  <div className="text-sm font-bold">{FinancialCalculator.formatCurrency(item.amount)}</div>
                </div>
              </div>

              {index < flowItems.length - 1 && <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
            </div>
          ))}
        </div>

        {rule.is_active && (
          <div className="mt-4 p-3 rounded-lg">
            <div className="flex items-center space-x-2 text-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Auto-allocation is active</span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              All future earnings will be automatically split according to these rules
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
