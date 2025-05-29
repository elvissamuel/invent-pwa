import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CloudOff } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex flex-col items-center max-w-md text-center space-y-4">
        <div className="p-6 bg-muted rounded-full">
          <CloudOff className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">You're offline</h1>
        <p className="text-muted-foreground">
          The page you're trying to view is not available offline. Please check your internet connection and try again.
        </p>
        <p className="text-sm text-muted-foreground">
          Don't worry - any inventory changes you make while offline will be saved locally and synced when you're back
          online.
        </p>
        <Button asChild>
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    </div>
  )
}
