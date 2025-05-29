"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, UserRole } from "./types"

interface AuthState {
  currentUser: User | null
  users: User[]
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  addUser: (user: Omit<User, "id" | "createdAt">) => void
  updateUser: (id: string, updates: Partial<User>) => void
  deleteUser: (id: string) => void
  hasPermission: (action: string) => boolean
}

// Default admin user for demo
const defaultAdmin: User = {
  id: "admin-1",
  name: "Admin User",
  email: "admin@inventory.com",
  role: "admin",
  createdAt: new Date().toISOString(),
  isActive: true,
}

// Demo users
const demoUsers: User[] = [
  defaultAdmin,
  {
    id: "manager-1",
    name: "Manager User",
    email: "manager@inventory.com",
    role: "manager",
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: "employee-1",
    name: "Employee User",
    email: "employee@inventory.com",
    role: "employee",
    createdAt: new Date().toISOString(),
    isActive: true,
  },
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: demoUsers,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Demo login - in real app, this would call an API
        const user = get().users.find((u) => u.email === email && u.isActive)
        if (user) {
          set({ currentUser: user, isAuthenticated: true })
          return true
        }
        return false
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false })
      },

      addUser: (userData) => {
        const newUser: User = {
          ...userData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          users: [...state.users, newUser],
        }))
      },

      updateUser: (id, updates) => {
        set((state) => ({
          users: state.users.map((user) => (user.id === id ? { ...user, ...updates } : user)),
        }))
      },

      deleteUser: (id) => {
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        }))
      },

      hasPermission: (action: string) => {
        const user = get().currentUser
        if (!user) return false

        const permissions: Record<UserRole, string[]> = {
          admin: ["*"], // All permissions
          manager: [
            "view_inventory",
            "add_item",
            "edit_item",
            "delete_item",
            "view_reports",
            "manage_alerts",
            "view_users",
          ],
          employee: ["view_inventory", "add_item", "edit_item", "view_reports"],
        }

        const userPermissions = permissions[user.role]
        return userPermissions.includes("*") || userPermissions.includes(action)
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
