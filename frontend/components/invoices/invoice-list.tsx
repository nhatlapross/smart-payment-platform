"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Eye, Copy, MoreHorizontal, Zap } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FinancialCalculator } from "@/lib/financial-utils"
import type { Invoice } from "@/lib/types"

interface InvoiceListProps {
  invoices: Invoice[]
  onViewInvoice?: (invoice: Invoice) => void
  onDuplicateInvoice?: (invoice: Invoice) => void
}

export function InvoiceList({ invoices, onViewInvoice, onDuplicateInvoice }: InvoiceListProps) {
  const totalInvoiced = invoices.reduce((sum, invoice) => sum + invoice.amount, 0)
  const paidInvoices = invoices.filter((inv) => inv.invoice_status === "completed")
  const totalPaid = paidInvoices.reduce((sum, invoice) => sum + invoice.amount, 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-slate-100 text-slate-800"
      case "sent":
        return "bg-blue-100 text-blue-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "streaming":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-emerald-100 text-emerald-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getStatusIcon = (status: string) => {
    if (status === "streaming") {
      return <Zap className="w-3 h-3" />
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-green-600" />
          <span>Your Invoices</span>
        </CardTitle>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Total Invoiced</div>
            <div className="font-medium">{FinancialCalculator.formatCurrency(totalInvoiced)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Total Paid</div>
            <div className="font-medium">{FinancialCalculator.formatCurrency(totalPaid)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Success Rate</div>
            <div className="font-medium">
              {invoices.length > 0 ? Math.round((paidInvoices.length / invoices.length) * 100) : 0}%
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto mb-2 text-slate-400" />
            <p className="text-muted-foreground">No invoices yet</p>
            <p className="text-sm text-muted-foreground">Create your first invoice to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">{invoice.client_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(invoice.created_at).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="font-bold">{FinancialCalculator.formatCurrency(invoice.amount)}</div>
                      <Badge variant="outline" className={getStatusColor(invoice.invoice_status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(invoice.invoice_status)}
                          <span className="capitalize">{invoice.invoice_status}</span>
                        </div>
                      </Badge>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onViewInvoice?.(invoice)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDuplicateInvoice?.(invoice)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {invoice.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{invoice.description}</p>
                )}

                {invoice.blockchain_hash && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Blockchain: {invoice.blockchain_hash.slice(0, 10)}...{invoice.blockchain_hash.slice(-8)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
