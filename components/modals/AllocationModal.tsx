"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Allocation, Member, Item } from "../../types/inventory"

interface AllocationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (allocation: Omit<Allocation, "id">) => void
  onUpdate: (id: number, allocation: Omit<Allocation, "id">) => void
  allocation?: Allocation
  members: Member[]
  items: Item[]
  loading?: boolean
}

export default function AllocationModal({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  allocation,
  members,
  items,
  loading = false,
}: AllocationModalProps) {
  const [formData, setFormData] = useState({
    userId: "",
    Member_Name: "",
    Department: "",
    Office_Location: "",
    County: "",
    Item_Serial_No: "",
    Category: "",
    Model: "",
    Item_Name: "",
    Date_Allocated: "",
    Message: "",
    itemId: "",
  })

  useEffect(() => {
    if (allocation) {
      setFormData({
        ...allocation,
        userId: allocation.userId ? allocation.userId.toString() : "",
        itemId: allocation.itemId ? allocation.itemId.toString() : "",
      })
    } else {
      setFormData({
        userId: "",
        Member_Name: "",
        Department: "",
        Office_Location: "",
        County: "",
        Item_Serial_No: "",
        Category: "",
        Model: "",
        Item_Name: "",
        Date_Allocated: new Date().toISOString().split("T")[0],
        Message: "",
        itemId: items && items.length === 1 ? items[0].id.toString() : "",
      })
    }
  }, [allocation, isOpen, items])

  const handleMemberChange = (id: string) => {
    const selectedMember = members.find((m) => m.id.toString() === id)
    if (selectedMember) {
      setFormData({
        ...formData,
        userId: selectedMember.id.toString(),
        Member_Name: selectedMember.member_name,
        Department: selectedMember.department,
        Office_Location: selectedMember.office_location,
        County: selectedMember.county || "",
      })
    }
  }

  const handleItemChange = (serialNo: string) => {
    const selectedItem = items.find((i) => i.serialno === serialNo)
    if (selectedItem) {
      setFormData({
        ...formData,
        Item_Serial_No: selectedItem.serialno,
        Category: selectedItem.category,
        Model: selectedItem.model,
        Item_Name: selectedItem.pname,
        itemId: selectedItem.id.toString(),
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ensure userId and itemId are numbers for the API
    const userIdNum = formData.userId ? Number(formData.userId) : undefined;
    const itemIdNum = formData.itemId ? Number(formData.itemId) : undefined;
    if (allocation) {
      onUpdate(allocation.id, { ...formData, userId: userIdNum, itemId: itemIdNum });
    } else {
      onSave({ userId: userIdNum, itemId: itemIdNum, message: formData.Message });
    }
    onClose()
  }

  // Debug logs to help diagnose dropdown selection issue
  console.log("formData.userId:", formData.userId)
  console.log("members:", members)
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl w-full max-h-[80vh] overflow-y-auto bg-background shadow-lg rounded-lg">
        <DialogHeader>
          <DialogTitle>{allocation ? "Edit Allocation" : "New Allocation"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className={`space-y-4 ${loading ? 'pointer-events-none opacity-60' : ''}`}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="member">Member</Label>
              <Select value={formData.userId} onValueChange={handleMemberChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.member_name} ({member.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="item">Item</Label>
              <Select value={formData.Item_Serial_No} onValueChange={handleItemChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item.id} value={item.serialno}>
                      {item.pname} ({item.serialno})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="member_name">Member Name</Label>
              <Input id="member_name" value={formData.Member_Name} readOnly className="bg-gray-50" />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input id="department" value={formData.Department} readOnly className="bg-gray-50" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="office_location">Office Location</Label>
              <Input id="office_location" value={formData.Office_Location} readOnly className="bg-gray-50" />
            </div>
            <div>
              <Label htmlFor="county">County</Label>
              <Input id="county" value={formData.County} readOnly className="bg-gray-50" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="item_name">Item Name</Label>
              <Input id="item_name" value={formData.Item_Name} readOnly className="bg-gray-50" />
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Input id="model" value={formData.Model} readOnly className="bg-gray-50" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" value={formData.Category} readOnly className="bg-gray-50" />
            </div>
            <div>
              <Label htmlFor="date_allocated">Date Allocated</Label>
              <Input
                id="date_allocated"
                type="date"
                value={formData.Date_Allocated}
                onChange={(e) => setFormData({ ...formData, Date_Allocated: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={formData.Message}
              onChange={(e) => setFormData({ ...formData, Message: e.target.value })}
              placeholder="Additional notes or comments"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{allocation ? "Update" : "Create"} Allocation</Button>
          </div>
        </form>
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-70 z-10">
            <div className="mb-2 text-red-200 text-sm">Processing allocation...</div>
            <div className="w-14 h-14">
              <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-[#0a9b21] border-opacity-30"></div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
