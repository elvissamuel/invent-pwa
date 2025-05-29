"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ActivityLog, ActivityAction } from "./types"

interface ActivityState {
  activities: ActivityLog[]
  addActivity: (action: ActivityAction, details: string, metadata?: Record<string, any>) => void
  getActivitiesByDate: (date: string) => ActivityLog[]
  getTodaysActivities: () => ActivityLog[]
  clearOldActivities: (daysToKeep: number) => void
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      activities: [],

      addActivity: (action, details, metadata = {}) => {
        // Get current user from auth store
        const authStore = JSON.parse(localStorage.getItem("auth-storage") || "{}")
        const currentUser = authStore?.state?.currentUser

        if (!currentUser) return

        const activity: ActivityLog = {
          id: crypto.randomUUID(),
          userId: currentUser.id,
          userName: currentUser.name,
          action,
          details,
          timestamp: new Date().toISOString(),
          metadata,
        }

        set((state) => ({
          activities: [activity, ...state.activities],
        }))
      },

      getActivitiesByDate: (date) => {
        const activities = get().activities
        return activities.filter((activity) => activity.timestamp.startsWith(date))
      },

      getTodaysActivities: () => {
        const today = new Date().toISOString().split("T")[0]
        return get().getActivitiesByDate(today)
      },

      clearOldActivities: (daysToKeep) => {
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

        set((state) => ({
          activities: state.activities.filter((activity) => new Date(activity.timestamp) > cutoffDate),
        }))
      },
    }),
    {
      name: "activity-storage",
    },
  ),
)
