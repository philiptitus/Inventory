"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Item, Category, County, Model } from "../../types/inventory"

interface ItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: Omit<Item, "id">) => void
  onUpdate: (id: number, item: Omit<Item, "id">) => void
  item?: Item
  categories: Category[]
  counties: County[]
  models: Model[]
}

export default function ItemModal({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  item,
  categories,
  counties,
  models,
}: ItemModalProps) {
  const [formData, setFormData] = useState({
    pname: "",
    serialno: "",
    model: "",
    category: "",
    county: "",
  })

  useEffect(() => {
    if (item) {
      setFormData({
        pname: item.pname,
        serialno: item.serialno,
        model: item.model,
        category: item.category,
        county: item.county,
      })
    } else {
      setFormData({
        pname: "",
        serialno: "",
        model: "",
        category: "",
        county: "",
      })
    }
  }, [item, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (item) {
      onUpdate(item.id, formData)
    } else {
      onSave(formData)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Item" : "Add New Item"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="pname">Item Name</Label>
            <Input
              id="pname"
              value={formData.pname}
              onChange={(e) => setFormData({ ...formData, pname: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="serialno">Serial Number</Label>
            <Input
              id="serialno"
              value={formData.serialno}
              onChange={(e) => setFormData({ ...formData, serialno: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="model">Model</Label>
            <Select value={formData.model} onValueChange={(value) => setFormData({ ...formData, model: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.model_name}>
                    {model.model_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.category_name}>
                    {category.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="county">County</Label>
            <Select value={formData.county} onValueChange={(value) => setFormData({ ...formData, county: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select county" />
              </SelectTrigger>
              <SelectContent>
                {counties.map((county) => (
                  <SelectItem key={county.id} value={county.county_name}>
                    {county.county_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{item ? "Update" : "Add"} Item</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
