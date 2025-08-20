"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { TrendingUp, DollarSign, Clock, Target } from "lucide-react"
import { FinancialCalculator } from "@/lib/financial-utils"

interface EarningsAnalyticsProps {
  data?: Array<{
    date: string
    earnings: number
    cumulative: number
    target: number
  }>
}

export function EarningsAnalytics({ data }: EarningsAnalyticsProps) {
  // Mock data for the last 30 days
  const mockData =
    data ||
    Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      const baseEarnings = 1000000 + Math.random() * 500000
      const cumulative = (i + 1) * 1000000 + Math.random() * 2000000

      return {
        date: date.toISOString().split("T")[0],
        earnings: baseEarnings,
        cumulative: cumulative,
        target: 1200000, // Daily target
      }
    })

  const totalEarnings = mockData.reduce((sum, day) => sum + day.earnings, 0)
  const averageDaily = totalEarnings / mockData.length
  const targetAchievement = (averageDaily / 1200000) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <span>Earnings Analytics</span>
        </CardTitle>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Total (30 days)</div>
            <div className="font-medium">{FinancialCalculator.formatCurrency(totalEarnings)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Daily Average</div>
            <div className="font-medium">{FinancialCalculator.formatCurrency(averageDaily)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Target Achievement</div>
            <div className={`font-medium ${targetAchievement >= 100 ? "text-green-600" : "text-amber-600"}`}>
              {Math.round(targetAchievement)}%
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("vi-VN", { month: "short", day: "numeric" })
                }
              />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <Tooltip
                formatter={(value: number, name: string) => [
                  FinancialCalculator.formatCurrency(value),
                  name === "earnings" ? "Daily Earnings" : name === "target" ? "Target" : "Cumulative",
                ]}
                labelFormatter={(value) => new Date(value).toLocaleDateString("vi-VN")}
              />
              <Area type="monotone" dataKey="earnings" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
              <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-lg">
            <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <div className="text-sm font-medium">Best Day</div>
            <div className="text-xs text-muted-foreground">
              {FinancialCalculator.formatCurrency(Math.max(...mockData.map((d) => d.earnings)))}
            </div>
          </div>
          <div className="p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-1" />
            <div className="text-sm font-medium">Growth</div>
            <div className="text-xs text-muted-foreground">+12.5%</div>
          </div>
          <div className="p-3 rounded-lg">
            <Target className="w-6 h-6 text-purple-600 mx-auto mb-1" />
            <div className="text-sm font-medium">On Target</div>
            <div className="text-xs text-muted-foreground">23/30 days</div>
          </div>
          <div className="p-3 rounded-lg">
            <Clock className="w-6 h-6 text-amber-600 mx-auto mb-1" />
            <div className="text-sm font-medium">Streak</div>
            <div className="text-xs text-muted-foreground">7 days</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
