"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { InventoryItem } from "./types"
import { useActivityStore } from "./activity-store"

interface InventoryState {
  items: InventoryItem[]
  initialized: boolean
  initializeStore: () => void
  addItem: (item: InventoryItem) => void
  updateItem: (item: InventoryItem) => void
  deleteItem: (id: string) => void
  getItemByBarcode: (barcode: string) => InventoryItem | undefined
  markAllSynced: () => void
  getUnsyncedItems: () => InventoryItem[]
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      items: [],
      initialized: false,

      initializeStore: () => {
        set({ initialized: true })
      },

      addItem: (item) => {
        set((state) => ({
          items: [...state.items, item],
        }))

        // Log activity
        const activityStore = useActivityStore.getState()
        activityStore.addActivity("item_created", `Created new item: ${item.name}`, {
          itemId: item.id,
          itemName: item.name,
          quantity: item.quantity,
        })
      },

      updateItem: (updatedItem) => {
        const oldItem = get().items.find((item) => item.id === updatedItem.id)

        set((state) => ({
          items: state.items.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
        }))

        // Log activity
        const activityStore = useActivityStore.getState()
        if (oldItem && oldItem.quantity !== updatedItem.quantity) {
          activityStore.addActivity(
            "quantity_adjusted",
            `Updated ${updatedItem.name} quantity from ${oldItem.quantity} to ${updatedItem.quantity}`,
            {
              itemId: updatedItem.id,
              itemName: updatedItem.name,
              oldQuantity: oldItem.quantity,
              newQuantity: updatedItem.quantity,
            },
          )
        } else {
          activityStore.addActivity("item_updated", `Updated item: ${updatedItem.name}`, {
            itemId: updatedItem.id,
            itemName: updatedItem.name,
          })
        }
      },

      deleteItem: (id) => {
        const item = get().items.find((item) => item.id === id)

        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))

        // Log activity
        if (item) {
          const activityStore = useActivityStore.getState()
          activityStore.addActivity("item_deleted", `Deleted item: ${item.name}`, {
            itemId: item.id,
            itemName: item.name,
          })
        }
      },

      getItemByBarcode: (barcode) => {
        return get().items.find((item) => item.barcode === barcode)
      },

      markAllSynced: () => {
        set((state) => ({
          items: state.items.map((item) => ({
            ...item,
            synced: true,
          })),
        }))
      },

      getUnsyncedItems: () => {
        return get().items.filter((item) => !item.synced)
      },
    }),
    {
      name: "inventory-storage",
    },
  ),
)
