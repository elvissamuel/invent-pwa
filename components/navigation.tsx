"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, BarChart3, AlertTriangle, Users, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/lib/auth-store"
import { useAlertsStore } from "@/lib/alerts-store"
import { useActivityStore } from "@/lib/activity-store"
import { cn } from "@/lib/utils"
import { PWAStatus } from "@/components/pwa-status"
import { InstallPrompt } from "@/components/install-prompt"

const navigation = [
  { name: "Inventory", href: "/", icon: Package, permission: "view_inventory" },
  { name: "Reports", href: "/reports", icon: BarChart3, permission: "view_reports" },
  { name: "Alerts", href: "/alerts", icon: AlertTriangle, permission: "manage_alerts" },
  { name: "Users", href: "/users", icon: Users, permission: "view_users" },
]

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { currentUser, logout, hasPermission } = useAuthStore()
  const { getUnacknowledgedAlerts } = useAlertsStore()
  const { addActivity } = useActivityStore()

  const unacknowledgedAlerts = getUnacknowledgedAlerts()

  const handleLogout = () => {
    addActivity("user_logout", "User logged out")
    logout()
  }

  const filteredNavigation = navigation.filter((item) => hasPermission(item.permission))

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="p-2 bg-teal-500 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-black">Inventory Tracker</span>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {filteredNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                      isActive
                        ? "border-teal-500 text-teal-600"
                        : "border-transparent text-black hover:border-teal-300 hover:text-teal-600",
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                    {item.name === "Alerts" && unacknowledgedAlerts.length > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {unacknowledgedAlerts.length}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <PWAStatus />
            <div className="text-sm text-black">
              Welcome, <span className="font-medium text-black">{currentUser?.name}</span>
              <Badge variant="outline" className="ml-2 border-teal-200 text-teal-700">
                {currentUser?.role}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-teal-200 text-teal-700 hover:bg-teal-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-black"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors",
                    isActive
                      ? "bg-teal-50 border-teal-500 text-teal-700"
                      : "border-transparent text-black hover:bg-gray-50 hover:border-gray-300 hover:text-black",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.name}
                    {item.name === "Alerts" && unacknowledgedAlerts.length > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {unacknowledgedAlerts.length}
                      </Badge>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 bg-gray-50">
            <div className="px-4">
              <div className="text-base font-medium text-black">{currentUser?.name}</div>
              <div className="text-sm text-gray-500">{currentUser?.email}</div>
              <Badge variant="outline" className="mt-1 border-teal-200 text-teal-700">
                {currentUser?.role}
              </Badge>
            </div>
            <div className="mt-3 px-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full border-teal-200 text-teal-700 hover:bg-teal-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
      <InstallPrompt />
    </nav>
  )
}
