import { Navigation } from "@/components/navigation"
import { AlertsPanel } from "@/components/alerts-panel"

export default function AlertsPage() {
  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        <AlertsPanel />
      </main>
    </>
  )
}
