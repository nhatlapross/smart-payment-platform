-- Users table for authentication and profile
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) CHECK (user_type IN ('employee', 'freelancer', 'employer')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payroll streams for real-time salary streaming
CREATE TABLE IF NOT EXISTS payroll_streams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    employer_name VARCHAR(255) NOT NULL,
    monthly_salary DECIMAL(15,2) NOT NULL,
    hourly_rate DECIMAL(10,2),
    stream_start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    stream_end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time earnings tracking
CREATE TABLE IF NOT EXISTS earnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    stream_id UUID REFERENCES payroll_streams(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    transaction_type VARCHAR(20) CHECK (transaction_type IN ('salary', 'bonus', 'freelance')) DEFAULT 'salary'
);

-- Financial allocation rules
CREATE TABLE IF NOT EXISTS allocation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    savings_percentage DECIMAL(5,2) DEFAULT 10.00,
    investment_percentage DECIMAL(5,2) DEFAULT 20.00,
    spending_percentage DECIMAL(5,2) DEFAULT 70.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automated savings
CREATE TABLE IF NOT EXISTS savings_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    account_name VARCHAR(255) NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00,
    target_amount DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment portfolios
CREATE TABLE IF NOT EXISTS investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    investment_type VARCHAR(50) NOT NULL, -- 'crypto', 'stocks', 'aptos_stake'
    symbol VARCHAR(20) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    purchase_price DECIMAL(15,2) NOT NULL,
    current_value DECIMAL(15,2),
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bills and recurring payments
CREATE TABLE IF NOT EXISTS bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bill_name VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date INTEGER NOT NULL, -- Day of month (1-31)
    category VARCHAR(50) NOT NULL, -- 'utilities', 'rent', 'internet', etc.
    is_active BOOLEAN DEFAULT true,
    auto_pay BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bill payment history
CREATE TABLE IF NOT EXISTS bill_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID REFERENCES bills(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'completed', 'failed')) DEFAULT 'pending'
);

-- Freelancer invoices
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    freelancer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    client_email VARCHAR(255) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    invoice_status VARCHAR(20) CHECK (invoice_status IN ('draft', 'sent', 'approved', 'streaming', 'completed')) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    blockchain_hash VARCHAR(255)
);

-- Crypto/Fiat transactions
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) CHECK (transaction_type IN ('deposit', 'withdrawal', 'conversion', 'payment')) NOT NULL,
    from_currency VARCHAR(10) NOT NULL,
    to_currency VARCHAR(10) NOT NULL,
    from_amount DECIMAL(15,8) NOT NULL,
    to_amount DECIMAL(15,8) NOT NULL,
    exchange_rate DECIMAL(15,8),
    status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_earnings_user_id ON earnings(user_id);
CREATE INDEX IF NOT EXISTS idx_earnings_earned_at ON earnings(earned_at);
CREATE INDEX IF NOT EXISTS idx_payroll_streams_user_id ON payroll_streams(user_id);
CREATE INDEX IF NOT EXISTS idx_bills_user_id ON bills(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_freelancer_id ON invoices(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
