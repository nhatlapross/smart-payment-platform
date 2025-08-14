import type { PayrollStream, AllocationRule } from "./types"

export class FinancialCalculator {
  // Calculate real-time earnings per second
  static calculateEarningsPerSecond(stream: PayrollStream): number {
    if (stream.hourly_rate) {
      return stream.hourly_rate / 3600 // Convert hourly to per second
    }

    // Assume 22 working days per month, 8 hours per day
    const workingSecondsPerMonth = 22 * 8 * 3600
    return stream.monthly_salary / workingSecondsPerMonth
  }

  // Calculate daily earnings
  static calculateDailyEarnings(stream: PayrollStream): number {
    const earningsPerSecond = this.calculateEarningsPerSecond(stream)
    return earningsPerSecond * 8 * 3600 // 8 hours per day
  }

  // Apply allocation rules to incoming earnings
  static applyAllocationRules(amount: number, rules: AllocationRule) {
    return {
      savings: (amount * rules.savings_percentage) / 100,
      investment: (amount * rules.investment_percentage) / 100,
      spending: (amount * rules.spending_percentage) / 100,
    }
  }

  // Calculate compound interest for savings
  static calculateCompoundInterest(principal: number, rate: number, time: number, compoundFrequency = 12): number {
    return principal * Math.pow(1 + rate / compoundFrequency, compoundFrequency * time)
  }

  // Format currency for display
  static formatCurrency(amount: number, currency = "VND"): string {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // Calculate next bill due date
  static getNextBillDueDate(dueDay: number): Date {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    let nextDue = new Date(currentYear, currentMonth, dueDay)

    // If the due date has passed this month, move to next month
    if (nextDue <= now) {
      nextDue = new Date(currentYear, currentMonth + 1, dueDay)
    }

    return nextDue
  }
}

export class CryptoUtils {
  // Mock exchange rates (in real app, fetch from API)
  static readonly EXCHANGE_RATES = {
    "BTC/USD": 45000,
    "ETH/USD": 3000,
    "APT/USD": 12,
    "USD/VND": 24000,
  }

  static convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
    const pair = `${fromCurrency}/${toCurrency}`
    const reversePair = `${toCurrency}/${fromCurrency}`

    if (this.EXCHANGE_RATES[pair]) {
      return amount * this.EXCHANGE_RATES[pair]
    } else if (this.EXCHANGE_RATES[reversePair]) {
      return amount / this.EXCHANGE_RATES[reversePair]
    }

    // For complex conversions, go through USD
    const toUSD = this.convertToUSD(amount, fromCurrency)
    return this.convertFromUSD(toUSD, toCurrency)
  }

  private static convertToUSD(amount: number, currency: string): number {
    const pair = `${currency}/USD`
    const reversePair = `USD/${currency}`

    if (this.EXCHANGE_RATES[pair]) {
      return amount * this.EXCHANGE_RATES[pair]
    } else if (this.EXCHANGE_RATES[reversePair]) {
      return amount / this.EXCHANGE_RATES[reversePair]
    }

    return amount // Assume USD if no rate found
  }

  private static convertFromUSD(usdAmount: number, currency: string): number {
    const pair = `USD/${currency}`
    const reversePair = `${currency}/USD`

    if (this.EXCHANGE_RATES[pair]) {
      return usdAmount * this.EXCHANGE_RATES[pair]
    } else if (this.EXCHANGE_RATES[reversePair]) {
      return usdAmount / this.EXCHANGE_RATES[reversePair]
    }

    return usdAmount // Return USD if no conversion available
  }
}
