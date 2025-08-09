"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, X } from "lucide-react"
import { apiFetchAllUsers } from "@/lib/userApi"
import { apiFetchItems } from "@/lib/itemApi"
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
  currentUser?: {
    id: number
    name: string
    department: string
    office_location: string
    county: string
  } | null
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
  currentUser = null,
}: AllocationModalProps) {
  // Check if this is a self-allocation (only one member and it's the current user)
  const isSelfAllocation = members.length === 1 && currentUser && members[0].id === currentUser.id;
  const [formData, setFormData] = useState({
    userId: currentUser?.id?.toString() || "",
    Member_Name: currentUser?.name || "",
    Department: currentUser?.department || "",
    County: currentUser?.county || "",
    Item_Serial_No: "",
    Category: "",
    Model: "",
    Item_Name: "",
    Date_Allocated: new Date().toISOString().split("T")[0],
    Message: "",
    itemId: "",
    ID_PF_No: ""
  })
  const [itemSearch, setItemSearch] = useState("")
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [showItemDropdown, setShowItemDropdown] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const itemDropdownRef = useRef<HTMLDivElement>(null)

  // Search items using the item API
  useEffect(() => {
    const searchItems = async () => {
      if (itemSearch.trim() === "") {
        setFilteredItems([])
        return
      }
      
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No authentication token found')
        }
        
        // Use the item search API
        const response = await apiFetchItems(token, 1, 10, itemSearch)
        
        // Set the filtered items
        setFilteredItems(response.items || [])
      } catch (error) {
        console.error('Error searching items:', error)
        // Fallback to local filtering if API fails
        const searchTerm = itemSearch.toLowerCase()
        const filtered = items.filter(
          (item) =>
            item.pname?.toLowerCase().includes(searchTerm) ||
            item.serialno?.toLowerCase().includes(searchTerm) ||
            item.category?.toLowerCase().includes(searchTerm) ||
            item.model?.toLowerCase().includes(searchTerm)
        )
        setFilteredItems(filtered)
      }
    }
    
    // Add debounce to prevent too many API calls
    const timer = setTimeout(() => {
      searchItems()
    }, 300) // 300ms debounce
    
    return () => clearTimeout(timer)
  }, [itemSearch, items])

  // Handle click outside to close item dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (itemDropdownRef.current && !itemDropdownRef.current.contains(event.target as Node)) {
        setShowItemDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (allocation) {
      setFormData({
        ...allocation,
        userId: allocation.userId ? allocation.userId.toString() : "",
        itemId: allocation.itemId ? allocation.itemId.toString() : "",
      });
    } else {
      // For self-allocation, pre-fill user data
      const defaultItem = items && items.length === 1 ? items[0] : null;
      setFormData({
        userId: currentUser?.id?.toString() || "",
        Member_Name: currentUser?.name || "",
        Department: currentUser?.department || "",
        County: currentUser?.county || "",
        Item_Serial_No: defaultItem?.serialno || "",
        Category: defaultItem?.category || "",
        Model: defaultItem?.model || "",
        Item_Name: defaultItem?.pname || "",
        Date_Allocated: new Date().toISOString().split("T")[0],
        Message: "",
        itemId: defaultItem?.id?.toString() || "",
        ID_PF_No: ""
      });
    }
  }, [allocation, isOpen, items])



  const handleItemSelect = (item: Item) => {
    setFormData({
      ...formData,
      Item_Serial_No: item.serialno || "",
      Category: item.category || "",
      Model: item.model || "",
      Item_Name: item.pname || "",
      itemId: item.id.toString(),
    })
    setItemSearch(item.pname || item.serialno || "")
    setShowItemDropdown(false)
  }

  const clearItemSelection = () => {
    setFormData({
      ...formData,
      Item_Serial_No: "",
      Category: "",
      Model: "",
      Item_Name: "",
      itemId: "",
    })
    setItemSearch("")
    setShowItemDropdown(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null) // Clear any previous errors
    
    // Ensure itemId is a number for the API
    const itemIdNum = formData.itemId ? Number(formData.itemId) : undefined;
    
    // For self-allocation, use the current user's ID
    const userIdNum = isSelfAllocation && currentUser 
      ? currentUser.id 
      : formData.userId 
        ? Number(formData.userId) 
        : undefined;
    

    if (!itemIdNum) {
      setError("Please select an item to allocate");
      return;
    }
    
    try {
      const allocationData = {
        userId: userIdNum,
        itemId: itemIdNum,
        ID_PF_No: allocation?.ID_PF_No || 0,
        Date_Allocated: formData.Date_Allocated || new Date().toISOString().split('T')[0],
        Member_Name: formData.Member_Name,
        Department: formData.Department,
        County: formData.County,
        Item_Serial_No: formData.Item_Serial_No,
        Category: formData.Category,
        Model: formData.Model,
        Item_Name: formData.Item_Name,
        Message: formData.Message
      };

      if (allocation) {
        await onUpdate(allocation.id, allocationData);
      } else {
        await onSave(allocationData);
      }
      onClose()
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
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
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="item">Item</Label>
                <div className="relative w-full" ref={itemDropdownRef}>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search for an item..."
                      value={itemSearch}
                      onChange={(e) => {
                        setItemSearch(e.target.value)
                        setShowItemDropdown(true)
                      }}
                      onFocus={() => setShowItemDropdown(true)}
                      className="w-full"
                    />
                    {formData.itemId && (
                      <button
                        type="button"
                        onClick={clearItemSelection}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {showItemDropdown && (filteredItems.length > 0 || itemSearch) && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg max-h-60 overflow-auto">
                      {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                          <div
                            key={item.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleItemSelect(item)}
                          >
                            <div className="font-medium">{item.pname}</div>
                            <div className="text-sm text-gray-500">
                              {item.serialno} • {item.category} • {item.model}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500">No items found</div>
                      )}
                    </div>
                  )}
                </div>
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
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {error}
            </div>
          )}

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
