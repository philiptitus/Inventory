"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  Home,
  Package,
  Users,
  MapPin,
  Settings,
  LogOut,
  Search,
  Bell,
  Menu,
  Plus,
  Eye,
  Edit,
  Trash2,
  FileText,
  Building,
  Tag,
  Car,
} from "lucide-react"
import { useState } from "react"
import { useInventoryData } from "./hooks/useInventoryData"
import ItemModal from "./components/modals/ItemModal"
import MemberModal from "./components/modals/MemberModal"
import AllocationModal from "./components/modals/AllocationModal"
import DeleteConfirmModal from "./components/modals/DeleteConfirmModal"
import { CategoryModal, CountyModal, ModelModal, DepartmentModal } from "./components/modals/SimpleModals"
import type { Item, Member, Allocation, Category, County, Model, Department } from "./types/inventory"

type ActivePage =
  | "dashboard"
  | "items"
  | "members"
  | "allocations"
  | "categories"
  | "models"
  | "counties"
  | "departments"

interface InventoryDashboardProps {
  onLogout?: () => void
}

export default function InventoryDashboard({ onLogout }: InventoryDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false)
  const [activePage, setActivePage] = useState<ActivePage>("dashboard")
  const [searchTerm, setSearchTerm] = useState("")

  // Modal states
  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [memberModalOpen, setMemberModalOpen] = useState(false)
  const [allocationModalOpen, setAllocationModalOpen] = useState(false)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [countyModalOpen, setCountyModalOpen] = useState(false)
  const [modelModalOpen, setModelModalOpen] = useState(false)
  const [departmentModalOpen, setDepartmentModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  // Edit states
  const [editingItem, setEditingItem] = useState<Item | undefined>()
  const [editingMember, setEditingMember] = useState<Member | undefined>()
  const [editingAllocation, setEditingAllocation] = useState<Allocation | undefined>()
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()
  const [editingCounty, setEditingCounty] = useState<County | undefined>()
  const [editingModel, setEditingModel] = useState<Model | undefined>()
  const [editingDepartment, setEditingDepartment] = useState<Department | undefined>()

  // Delete states
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: number; name: string } | null>(null)

  const {
    items,
    categories,
    counties,
    members,
    models,
    departments,
    allocations,
    addItem,
    updateItem,
    deleteItem,
    addCategory,
    updateCategory,
    deleteCategory,
    addCounty,
    updateCounty,
    deleteCounty,
    addMember,
    updateMember,
    deleteMember,
    addModel,
    updateModel,
    deleteModel,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    addAllocation,
    updateAllocation,
    deleteAllocation,
  } = useInventoryData()

  // Filter data based on search
  const filteredItems = items.filter(
    (item) =>
      item.pname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialno.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredMembers = members.filter(
    (member) =>
      member.member_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.payroll_no.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredAllocations = allocations.filter(
    (allocation) =>
      allocation.Member_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.Item_Name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle delete operations
  const handleDelete = () => {
    if (!deleteTarget) return

    switch (deleteTarget.type) {
      case "item":
        deleteItem(deleteTarget.id)
        break
      case "member":
        deleteMember(deleteTarget.id)
        break
      case "allocation":
        deleteAllocation(deleteTarget.id)
        break
      case "category":
        deleteCategory(deleteTarget.id)
        break
      case "county":
        deleteCounty(deleteTarget.id)
        break
      case "model":
        deleteModel(deleteTarget.id)
        break
      case "department":
        deleteDepartment(deleteTarget.id)
        break
    }

    setDeleteModalOpen(false)
    setDeleteTarget(null)
  }

  const openDeleteModal = (type: string, id: number, name: string) => {
    setDeleteTarget({ type, id, name })
    setDeleteModalOpen(true)
  }

  // Handle edit operations
  const handleEdit = (type: string, item: any) => {
    switch (type) {
      case "item":
        setEditingItem(item)
        setItemModalOpen(true)
        break
      case "member":
        setEditingMember(item)
        setMemberModalOpen(true)
        break
      case "allocation":
        setEditingAllocation(item)
        setAllocationModalOpen(true)
        break
      case "category":
        setEditingCategory(item)
        setCategoryModalOpen(true)
        break
      case "county":
        setEditingCounty(item)
        setCountyModalOpen(true)
        break
      case "model":
        setEditingModel(item)
        setModelModalOpen(true)
        break
      case "department":
        setEditingDepartment(item)
        setDepartmentModalOpen(true)
        break
    }
  }

  // Handle add operations
  const handleAdd = (type: string) => {
    switch (type) {
      case "item":
        setEditingItem(undefined)
        setItemModalOpen(true)
        break
      case "member":
        setEditingMember(undefined)
        setMemberModalOpen(true)
        break
      case "allocation":
        setEditingAllocation(undefined)
        setAllocationModalOpen(true)
        break
      case "category":
        setEditingCategory(undefined)
        setCategoryModalOpen(true)
        break
      case "county":
        setEditingCounty(undefined)
        setCountyModalOpen(true)
        break
      case "model":
        setEditingModel(undefined)
        setModelModalOpen(true)
        break
      case "department":
        setEditingDepartment(undefined)
        setDepartmentModalOpen(true)
        break
    }
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-red-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-red-900 font-bold text-lg">Y</span>
          </div>
          <span className="text-xl font-bold">YouthFund</span>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <div
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
              activePage === "dashboard"
                ? "bg-red-700 text-white"
                : "text-red-200 hover:bg-red-700 hover:text-white"
            }`}
            onClick={() => setActivePage("dashboard")}
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
            {activePage === "dashboard" && <div className="w-2 h-2 bg-[#0a9b21] rounded-full ml-auto"></div>}
          </div>
          <div
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
              activePage === "items" ? "bg-red-700 text-white" : "text-red-200 hover:bg-red-700 hover:text-white"
            }`}
            onClick={() => setActivePage("items")}
          >
            <Package className="w-5 h-5" />
            <span>Items</span>
          </div>
          <div
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
              activePage === "members"
                ? "bg-red-700 text-white"
                : "text-red-200 hover:bg-red-700 hover:text-white"
            }`}
            onClick={() => setActivePage("members")}
          >
            <Users className="w-5 h-5" />
            <span>Members</span>
          </div>
          <div
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
              activePage === "allocations"
                ? "bg-red-700 text-white"
                : "text-red-200 hover:bg-red-700 hover:text-white"
            }`}
            onClick={() => setActivePage("allocations")}
          >
            <FileText className="w-5 h-5" />
            <span>Allocations</span>
          </div>
          <div
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
              activePage === "categories"
                ? "bg-red-700 text-white"
                : "text-red-200 hover:bg-red-700 hover:text-white"
            }`}
            onClick={() => setActivePage("categories")}
          >
            <Tag className="w-5 h-5" />
            <span>Categories</span>
          </div>
          <div
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
              activePage === "models" ? "bg-red-700 text-white" : "text-red-200 hover:bg-red-700 hover:text-white"
            }`}
            onClick={() => setActivePage("models")}
          >
            <Car className="w-5 h-5" />
            <span>Models</span>
          </div>
          <div
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
              activePage === "counties"
                ? "bg-red-700 text-white"
                : "text-red-200 hover:bg-red-700 hover:text-white"
            }`}
            onClick={() => setActivePage("counties")}
          >
            <MapPin className="w-5 h-5" />
            <span>Counties</span>
          </div>
          <div
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
              activePage === "departments"
                ? "bg-red-700 text-white"
                : "text-red-200 hover:bg-red-700 hover:text-white"
            }`}
            onClick={() => setActivePage("departments")}
          >
            <Building className="w-5 h-5" />
            <span>Departments</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-200 hover:bg-red-700 hover:text-white cursor-pointer">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </div>
          <div
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-200 hover:bg-red-700 hover:text-white cursor-pointer"
            onClick={onLogout}
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </div>
        </div>
      </nav>
    </div>
  )

  const RightSidebarContent = () => (
    <div className="h-full p-6 overflow-y-auto">
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-200" />
          <Input
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-red-700 border-red-700 text-white placeholder-[#8b8989]"
          />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Quick Actions</h3>
        </div>
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-red-700"
            onClick={() => handleAdd("item")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Item
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-red-700"
            onClick={() => handleAdd("member")}
          >
            <Users className="w-4 h-4 mr-2" />
            Add Member
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-red-700"
            onClick={() => handleAdd("allocation")}
          >
            <FileText className="w-4 h-4 mr-2" />
            New Allocation
          </Button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Activity</h3>
        </div>
        <div className="space-y-3">
          {allocations
            .slice(-5)
            .reverse()
            .map((allocation, index) => (
              <div key={index} className="text-sm">
                <p className="font-medium text-white">{allocation.Item_Name}</p>
                <p className="text-red-200">Allocated to {allocation.Member_Name}</p>
                <p className="text-xs text-red-200">{allocation.Date_Allocated}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  )

  const renderDashboard = () => (
    <>
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6">
        <Card className="bg-white border border-[#d9d9d9]">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-[#0a9b21]">{items.length}</p>
                <p className="text-red-200 font-medium text-sm lg:text-base">Total Items</p>
              </div>
              <Package className="w-8 h-8 text-[#0a9b21]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-[#d9d9d9]">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-[#0c1cab]">{members.length}</p>
                <p className="text-red-200 font-medium text-sm lg:text-base">Total Members</p>
              </div>
              <Users className="w-8 h-8 text-[#0c1cab]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-[#d9d9d9]">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-[#be0606]">{allocations.length}</p>
                <p className="text-red-200 font-medium text-sm lg:text-base">Active Allocations</p>
              </div>
              <FileText className="w-8 h-8 text-[#be0606]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-[#d9d9d9]">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-[#41b219]">{categories.length}</p>
                <p className="text-red-200 font-medium text-sm lg:text-base">Categories</p>
              </div>
              <Tag className="w-8 h-8 text-[#41b219]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 mb-6">
        <Card className="bg-white border border-[#d9d9d9]">
          <CardHeader>
            <CardTitle className="text-[#1c1b1f] text-lg">Items by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((category) => {
                const count = items.filter((item) => item.category === category.category_name).length
                return (
                  <div key={category.id} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category.category_name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-[#d9d9d9] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0a9b21] rounded-full"
                          style={{ width: `${items.length > 0 ? (count / items.length) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-[#0a9b21]">{count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-[#d9d9d9]">
          <CardHeader>
            <CardTitle className="text-[#1c1b1f] text-lg">Items by County</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {counties.map((county) => {
                const count = items.filter((item) => item.county === county.county_name).length
                return (
                  <div key={county.id} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{county.county_name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-[#d9d9d9] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0c1cab] rounded-full"
                          style={{ width: `${items.length > 0 ? (count / items.length) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-[#0c1cab]">{count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Allocations Table */}
      <Card className="bg-white border border-[#d9d9d9]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#1c1b1f] text-lg">Recent Allocations</CardTitle>
            <Button size="sm" className="bg-[#0a9b21] hover:bg-[#0a9b21]/90" onClick={() => handleAdd("allocation")}>
              <Plus className="w-4 h-4 mr-2" />
              New Allocation
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#d9d9d9]">
                  <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Member</th>
                  <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Item</th>
                  <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Serial No</th>
                  <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Date Allocated</th>
                  <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allocations.slice(0, 5).map((allocation) => (
                  <tr key={allocation.id} className="border-b border-[#d9d9d9]">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6 lg:w-8 lg:h-8">
                          <AvatarFallback className="text-xs">
                            {allocation.Member_Name.split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{allocation.Member_Name}</p>
                          <p className="text-xs text-red-200">{allocation.ID_PF_No}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-sm">{allocation.Item_Name}</p>
                        <p className="text-xs text-red-200">{allocation.Model}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{allocation.Item_Serial_No}</td>
                    <td className="py-3 px-4 text-sm">{allocation.Department}</td>
                    <td className="py-3 px-4 text-sm">{allocation.Date_Allocated}</td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary" className="bg-[#0a9b21]/10 text-[#0a9b21] text-xs">
                        Active
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEdit("allocation", allocation)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-[#be0606] hover:text-[#be0606]"
                          onClick={() => openDeleteModal("allocation", allocation.id, allocation.Item_Name)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  )

  const renderDataTable = (data: any[], type: string, columns: string[]) => (
    <Card className="bg-white border border-[#d9d9d9]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#1c1b1f] text-lg capitalize">{type}</CardTitle>
          <Button size="sm" className="bg-[#0a9b21] hover:bg-[#0a9b21]/90" onClick={() => handleAdd(type)}>
            <Plus className="w-4 h-4 mr-2" />
            Add {type.slice(0, -1)}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#d9d9d9]">
                {columns.map((column, index) => (
                  <th key={index} className="text-left py-3 px-4 font-medium text-red-200 text-sm capitalize">
                    {column.replace("_", " ")}
                  </th>
                ))}
                <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-b border-[#d9d9d9]">
                  {columns.map((column, index) => (
                    <td key={index} className="py-3 px-4 text-sm">
                      {item[column]}
                    </td>
                  ))}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(type, item)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-[#be0606] hover:text-[#be0606]"
                        onClick={() =>
                          openDeleteModal(
                            type,
                            item.id,
                            item.name ||
                              item.pname ||
                              item.member_name ||
                              item.category_name ||
                              item.county_name ||
                              item.model_name ||
                              item.Dep_name,
                          )
                        }
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return renderDashboard()
      case "items":
        return renderDataTable(filteredItems, "items", ["pname", "serialno", "model", "category", "county"])
      case "members":
        return renderDataTable(filteredMembers, "members", [
          "payroll_no",
          "member_name",
          "department",
          "office_location",
        ])
      case "allocations":
        return renderDataTable(filteredAllocations, "allocations", [
          "Member_Name",
          "Item_Name",
          "Item_Serial_No",
          "Department",
          "Date_Allocated",
        ])
      case "categories":
        return renderDataTable(categories, "categories", ["category_name", "status"])
      case "counties":
        return renderDataTable(counties, "counties", ["county_name", "county_number"])
      case "models":
        return renderDataTable(models, "models", ["model_name", "status"])
      case "departments":
        return renderDataTable(departments, "departments", ["Dep_ID", "Dep_name"])
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="flex h-screen bg-[#fffcfc] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 bg-[#292929] text-white flex-col">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 bg-[#292929] text-white p-0 border-r-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white p-4 lg:p-6 border-b border-[#d9d9d9] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold text-[#1c1b1f]">
                {activePage === "dashboard"
                  ? "Inventory Dashboard"
                  : activePage.charAt(0).toUpperCase() + activePage.slice(1)}
              </h1>
              <p className="text-red-200 text-sm lg:text-base">
                {activePage === "dashboard" ? "Manage your inventory efficiently" : `Manage ${activePage}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <Avatar className="w-8 h-8 lg:w-10 lg:h-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="font-medium text-[#1c1b1f] text-sm lg:text-base">Admin User</p>
                <p className="text-xs lg:text-sm text-red-200">Inventory Manager</p>
              </div>
            </div>
            <Bell className="w-5 h-5 text-red-200" />
            <Button variant="ghost" size="sm" className="xl:hidden" onClick={() => setRightSidebarOpen(true)}>
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Dashboard Content */}
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto">{renderContent()}</div>

          {/* Desktop Right Sidebar */}
          <div className="hidden xl:flex w-80 bg-[#292929] text-white">
            <RightSidebarContent />
          </div>

          {/* Mobile Right Sidebar */}
          <Sheet open={rightSidebarOpen} onOpenChange={setRightSidebarOpen}>
            <SheetContent side="right" className="w-80 bg-[#292929] text-white p-0 border-l-0">
              <RightSidebarContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* All Modals */}
      <ItemModal
        isOpen={itemModalOpen}
        onClose={() => setItemModalOpen(false)}
        onSave={addItem}
        onUpdate={updateItem}
        item={editingItem}
        categories={categories}
        counties={counties}
        models={models}
      />

      <MemberModal
        isOpen={memberModalOpen}
        onClose={() => setMemberModalOpen(false)}
        onSave={addMember}
        onUpdate={updateMember}
        member={editingMember}
        departments={departments}
        counties={counties}
      />

      <AllocationModal
        isOpen={allocationModalOpen}
        onClose={() => setAllocationModalOpen(false)}
        onSave={addAllocation}
        onUpdate={updateAllocation}
        allocation={editingAllocation}
        members={members}
        items={items}
      />

      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSave={addCategory}
        onUpdate={updateCategory}
        category={editingCategory}
      />

      <CountyModal
        isOpen={countyModalOpen}
        onClose={() => setCountyModalOpen(false)}
        onSave={addCounty}
        onUpdate={updateCounty}
        county={editingCounty}
      />

      <ModelModal
        isOpen={modelModalOpen}
        onClose={() => setModelModalOpen(false)}
        onSave={addModel}
        onUpdate={updateModel}
        model={editingModel}
      />

      <DepartmentModal
        isOpen={departmentModalOpen}
        onClose={() => setDepartmentModalOpen(false)}
        onSave={addDepartment}
        onUpdate={updateDepartment}
        department={editingDepartment}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title={deleteTarget?.name || ""}
        description="This action cannot be undone."
      />
    </div>
  )
}
