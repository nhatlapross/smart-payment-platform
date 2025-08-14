"use client"

import { EarningsAnalytics } from "@/components/dashboard/earnings-analytics"
import { AllocationPerformance } from "@/components/dashboard/allocation-performance"
import { FinancialHealthScore } from "@/components/dashboard/financial-health-score"
import { CashFlowForecast } from "@/components/dashboard/cash-flow-forecast"
import { FinancialCard } from "@/components/ui/financial-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const handleExportData = () => {
    // In real app, this would export financial data
    console.log("Exporting financial data...")
  }

  const handleRefreshData = () => {
    // In real app, this would refresh all data
    console.log("Refreshing data...")
  }

  return (
    <div className="min-h-screen">
      {/* Page Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Financial Dashboard</h1>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={handleRefreshData} className="bg-secondary/50 border-border hover:bg-primary hover:text-primary-foreground transition-all duration-200">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportData} className="bg-secondary/50 border-border hover:bg-primary hover:text-primary-foreground transition-all duration-200">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-card/80 backdrop-blur-xl rounded-xl border border-border/50 p-6 hover:border-primary/50 transition-all duration-300">
            <FinancialCard
              title="Monthly Income"
              value="30.2M VND"
              change="+8.3% from last month"
              changeType="positive"
            />
          </div>
          <div className="bg-card/80 backdrop-blur-xl rounded-xl border border-border/50 p-6 hover:border-primary/50 transition-all duration-300">
            <FinancialCard
              title="Monthly Expenses"
              value="18.5M VND"
              change="-2.1% from last month"
              changeType="positive"
            />
          </div>
          <div className="bg-card/80 backdrop-blur-xl rounded-xl border border-border/50 p-6 hover:border-primary/50 transition-all duration-300">
            <FinancialCard title="Net Worth" value="125.8M VND" change="+15.2% from last month" changeType="positive" />
          </div>
          <div className="bg-card/80 backdrop-blur-xl rounded-xl border border-border/50 p-6 hover:border-primary/50 transition-all duration-300">
            <FinancialCard title="Investment Returns" value="+12.4%" change="YTD performance" changeType="positive" />
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-8 hover:border-primary/50 transition-all duration-300">
            <EarningsAnalytics />
          </div>
          <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-8 hover:border-primary/50 transition-all duration-300">
            <AllocationPerformance />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-8 hover:border-primary/50 transition-all duration-300">
            <CashFlowForecast />
          </div>
          <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-8 hover:border-primary/50 transition-all duration-300">
            <FinancialHealthScore />
          </div>
        </div>
      </main>
    </div>
  )
}
