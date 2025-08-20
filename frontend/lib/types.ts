export interface User {
  id: string
  email: string
  full_name: string
  user_type: "employee" | "freelancer" | "employer"
  created_at: string
  updated_at: string
}

export interface PayrollStream {
  id: string
  user_id: string
  employer_name: string
  monthly_salary: number
  hourly_rate?: number
  stream_start_date: string
  stream_end_date?: string
  is_active: boolean
  created_at: string
}

export interface Earning {
  id: string
  user_id: string
  stream_id: string
  amount: number
  earned_at: string
  transaction_type: "salary" | "bonus" | "freelance"
}

export interface AllocationRule {
  id: string
  user_id: string
  savings_percentage: number
  investment_percentage: number
  spending_percentage: number
  is_active: boolean
  created_at: string
}

export interface SavingsAccount {
  id: string
  user_id: string
  account_name: string
  balance: number
  target_amount?: number
  created_at: string
}

export interface Investment {
  id: string
  user_id: string
  investment_type: string
  symbol: string
  amount: number
  purchase_price: number
  current_value?: number
  purchased_at: string
}

export interface Bill {
  id: string
  user_id: string
  bill_name: string
  amount: number
  due_date: number
  category: string
  is_active: boolean
  auto_pay: boolean
  created_at: string
}

export interface BillPayment {
  id: string
  bill_id: string
  amount: number
  payment_status: "pending" | "completed" | "failed"
  paid_at: string
  created_at: string
}

export interface Invoice {
  id: string
  freelancer_id: string
  client_email: string
  client_name: string
  amount: number
  description?: string
  invoice_status: "draft" | "sent" | "approved" | "streaming" | "completed"
  created_at: string
  approved_at?: string
  blockchain_hash?: string
}

export interface Transaction {
  id: string
  user_id: string
  transaction_type: "deposit" | "withdrawal" | "conversion" | "payment"
  from_currency: string
  to_currency: string
  from_amount: number
  to_amount: number
  exchange_rate?: number
  status: "pending" | "completed" | "failed"
  created_at: string
}

export interface FinancialSummary {
  totalEarnings: number
  totalSavings: number
  totalInvestments: number
  monthlyBills: number
  availableBalance: number
}
