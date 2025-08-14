"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Mail, Building } from "lucide-react"
import { FinancialCalculator } from "@/lib/financial-utils"
import type { Invoice } from "@/lib/types"

interface Client {
  id: string
  name: string
  email: string
  totalInvoiced: number
  totalPaid: number
  invoiceCount: number
}

interface ClientManagerProps {
  invoices: Invoice[]
}

export function ClientManager({ invoices }: ClientManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })

  // Generate client data from invoices
  const clients: Client[] = invoices.reduce((acc: Client[], invoice) => {
    const existingClient = acc.find((c) => c.email === invoice.client_email)

    if (existingClient) {
      existingClient.totalInvoiced += invoice.amount
      if (invoice.invoice_status === "completed") {
        existingClient.totalPaid += invoice.amount
      }
      existingClient.invoiceCount += 1
    } else {
      acc.push({
        id: crypto.randomUUID(),
        name: invoice.client_name,
        email: invoice.client_email,
        totalInvoiced: invoice.amount,
        totalPaid: invoice.invoice_status === "completed" ? invoice.amount : 0,
        invoiceCount: 1,
      })
    }

    return acc
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In real app, this would save the client
    console.log("Adding client:", formData)
    setFormData({ name: "", email: "" })
    setShowForm(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Clients</span>
          </CardTitle>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add Client
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">{clients.length} active clients</div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-blue-50 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="client-name">Client Name</Label>
              <Input
                id="client-name"
                placeholder="Company or Person Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-email">Email Address</Label>
              <Input
                id="client-email"
                type="email"
                placeholder="client@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" size="sm">
                Add Client
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {clients.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto mb-2 text-slate-400" />
            <p className="text-muted-foreground">No clients yet</p>
            <p className="text-sm text-muted-foreground">Clients will appear here when you create invoices</p>
          </div>
        ) : (
          <div className="space-y-3">
            {clients.map((client) => {
              const paymentRate = client.totalInvoiced > 0 ? (client.totalPaid / client.totalInvoiced) * 100 : 0

              return (
                <div key={client.id} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{client.email}</span>
                        </div>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className={
                        paymentRate >= 80
                          ? "bg-green-100 text-green-800"
                          : paymentRate >= 50
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {Math.round(paymentRate)}% paid
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Invoices</div>
                      <div className="font-medium">{client.invoiceCount}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Total Invoiced</div>
                      <div className="font-medium">{FinancialCalculator.formatCurrency(client.totalInvoiced)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Total Paid</div>
                      <div className="font-medium">{FinancialCalculator.formatCurrency(client.totalPaid)}</div>
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
