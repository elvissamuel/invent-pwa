"use client"

import { useState, useCallback, useEffect } from "react"
import { useInventoryStore } from "./inventory-store"
import { useOnlineStatus } from "./use-online-status"

export function useSyncManager() {
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "error" | "success">("idle")
  const { getUnsyncedItems, markAllSynced } = useInventoryStore()
  const isOnline = useOnlineStatus()

  const syncInventory = useCallback(async () => {
    if (!isOnline) {
      return
    }

    const unsyncedItems = getUnsyncedItems()
    if (unsyncedItems.length === 0) {
      return
    }

    setSyncStatus("syncing")

    try {
      // In a real app, this would be an API call to sync data
      // For this demo, we'll simulate a network request
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mark all items as synced
      markAllSynced()

      setSyncStatus("success")
      setTimeout(() => setSyncStatus("idle"), 2000)
    } catch (error) {
      console.error("Sync failed:", error)
      setSyncStatus("error")
      setTimeout(() => setSyncStatus("idle"), 3000)
    }
  }, [isOnline, getUnsyncedItems, markAllSynced])

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline) {
      const unsyncedItems = getUnsyncedItems()
      if (unsyncedItems.length > 0) {
        syncInventory()
      }
    }
  }, [isOnline, getUnsyncedItems, syncInventory])

  return { syncStatus, syncInventory }
}
