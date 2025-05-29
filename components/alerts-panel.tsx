"use client"

import { useEffect } from "react"
import { AlertTriangle, Bell, BellOff, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAlertsStore } from "@/lib/alerts-store"
import { useInventoryStore } from "@/lib/inventory-store"
import { useActivityStore } from "@/lib/activity-store"

export function AlertsPanel() {
  const {
    alerts,
    notificationsEnabled,
    checkLowStock,
    acknowledgeAlert,
    clearAlert,
    enableNotifications,
    disableNotifications,
    getUnacknowledgedAlerts,
  } = useAlertsStore()

  const { items } = useInventoryStore()
  const { addActivity } = useActivityStore()
  const unacknowledgedAlerts = getUnacknowledgedAlerts()

  // Check for low stock on component mount and when items change
  useEffect(() => {
    checkLowStock(items)
  }, [items, checkLowStock])

  const handleAcknowledge = (alertId: string) => {
    acknowledgeAlert(alertId)
    const alert = alerts.find((a) => a.id === alertId)
    if (alert) {
      addActivity("low_stock_alert", `Acknowledged low stock alert for ${alert.itemName}`)
    }
  }

  const handleClear = (alertId: string) => {
    clearAlert(alertId)
    const alert = alerts.find((a) => a.id === alertId)
    if (alert) {
      addActivity("low_stock_alert", `Cleared low stock alert for ${alert.itemName}`)
    }
  }

  const toggleNotifications = async () => {
    if (notificationsEnabled) {
      disableNotifications()
    } else {
      await enableNotifications()
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alerts
              {unacknowledgedAlerts.length > 0 && <Badge variant="destructive">{unacknowledgedAlerts.length}</Badge>}
            </CardTitle>
            <CardDescription>Monitor inventory levels and get notified when stock is low</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={toggleNotifications} className="flex items-center gap-2 w-full sm:w-auto">
            {notificationsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            {notificationsEnabled ? "Enabled" : "Enable Notifications"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No low stock alerts</p>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 border rounded-md ${
                  alert.acknowledged
                    ? "bg-muted/50"
                    : alert.severity === "critical"
                      ? "bg-red-50 border-red-200"
                      : "bg-teal-50 border-teal-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-medium">{alert.itemName}</h4>
                      <Badge
                        variant={alert.severity === "critical" ? "destructive" : "default"}
                        className={alert.severity === "warning" ? "bg-teal-500 text-white" : ""}
                      >
                        {alert.severity}
                      </Badge>
                      {alert.acknowledged && <Badge variant="secondary">Acknowledged</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Current stock: {alert.currentQuantity} (Threshold: {alert.threshold})
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(alert.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-1 self-end sm:self-start">
                    {!alert.acknowledged && (
                      <Button variant="outline" size="sm" onClick={() => handleAcknowledge(alert.id)}>
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleClear(alert.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
