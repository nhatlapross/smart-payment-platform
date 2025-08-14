"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, CheckCircle } from "lucide-react"

export function FinancialHealthScore() {
  // Mock financial health metrics
  const healthMetrics = {
    overallScore: 78,
    emergencyFund: 85, // 3+ months expenses
    debtToIncome: 92, // Low debt ratio
    savingsRate: 65, // 15% savings rate
    investmentDiversification: 70,
    billPaymentHistory: 95, // On-time payments
    incomeStability: 88, // Consistent income
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-amber-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-4 h-4 text-green-600" />
    if (score >= 60) return <AlertTriangle className="w-4 h-4 text-amber-600" />
    return <AlertTriangle className="w-4 h-4 text-red-600" />
  }

  const getHealthLevel = (score: number) => {
    if (score >= 80) return { label: "Excellent", color: "bg-green-100 text-green-800" }
    if (score >= 70) return { label: "Good", color: "bg-blue-100 text-blue-800" }
    if (score >= 60) return { label: "Fair", color: "bg-amber-100 text-amber-800" }
    return { label: "Needs Improvement", color: "bg-red-100 text-red-800" }
  }

  const healthLevel = getHealthLevel(healthMetrics.overallScore)

  const recommendations = [
    {
      category: "Emergency Fund",
      suggestion: "Great job! You have 4.2 months of expenses saved.",
      priority: "low",
    },
    {
      category: "Investment Diversification",
      suggestion: "Consider adding international stocks to your portfolio.",
      priority: "medium",
    },
    {
      category: "Savings Rate",
      suggestion: "Try to increase your savings rate to 20% for optimal growth.",
      priority: "medium",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <span>Financial Health Score</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" stroke="#e5e7eb" strokeWidth="8" fill="none" />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#3b82f6"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(healthMetrics.overallScore / 100) * 314} 314`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(healthMetrics.overallScore)}`}>
                  {healthMetrics.overallScore}
                </div>
                <div className="text-xs text-muted-foreground">out of 100</div>
              </div>
            </div>
          </div>
          <Badge variant="outline" className={healthLevel.color}>
            {healthLevel.label}
          </Badge>
        </div>

        {/* Detailed Metrics */}
        <div className="space-y-4">
          <h4 className="font-medium">Health Breakdown</h4>
          {Object.entries(healthMetrics).map(([key, score]) => {
            if (key === "overallScore") return null

            const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())

            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    {getScoreIcon(score)}
                    <span>{label}</span>
                  </div>
                  <span className={`font-medium ${getScoreColor(score)}`}>{score}/100</span>
                </div>
                <Progress value={score} className="h-2" />
              </div>
            )
          })}
        </div>

        {/* Recommendations */}
        <div className="space-y-4">
          <h4 className="font-medium">Recommendations</h4>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-start justify-between mb-1">
                  <div className="font-medium text-sm">{rec.category}</div>
                  <Badge
                    variant="outline"
                    className={
                      rec.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : rec.priority === "medium"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-green-100 text-green-800"
                    }
                  >
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{rec.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
