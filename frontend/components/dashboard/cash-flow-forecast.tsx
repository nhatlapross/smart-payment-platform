"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { TrendingUp, AlertCircle, DollarSign } from "lucide-react"
import { FinancialCalculator } from "@/lib/financial-utils"

export function CashFlowForecast() {
  // Mock forecast data for next 12 months
  const forecastData = Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() + i)

    const baseIncome = 30000000 + (Math.random() - 0.5) * 2000000
    const expenses = 18000000 + (Math.random() - 0.5) * 1000000
    const netCashFlow = baseIncome - expenses

    return {
      month: date.toLocaleDateString("vi-VN", { month: "short", year: "2-digit" }),
      income: baseIncome,
      expenses: expenses,
      netCashFlow: netCashFlow,
      cumulativeCash: (i + 1) * netCashFlow + 15000000, // Starting with 15M
    }
  })

  const averageMonthlyFlow = forecastData.reduce((sum, month) => sum + month.netCashFlow, 0) / forecastData.length
  const projectedYearEnd = forecastData[forecastData.length - 1].cumulativeCash
  const cashFlowTrend = averageMonthlyFlow > 0 ? "positive" : "negative"

  const insights = [
    {
      type: cashFlowTrend === "positive" ? "success" : "warning",
      title: cashFlowTrend === "positive" ? "Positive Cash Flow" : "Cash Flow Concern",
      description:
        cashFlowTrend === "positive"
          ? `Average monthly surplus of ${FinancialCalculator.formatCurrency(averageMonthlyFlow)}`
          : `Average monthly deficit of ${FinancialCalculator.formatCurrency(Math.abs(averageMonthlyFlow))}`,
    },
    {
      type: projectedYearEnd > 50000000 ? "success" : "info",
      title: "Year-End Projection",
      description: `Projected cash position: ${FinancialCalculator.formatCurrency(projectedYearEnd)}`,
    },
    {
      type: "info",
      title: "Savings Opportunity",
      description: "Consider increasing investment allocation during high cash flow months",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <span>Cash Flow Forecast</span>
        </CardTitle>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Avg Monthly Flow</div>
            <div className={`font-medium ${cashFlowTrend === "positive" ? "text-green-600" : "text-red-600"}`}>
              {FinancialCalculator.formatCurrency(averageMonthlyFlow)}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Year-End Projection</div>
            <div className="font-medium">{FinancialCalculator.formatCurrency(projectedYearEnd)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Trend</div>
            <div className={`font-medium ${cashFlowTrend === "positive" ? "text-green-600" : "text-red-600"}`}>
              {cashFlowTrend === "positive" ? "↗ Growing" : "↘ Declining"}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Forecast Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
              <Tooltip
                formatter={(value: number, name: string) => [
                  FinancialCalculator.formatCurrency(value),
                  name === "income"
                    ? "Income"
                    : name === "expenses"
                      ? "Expenses"
                      : name === "netCashFlow"
                        ? "Net Cash Flow"
                        : "Cumulative Cash",
                ]}
              />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="netCashFlow" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="cumulativeCash" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" />
              <ReferenceLine y={0} stroke="#64748b" strokeDasharray="2 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="space-y-3">
          <h4 className="font-medium">Key Insights</h4>
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                insight.type === "success"
                  ? "bg-green-50 border-green-200"
                  : insight.type === "warning"
                    ? "bg-amber-50 border-amber-200"
                    : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex items-start space-x-2">
                {insight.type === "success" ? (
                  <DollarSign className="w-4 h-4 text-green-600 mt-0.5" />
                ) : insight.type === "warning" ? (
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
                )}
                <div>
                  <div
                    className={`font-medium text-sm ${
                      insight.type === "success"
                        ? "text-green-800"
                        : insight.type === "warning"
                          ? "text-amber-800"
                          : "text-blue-800"
                    }`}
                  >
                    {insight.title}
                  </div>
                  <div
                    className={`text-sm ${
                      insight.type === "success"
                        ? "text-green-700"
                        : insight.type === "warning"
                          ? "text-amber-700"
                          : "text-blue-700"
                    }`}
                  >
                    {insight.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
