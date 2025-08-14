import { Button } from "@/components/ui/button"
import { DollarSign } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan to-darkvibrant rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-dark-blue" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">PayStream</h1>
          </div>
          <nav className="flex items-center space-x-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-all duration-200">
                Dashboard
              </Button>
            </Link>
            <Link href="/payroll">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-all duration-200">
                Payroll
              </Button>
            </Link>
            <Link href="/allocation">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-all duration-200">
                Allocation
              </Button>
            </Link>
            <Link href="/bills">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-all duration-200">
                Bills
              </Button>
            </Link>
            <Link href="/invoices">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-all duration-200">
                Invoices
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="bg-secondary/50 border-border hover:bg-primary hover:text-primary-foreground transition-all duration-200">
              Settings
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}