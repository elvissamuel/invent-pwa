"use client"

import { useEffect, useRef } from "react"
import { BarcodeScanner } from "@/lib/barcode-scanner"

interface BarcodeScannerComponentProps {
  onDetected: (barcode: string) => void
}

export function BarcodeScannerComponent({ onDetected }: BarcodeScannerComponentProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const scannerRef = useRef<BarcodeScanner | null>(null)

  useEffect(() => {
    const initializeScanner = async () => {
      try {
        // Dynamically import the barcode scanner library
        const { BarcodeDetector } = await import("barcode-detector")

        if (!videoRef.current) return

        // Create scanner instance
        scannerRef.current = new BarcodeScanner(videoRef.current, {
          barcodeDetector: BarcodeDetector,
          onDetected: (result) => {
            onDetected(result)
          },
        })

        // Start scanning
        await scannerRef.current.start()
      } catch (error) {
        console.error("Failed to initialize barcode scanner:", error)
      }
    }

    initializeScanner()

    return () => {
      // Clean up scanner when component unmounts
      if (scannerRef.current) {
        scannerRef.current.stop()
      }
    }
  }, [onDetected])

  return (
    <div className="relative w-full h-full">
      <video ref={videoRef} className="w-full h-full object-cover rounded-md" playsInline />
      <div className="absolute inset-0 border-2 border-dashed border-primary/50 pointer-events-none rounded-md" />
    </div>
  )
}
