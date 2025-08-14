"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Plus, Bitcoin, DollarSign, Coins } from "lucide-react"
import { FinancialCalculator, CryptoUtils } from "@/lib/financial-utils"
import type { Investment } from "@/lib/types"

interface InvestmentPortfolioProps {
  investments: Investment[]
  onInvestmentCreated?: (investment: Investment) => void
}

export function InvestmentPortfolio({ investments, onInvestmentCreated }: InvestmentPortfolioProps) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    investment_type: "",
    symbol: "",
    amount: "",
  })

  const totalInvestmentValue = investments.reduce((sum, inv) => sum + (inv.current_value || inv.amount), 0)
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalGainLoss = totalInvestmentValue - totalInvested

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const purchasePrice = Number.parseFloat(formData.amount)
    const currentValue =
      formData.investment_type === "crypto"
        ? CryptoUtils.convertCurrency(1, formData.symbol, "VND") *
          (purchasePrice / CryptoUtils.convertCurrency(1, formData.symbol, "VND"))
        : purchasePrice * 1.05 // Mock 5% gain for other investments

    const newInvestment: Investment = {
      id: crypto.randomUUID(),
      user_id: "current-user-id",
      investment_type: formData.investment_type,
      symbol: formData.symbol,
      amount: purchasePrice,
      purchase_price: purchasePrice,
      current_value: currentValue,
      purchased_at: new Date().toISOString(),
    }

    onInvestmentCreated?.(newInvestment)
    setFormData({ investment_type: "", symbol: "", amount: "" })
    setShowForm(false)
  }

  const getInvestmentIcon = (type: string) => {
    switch (type) {
      case "crypto":
        return <Bitcoin className="w-4 h-4" />
      case "stocks":
        return <TrendingUp className="w-4 h-4" />
      case "aptos_stake":
        return <Coins className="w-4 h-4" />
      default:
        return <DollarSign className="w-4 h-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>Investment Portfolio</span>
          </CardTitle>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add Investment
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Total Invested</div>
            <div className="font-medium">{FinancialCalculator.formatCurrency(totalInvested)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Current Value</div>
            <div className="font-medium">{FinancialCalculator.formatCurrency(totalInvestmentValue)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Gain/Loss</div>
            <div className={`font-medium ${totalGainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
              {totalGainLoss >= 0 ? "+" : ""}
              {FinancialCalculator.formatCurrency(totalGainLoss)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-blue-50 rounded-lg">
            <div className="space-y-2">
              <Label>Investment Type</Label>
              <Select
                value={formData.investment_type}
                onValueChange={(value) => setFormData({ ...formData, investment_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select investment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="stocks">Stocks</SelectItem>
                  <SelectItem value="aptos_stake">Aptos Staking</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                placeholder="BTC, ETH, APT, AAPL, etc."
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (VND)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="1,000,000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div className="flex space-x-2">
              <Button type="submit" size="sm">
                Add Investment
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {investments.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 mx-auto mb-2 text-slate-400" />
            <p className="text-muted-foreground">No investments yet</p>
            <p className="text-sm text-muted-foreground">Start building your portfolio</p>
          </div>
        ) : (
          <div className="space-y-3">
            {investments.map((investment) => {
              const gainLoss = (investment.current_value || investment.amount) - investment.amount
              const gainLossPercent = (gainLoss / investment.amount) * 100

              return (
                <div key={investment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {getInvestmentIcon(investment.investment_type)}
                    </div>
                    <div>
                      <div className="font-medium">{investment.symbol}</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {investment.investment_type.replace("_", " ")}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-medium">
                      {FinancialCalculator.formatCurrency(investment.current_value || investment.amount)}
                    </div>
                    <div className={`text-sm ${gainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {gainLoss >= 0 ? "+" : ""}
                      {gainLossPercent.toFixed(1)}%
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
