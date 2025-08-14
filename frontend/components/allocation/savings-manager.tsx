"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { PiggyBank, Plus, Target } from "lucide-react"
import { FinancialCalculator } from "@/lib/financial-utils"
import type { SavingsAccount } from "@/lib/types"

interface SavingsManagerProps {
  accounts: SavingsAccount[]
  onAccountCreated?: (account: SavingsAccount) => void
}

export function SavingsManager({ accounts, onAccountCreated }: SavingsManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    account_name: "",
    target_amount: "",
  })

  const totalSavings = accounts.reduce((sum, account) => sum + account.balance, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newAccount: SavingsAccount = {
      id: crypto.randomUUID(),
      user_id: "current-user-id",
      account_name: formData.account_name,
      balance: 0,
      target_amount: Number.parseFloat(formData.target_amount) || undefined,
      created_at: new Date().toISOString(),
    }

    onAccountCreated?.(newAccount)
    setFormData({ account_name: "", target_amount: "" })
    setShowForm(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <PiggyBank className="w-5 h-5 text-green-600" />
            <span>Savings Accounts</span>
          </CardTitle>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add Account
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Total Savings: {FinancialCalculator.formatCurrency(totalSavings)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-green-50 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="account-name">Account Name</Label>
              <Input
                id="account-name"
                placeholder="Emergency Fund, Vacation, etc."
                value={formData.account_name}
                onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target-amount">Target Amount (Optional)</Label>
              <Input
                id="target-amount"
                type="number"
                placeholder="10,000,000"
                value={formData.target_amount}
                onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" size="sm">
                Create Account
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {accounts.length === 0 ? (
          <div className="text-center py-8">
            <PiggyBank className="w-12 h-12 mx-auto mb-2 text-slate-400" />
            <p className="text-muted-foreground">No savings accounts yet</p>
            <p className="text-sm text-muted-foreground">Create your first savings goal</p>
          </div>
        ) : (
          <div className="space-y-4">
            {accounts.map((account) => {
              const progress = account.target_amount
                ? Math.min(100, (account.balance / account.target_amount) * 100)
                : 0

              return (
                <div key={account.id} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{account.account_name}</h4>
                    <Badge variant="outline" className="text-green-600">
                      {FinancialCalculator.formatCurrency(account.balance)}
                    </Badge>
                  </div>

                  {account.target_amount && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center space-x-1">
                          <Target className="w-3 h-3" />
                          <span>Target: {FinancialCalculator.formatCurrency(account.target_amount)}</span>
                        </span>
                        <span className="font-medium">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {FinancialCalculator.formatCurrency(account.target_amount - account.balance)} remaining
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
