import { Navigation } from "@/components/navigation"
import { UserManagement } from "@/components/user-management"

export default function UsersPage() {
  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        <UserManagement />
      </main>
    </>
  )
}
