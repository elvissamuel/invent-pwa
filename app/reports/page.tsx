import { Navigation } from "@/components/navigation"
import { DailyReports } from "@/components/daily-reports"

export default function ReportsPage() {
  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        <DailyReports />
      </main>
    </>
  )
}
