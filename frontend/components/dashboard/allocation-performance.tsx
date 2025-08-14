"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Target } from "lucide-react"
import { FinancialCalculator } from "@/lib/financial-utils"

export function AllocationPerformance() {
  const allocationData = [
    { name: "Savings", value: 15, amount: 4500000, target: 3000000, color: "#10b981" },
    { name: "Investment", value: 25, amount: 7500000, target: 6000000, color: "#3b82f6" },
    { name: "Spending", value: 60, amount: 18000000, target: 21000000, color: "#f59e0b" },
  ]

  const monthlyTrend = [
    { month: "Jan", savings: 2800000, investment: 5200000, spending: 19000000 },
    { month: "Feb", savings: 3200000, investment: 5800000, spending: 18500000 },
    { month: "Mar", savings: 3600000, investment: 6400000, spending: 18200000 },
    { month: "Apr", savings: 4100000, investment: 7000000, spending: 17900000 },
    { month: "May", savings: 4500000, investment: 7500000, spending: 18000000 },
  ]

  const totalAllocated = allocationData.reduce((sum, item) => sum + item.amount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-purple-600" />
          <span>Allocation Performance</span>
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Total allocated this month: {FinancialCalculator.formatCurrency(totalAllocated)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Allocation Pie Chart */}
          <div>
            <h4 className="font-medium mb-4">Current Allocation</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance vs Target */}
          <div>
            <h4 className="font-medium mb-4">Performance vs Target</h4>
            <div className="space-y-4">
              {allocationData.map((item) => {
                const performance = (item.amount / item.target) * 100
                const isOverTarget = performance > 100

                return (
                  <div key={item.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                      </div>
                      <span className={`font-medium ${isOverTarget ? "text-green-600" : "text-amber-600"}`}>
                        {Math.round(performance)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min(performance, 100)}%`,
                          backgroundColor: isOverTarget ? "#10b981" : item.color,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{FinancialCalculator.formatCurrency(item.amount)}</span>
                      <span>Target: {FinancialCalculator.formatCurrency(item.target)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="mt-6">
          <h4 className="font-medium mb-4">5-Month Trend</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={(value: number) => FinancialCalculator.formatCurrency(value)} />
                <Bar dataKey="savings" fill="#10b981" />
                <Bar dataKey="investment" fill="#3b82f6" />
                <Bar dataKey="spending" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
