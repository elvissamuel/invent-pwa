"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { BarcodeScannerComponent } from "@/components/barcode-scanner"

interface ScannerButtonProps {
  scanning: boolean
  onScanningChange: (scanning: boolean) => void
  onDetected: (barcode: string) => void
}

export function ScannerButton({ scanning, onScanningChange, onDetected }: ScannerButtonProps) {
  const [barcode, setBarcode] = useState<string | null>(null)

  const handleDetected = (result: string) => {
    setBarcode(result)
  }

  const handleConfirm = () => {
    if (barcode) {
      onDetected(barcode)
    }
    setBarcode(null)
    onScanningChange(false)
  }

  const handleCancel = () => {
    setBarcode(null)
    onScanningChange(false)
  }

  return (
    <>
      <Button type="button" variant="outline" size="icon" onClick={() => onScanningChange(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
          <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
          <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
          <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
          <rect width="10" height="8" x="7" y="8" rx="1"></rect>
        </svg>
        <span className="sr-only">Scan Barcode</span>
      </Button>

      <Dialog open={scanning} onOpenChange={onScanningChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Scan Barcode</DialogTitle>
            <DialogDescription>Position the barcode in the center of the camera view.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            {!barcode ? (
              <div className="w-full max-w-sm aspect-square">
                <BarcodeScannerComponent onDetected={handleDetected} />
              </div>
            ) : (
              <div className="p-4 border rounded-md w-full">
                <p className="font-mono text-center">{barcode}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            {barcode ? (
              <div className="flex w-full justify-between">
                <Button variant="outline" onClick={() => setBarcode(null)}>
                  Scan Again
                </Button>
                <Button onClick={handleConfirm}>Use This Barcode</Button>
              </div>
            ) : (
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
