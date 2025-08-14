"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Play } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { PayrollStream } from "@/lib/types"

interface StreamSetupProps {
  onStreamCreated?: (stream: PayrollStream) => void
}

export function StreamSetup({ onStreamCreated }: StreamSetupProps) {
  const [formData, setFormData] = useState({
    employer_name: "",
    monthly_salary: "",
    hourly_rate: "",
    salary_type: "monthly",
  })
  const [startDate, setStartDate] = useState<Date>()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In real app, this would call an API
      const newStream: PayrollStream = {
        id: crypto.randomUUID(),
        user_id: "current-user-id",
        employer_name: formData.employer_name,
        monthly_salary: formData.salary_type === "monthly" ? Number.parseFloat(formData.monthly_salary) : 0,
        hourly_rate: formData.salary_type === "hourly" ? Number.parseFloat(formData.hourly_rate) : undefined,
        stream_start_date: startDate?.toISOString() || new Date().toISOString(),
        is_active: true,
        created_at: new Date().toISOString(),
      }

      onStreamCreated?.(newStream)

      // Reset form
      setFormData({
        employer_name: "",
        monthly_salary: "",
        hourly_rate: "",
        salary_type: "monthly",
      })
      setStartDate(undefined)
    } catch (error) {
      console.error("Failed to create stream:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Play className="w-5 h-5 text-green-600" />
          <span>Setup Payroll Stream</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employer">Employer Name</Label>
            <Input
              id="employer"
              placeholder="Enter your employer name"
              value={formData.employer_name}
              onChange={(e) => setFormData({ ...formData, employer_name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Salary Type</Label>
            <Select
              value={formData.salary_type}
              onValueChange={(value) => setFormData({ ...formData, salary_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly Salary</SelectItem>
                <SelectItem value="hourly">Hourly Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.salary_type === "monthly" ? (
            <div className="space-y-2">
              <Label htmlFor="monthly-salary">Monthly Salary (VND)</Label>
              <Input
                id="monthly-salary"
                type="number"
                placeholder="30,000,000"
                value={formData.monthly_salary}
                onChange={(e) => setFormData({ ...formData, monthly_salary: e.target.value })}
                required
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="hourly-rate">Hourly Rate (VND)</Label>
              <Input
                id="hourly-rate"
                type="number"
                placeholder="200,000"
                value={formData.hourly_rate}
                onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Stream Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Stream..." : "Start Payroll Stream"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
