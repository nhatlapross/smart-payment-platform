"use client"

import { useState } from "react"
import { InvoiceCreator } from "@/components/invoices/invoice-creator"
import { InvoiceList } from "@/components/invoices/invoice-list"
import { InvoiceStreaming } from "@/components/invoices/invoice-streaming"
import { ClientManager } from "@/components/invoices/client-manager"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import type { Invoice } from "@/lib/types"

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "1",
      freelancer_id: "user-1",
      client_name: "Tech Startup Inc",
      client_email: "finance@techstartup.com",
      amount: 5000000,
      description: "Website development and design services for Q1 2024",
      invoice_status: "streaming",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
      approved_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
      blockchain_hash: "0x1234567890abcdef1234567890abcdef12345678",
    },
    {
      id: "2",
      freelancer_id: "user-1",
      client_name: "Marketing Agency",
      client_email: "billing@marketingpro.com",
      amount: 3000000,
      description: "Social media content creation and management",
      invoice_status: "completed",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
      approved_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString(), // 28 days ago
      blockchain_hash: "0xabcdef1234567890abcdef1234567890abcdef12",
    },
    {
      id: "3",
      freelancer_id: "user-1",
      client_name: "E-commerce Store",
      client_email: "owner@eshop.com",
      amount: 2500000,
      description: "Product photography and image editing",
      invoice_status: "sent",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      blockchain_hash: "0x567890abcdef1234567890abcdef1234567890ab",
    },
  ])

  const [showCreator, setShowCreator] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const streamingInvoice = invoices.find((inv) => inv.invoice_status === "streaming")

  const handleInvoiceCreated = (invoice: Invoice) => {
    setInvoices([invoice, ...invoices])
    setShowCreator(false)
  }

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
  }

  const handleDuplicateInvoice = (invoice: Invoice) => {
    // In real app, this would pre-fill the creator form
    console.log("Duplicating invoice:", invoice.id)
    setShowCreator(true)
  }

  const handleFactorInvoice = (invoiceId: string) => {
    // In real app, this would open factoring marketplace
    console.log("Factoring invoice:", invoiceId)
  }

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
          <Button onClick={() => setShowCreator(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Invoice Management */}
          <div className="lg:col-span-2 space-y-6">
            {showCreator && (
              <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">Create New Invoice</h2>
                  <Button variant="outline" onClick={() => setShowCreator(false)} className="bg-secondary/50 border-border hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                    Cancel
                  </Button>
                </div>
                <InvoiceCreator onInvoiceCreated={handleInvoiceCreated} />
              </div>
            )}

            {/* Streaming Invoice */}
            {streamingInvoice && (
              <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-8 space-y-6 relative overflow-hidden">
                <div className="absolute inset-0 rounded-2xl"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-foreground">Active Payment Stream</h2>
                  <InvoiceStreaming invoice={streamingInvoice} onFactorInvoice={handleFactorInvoice} />
                </div>
              </div>
            )}

            {/* Invoice List */}
            <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-8">
              <InvoiceList
                invoices={invoices}
                onViewInvoice={handleViewInvoice}
                onDuplicateInvoice={handleDuplicateInvoice}
              />
            </div>
          </div>

          {/* Right Column - Client Management */}
          <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-8">
            <ClientManager invoices={invoices} />
          </div>
        </div>
      </main>
    </div>
  )
}
