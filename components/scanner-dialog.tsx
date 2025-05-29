"use client"

import { useEffect, useState } from "react"
import { BarcodeScannerComponent } from "@/components/barcode-scanner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useInventoryStore } from "@/lib/inventory-store"

interface ScannerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ScannerDialog({ open, onOpenChange }: ScannerDialogProps) {
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null)
  const [foundItem, setFoundItem] = useState<any | null>(null)
  const { items, getItemByBarcode } = useInventoryStore()

  useEffect(() => {
    if (scannedBarcode) {
      const item = getItemByBarcode(scannedBarcode)
      setFoundItem(item)
    } else {
      setFoundItem(null)
    }
  }, [scannedBarcode, items, getItemByBarcode])

  const handleDetected = (barcode: string) => {
    setScannedBarcode(barcode)
  }

  const handleClose = () => {
    setScannedBarcode(null)
    setFoundItem(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Scan Barcode</DialogTitle>
          <DialogDescription>Position the barcode in the center of the camera view.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4">
          {!scannedBarcode ? (
            <div className="w-full max-w-sm aspect-square">
              <BarcodeScannerComponent onDetected={handleDetected} />
            </div>
          ) : (
            <div className="space-y-4 w-full">
              <div className="p-4 border rounded-md">
                <p className="font-mono text-center">{scannedBarcode}</p>
              </div>

              {foundItem ? (
                <div className="p-4 border rounded-md bg-muted">
                  <h3 className="font-medium">{foundItem.name}</h3>
                  <p className="text-sm text-muted-foreground">SKU: {foundItem.sku}</p>
                  <p className="text-sm">Quantity: {foundItem.quantity}</p>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No matching item found for this barcode.</p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          {scannedBarcode ? (
            <div className="flex w-full justify-between">
              <Button variant="outline" onClick={() => setScannedBarcode(null)}>
                Scan Again
              </Button>
              <Button onClick={handleClose}>Close</Button>
            </div>
          ) : (
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
