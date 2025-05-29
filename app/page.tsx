"use client"
import { Suspense } from "react"
import { Inventory } from "@/components/inventory"
import { LoadingInventory } from "@/components/loading-inventory"
import { LoginForm } from "@/components/login-form"
import { Navigation } from "@/components/navigation"
import { useAuthStore } from "@/lib/auth-store"

function InventoryPage() {
  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        <Suspense fallback={<LoadingInventory />}>
          <Inventory />
        </Suspense>
      </main>
    </>
  )
}

function AuthenticatedApp() {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <LoginForm />
  }

  return <InventoryPage />
}

export default function Home() {
  return <AuthenticatedApp />
}
