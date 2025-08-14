"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, FileText, Send, Save } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { FinancialCalculator } from "@/lib/financial-utils"
import type { Invoice } from "@/lib/types"

interface InvoiceCreatorProps {
  onInvoiceCreated?: (invoice: Invoice) => void
}

export function InvoiceCreator({ onInvoiceCreated }: InvoiceCreatorProps) {
  const [formData, setFormData] = useState({
    client_name: "",
    client_email: "",
    amount: "",
    description: "",
    payment_terms: "net30",
  })
  const [dueDate, setDueDate] = useState<Date>()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent, action: "save" | "send") => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const newInvoice: Invoice = {
        id: crypto.randomUUID(),
        freelancer_id: "current-user-id",
        client_name: formData.client_name,
        client_email: formData.client_email,
        amount: Number.parseFloat(formData.amount),
        description: formData.description,
        invoice_status: action === "send" ? "sent" : "draft",
        created_at: new Date().toISOString(),
        blockchain_hash: action === "send" ? `0x${crypto.randomUUID().replace(/-/g, "")}` : undefined,
      }

      onInvoiceCreated?.(newInvoice)

      // Reset form
      setFormData({
        client_name: "",
        client_email: "",
        amount: "",
        description: "",
        payment_terms: "net30",
      })
      setDueDate(undefined)
    } catch (error) {
      console.error("Failed to create invoice:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-green-600" />
          <span>Create Invoice</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client-name">Client Name</Label>
              <Input
                id="client-name"
                placeholder="Acme Corporation"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-email">Client Email</Label>
              <Input
                id="client-email"
                type="email"
                placeholder="client@acme.com"
                value={formData.client_email}
                onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (VND)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="5,000,000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Terms</Label>
              <Select
                value={formData.payment_terms}
                onValueChange={(value) => setFormData({ ...formData, payment_terms: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="net15">Net 15 days</SelectItem>
                  <SelectItem value="net30">Net 30 days</SelectItem>
                  <SelectItem value="net60">Net 60 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Select due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Work Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the work performed, deliverables, or services provided..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {/* Invoice Preview */}
          {formData.amount && (
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium mb-2">Invoice Preview</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium">
                    {FinancialCalculator.formatCurrency(Number.parseFloat(formData.amount))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Blockchain Fee (2%):</span>
                  <span>{FinancialCalculator.formatCurrency(Number.parseFloat(formData.amount) * 0.02)}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-1">
                  <span>You'll Receive:</span>
                  <span>{FinancialCalculator.formatCurrency(Number.parseFloat(formData.amount) * 0.98)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={(e) => handleSubmit(e, "save")}
              disabled={isLoading}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button type="button" onClick={(e) => handleSubmit(e, "send")} disabled={isLoading} className="flex-1">
              <Send className="w-4 h-4 mr-2" />
              Send Invoice
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
