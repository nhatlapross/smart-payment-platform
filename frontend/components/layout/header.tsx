'use client'

import { usePathname } from 'next/navigation'
import { Bell, User, Wallet } from 'lucide-react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'

export function Header() {
  const pathname = usePathname()
  const { connect, disconnect, account, connected, wallets } = useWallet()
  
  const handleWalletAction = async () => {
    if (connected) {
      await disconnect()
    } else {
      // Connect with the first available wallet
      const wallet = wallets?.[0]
      if (wallet) {
        try {
          await connect(wallet.name)
        } catch (error) {
          console.error('Failed to connect wallet:', error)
        }
      }
    }
  }

  const formatAddress = (address: string | undefined) => {
    if (!address || typeof address !== 'string') return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }
  
  // Map routes to page titles
  const getPageTitle = () => {
    const routeMap: { [key: string]: string } = {
      '/': 'Home',
      '/allocation': 'Allocation',
      '/payroll': 'Payroll',
      '/dashboard': 'Dashboard',
      '/bills': 'Bills',
      '/invoices': 'Invoices',
    }
    
    return routeMap[pathname] || 'Dashboard'
  }

  return (
    <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">
          {getPageTitle()}
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Notification Button */}
        <button className="relative p-2 rounded-lg transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        {/* User Avatar */}
        <button className="flex items-center space-x-2 p-2 rounded-lg transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
        </button>
        
        {/* Connect/Disconnect Button */}
        <button 
          onClick={handleWalletAction}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 font-medium text-sm"
        >
          <Wallet size={16} />
          <span>
            {connected && account?.address 
              ? formatAddress(account.address.toString()) 
              : 'Connect Wallet'
            }
          </span>
        </button>
        
        {/* Settings */}
        <button className="p-2 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </header>
  )
}