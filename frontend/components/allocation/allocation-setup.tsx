"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Settings, PiggyBank, TrendingUp, Wallet } from "lucide-react"
import { FinancialCalculator } from "@/lib/financial-utils"
import type { AllocationRule } from "@/lib/types"

interface AllocationSetupProps {
  currentRule?: AllocationRule
  onRuleUpdated?: (rule: AllocationRule) => void
}

export function AllocationSetup({ currentRule, onRuleUpdated }: AllocationSetupProps) {
  const [savingsPercentage, setSavingsPercentage] = useState(currentRule?.savings_percentage || 10)
  const [investmentPercentage, setInvestmentPercentage] = useState(currentRule?.investment_percentage || 20)
  const [isAutoEnabled, setIsAutoEnabled] = useState(currentRule?.is_active || false)

  const spendingPercentage = 100 - savingsPercentage - investmentPercentage

  // Sample monthly salary for preview
  const sampleSalary = 30000000

  const allocationData = [
    { name: "Savings", value: savingsPercentage, color: "#10b981", amount: (sampleSalary * savingsPercentage) / 100 },
    {
      name: "Investment",
      value: investmentPercentage,
      color: "#3b82f6",
      amount: (sampleSalary * investmentPercentage) / 100,
    },
    {
      name: "Spending",
      value: spendingPercentage,
      color: "#f59e0b",
      amount: (sampleSalary * spendingPercentage) / 100,
    },
  ]

  const handleSave = () => {
    const newRule: AllocationRule = {
      id: currentRule?.id || crypto.randomUUID(),
      user_id: "current-user-id",
      savings_percentage: savingsPercentage,
      investment_percentage: investmentPercentage,
      spending_percentage: spendingPercentage,
      is_active: isAutoEnabled,
      created_at: currentRule?.created_at || new Date().toISOString(),
    }

    onRuleUpdated?.(newRule)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-blue-600" />
          <span>Allocation Rules</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto-allocation toggle */}
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div>
            <h3 className="font-medium">Auto-Allocation</h3>
            <p className="text-sm text-muted-foreground">Automatically split earnings when they arrive</p>
          </div>
          <Switch checked={isAutoEnabled} onCheckedChange={setIsAutoEnabled} />
        </div>

        {/* Allocation sliders */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center space-x-2">
                <PiggyBank className="w-4 h-4 text-green-600" />
                <span>Savings</span>
              </Label>
              <span className="font-medium">{savingsPercentage}%</span>
            </div>
            <Slider
              value={[savingsPercentage]}
              onValueChange={(value) => setSavingsPercentage(value[0])}
              max={80}
              step={1}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              {FinancialCalculator.formatCurrency(allocationData[0].amount)} per month
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Investment</span>
              </Label>
              <span className="font-medium">{investmentPercentage}%</span>
            </div>
            <Slider
              value={[investmentPercentage]}
              onValueChange={(value) => setInvestmentPercentage(value[0])}
              max={80}
              step={1}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              {FinancialCalculator.formatCurrency(allocationData[1].amount)} per month
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center space-x-2">
                <Wallet className="w-4 h-4 text-amber-600" />
                <span>Spending</span>
              </Label>
              <span className="font-medium">{spendingPercentage}%</span>
            </div>
            <div className="h-2 bg-amber-100 rounded-full">
              <div
                className="h-full bg-amber-500 rounded-full transition-all"
                style={{ width: `${spendingPercentage}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {FinancialCalculator.formatCurrency(allocationData[2].amount)} per month (auto-calculated)
            </p>
          </div>
        </div>

        {/* Visual preview */}
        <div className="bg-slate-50 rounded-lg p-4">
          <h4 className="font-medium mb-4 text-center">Allocation Preview</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number, name: string) => [`${value}%`, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          {currentRule ? "Update Allocation Rules" : "Save Allocation Rules"}
        </Button>
      </CardContent>
    </Card>
  )
}
