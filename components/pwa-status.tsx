"use client"

import { useEffect, useState } from "react"
import { Smartphone, Monitor } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function PWAStatus() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [installSource, setInstallSource] = useState<string>("")

  useEffect(() => {
    // Check if app is running as installed PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      setInstallSource("PWA")
    } else if ((window.navigator as any).standalone === true) {
      setIsInstalled(true)
      setInstallSource("iOS")
    } else if (document.referrer.startsWith("android-app://")) {
      setIsInstalled(true)
      setInstallSource("Android")
    }
  }, [])

  if (!isInstalled) {
    return (
      <Badge variant="outline" className="text-xs border-gray-200 text-black">
        <Monitor className="h-3 w-3 mr-1" />
        Web
      </Badge>
    )
  }

  return (
    <Badge className="text-xs bg-teal-500 text-white">
      <Smartphone className="h-3 w-3 mr-1" />
      Installed ({installSource})
    </Badge>
  )
}
