export interface InventoryItem {
  id: string
  name: string
  sku: string
  barcode?: string
  quantity: number
  price: number
  lowStockThreshold: number
  createdAt: string
  updatedAt: string
  synced: boolean
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
  isActive: boolean
}

export type UserRole = "admin" | "manager" | "employee"

export interface ActivityLog {
  id: string
  userId: string
  userName: string
  action: ActivityAction
  itemId?: string
  itemName?: string
  details: string
  timestamp: string
  metadata?: Record<string, any>
}

export type ActivityAction =
  | "item_created"
  | "item_updated"
  | "item_deleted"
  | "quantity_adjusted"
  | "user_login"
  | "user_logout"
  | "low_stock_alert"

export interface LowStockAlert {
  id: string
  itemId: string
  itemName: string
  currentQuantity: number
  threshold: number
  severity: "warning" | "critical"
  acknowledged: boolean
  createdAt: string
}

export interface DailyReport {
  date: string
  totalItems: number
  lowStockItems: number
  totalValue: number
  activitiesCount: number
  topActivities: ActivityLog[]
  alerts: LowStockAlert[]
}
