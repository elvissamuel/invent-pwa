"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InventoryList } from "@/components/inventory-list"
import { AddItemDialog } from "@/components/add-item-dialog"
import { ScannerDialog } from "@/components/scanner-dialog"
import { SyncStatus } from "@/components/sync-status"
import { useInventoryStore } from "@/lib/inventory-store"
import { useSyncManager } from "@/lib/use-sync-manager"

export function Inventory() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { items, initialized, initializeStore } = useInventoryStore()
  const { syncStatus, syncInventory } = useSyncManager()

  useEffect(() => {
    initializeStore()
  }, [initializeStore])

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.barcode?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (!initialized) {
    return <div>Loading inventory...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <Input
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={() => setIsScannerOpen(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
              <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
              <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
              <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
              <rect width="10" height="8" x="7" y="8" rx="1"></rect>
            </svg>
            <span className="sr-only">Scan Barcode</span>
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <SyncStatus status={syncStatus} onSync={syncInventory} />

      <InventoryList items={filteredItems} />

      <AddItemDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />

      <ScannerDialog open={isScannerOpen} onOpenChange={setIsScannerOpen} />
    </div>
  )
}
