"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, DollarSign, Clock, TrendingUp } from "lucide-react"
import { FinancialCalculator } from "@/lib/financial-utils"
import type { Invoice } from "@/lib/types"

interface InvoiceStreamingProps {
  invoice: Invoice
  onFactorInvoice?: (invoiceId: string) => void
}

export function InvoiceStreaming({ invoice, onFactorInvoice }: InvoiceStreamingProps) {
  const [streamedAmount, setStreamedAmount] = useState(0)
  const [isStreaming, setIsStreaming] = useState(invoice.invoice_status === "streaming")

  // Mock streaming rate - in real app, this would be based on contract terms
  const streamingRate = invoice.amount / (30 * 24 * 3600) // Stream over 30 days
  const progress = (streamedAmount / invoice.amount) * 100

  useEffect(() => {
    if (!isStreaming) return

    const interval = setInterval(() => {
      setStreamedAmount((prev) => {
        const newAmount = prev + streamingRate
        if (newAmount >= invoice.amount) {
          setIsStreaming(false)
          return invoice.amount
        }
        return newAmount
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [streamingRate, invoice.amount, isStreaming])

  const remainingAmount = invoice.amount - streamedAmount
  const estimatedDaysRemaining = remainingAmount / (streamingRate * 24 * 3600)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-purple-600" />
            <span>Streaming Payment</span>
          </CardTitle>
          <Badge variant={isStreaming ? "default" : "secondary"} className="flex items-center space-x-1">
            {isStreaming ? <Zap className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            <span>{isStreaming ? "Live" : "Completed"}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Streaming Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Payment Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              Started: {invoice.approved_at ? new Date(invoice.approved_at).toLocaleDateString("vi-VN") : "N/A"}
            </span>
            <span>{isStreaming ? `~${Math.ceil(estimatedDaysRemaining)} days remaining` : "Payment completed"}</span>
          </div>
        </div>

        {/* Real-time earnings display */}
        <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Amount Received</div>
          <div className="text-2xl font-bold text-purple-600 tabular-nums">
            {FinancialCalculator.formatCurrency(streamedAmount)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            of {FinancialCalculator.formatCurrency(invoice.amount)}
          </div>
        </div>

        {/* Streaming stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto mb-1">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-sm font-medium">{FinancialCalculator.formatCurrency(streamingRate * 3600)}</div>
            <div className="text-xs text-muted-foreground">Per Hour</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mx-auto mb-1">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-sm font-medium">{FinancialCalculator.formatCurrency(streamingRate * 24 * 3600)}</div>
            <div className="text-xs text-muted-foreground">Per Day</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full mx-auto mb-1">
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-sm font-medium">{FinancialCalculator.formatCurrency(remainingAmount)}</div>
            <div className="text-xs text-muted-foreground">Remaining</div>
          </div>
        </div>

        {/* Invoice Factoring Option */}
        {isStreaming && remainingAmount > 0 && (
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-medium text-amber-800 mb-2">Need Cash Now?</h4>
            <p className="text-sm text-amber-700 mb-3">
              Sell your future payment stream and get {FinancialCalculator.formatCurrency(remainingAmount * 0.85)}{" "}
              immediately (15% discount)
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-amber-300 text-amber-700 hover:bg-amber-100 bg-transparent"
              onClick={() => onFactorInvoice?.(invoice.id)}
            >
              Factor This Invoice
            </Button>
          </div>
        )}

        {/* Client Information */}
        <div className="pt-4 border-t">
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Client:</span>
              <span className="font-medium">{invoice.client_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Invoice ID:</span>
              <span className="font-mono text-xs">{invoice.id.slice(0, 8)}</span>
            </div>
            {invoice.blockchain_hash && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Blockchain:</span>
                <span className="font-mono text-xs">
                  {invoice.blockchain_hash.slice(0, 6)}...{invoice.blockchain_hash.slice(-4)}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
