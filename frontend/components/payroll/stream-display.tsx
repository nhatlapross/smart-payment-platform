"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, DollarSign, Clock, TrendingUp } from "lucide-react"
import { FinancialCalculator } from "@/lib/financial-utils"
import type { PayrollStream } from "@/lib/types"

interface StreamDisplayProps {
  stream: PayrollStream
  onToggleStream?: (streamId: string, isActive: boolean) => void
}

export function StreamDisplay({ stream, onToggleStream }: StreamDisplayProps) {
  const [currentEarnings, setCurrentEarnings] = useState(0)
  const [isStreaming, setIsStreaming] = useState(stream.is_active)

  const earningsPerSecond = FinancialCalculator.calculateEarningsPerSecond(stream)
  const dailyEarnings = FinancialCalculator.calculateDailyEarnings(stream)

  useEffect(() => {
    if (!isStreaming) return

    const interval = setInterval(() => {
      setCurrentEarnings((prev) => prev + earningsPerSecond)
    }, 1000)

    return () => clearInterval(interval)
  }, [earningsPerSecond, isStreaming])

  const handleToggleStream = () => {
    const newState = !isStreaming
    setIsStreaming(newState)
    onToggleStream?.(stream.id, newState)
  }

  // Calculate progress through the day (0-100%)
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0) // 9 AM
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0) // 5 PM
  const dayProgress = Math.min(
    100,
    Math.max(0, ((now.getTime() - startOfDay.getTime()) / (endOfDay.getTime() - startOfDay.getTime())) * 100),
  )

  return (
    <Card className="relative overflow-hidden">
      {/* Streaming indicator */}
      {isStreaming && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500">
          <div className="h-full bg-white/30 animate-pulse" />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{stream.employer_name}</CardTitle>
          <Badge variant={isStreaming ? "default" : "secondary"} className="flex items-center space-x-1">
            {isStreaming ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            <span>{isStreaming ? "Streaming" : "Paused"}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Real-time earnings display */}
        <div className="text-center p-4">
          <div className="text-sm text-muted-foreground mb-1">Today's Earnings</div>
          <div className="text-3xl font-bold text-green-600 tabular-nums">
            {FinancialCalculator.formatCurrency(currentEarnings)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            +{FinancialCalculator.formatCurrency(earningsPerSecond)} per second
          </div>
        </div>

        {/* Daily progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Daily Progress</span>
            <span className="font-medium">{Math.round(dayProgress)}%</span>
          </div>
          <Progress value={dayProgress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>9:00 AM</span>
            <span>Target: {FinancialCalculator.formatCurrency(dailyEarnings)}</span>
            <span>5:00 PM</span>
          </div>
        </div>

        {/* Stream stats */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full mx-auto mb-1">
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-sm font-medium">
              {stream.monthly_salary
                ? FinancialCalculator.formatCurrency(stream.monthly_salary)
                : `${FinancialCalculator.formatCurrency(stream.hourly_rate || 0)}/hr`}
            </div>
            <div className="text-xs text-muted-foreground">{stream.monthly_salary ? "Monthly" : "Hourly"}</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full mx-auto mb-1">
              <Clock className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-sm font-medium">{FinancialCalculator.formatCurrency(dailyEarnings)}</div>
            <div className="text-xs text-muted-foreground">Daily Target</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full mx-auto mb-1">
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-sm font-medium">{Math.round((currentEarnings / dailyEarnings) * 100)}%</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
        </div>

        {/* Control button */}
        <Button onClick={handleToggleStream} variant={isStreaming ? "outline" : "default"} className="w-full">
          {isStreaming ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Pause Stream
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Resume Stream
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
