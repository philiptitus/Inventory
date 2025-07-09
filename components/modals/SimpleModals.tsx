"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Category, County, Model, Department } from "../../types/inventory"

// Category Modal
interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (category: Omit<Category, "id">, id?: number) => Promise<void> | void
  category?: Category
  loading?: boolean
  error?: string
}

export function CategoryModal({ isOpen, onClose, onSave, category, loading, error }: CategoryModalProps) {
  const [categoryName, setCategoryName] = useState("")
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (category) {
      setCategoryName(category.category_name)
    } else {
      setCategoryName("")
    }
    setLocalError(null)
  }, [category, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryName.trim()) {
      setLocalError("Category name is required")
      return
    }
    setLocalError(null)
    try {
      if (category) {
        // Edit
        const result = onSave({ category_name: categoryName, status: 1 }, category.id)
        if (result && typeof result.then === "function") {
          await result
        }
      } else {
        // Add
        const result = onSave({ category_name: categoryName, status: 1 })
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
          <DialogTitle>{category ? "Edit Category" : "Add New Category"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="category_name">Category Name</Label>
            <Input id="category_name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required disabled={loading} />
          </div>
          {(localError || error) && <div className="text-red-600 text-sm">{localError || error}</div>}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <span className="flex items-center"><span className="animate-spin mr-2 w-4 h-4 border-2 border-t-2 border-gray-200 border-t-red-500 rounded-full"></span>{category ? "Updating..." : "Adding..."}</span> : (category ? "Update" : "Add") + " Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// County Modal
interface CountyModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (county: Omit<County, "id">) => Promise<void> | void
  onUpdate?: (id: number, county: Omit<County, "id">) => Promise<void> | void
  county?: County
}

export function CountyModal({ isOpen, onClose, onSave, onUpdate, county }: CountyModalProps) {
  const [formData, setFormData] = useState({ county_name: "", county_number: "" })

  useEffect(() => {
    if (county) {
      setFormData({
        county_name: county.county_name,
        county_number: county.county_number !== undefined && county.county_number !== null ? county.county_number.toString() : ""
      })
    } else {
      setFormData({ county_name: "", county_number: "" })
    }
  }, [county, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const countyData = { county_name: formData.county_name, county_number: Number.parseInt(formData.county_number) }
    if (county && onUpdate) {
      await onUpdate(county.id, countyData)
    } else {
      await onSave(countyData)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{county ? "Edit County" : "Add New County"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="county_name">County Name</Label>
            <Input
              id="county_name"
              value={formData.county_name}
              onChange={(e) => setFormData({ ...formData, county_name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="county_number">County Number</Label>
            <Input
              id="county_number"
              type="number"
              value={formData.county_number}
              onChange={(e) => setFormData({ ...formData, county_number: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{county ? "Update" : "Add"} County</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Model Modal
interface ModelModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (model: Omit<Model, "id">) => void
  onUpdate: (id: number, model: Omit<Model, "id">) => void
  model?: Model
}

export function ModelModal({ isOpen, onClose, onSave, onUpdate, model }: ModelModalProps) {
  const [modelName, setModelName] = useState("")

  useEffect(() => {
    if (model) {
      setModelName(model.model_name)
    } else {
      setModelName("")
    }
  }, [model, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const modelData = { model_name: modelName, status: 1 }
    if (model) {
      onUpdate(model.id, modelData)
    } else {
      onSave(modelData)
    }
    onClose()
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
            <Input id="model_name" value={modelName} onChange={(e) => setModelName(e.target.value)} required />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{model ? "Update" : "Add"} Model</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Department Modal
interface DepartmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (department: Omit<Department, "id">) => Promise<void> | void
  onUpdate?: (id: number, department: Omit<Department, "id">) => Promise<void> | void
  department?: Department
  loading?: boolean
  error?: string
}

export function DepartmentModal({ isOpen, onClose, onSave, onUpdate, department, loading, error }: DepartmentModalProps) {
  const [formData, setFormData] = useState({ Dep_ID: "", Dep_name: "" })
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (department) {
      setFormData({ Dep_ID: department.Dep_ID, Dep_name: department.Dep_name })
    } else {
      setFormData({ Dep_ID: "", Dep_name: "" })
    }
    setLocalError(null)
  }, [department, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.Dep_ID.trim() || !formData.Dep_name.trim()) {
      setLocalError("Both fields are required")
      return
    }
    setLocalError(null)
    try {
      if (department && onUpdate) {
        const result = onUpdate(department.id, formData)
        if (result && typeof result.then === "function") {
          await result
        }
      } else {
        const result = onSave(formData)
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
          <DialogTitle>{department ? "Edit Department" : "Add New Department"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="dep_id">Department ID</Label>
            <Input
              id="dep_id"
              value={formData.Dep_ID}
              onChange={(e) => setFormData({ ...formData, Dep_ID: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="dep_name">Department Name</Label>
            <Input
              id="dep_name"
              value={formData.Dep_name}
              onChange={(e) => setFormData({ ...formData, Dep_name: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          {(localError || error) && <div className="text-red-600 text-sm">{localError || error}</div>}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <span className="flex items-center"><span className="animate-spin mr-2 w-4 h-4 border-2 border-t-2 border-gray-200 border-t-red-500 rounded-full"></span>{department ? "Updating..." : "Adding..."}</span> : (department ? "Update" : "Add") + " Department"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
