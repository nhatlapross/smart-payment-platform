import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/layout/header'
import { SideMenu } from '@/components/layout/sidebar'
import { WalletProvider } from '@/components/providers/wallet-provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Super payment App',
  description: 'Created with payment team',
  generator: 'we-payment-platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <div className="flex h-screen">
            <SideMenu />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                {children}
              </main>
            </div>
          </div>
        </WalletProvider>
      </body>
    </html>
  )
}