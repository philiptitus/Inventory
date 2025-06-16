"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Member, Department, County } from "../../types/inventory"

interface MemberModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (member: Omit<Member, "id">) => void
  onUpdate: (id: number, member: Omit<Member, "id">) => void
  member?: Member
  departments: Department[]
  counties: County[]
}

export default function MemberModal({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  member,
  departments,
  counties,
}: MemberModalProps) {
  const [formData, setFormData] = useState({
    payroll_no: "",
    member_name: "",
    department: "",
    office_location: "",
    county: "",
  })

  useEffect(() => {
    if (member) {
      setFormData({
        payroll_no: member.payroll_no,
        member_name: member.member_name,
        department: member.department,
        office_location: member.office_location,
        county: member.county || "",
      })
    } else {
      setFormData({
        payroll_no: "",
        member_name: "",
        department: "",
        office_location: "",
        county: "",
      })
    }
  }, [member, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (member) {
      onUpdate(member.id, formData)
    } else {
      onSave(formData)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{member ? "Edit Member" : "Add New Member"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="payroll_no">Payroll Number</Label>
            <Input
              id="payroll_no"
              value={formData.payroll_no}
              onChange={(e) => setFormData({ ...formData, payroll_no: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="member_name">Member Name</Label>
            <Input
              id="member_name"
              value={formData.member_name}
              onChange={(e) => setFormData({ ...formData, member_name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => setFormData({ ...formData, department: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.Dep_name}>
                    {dept.Dep_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="office_location">Office Location</Label>
            <Input
              id="office_location"
              value={formData.office_location}
              onChange={(e) => setFormData({ ...formData, office_location: e.target.value })}
              required
            />
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
            <Button type="submit">{member ? "Update" : "Add"} Member</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
