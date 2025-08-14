"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { CreditCard, Plus } from "lucide-react"
import type { Bill } from "@/lib/types"

interface BillSetupProps {
  onBillCreated?: (bill: Bill) => void
}

const BILL_CATEGORIES = [
  { value: "utilities", label: "Utilities", icon: "⚡" },
  { value: "rent", label: "Rent/Mortgage", icon: "🏠" },
  { value: "internet", label: "Internet", icon: "🌐" },
  { value: "phone", label: "Phone", icon: "📱" },
  { value: "insurance", label: "Insurance", icon: "🛡️" },
  { value: "subscription", label: "Subscriptions", icon: "📺" },
  { value: "loan", label: "Loans", icon: "💳" },
  { value: "other", label: "Other", icon: "📄" },
]

export function BillSetup({ onBillCreated }: BillSetupProps) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    bill_name: "",
    amount: "",
    due_date: "",
    category: "",
    auto_pay: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newBill: Bill = {
      id: crypto.randomUUID(),
      user_id: "current-user-id",
      bill_name: formData.bill_name,
      amount: Number.parseFloat(formData.amount),
      due_date: Number.parseInt(formData.due_date),
      category: formData.category,
      is_active: true,
      auto_pay: formData.auto_pay,
      created_at: new Date().toISOString(),
    }

    onBillCreated?.(newBill)
    setFormData({
      bill_name: "",
      amount: "",
      due_date: "",
      category: "",
      auto_pay: false,
    })
    setShowForm(false)
  }

  if (!showForm) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Button onClick={() => setShowForm(true)} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add New Bill
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-purple-600" />
          <span>Add New Bill</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bill-name">Bill Name</Label>
            <Input
              id="bill-name"
              placeholder="Electric Bill, Rent, Netflix, etc."
              value={formData.bill_name}
              onChange={(e) => setFormData({ ...formData, bill_name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (VND)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="500,000"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {BILL_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <span className="flex items-center space-x-2">
                      <span>{category.icon}</span>
                      <span>{category.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="due-date">Due Date (Day of Month)</Label>
            <Select value={formData.due_date} onValueChange={(value) => setFormData({ ...formData, due_date: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select due date" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <SelectItem key={day} value={day.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
            <div>
              <h4 className="font-medium">Auto-Pay</h4>
              <p className="text-sm text-muted-foreground">Automatically pay from streaming salary</p>
            </div>
            <Switch
              checked={formData.auto_pay}
              onCheckedChange={(checked) => setFormData({ ...formData, auto_pay: checked })}
            />
          </div>

          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">
              Add Bill
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
