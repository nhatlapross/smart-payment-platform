"use client"

import { useState } from "react"
import { AllocationSetup } from "@/components/allocation/allocation-setup"
import { SavingsManager } from "@/components/allocation/savings-manager"
import { InvestmentPortfolio } from "@/components/allocation/investment-portfolio"
import { AllocationFlow } from "@/components/allocation/allocation-flow"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { AllocationRule, SavingsAccount, Investment } from "@/lib/types"

export default function AllocationPage() {
  const [allocationRule, setAllocationRule] = useState<AllocationRule>({
    id: "1",
    user_id: "user-1",
    savings_percentage: 10,
    investment_percentage: 20,
    spending_percentage: 70,
    is_active: true,
    created_at: new Date().toISOString(),
  })

  const [savingsAccounts, setSavingsAccounts] = useState<SavingsAccount[]>([
    {
      id: "1",
      user_id: "user-1",
      account_name: "Emergency Fund",
      balance: 5000000,
      target_amount: 10000000,
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      user_id: "user-1",
      account_name: "Vacation Fund",
      balance: 2500000,
      target_amount: 5000000,
      created_at: new Date().toISOString(),
    },
  ])

  const [investments, setInvestments] = useState<Investment[]>([
    {
      id: "1",
      user_id: "user-1",
      investment_type: "crypto",
      symbol: "BTC",
      amount: 2000000,
      purchase_price: 2000000,
      current_value: 2100000,
      purchased_at: new Date().toISOString(),
    },
    {
      id: "2",
      user_id: "user-1",
      investment_type: "aptos_stake",
      symbol: "APT",
      amount: 1500000,
      purchase_price: 1500000,
      current_value: 1575000,
      purchased_at: new Date().toISOString(),
    },
  ])

  const handleRuleUpdated = (rule: AllocationRule) => {
    setAllocationRule(rule)
  }

  const handleAccountCreated = (account: SavingsAccount) => {
    setSavingsAccounts([...savingsAccounts, account])
  }

  const handleInvestmentCreated = (investment: Investment) => {
    setInvestments([...investments, investment])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <AllocationSetup currentRule={allocationRule} onRuleUpdated={handleRuleUpdated} />

            <AllocationFlow rule={allocationRule} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <SavingsManager accounts={savingsAccounts} onAccountCreated={handleAccountCreated} />

            <InvestmentPortfolio investments={investments} onInvestmentCreated={handleInvestmentCreated} />
          </div>
        </div>
      </main>
    </div>
  )
}
