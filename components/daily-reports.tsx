"use client"

import { useState, useMemo } from "react"
import { Calendar, TrendingUp, Package, AlertTriangle, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useInventoryStore } from "@/lib/inventory-store"
import { useActivityStore } from "@/lib/activity-store"
import { useAlertsStore } from "@/lib/alerts-store"
import { formatCurrency } from "@/lib/utils"
import type { DailyReport } from "@/lib/types"

export function DailyReports() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const { items } = useInventoryStore()
  const { getActivitiesByDate } = useActivityStore()
  const { alerts } = useAlertsStore()

  const dailyReport: DailyReport = useMemo(() => {
    const activities = getActivitiesByDate(selectedDate)
    const dateAlerts = alerts.filter((alert) => alert.createdAt.startsWith(selectedDate))

    const totalValue = items.reduce((sum, item) => sum + item.quantity * item.price, 0)
    const lowStockItems = items.filter((item) => item.quantity <= item.lowStockThreshold).length

    return {
      date: selectedDate,
      totalItems: items.length,
      lowStockItems,
      totalValue,
      activitiesCount: activities.length,
      topActivities: activities.slice(0, 10),
      alerts: dateAlerts,
    }
  }, [selectedDate, items, getActivitiesByDate, alerts])

  const activityCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    dailyReport.topActivities.forEach((activity) => {
      counts[activity.action] = (counts[activity.action] || 0) + 1
    })
    return counts
  }, [dailyReport.topActivities])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">Daily Reports</h2>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-black" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{dailyReport.totalItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{dailyReport.lowStockItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{formatCurrency(dailyReport.totalValue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activities</CardTitle>
            <Activity className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{dailyReport.activitiesCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
            <CardDescription>Breakdown of activities for {selectedDate}</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(activityCounts).length === 0 ? (
              <p className="text-muted-foreground">No activities recorded for this date</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(activityCounts).map(([action, count]) => (
                  <div key={action} className="flex justify-between items-center">
                    <span className="capitalize text-black">{action.replace("_", " ")}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest activities for {selectedDate}</CardDescription>
          </CardHeader>
          <CardContent>
            {dailyReport.topActivities.length === 0 ? (
              <p className="text-muted-foreground">No activities recorded for this date</p>
            ) : (
              <div className="space-y-3">
                {dailyReport.topActivities.map((activity) => (
                  <div key={activity.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-black">{activity.details}</p>
                      <p className="text-xs text-muted-foreground">
                        by {activity.userName} at {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {activity.action.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alerts for the day */}
      {dailyReport.alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Alerts Generated</CardTitle>
            <CardDescription>Low stock alerts created on {selectedDate}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dailyReport.alerts.map((alert) => (
                <div key={alert.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <span className="font-medium text-black">{alert.itemName}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      Stock: {alert.currentQuantity} (Threshold: {alert.threshold})
                    </span>
                  </div>
                  <Badge
                    variant={alert.severity === "critical" ? "destructive" : "default"}
                    className={alert.severity === "warning" ? "bg-teal-500 text-white" : ""}
                  >
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
