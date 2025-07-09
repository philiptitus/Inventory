"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Model } from "../../types/inventory"

interface ModelEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (model: Omit<Model, "id">, id?: number) => Promise<void> | void
  model?: Model
  loading?: boolean
  error?: string
}

export default function ModelEditModal({ isOpen, onClose, onSave, model, loading, error }: ModelEditModalProps) {
  const [modelName, setModelName] = useState("")
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (model) {
      setModelName(model.model_name)
    } else {
      setModelName("")
    }
    setLocalError(null)
  }, [model, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!modelName.trim()) {
      setLocalError("Model name is required")
      return
    }
    setLocalError(null)
    try {
      if (model) {
        // Edit
        const result = onSave({ model_name: modelName, status: 1 }, model.id)
        if (result && typeof result.then === "function") {
          await result
        }
      } else {
        // Add
        const result = onSave({ model_name: modelName, status: 1 })
        if (result && typeof result.then === "function") {
          await result
        }
      }
      onClose()
    } catch (err) {
      // Parent handles error and keeps modal open
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{model ? "Edit Model" : "Add New Model"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="model_name">Model Name</Label>
            <Input id="model_name" value={modelName} onChange={(e) => setModelName(e.target.value)} required disabled={loading} />
          </div>
          {(localError || error) && <div className="text-red-600 text-sm">{localError || error}</div>}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <span className="flex items-center"><span className="animate-spin mr-2 w-4 h-4 border-2 border-t-2 border-gray-200 border-t-blue-500 rounded-full"></span>{model ? "Updating..." : "Adding..."}</span> : (model ? "Update" : "Add") + " Model"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 