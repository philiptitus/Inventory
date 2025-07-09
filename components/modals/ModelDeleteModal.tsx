"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ModelDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  loading?: boolean
}

export default function ModelDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  loading,
}: ModelDeleteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-blue-500" />
            <DialogTitle>Confirm Deletion</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Are you sure you want to delete <strong>{title}</strong>?
            <br />
            <span className="text-sm text-gray-600">{description}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? <span className="flex items-center"><span className="animate-spin mr-2 w-4 h-4 border-2 border-t-2 border-gray-200 border-t-blue-500 rounded-full"></span>Deleting...</span> : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 