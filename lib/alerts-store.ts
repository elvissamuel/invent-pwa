"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { LowStockAlert, InventoryItem } from "./types"

interface AlertsState {
  alerts: LowStockAlert[]
  notificationsEnabled: boolean
  checkLowStock: (items: InventoryItem[]) => void
  acknowledgeAlert: (alertId: string) => void
  clearAlert: (alertId: string) => void
  enableNotifications: () => void
  disableNotifications: () => void
  getUnacknowledgedAlerts: () => LowStockAlert[]
}

export const useAlertsStore = create<AlertsState>()(
  persist(
    (set, get) => ({
      alerts: [],
      notificationsEnabled: false,

      checkLowStock: (items) => {
        const existingAlerts = get().alerts
        const newAlerts: LowStockAlert[] = []

        items.forEach((item) => {
          if (item.quantity <= item.lowStockThreshold) {
            // Check if alert already exists for this item
            const existingAlert = existingAlerts.find((alert) => alert.itemId === item.id && !alert.acknowledged)

            if (!existingAlert) {
              const severity = item.quantity === 0 ? "critical" : "warning"

              const alert: LowStockAlert = {
                id: crypto.randomUUID(),
                itemId: item.id,
                itemName: item.name,
                currentQuantity: item.quantity,
                threshold: item.lowStockThreshold,
                severity,
                acknowledged: false,
                createdAt: new Date().toISOString(),
              }

              newAlerts.push(alert)

              // Send browser notification if enabled
              if (get().notificationsEnabled && "Notification" in window) {
                new Notification(`Low Stock Alert: ${item.name}`, {
                  body: `Only ${item.quantity} items remaining (threshold: ${item.lowStockThreshold})`,
                  icon: "/icon-192.png",
                  tag: `low-stock-${item.id}`,
                })
              }
            }
          }
        })

        if (newAlerts.length > 0) {
          set((state) => ({
            alerts: [...newAlerts, ...state.alerts],
          }))
        }
      },

      acknowledgeAlert: (alertId) => {
        set((state) => ({
          alerts: state.alerts.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)),
        }))
      },

      clearAlert: (alertId) => {
        set((state) => ({
          alerts: state.alerts.filter((alert) => alert.id !== alertId),
        }))
      },

      enableNotifications: async () => {
        if ("Notification" in window) {
          const permission = await Notification.requestPermission()
          if (permission === "granted") {
            set({ notificationsEnabled: true })
          }
        }
      },

      disableNotifications: () => {
        set({ notificationsEnabled: false })
      },

      getUnacknowledgedAlerts: () => {
        return get().alerts.filter((alert) => !alert.acknowledged)
      },
    }),
    {
      name: "alerts-storage",
    },
  ),
)
