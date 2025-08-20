'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { DoubleLeftArrow } from '@/components/icons/doubleLeftArrow'
import {
  Home,
  Activity,
  Clock,
  Lock,
  Search,
  Settings,
  ListCheck,
  List,
  DollarSign,
  ChartArea
} from 'lucide-react'

interface MenuItem {
  id: string
  label: string
  href: string
  icon: React.ReactNode
}

interface MenuSection {
  title: string
  items: MenuItem[]
}

const menuSections: MenuSection[] = [
  {
    title: 'HOME',
    items: [
      { id: 'home', label: 'Home', href: '/', icon: <Home size={18} /> }
    ]
  },
  {
    title: 'TOKEN OPS',
    items: [
      { id: 'Allocation', label: 'Allocation', href: '/allocation', icon: <Activity size={18} /> },
      { id: 'Payroll', label: 'Payroll', href: '/payroll', icon: <Clock size={18} /> },
    ]
  },
  {
    title: 'TOOLS',
    items: [
      { id: 'Dashboard', label: 'Dashboard', href: '/dashboard', icon: <ChartArea size={18} /> },
      { id: 'Bills', label: 'Bills', href: '/bills', icon: <DollarSign size={18} /> },
      { id: 'Invoices', label: 'Invoices', href: '/invoices', icon: <ListCheck size={18} /> },
    ]
  }
]

export function SideMenu() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <aside className={`
      ${isCollapsed ? 'w-16' : 'w-64'} 
      h-screen bg-gradient-to-b from-gray-900 to-gray-950 
      text-white transition-all duration-300 ease-in-out
      flex flex-col border-r border-gray-800
    `}>
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <Image
              src="/logo.png"
              alt="Logo"
              width={25}
              height={25}
              className="object-contain"
              priority
            />
            {!isCollapsed && (
              <span className="ml-3 text-xl font-bold tracking-wider">KEAN</span>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-800 rounded-lg text-sm 
                       placeholder-gray-500 focus:outline-none focus:ring-2 
                       focus:ring-cyan-500 transition-all"
            />
          </div>
        </div>
      )}

      {/* Menu Sections */}
      <nav className="flex-1 overflow-y-auto p-4">
        {menuSections.map((section) => (
          <div key={section.title} className="mb-6">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`
                      flex items-center px-3 py-2.5 rounded-lg transition-all duration-200
                      ${isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border-l-2 border-cyan-400'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                    title={isCollapsed ? item.label : ''}
                  >
                    <span className={`${!isCollapsed && 'mr-3'}`}>{item.icon}</span>
                    {!isCollapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Toggle Button with Custom Background and Sparkle Effect */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={toggleSidebar}
          className="toggle-button-wrapper w-full relative group overflow-hidden rounded-lg"
          style={{
            backgroundImage: 'url(/SliderButtonbg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Sparkle/Shimmer Effect Overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="sparkle-effect absolute inset-0"></div>
          </div>

          {/* Button Content */}
          <div className="relative z-10 flex items-center justify-center px-3 py-2.5 
                        backdrop-blur-sm bg-black/20 hover:bg-black/30 
                        transition-all duration-300">
            <DoubleLeftArrow
              isCollapsed={isCollapsed}
              className="text-white group-hover:text-cyan-300 transition-colors duration-300"
            />
            {!isCollapsed && (
              <span className="ml-2 text-sm font-medium text-white group-hover:text-cyan-300 transition-colors duration-300">
                Hide
              </span>
            )}
          </div>
        </button>
      </div>
    </aside>
  )
}