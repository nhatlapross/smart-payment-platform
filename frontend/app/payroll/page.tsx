"use client"

import { useState } from "react"
import { StreamSetup } from "@/components/payroll/stream-setup"
import { StreamDisplay } from "@/components/payroll/stream-display"
import { EarningsHistory } from "@/components/payroll/earnings-history"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import type { PayrollStream, Earning } from "@/lib/types"

export default function PayrollPage() {
  const [streams, setStreams] = useState<PayrollStream[]>([])
  const [showSetup, setShowSetup] = useState(false)

  // Mock earnings data
  const mockEarnings: Earning[] = [
    {
      id: "1",
      user_id: "user-1",
      stream_id: "stream-1",
      amount: 125000,
      earned_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      transaction_type: "salary",
    },
    {
      id: "2",
      user_id: "user-1",
      stream_id: "stream-1",
      amount: 125000,
      earned_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      transaction_type: "salary",
    },
    {
      id: "3",
      user_id: "user-1",
      stream_id: "stream-1",
      amount: 500000,
      earned_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      transaction_type: "bonus",
    },
  ]

  const handleStreamCreated = (stream: PayrollStream) => {
    setStreams([...streams, stream])
    setShowSetup(false)
  }

  const handleToggleStream = (streamId: string, isActive: boolean) => {
    setStreams(streams.map((stream) => (stream.id === streamId ? { ...stream, is_active: isActive } : stream)))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button onClick={() => setShowSetup(true)} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Stream</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stream Setup/Management */}
          <div className="lg:col-span-2 space-y-6">
            {showSetup && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Setup New Stream</h2>
                  <Button variant="outline" onClick={() => setShowSetup(false)}>
                    Cancel
                  </Button>
                </div>
                <StreamSetup onStreamCreated={handleStreamCreated} />
              </div>
            )}

            {/* Active Streams */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Active Streams</h2>
              {streams.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No Active Streams</h3>
                  <p className="text-slate-600 mb-4">Create your first payroll stream to start earning in real-time</p>
                  <Button onClick={() => setShowSetup(true)}>Create First Stream</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {streams.map((stream) => (
                    <StreamDisplay key={stream.id} stream={stream} onToggleStream={handleToggleStream} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Earnings History */}
          <div>
            <EarningsHistory earnings={mockEarnings} />
          </div>
        </div>
      </main>
    </div>
  )
}
