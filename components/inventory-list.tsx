"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EditItemDialog } from "@/components/edit-item-dialog"
import type { InventoryItem } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

interface InventoryListProps {
  items: InventoryItem[]
}

export function InventoryList({ items }: InventoryListProps) {
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No items found</CardTitle>
          <CardDescription>Add items to your inventory to get started.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">SKU</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right hidden sm:table-cell">Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground md:hidden">{item.sku}</div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{item.sku}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={
                      item.quantity <= item.lowStockThreshold
                        ? "destructive"
                        : item.quantity <= item.lowStockThreshold * 2
                          ? "default" // Use teal instead of warning
                          : "secondary"
                    }
                    className={
                      item.quantity <= item.lowStockThreshold * 2 && item.quantity > item.lowStockThreshold
                        ? "bg-teal-500 text-white"
                        : ""
                    }
                  >
                    {item.quantity}
                  </Badge>
                </TableCell>
                <TableCell className="text-right hidden sm:table-cell">{formatCurrency(item.price)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => setEditingItem(item)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingItem && (
        <EditItemDialog
          item={editingItem}
          open={!!editingItem}
          onOpenChange={(open) => {
            if (!open) setEditingItem(null)
          }}
        />
      )}
    </>
  )
}
