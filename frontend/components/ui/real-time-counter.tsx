"use client"

import { useState, useEffect } from "react"
import { FinancialCalculator } from "@/lib/financial-utils"

interface RealTimeCounterProps {
  earningsPerSecond: number
  initialAmount?: number
  currency?: string
}

export function RealTimeCounter({ earningsPerSecond, initialAmount = 0, currency = "VND" }: RealTimeCounterProps) {
  const [currentAmount, setCurrentAmount] = useState(initialAmount)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const interval = setInterval(() => {
      setCurrentAmount((prev) => prev + earningsPerSecond)
    }, 1000)

    return () => clearInterval(interval)
  }, [earningsPerSecond])

  // Show initial amount on server and until client hydration
  const displayAmount = isClient ? currentAmount : initialAmount

  return (
    <div className="text-4xl font-bold text-primary tabular-nums">
      {FinancialCalculator.formatCurrency(displayAmount, currency)}
    </div>
  )
}
