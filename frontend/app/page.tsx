import { FinancialCard } from "@/components/ui/financial-card"
import { RealTimeCounter } from "@/components/ui/real-time-counter"
import { Button } from "@/components/ui/button"
import { TrendingUp, PiggyBank, CreditCard, FileText, BarChart3, Play, DollarSign } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  // Mock data - in real app, fetch from database
  const mockEarningsPerSecond = 0.347 // ~30M VND per month
  const mockData = {
    totalEarnings: 25000000,
    totalSavings: 5000000,
    totalInvestments: 8000000,
    monthlyBills: 3500000,
    availableBalance: 12500000,
  }

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Real-time Earnings Section */}
        <div className="mb-12">
          <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-xl border border-border/50 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl"></div>
            <div className="text-center relative z-10">
              <h2 className="text-2xl font-bold text-foreground mb-3">Real-Time Earnings</h2>
              <p className="text-muted-foreground mb-6">Your salary is streaming live - watch it grow every second!</p>
              <RealTimeCounter earningsPerSecond={mockEarningsPerSecond} initialAmount={mockData.totalEarnings} />
              <p className="text-sm text-muted-foreground mt-3">
                +{(mockEarningsPerSecond * 3600).toLocaleString("vi-VN")} VND per hour
              </p>
              <Link href="/payroll">
                <Button className="mt-6 bg-cyan hover:bg-darkvibrant text-dark-blue px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg">
                  <Play className="w-5 h-5 mr-2" />
                  Manage Payroll Streams
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-card/80 backdrop-blur-xl rounded-xl border border-border/50 p-6 hover:border-primary/50 transition-all duration-300 group">
            <FinancialCard
              title="Available Balance"
              value="12.5M VND"
              change="+2.3% from yesterday"
              changeType="positive"
              icon={<DollarSign className="w-5 h-5 text-cyan" />}
            />
          </div>
          <div className="bg-card/80 backdrop-blur-xl rounded-xl border border-border/50 p-6 hover:border-cyan/50 transition-all duration-300 group">
            <FinancialCard
              title="Total Savings"
              value="5.0M VND"
              change="Auto-saved 10%"
              changeType="positive"
              icon={<PiggyBank className="w-5 h-5 text-lightvibrant" />}
            />
          </div>
          <div className="bg-card/80 backdrop-blur-xl rounded-xl border border-border/50 p-6 hover:border-cyan/50 transition-all duration-300 group">
            <FinancialCard
              title="Investments"
              value="8.0M VND"
              change="+5.2% this month"
              changeType="positive"
              icon={<TrendingUp className="w-5 h-5 text-darkvibrant" />}
            />
          </div>
          <div className="bg-card/80 backdrop-blur-xl rounded-xl border border-border/50 p-6 hover:border-primary/50 transition-all duration-300 group">
            <FinancialCard
              title="Monthly Bills"
              value="3.5M VND"
              change="2 bills auto-paid"
              changeType="neutral"
              icon={<CreditCard className="w-5 h-5 text-muted-foreground" />}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-xl border border-border/50 p-8 hover:border-primary/50 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent group-hover:from-primary/10 transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-cyan/20 rounded-xl flex items-center justify-center group-hover:bg-cyan/30 transition-all duration-300">
                  <BarChart3 className="w-6 h-6 text-cyan" />
                </div>
                <h3 className="font-bold text-foreground text-lg">Financial Dashboard</h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">View detailed analytics and manage your financial allocations</p>
              <Link href="/dashboard">
                <Button className="w-full bg-cyan hover:bg-darkvibrant text-dark-blue rounded-xl font-semibold py-3 transition-all duration-200 hover:scale-105 shadow-lg">
                  Open Dashboard
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-xl border border-border/50 p-8 hover:border-primary/50 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent group-hover:from-accent/10 transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-lightvibrant/20 rounded-xl flex items-center justify-center group-hover:bg-lightvibrant/30 transition-all duration-300">
                  <FileText className="w-6 h-6 text-lightvibrant" />
                </div>
                <h3 className="font-bold text-foreground text-lg">Create Invoice</h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">Send blockchain-powered invoices and get paid instantly</p>
              <Link href="/invoices">
                <Button variant="outline" className="w-full border-border bg-secondary/50 hover:bg-primary hover:text-primary-foreground rounded-xl font-semibold py-3 transition-all duration-200 hover:scale-105">
                  New Invoice
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-xl border border-border/50 p-8 hover:border-primary/50 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent group-hover:from-primary/10 transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-muted/20 rounded-xl flex items-center justify-center group-hover:bg-muted/30 transition-all duration-300">
                  <CreditCard className="w-6 h-6 text-muted" />
                </div>
                <h3 className="font-bold text-foreground text-lg">Manage Bills</h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">Set up automatic bill payments from your streaming salary</p>
              <Link href="/bills">
                <Button variant="outline" className="w-full border-border bg-secondary/50 hover:bg-primary hover:text-primary-foreground rounded-xl font-semibold py-3 transition-all duration-200 hover:scale-105">
                  Setup Bills
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
