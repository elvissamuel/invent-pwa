"use client"

import { Cloud, CloudOff, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useOnlineStatus } from "@/lib/use-online-status"

interface SyncStatusProps {
  status: "idle" | "syncing" | "error" | "success"
  onSync: () => void
}

export function SyncStatus({ status, onSync }: SyncStatusProps) {
  const isOnline = useOnlineStatus()

  return (
    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-50 to-white rounded-lg border border-teal-100">
      <div className="flex items-center space-x-2">
        {isOnline ? <Cloud className="h-4 w-4 text-teal-500" /> : <CloudOff className="h-4 w-4 text-black" />}
        <span className="text-sm text-black">
          {isOnline ? "Online - Changes will sync automatically" : "Offline - Changes saved locally"}
        </span>
      </div>
      {isOnline && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onSync}
          disabled={status === "syncing"}
          className="h-8 text-teal-600 hover:text-teal-700 hover:bg-teal-100"
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${status === "syncing" ? "animate-spin" : ""}`} />
          {status === "syncing" ? "Syncing..." : "Sync Now"}
        </Button>
      )}
    </div>
  )
}
