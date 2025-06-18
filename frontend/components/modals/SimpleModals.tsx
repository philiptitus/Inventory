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
  onSave: (category: Omit<Category, "id">) => void
  onUpdate: (id: number, category: Omit<Category, "id">) => void
  category?: Category
}

export function CategoryModal({ isOpen, onClose, onSave, onUpdate, category }: CategoryModalProps) {
  const [categoryName, setCategoryName] = useState("")

  useEffect(() => {
    if (category) {
      setCategoryName(category.category_name)
    } else {
      setCategoryName("")
    }
  }, [category, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const categoryData = { category_name: categoryName, status: 1 }
    if (category) {
      onUpdate(category.id, categoryData)
    } else {
      onSave(categoryData)
    }
    onClose()
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
            <Input id="category_name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{category ? "Update" : "Add"} Category</Button>
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
  onSave: (county: Omit<County, "id">) => void
  onUpdate: (id: number, county: Omit<County, "id">) => void
  county?: County
}

export function CountyModal({ isOpen, onClose, onSave, onUpdate, county }: CountyModalProps) {
  const [formData, setFormData] = useState({ county_name: "", county_number: "" })

  useEffect(() => {
    if (county) {
      setFormData({ county_name: county.county_name, county_number: county.county_number.toString() })
    } else {
      setFormData({ county_name: "", county_number: "" })
    }
  }, [county, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const countyData = { county_name: formData.county_name, county_number: Number.parseInt(formData.county_number) }
    if (county) {
      onUpdate(county.id, countyData)
    } else {
      onSave(countyData)
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
  onSave: (department: Omit<Department, "id">) => void
  onUpdate: (id: number, department: Omit<Department, "id">) => void
  department?: Department
}

export function DepartmentModal({ isOpen, onClose, onSave, onUpdate, department }: DepartmentModalProps) {
  const [formData, setFormData] = useState({ Dep_ID: "", Dep_name: "" })

  useEffect(() => {
    if (department) {
      setFormData({ Dep_ID: department.Dep_ID, Dep_name: department.Dep_name })
    } else {
      setFormData({ Dep_ID: "", Dep_name: "" })
    }
  }, [department, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (department) {
      onUpdate(department.id, formData)
    } else {
      onSave(formData)
    }
    onClose()
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
            />
          </div>
          <div>
            <Label htmlFor="dep_name">Department Name</Label>
            <Input
              id="dep_name"
              value={formData.Dep_name}
              onChange={(e) => setFormData({ ...formData, Dep_name: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{department ? "Update" : "Add"} Department</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
