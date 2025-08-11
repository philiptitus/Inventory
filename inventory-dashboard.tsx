"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import Sidebar from "./components/inventory/Sidebar"
import RightSidebar from "./components/inventory/RightSidebar"
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
import { useState, useEffect, useRef } from "react"
import { useInventoryData } from "./hooks/useInventoryData"
import ItemModal from "./components/modals/ItemModal"
import MemberModal from "./components/modals/MemberModal"
import AllocationModal from "./components/modals/AllocationModal"
import DeleteConfirmModal from "./components/modals/DeleteConfirmModal"
import { CategoryModal, CountyModal, ModelModal, DepartmentModal } from "./components/modals/SimpleModals"
import type { Item, Member, Allocation, Category, County, Model, Department } from "./types/inventory"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { updateCategory as apiUpdateCategory, deleteCategory as apiDeleteCategory, fetchCategories as apiFetchCategories } from "@/lib/categoryApi"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"
import { fetchModels as apiFetchModels, createModel as apiCreateModel, updateModel as apiUpdateModel, deleteModel as apiDeleteModel } from "@/lib/modelApi"
import ModelEditModal from "@/components/modals/ModelEditModal"
import ModelDeleteModal from "@/components/modals/ModelDeleteModal"
import ModelsSection from "./components/inventory/ModelsSection";
import CountiesSection from "./components/inventory/CountiesSection";
import DepartmentsSection from "./components/inventory/DepartmentsSection";
import AllocationsSection from "./components/inventory/AllocationsSection";
import MembersSection from "./components/inventory/MembersSection";
import ItemsSection from "./components/inventory/ItemsSection";
import CategoriesSection from "./components/inventory/CategoriesSection";
import DashboardSection from "./components/inventory/DashboardSection";
import ReturnRequestsSection from "./components/inventory/ReturnRequestsSection";
import RepairRequestsSection from "./components/inventory/RepairRequestsSection";
import { fetchCounties as apiFetchCounties, createCounty as apiCreateCounty, updateCounty as apiUpdateCounty, apiDeleteCounty } from "@/lib/countyApi";
import { apiFetchDepartments, apiCreateDepartment, apiUpdateDepartment, apiDeleteDepartment } from "@/lib/departmentApi";
import { apiFetchItems, apiCreateItem, apiUpdateItem, apiDeleteItem, apiFetchItemById } from "@/lib/itemApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiFetchAllocations, apiFetchAllocationById, apiDeleteAllocation } from "@/lib/allocationApi";
import { apiFetchAllUsers } from "@/lib/userApi";
import { Skeleton } from "@/components/ui/skeleton";
import { apiCreateAllocation } from "@/lib/allocationApi";
import { toast } from "@/hooks/use-toast";
import AllocationDetailModal from "@/components/modals/AllocationDetailModal";
import { Toaster } from '@/components/ui/toaster';

export type ActivePage =
  | "dashboard"
  | "items"
  | "members"
  | "allocations"
  | "return-requests"
  | "repair-requests"
  | "categories"
  | "models"
  | "counties"
  | "departments"

interface InventoryDashboardProps {
  onLogout?: () => void
  initialPage?: ActivePage
}

export default function InventoryDashboard({ onLogout, initialPage }: InventoryDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false)
  const [activePage, setActivePage] = useState<ActivePage>(initialPage || "dashboard")
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const [deleteAllocationModalOpen, setDeleteAllocationModalOpen] = useState(false);
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
    categories: fakeCategories,
    members: fakeMembers,
    models: fakeModels,
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
  } = useInventoryData()

  // Add a useState for departments
  const [departments, setDepartments] = useState<Department[]>([]);

  // State for items and pagination
  const [items, setItems] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const [itemListLoading, setItemListLoading] = useState(false);
  const [itemLoading, setItemLoading] = useState(false);
  const [itemError, setItemError] = useState<string | null>(null);
  
  // Fetch items with pagination and search
  const fetchItems = async (page: number = currentPage, search: string = searchTerm) => {
    setItemListLoading(true);
    setItemError(null);
    
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) throw new Error('No authentication token found');
      
      const response = await fetch(`/api/inventory?page=${page}&limit=${itemsPerPage}${search ? `&search=${encodeURIComponent(search)}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      
      const data = await response.json();
      setItems(data.items || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalItems(data.pagination?.total || 0);
      setCurrentPage(page);
      
      return data;
    } catch (error) {
      console.error('Error fetching items:', error);
      setItemError(error instanceof Error ? error.message : 'Failed to fetch items');
      toast({
        title: 'Error',
        description: 'Failed to fetch items',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setItemListLoading(false);
    }
  };

  // Load items on component mount and when search term changes
  useEffect(() => {
    const loadItems = async () => {
      try {
        await fetchItems(1, searchTerm);
      } catch (error) {
        // Error is already handled in fetchItems
      }
    };
    
    // Set a timeout to debounce the search
    const timeoutId = setTimeout(() => {
      loadItems();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);
  
  // Add state for item detail modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<Item | null>(null);
  const [detailItemLoading, setDetailItemLoading] = useState(false);
  const [detailItemError, setDetailItemError] = useState<string | null>(null);

  const [user, setUser] = useState<{ name: string; isAdmin: boolean } | null>(null)
  const { toast } = useToast()
  const [initialLoad, setInitialLoad] = useState(true)
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryPage, setCategoryPage] = useState(1)
  const [categoryTotalPages, setCategoryTotalPages] = useState(1)
  const [categoryListLoading, setCategoryListLoading] = useState(false)

  // Add state for editing and deleting categories
  const [editCategoryModalOpen, setEditCategoryModalOpen] = useState(false)
  const [editCategoryLoading, setEditCategoryLoading] = useState(false)
  const [editCategoryError, setEditCategoryError] = useState<string | null>(null)
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null)
  const [deleteCategoryModalOpen, setDeleteCategoryModalOpen] = useState(false)
  const [deleteCategoryLoading, setDeleteCategoryLoading] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

  // Model state
  const [models, setModels] = useState<Model[]>([])
  const [modelLoading, setModelLoading] = useState(false)
  const [modelListLoading, setModelListLoading] = useState(false)
  const [modelPage, setModelPage] = useState(1)
  const [modelTotalPages, setModelTotalPages] = useState(1)
  const [editModelModalOpen, setEditModelModalOpen] = useState(false)
  const [editModelLoading, setEditModelLoading] = useState(false)
  const [editModelError, setEditModelError] = useState<string | null>(null)
  const [modelToEdit, setModelToEdit] = useState<Model | null>(null)
  const [deleteModelModalOpen, setDeleteModelModalOpen] = useState(false)
  const [deleteModelLoading, setDeleteModelLoading] = useState(false)
  const [modelToDelete, setModelToDelete] = useState<Model | null>(null)

  // Counties state
  const [counties, setCounties] = useState<County[]>([])
  const [countyPage, setCountyPage] = useState(1)
  const [countyTotalPages, setCountyTotalPages] = useState(1)
  const [countyListLoading, setCountyListLoading] = useState(false)
  const [countyLoading, setCountyLoading] = useState(false)
  const [countyError, setCountyError] = useState<string | null>(null);

  const [editCountyModalOpen, setEditCountyModalOpen] = useState(false)
  const [deleteCountyModalOpen, setDeleteCountyModalOpen] = useState(false)
  const [deleteCountyLoading, setDeleteCountyLoading] = useState(false)
  const [countyToDelete, setCountyToDelete] = useState<County | null>(null)
  const [editCountyError, setEditCountyError] = useState<string | null>(null)
  const [editCountyLoading, setEditCountyLoading] = useState(false)
  const [countyToEdit, setCountyToEdit] = useState<County | null>(null)

  // 1. Add state for department loading and error
  const [departmentLoading, setDepartmentLoading] = useState(false);
  const [departmentError, setDepartmentError] = useState<string | null>(null);

  // Add state for deleting departments
  const [deleteDepartmentModalOpen, setDeleteDepartmentModalOpen] = useState(false);
  const [deleteDepartmentLoading, setDeleteDepartmentLoading] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);

  // Add state for editing departments
  const [editDepartmentModalOpen, setEditDepartmentModalOpen] = useState(false);
  const [editDepartmentLoading, setEditDepartmentLoading] = useState(false);
  const [editDepartmentError, setEditDepartmentError] = useState<string | null>(null);
  const [departmentToEdit, setDepartmentToEdit] = useState<Department | null>(null);

  // Add state for editing and deleting items
  const [editItemModalOpen, setEditItemModalOpen] = useState(false);
  const [editItemLoading, setEditItemLoading] = useState(false);
  const [editItemError, setEditItemError] = useState<string | null>(null);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  const [deleteItemModalOpen, setDeleteItemModalOpen] = useState(false);
  const [deleteItemLoading, setDeleteItemLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  // Add state for allocations
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [allocationsLoading, setAllocationsLoading] = useState(false);
  const [allocationListLoading, setAllocationListLoading] = useState(false);
  const [allocationError, setAllocationError] = useState<string | null>(null);

  // Fetch allocations from backend
  const fetchAndSetAllocations = async () => {
    setAllocationListLoading(true);
    setAllocationError(null);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      const data = await apiFetchAllocations(token || "");
      setAllocations(data.allocations || []);
      return data.allocations || [];
    } catch (err: any) {
      setAllocationError(err.message || "Failed to fetch allocations");
      toast({ title: "Network error", description: err.message || "Could not fetch allocations.", variant: "destructive" });
      return [];
    } finally {
      setAllocationListLoading(false);
    }
  };

  // Handle updating an allocation
  const handleUpdateAllocation = async (allocationId: number, allocationData: Omit<Allocation, "id">) => {
    setAllocationLoading(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      if (!token) throw new Error("No authentication token found");
      
      await apiUpdateAllocation(allocationId, {
        message: allocationData.Message,
        status: allocationData.status
      }, token);
      
      // Refresh the allocations list
      await fetchAndSetAllocations();
      toast({ title: "Success", description: "Allocation updated successfully", variant: "default" });
      return true;
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to update allocation", variant: "destructive" });
      return false;
    } finally {
      setAllocationLoading(false);
    }
  };

  // Handle deleting an allocation
  const deleteAllocation = async (id: number) => {
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      if (!token) throw new Error("No authentication token found");
      
      await apiDeleteAllocation(id, token);
      
      // Refresh the allocations list
      await fetchAndSetAllocations();
      toast({ title: "Success", description: "Allocation deleted successfully", variant: "default" });
      return true;
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to delete allocation", variant: "destructive" });
      return false;
    }
  };

  useEffect(() => {
    fetchAndSetAllocations();
  }, []);

  useEffect(() => {
    if (activePage !== "allocations") return;
    fetchAndSetAllocations();
    // eslint-disable-next-line
  }, [activePage]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      if (!token) return;
      const res = await fetch("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser({ name: data.name, isAdmin: data.isAdmin });
      }
    };
    fetchUser();
  }, []);

  // Handle initial page redirection for normal users
  useEffect(() => {
    if (initialLoad && user) {
      if (!user.isAdmin && activePage === 'dashboard') {
        setActivePage('allocations');
      }
      setInitialLoad(false);
    }
  }, [user, activePage, initialLoad]);

  // Add a function to fetch categories and update state
  const fetchAndSetCategories = async (page = categoryPage) => {
    setCategoryListLoading(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      const data = await apiFetchCategories(page, 10, token || undefined);
      setCategories(data.categories);
      setCategoryTotalPages(data.pagination.totalPages);
    } catch (err) {
      toast({ title: "Error", description: "Could not fetch categories.", variant: "destructive" });
    }
    setCategoryListLoading(false);
  };

  // Fetch categories on mount
  useEffect(() => {
    fetchAndSetCategories();
    // eslint-disable-next-line
  }, []);

  // Replace useEffect for fetching categories
  useEffect(() => {
    if (activePage !== "categories") return;
    fetchAndSetCategories();
    // eslint-disable-next-line
  }, [activePage, categoryPage]);

  // Fetch models
  const fetchAndSetModels = async (page = modelPage) => {
    setModelListLoading(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      const data = await apiFetchModels(page, 10, token || undefined);
      setModels(data.models);
      setModelTotalPages(data.pagination.totalPages);
    } catch (err) {
      toast({ title: "Error", description: "Could not fetch models.", variant: "destructive" });
    }
    setModelListLoading(false);
  };

  // Fetch models on mount
  useEffect(() => {
    fetchAndSetModels();
    // eslint-disable-next-line
  }, []);

  // Replace useEffect for fetching models
  useEffect(() => {
    if (activePage !== "models") return;
    fetchAndSetModels();
    // eslint-disable-next-line
  }, [activePage, modelPage]);

  // Fetch counties list
  const fetchAndSetCounties = async (page = countyPage) => {
    setCountyListLoading(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      const data = await apiFetchCounties(page, 10, token || undefined);
      setCounties(data.counties);
      setCountyTotalPages(data.pagination.totalPages);
    } catch (err) {
      toast({ title: "Error", description: "Could not fetch counties.", variant: "destructive" });
    }
    setCountyListLoading(false);
  };

  // Fetch counties on mount
  useEffect(() => {
    fetchAndSetCounties();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (activePage !== "counties") return;
    fetchAndSetCounties();
    // eslint-disable-next-line
  }, [activePage, countyPage]);

  // 3. Add fetchAndSetDepartments function
  const fetchAndSetDepartments = async (page = 1) => {
    setDepartmentLoading(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      const data = await apiFetchDepartments(page, 100, token || undefined);
      setDepartments(data.departments);
    } catch (err) {
      toast({ title: "Error", description: "Could not fetch departments.", variant: "destructive" });
    }
    setDepartmentLoading(false);
  };

  useEffect(() => {
    if (activePage !== "departments" && activePage !== "members") return;
    fetchAndSetDepartments();
    // eslint-disable-next-line
  }, [activePage]);

  // Filter data based on search
  const filteredItems = items.filter(
    (item) =>
      item.pname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialno.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  const memberSearchTimeout = useRef<NodeJS.Timeout | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);

  useEffect(() => {
    if (activePage !== "members") return;
    const fetchUsers = async (search?: string) => {
      setMembersLoading(true);
      setMembersError(null);
      try {
        const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
        if (!token) throw new Error("No token found");
        const users = await apiFetchAllUsers(token, search ?? memberSearchTerm);
        setMembers(users.map((u: any) => ({
          id: u.id,
          email: u.email || "-",
          phone: u.phone || "-",
          member_name: u.name,
          department: u.department || "-",
          office_location: u.county || "-",
        })));
      } catch (err: any) {
        setMembersError(err.message || "Failed to fetch users");
      }
      setMembersLoading(false);
    };
    if (memberSearchTimeout.current) clearTimeout(memberSearchTimeout.current);
    memberSearchTimeout.current = setTimeout(() => {
      fetchUsers(memberSearchTerm);
    }, 400);
    return () => {
      if (memberSearchTimeout.current) clearTimeout(memberSearchTimeout.current);
    };
  }, [activePage, memberSearchTerm]);

  const filteredAllocations = allocations.filter(
    (allocation) =>
      (allocation.Member_Name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (allocation.Item_Name?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
  )

  // Handle delete operations
  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      switch (deleteTarget.type) {
        case "item":
          await deleteItem(deleteTarget.id);
          break;
        case "member":
          await deleteMember(deleteTarget.id);
          break;
        case "allocation":
          await deleteAllocation(deleteTarget.id);
          // No need to refresh here since deleteAllocation already does it
          break;
        case "category":
          await deleteCategory(deleteTarget.id);
          break;
        case "county":
          await deleteCounty(deleteTarget.id);
          break;
        case "model":
          await deleteModel(deleteTarget.id);
          break;
        case "department":
          await deleteDepartment(deleteTarget.id);
          break;
      }

      toast({
        title: "Success",
        description: `${deleteTarget.type.charAt(0).toUpperCase() + deleteTarget.type.slice(1)} deleted successfully`,
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to delete ${deleteTarget.type}`,
        variant: "destructive"
      });
    } finally {
      setDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  }

  const openDeleteModal = (type: string, id: number, name: string) => {
    setDeleteTarget({ type, id, name })
    setDeleteModalOpen(true)
  }

  // Handle search operations
  const handleSearch = (type: string, term: string) => {
    setSearchTerm(term);
    // Add search logic here
  };

  // Handle search results for allocations
  const handleSearchResults = (results: any[]) => {
    setAllocations(results);
  };

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
        // Find the full allocation data including user and item details
        const fullAllocation = allocations.find((a: any) => a.id === item.id);
        if (fullAllocation) {
          setEditingAllocation(fullAllocation);
          // If the allocation has an item, set it for the modal
          if ('item' in fullAllocation) {
            setAllocationItem((fullAllocation as any).item);
          }
          setAllocationModalOpen(true);
        } else {
          toast({
            title: "Error",
            description: "Could not find allocation details",
            variant: "destructive"
          });
        }
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

  // Real category creation handler
  const handleCategorySave = async (category: Omit<Category, "id">) => {
    setCategoryLoading(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      const res = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ category_name: category.category_name }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast({ title: "Error", description: err.error || "Failed to add category", variant: "destructive" });
        setCategoryLoading(false);
        throw new Error(err.error || "Failed to add category");
      }
      toast({ title: "Category added!", description: `Category '${category.category_name}' created successfully.`, variant: "default" });
      setCategoryPage(1); // Go to first page to see new category
    } catch (err: any) {
      toast({ title: "Network error", description: "Could not add category.", variant: "destructive" });
      throw err;
    }
    setCategoryLoading(false);
  };

  // Edit logic
  const handleEditCategory = (category: Category) => {
    setCategoryToEdit(category);
    setEditCategoryError(null);
    setEditCategoryModalOpen(true);
  };
  const handleUpdateCategory = async (id: number, data: Omit<Category, "id">) => {
    setEditCategoryLoading(true);
    setEditCategoryError(null);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      await apiUpdateCategory(id, data.category_name, token);
      toast({ title: "Category updated!", description: `Category updated successfully.`, variant: "default" });
      setEditCategoryModalOpen(false);
      setCategoryToEdit(null);
      await fetchAndSetCategories();
    } catch (err: any) {
      setEditCategoryError(err.message || "Failed to update category");
      toast({ title: "Update failed", description: err.message || "Failed to update category", variant: "destructive" });
    }
    setEditCategoryLoading(false);
  };

  // Delete logic
  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteCategoryModalOpen(true);
  };
  const handleConfirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setDeleteCategoryLoading(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      await apiDeleteCategory(categoryToDelete.id, token);
      toast({ title: "Category deleted!", description: `Category deleted successfully.`, variant: "default" });
      setDeleteCategoryModalOpen(false);
      setCategoryToDelete(null);
      await fetchAndSetCategories();
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message || "Failed to delete category", variant: "destructive" });
    }
    setDeleteCategoryLoading(false);
  };

  // Real model creation handler
  const handleModelSave = async (model: Omit<Model, "id">) => {
    setModelLoading(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      await apiCreateModel(model.model_name, token);
      toast({ title: "Model added!", description: `Model '${model.model_name}' created successfully.`, variant: "default" });
      setModelPage(1);
      setModelModalOpen(false);
      await fetchAndSetModels(1);
    } catch (err: any) {
      toast({ title: "Network error", description: err.message || "Could not add model.", variant: "destructive" });
    }
    setModelLoading(false);
  };

  // Edit logic
  const handleEditModel = (model: Model) => {
    setModelToEdit(model);
    setEditModelError(null);
    setEditModelModalOpen(true);
  };
  const handleUpdateModel = async (id: number, data: Omit<Model, "id">) => {
    setEditModelLoading(true);
    setEditModelError(null);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      await apiUpdateModel(id, data.model_name, token);
      toast({ title: "Model updated!", description: `Model updated successfully.`, variant: "default" });
      setEditModelModalOpen(false);
      setModelToEdit(null);
      await fetchAndSetModels();
    } catch (err: any) {
      setEditModelError(err.message || "Failed to update model");
      toast({ title: "Update failed", description: err.message || "Failed to update model", variant: "destructive" });
    }
    setEditModelLoading(false);
  };

  // Delete logic
  const handleDeleteModel = (model: Model) => {
    setModelToDelete(model);
    setDeleteModelModalOpen(true);
  };
  const handleConfirmDeleteModel = async () => {
    if (!modelToDelete) return;
    setDeleteModelLoading(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      await apiDeleteModel(modelToDelete.id, token);
      toast({ title: "Model deleted!", description: `Model deleted successfully.`, variant: "default" });
      setDeleteModelModalOpen(false);
      setModelToDelete(null);
      await fetchAndSetModels();
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message || "Failed to delete model", variant: "destructive" });
    }
    setDeleteModelLoading(false);
  };

  // County creation handler
  const handleCountySave = async (county: Omit<County, "id">) => {
    setCountyLoading(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      await apiCreateCounty(county.county_name, county.county_number, token || undefined);
      toast({ title: "County added!", description: `County '${county.county_name}' created successfully.`, variant: "default" });
      setCountyPage(1); // Go to first page to see new county
      await fetchAndSetCounties(1);
    } catch (err: any) {
      toast({ title: "Network error", description: err.message || "Could not add county.", variant: "destructive" });
      setCountyError(err.message || 'Failed to add county');
      throw err;
    }
    setCountyLoading(false);
  };

  // Edit logic
  const handleEditCounty = (county: County) => {
    setCountyToEdit(county);
    setEditCountyError(null);
    setEditCountyModalOpen(true);
  };
  const handleUpdateCounty = async (id: number, data: Omit<County, "id">) => {
    setEditCountyLoading(true);
    setEditCountyError(null);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      await apiUpdateCounty(id, data.county_name, data.county_number, token || undefined);
      toast({ title: "County updated!", description: `County updated successfully.`, variant: "default" });
      setEditCountyModalOpen(false);
      setCountyToEdit(null);
      await fetchAndSetCounties();
    } catch (err: any) {
      setEditCountyError(err.message || "Failed to update county");
      toast({ title: "Update failed", description: err.message || "Failed to update county", variant: "destructive" });
    }
    setEditCountyLoading(false);
  };

  // Delete logic
  const handleDeleteCounty = (county: County) => {
    setCountyToDelete(county);
    setDeleteCountyModalOpen(true);
  };
  const handleConfirmDeleteCounty = async () => {
    if (!countyToDelete) return;
    setDeleteCountyLoading(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      await apiDeleteCounty(countyToDelete.id, token || undefined);
      toast({ title: "County deleted!", description: `County deleted successfully.`, variant: "default" });
      setDeleteCountyModalOpen(false);
      setCountyToDelete(null);
      await fetchAndSetCounties();
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message || "Failed to delete county", variant: "destructive" });
    }
    setDeleteCountyLoading(false);
  };

  // 2. Add handler for creating a department
  const handleDepartmentSave = async (department: Omit<Department, "id">) => {
    setDepartmentLoading(true);
    setDepartmentError(null);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      await apiCreateDepartment(Number(department.Dep_ID), department.Dep_name, token || undefined);
      toast({ title: "Department added!", description: `Department '${department.Dep_name}' created successfully.`, variant: "default" });
      setDepartmentModalOpen(false);
      setEditingDepartment(undefined);
      await fetchAndSetDepartments();
    } catch (err: any) {
      setDepartmentError(err.message || 'Failed to add department');
      toast({ title: "Network error", description: err.message || "Could not add department.", variant: "destructive" });
      throw err;
    }
    setDepartmentLoading(false);
  };

  // Edit logic
  const handleEditDepartment = (department: Department) => {
    setDepartmentToEdit(department);
    setEditDepartmentModalOpen(true);
  };
  const handleUpdateDepartment = async (id: number, data: Omit<Department, "id">) => {
    setEditDepartmentLoading(true);
    setEditDepartmentError(null);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      await apiUpdateDepartment(id, data.Dep_name, token || undefined);
      toast({ title: "Department updated!", description: `Department updated successfully.`, variant: "default" });
      setEditDepartmentModalOpen(false);
      setDepartmentToEdit(null);
      await fetchAndSetDepartments();
    } catch (err: any) {
      setEditDepartmentError(err.message || "Failed to update department");
      toast({ title: "Update failed", description: err.message || "Failed to update department", variant: "destructive" });
    }
    setEditDepartmentLoading(false);
  };

  // Delete logic
  const handleDeleteDepartment = (department: Department) => {
    setDepartmentToDelete(department);
    setDeleteDepartmentModalOpen(true);
  };
  const handleConfirmDeleteDepartment = async () => {
    if (!departmentToDelete) return;
    setDeleteDepartmentLoading(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      await apiDeleteDepartment(departmentToDelete.id, token || undefined);
      toast({ title: "Department deleted!", description: `Department deleted successfully.`, variant: "default" });
      setDeleteDepartmentModalOpen(false);
      setDepartmentToDelete(null);
      await fetchAndSetDepartments();
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message || "Failed to delete department", variant: "destructive" });
    }
    setDeleteDepartmentLoading(false);
  };

  // Fetch items from backend
  const fetchAndSetItems = async (search?: string) => {
    setItemListLoading(true);
    setItemError(null);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      const data = await apiFetchItems(token || "", 1, 10, search ?? searchTerm);
      setItems(data.items || []);
    } catch (err: any) {
      setItemError(err.message || "Failed to fetch items");
      toast({ title: "Network error", description: err.message || "Could not fetch items.", variant: "destructive" });
    }
    setItemListLoading(false);
  };

  useEffect(() => {
    fetchAndSetItems();
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchAndSetItems(searchTerm);
    }, 400);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchTerm]);

  // Create item
  const handleItemSave = async (item: Omit<Item, "id">) => {
    setItemLoading(true);
    setItemError(null);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      await apiCreateItem(item, token || "");
      toast({ title: "Item added!", description: `Item '${item.pname}' created successfully.`, variant: "default" });
      setItemModalOpen(false);
      setEditingItem(undefined);
      await fetchAndSetItems();
    } catch (err: any) {
      setItemError(err.message || 'Failed to add item');
      toast({ title: "Network error", description: err.message || "Could not add item.", variant: "destructive" });
      throw err;
    }
    setItemLoading(false);
  };

  // Edit logic
  const handleEditItem = (item: Item) => {
    setItemToEdit(item);
    setEditItemModalOpen(true);
  };
  const handleUpdateItem = async (id: number, data: Omit<Item, "id">) => {
    setEditItemLoading(true);
    setEditItemError(null);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      await apiUpdateItem(id, data, token || "");
      toast({ title: "Item updated!", description: `Item updated successfully.`, variant: "default" });
      setEditItemModalOpen(false);
      setItemToEdit(null);
      await fetchAndSetItems();
    } catch (err: any) {
      setEditItemError(err.message || "Failed to update item");
      toast({ title: "Update failed", description: err.message || "Failed to update item", variant: "destructive" });
    }
    setEditItemLoading(false);
  };
  // Delete logic
  const handleDeleteItem = (item: Item) => {
    setItemToDelete(item);
    setDeleteItemModalOpen(true);
  };
  const handleConfirmDeleteItem = async () => {
    if (!itemToDelete) return;
    setDeleteItemLoading(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      await apiDeleteItem(itemToDelete.id, token || "");
      toast({ title: "Item deleted!", description: `Item deleted successfully.`, variant: "default" });
      setDeleteItemModalOpen(false);
      setItemToDelete(null);
      await fetchAndSetItems();
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message || "Failed to delete item", variant: "destructive" });
    }
    setDeleteItemLoading(false);
  };

  const openDetailModal = async (item: Item) => {
    setDetailModalOpen(true);
    setDetailItem(null);
    setDetailItemLoading(true);
    setDetailItemError(null);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      const data = await apiFetchItemById(item.id, token || "");
      setDetailItem(data);
    } catch (err: any) {
      setDetailItemError(err.message || "Failed to fetch item details");
    }
    setDetailItemLoading(false);
  };

  // Allocation modal state
  const [allocationItem, setAllocationItem] = useState<Item | null>(null);
  const [allocationUsers, setAllocationUsers] = useState<Member[]>([]);
  const [allocationLoading, setAllocationLoading] = useState(false);

  // Open allocation modal for a specific item
  const handleOpenAllocate = async (item: Item) => {
    setAllocationItem(item);
    setAllocationModalOpen(true);
    setAllocationLoading(true);
    
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      if (!token) throw new Error("No token found");
      
      // If user is not admin, use current user's info directly
      if (!user?.isAdmin && user) {
        setAllocationUsers([{
          id: user.id,
          email: "",
          member_name: user.name,
          department: "",
          office_location: "",
          county: ""
        }]);
      } else {
        // For admins, fetch all users
        const users = await apiFetchAllUsers(token);
        setAllocationUsers(users.map((u: any) => ({
          id: u.id,
          email: u.email || "-",
          member_name: u.name,
          department: u.department || "-",
          office_location: u.county || "-",
          county: u.county || "-",
        })));
      }
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err.message || "Failed to fetch user information", 
        variant: "destructive" 
      });
      setAllocationUsers([]);
    } finally {
      setAllocationLoading(false);
    }
  };

  // Handle allocation creation - single source of truth
  const handleCreateAllocation = async (formData: any) => {
    setAllocationLoading(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      if (!token) throw new Error("No authentication token found");
      
      await apiCreateAllocation({
        userId: formData.userId,
        itemId: formData.itemId,
        message: formData.Message || ""
      }, token);
      
      // Refresh the allocations list
      await fetchAndSetAllocations();
      
      // Close modal and reset state
      setAllocationModalOpen(false);
      setAllocationItem(null);
      setActivePage("allocations");
      
      toast({ 
        title: "Success", 
        description: "Allocation created successfully!", 
        variant: "default" 
      });
      
      return true;
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err.message || "Failed to create allocation", 
        variant: "destructive" 
      });
      return false;
    } finally {
      setAllocationLoading(false);
    }
  };

  // Add state for allocation detail modal
  const [allocationDetailModalOpen, setAllocationDetailModalOpen] = useState(false);
  const [allocationDetailId, setAllocationDetailId] = useState<number | null>(null);

  const handleOpenAllocationDetail = (id: number) => {
    setAllocationDetailId(id);
    setAllocationDetailModalOpen(true);
  };
  const handleCloseAllocationDetail = () => {
    setAllocationDetailModalOpen(false);
    setAllocationDetailId(null);
  };

  const handleConfirmDeleteAllocation = async () => {
    if (!allocationDetailId) return;
    setDeleteAllocationLoading(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      await apiDeleteAllocation(allocationDetailId, token || "");
      toast({ title: "Allocation deleted!", description: `Allocation deleted successfully.`, variant: "default" });
      setAllocationDetailModalOpen(false);
      setAllocationDetailId(null);
      await fetchAndSetAllocations();
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message || "Failed to delete allocation", variant: "destructive" });
    }
    setDeleteAllocationLoading(false);
  };

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <DashboardSection
            items={items}
            members={members}
            allocations={allocations}
            categories={categories}
            counties={counties}
            models={models}
            departments={departments}
            handleAdd={handleAdd}
            handleOpenAllocationDetail={handleOpenAllocationDetail}
          />
        )
      case "items":
        return (
          <div>
            <div className="flex items-center mb-4 gap-2">
              <Input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full max-w-xs border border-red-200 focus:ring-2 focus:ring-red-200 rounded-lg shadow-sm"
              />
            </div>
            <div className="space-y-4">
              <ItemsSection
                items={items}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(newPage: number) => {
                  if (newPage >= 1 && newPage <= totalPages) {
                    fetchItems(newPage, searchTerm);
                  }
                }}
                setEditingItem={setEditingItem}
                setItemModalOpen={setItemModalOpen}
                handleEdit={handleEditItem}
                openDeleteModal={(item) => {
                  setItemToDelete(item);
                  setDeleteItemModalOpen(true);
                }}
                openDetailModal={(item) => {
                  setDetailItem(item);
                  setDetailModalOpen(true);
                }}
                onAllocate={handleOpenAllocate}
                isAdmin={user?.isAdmin || false}
              />
              {itemListLoading && (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              )}
            </div>
          </div>
        )
      case "members":
        return (
          <div>
            <div className="flex items-center mb-4 gap-2">
              <Input
                type="text"
                placeholder="Search members..."
                value={memberSearchTerm}
                onChange={e => setMemberSearchTerm(e.target.value)}
                className="w-full max-w-xs border border-red-200 focus:ring-2 focus:ring-red-200 rounded-lg shadow-sm"
              />
            </div>
            <MembersSection
              members={members}
              setEditingMember={setEditingMember}
              setMemberModalOpen={setMemberModalOpen}
              handleEdit={handleEdit}
              openDeleteModal={openDeleteModal}
              loading={membersLoading}
              departments={departments}
              counties={counties}
              refreshMembers={() => {
                // Re-fetch users for the list
                const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
                if (!token) return;
                apiFetchAllUsers(token).then(users => {
                  setMembers(users.map((u: any) => ({
                    id: u.id,
                    email: u.email,
                    phone: u.phone,
                    member_name: u.name,
                    department: u.department || "-",
                    office_location: u.county || "-",
                  })));
                });
              }}
            />
          </div>
        )
      case "allocations":
        return (
          <AllocationsSection
            allocations={allocations}
            setEditingAllocation={setEditingAllocation}
            setAllocationModalOpen={setAllocationModalOpen}
            handleEdit={handleEdit}
            openDeleteModal={openDeleteModal}
            openDetailModal={(allocation) => {
              // Pass only the allocation ID to the handler
              handleOpenAllocationDetail(allocation.id);
            }}
            loading={allocationsLoading}
            onSearchResults={handleSearchResults}
            isAdmin={user?.isAdmin || false}
          />
        );
      
      case "return-requests":
        return <ReturnRequestsSection isAdmin={user?.isAdmin || false} />;
      case "repair-requests":
        return <RepairRequestsSection isAdmin={user?.isAdmin || false} />;
      case "categories":
        return (
          <CategoriesSection
            categories={categories}
            categoryTotalPages={categoryTotalPages}
            categoryPage={categoryPage}
            setCategoryPage={setCategoryPage}
            setEditingCategory={setEditingCategory}
            setCategoryModalOpen={setCategoryModalOpen}
            handleEditCategory={handleEditCategory}
            handleDeleteCategory={handleDeleteCategory}
          />
        )
      case "counties":
        return (
          <CountiesSection
            counties={counties}
            setEditingCounty={setEditingCounty}
            setCountyModalOpen={setCountyModalOpen}
            handleEdit={handleEditCounty}
            openDeleteModal={handleDeleteCounty}
          />
        )
      case "models":
        return (
          <ModelsSection
            models={models}
            modelLoading={modelLoading}
            modelListLoading={modelListLoading}
            modelPage={modelPage}
            modelTotalPages={modelTotalPages}
            setModelPage={setModelPage}
            setEditingModel={setEditingModel}
            setModelModalOpen={setModelModalOpen}
            handleEditModel={handleEditModel}
            handleDeleteModel={handleDeleteModel}
          />
        )
      case "departments":
        return (
          <DepartmentsSection
            departments={departments}
            setEditingDepartment={setEditingDepartment}
            setDepartmentModalOpen={setDepartmentModalOpen}
            handleEdit={handleEditDepartment}
            openDeleteModal={handleDeleteDepartment}
          />
        )
      default:
        return (
          <DashboardSection
            items={items}
            members={members}
            allocations={allocations}
            categories={categories}
            counties={counties}
            handleAdd={handleAdd}
          />
        )
    }
  }

  return (
    <div className="flex h-screen bg-[#fffcfc] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 bg-[#292929] text-white flex-col">
        <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={onLogout} isAdmin={user?.isAdmin || false} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 bg-[#292929] text-white p-0 border-r-0">
          <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={onLogout} isAdmin={user?.isAdmin || false} />
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
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#1c1b1f] text-sm lg:text-base">
                    {user ? user.name : <span className="animate-pulse bg-gray-200 rounded w-20 h-4 inline-block" />}
                  </span>
                  <Link href="/profile" className="ml-2 px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 transition">
                    Profile
                  </Link>
                </div>
                <p className="text-xs lg:text-sm text-red-200">{user && user.isAdmin ? "Admin Portal" : "User Portal"}</p>
                
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
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
            {activePage === "dashboard" ? (
              <DashboardSection
                items={items}
                members={members}
                allocations={allocations}
                categories={categories}
                counties={counties}
                models={models}
                departments={departments}
                handleAdd={handleAdd}
                handleOpenAllocationDetail={handleOpenAllocationDetail}
              />
            ) : (
              renderContent()
            )}
          </div>

          {/* Desktop Right Sidebar */}
          <div className="hidden xl:flex w-80 bg-[#292929] text-white">
            <RightSidebar 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              allocations={allocations} 
              handleAdd={handleAdd}
              setActivePage={setActivePage}
              isAdmin={user?.isAdmin || false}
            />
          </div>

          {/* Mobile Right Sidebar */}
          <Sheet open={rightSidebarOpen} onOpenChange={setRightSidebarOpen}>
            <SheetContent side="right" className="w-80 bg-[#292929] text-white p-0 border-l-0">
              <RightSidebar 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                allocations={allocations} 
                handleAdd={handleAdd}
                setActivePage={setActivePage}
                isAdmin={user?.isAdmin || false}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* All Modals */}
      <ItemModal
        isOpen={itemModalOpen}
        onClose={() => setItemModalOpen(false)}
        onSave={handleItemSave}
        // TODO: Implement item update logic and pass onUpdate here
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
        departments={departments}kk
        counties={counties}
      />

      <AllocationModal
        isOpen={allocationModalOpen}
        onClose={() => { setAllocationModalOpen(false); setAllocationItem(null); }}
        onSave={handleCreateAllocation}
        onUpdate={handleUpdateAllocation}
        allocation={editingAllocation}
        members={allocationUsers}
        items={allocationItem ? [allocationItem] : []}
        loading={allocationLoading}
      />

      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSave={activePage === "categories" ? handleCategorySave : addCategory}
        category={editingCategory}
        loading={activePage === "categories" ? categoryLoading : undefined}
      />

<ModelModal
  isOpen={modelModalOpen}
  onClose={() => setModelModalOpen(false)}
  onSave={handleModelSave}
  onUpdate={handleUpdateModel}
  model={editingModel}
/>

      <CountyModal
        isOpen={countyModalOpen}
        onClose={() => setCountyModalOpen(false)}
        onSave={handleCountySave}
        county={editingCounty}
        loading={countyLoading}
        error={countyError || undefined}
      />

      <CountyModal
        isOpen={editCountyModalOpen}
        onClose={() => { setEditCountyModalOpen(false); setCountyToEdit(null); }}
        onSave={async (data) => {
          if (countyToEdit) {
            console.log('Update County clicked', countyToEdit.id, data);
            await handleUpdateCounty(countyToEdit.id, data);
          }
        }}
        county={countyToEdit || undefined}
        loading={editCountyLoading}
        error={editCountyError || undefined}
      />

      <AlertDialog open={deleteCategoryModalOpen} onOpenChange={setDeleteCategoryModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the category "{categoryToDelete?.category_name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteCategoryLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleConfirmDeleteCategory}
              disabled={deleteCategoryLoading}
            >
              {deleteCategoryLoading ? <span className="flex items-center"><span className="animate-spin mr-2 w-4 h-4 border-2 border-gray-200 border-t-white rounded-full"></span>Deleting...</span> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ModelEditModal
        isOpen={editModelModalOpen}
        onClose={() => { setEditModelModalOpen(false); setModelToEdit(null); }}
        onSave={async (data, id) => {
          if (modelToEdit && id) {
            await handleUpdateModel(id, data);
          }
        }}
        model={modelToEdit || undefined}
        loading={editModelLoading}
        error={editModelError || undefined}
      />

      <ModelDeleteModal
        isOpen={deleteModelModalOpen}
        onClose={() => setDeleteModelModalOpen(false)}
        onConfirm={handleConfirmDeleteModel}
        title={modelToDelete?.model_name || ""}
        description="This action cannot be undone."
        loading={deleteModelLoading}
      />

      <AlertDialog open={deleteCountyModalOpen} onOpenChange={setDeleteCountyModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete County</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the county "{countyToDelete?.county_name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteCountyLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleConfirmDeleteCounty}
              disabled={deleteCountyLoading}
            >
              {deleteCountyLoading ? <span className="flex items-center"><span className="animate-spin mr-2 w-4 h-4 border-2 border-gray-200 border-t-white rounded-full"></span>Deleting...</span> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DepartmentModal
        isOpen={departmentModalOpen}
        onClose={() => setDepartmentModalOpen(false)}
        onSave={handleDepartmentSave}
        department={editingDepartment}
        loading={departmentLoading}
        error={departmentError || undefined}
      />

      <DepartmentModal
        isOpen={editDepartmentModalOpen}
        onClose={() => { setEditDepartmentModalOpen(false); setDepartmentToEdit(null); }}
        onUpdate={async (id, data) => {
          await handleUpdateDepartment(id, data);
        }}
        department={departmentToEdit || undefined}
        loading={editDepartmentLoading}
        error={editDepartmentError || undefined}
      />

      <AlertDialog open={deleteDepartmentModalOpen} onOpenChange={setDeleteDepartmentModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Department</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the department "{departmentToDelete?.Dep_name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteDepartmentLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleConfirmDeleteDepartment}
              disabled={deleteDepartmentLoading}
            >
              {deleteDepartmentLoading ? <span className="flex items-center"><span className="animate-spin mr-2 w-4 h-4 border-2 border-gray-200 border-t-white rounded-full"></span>Deleting...</span> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ItemModal
        isOpen={editItemModalOpen}
        onClose={() => { setEditItemModalOpen(false); setItemToEdit(null); }}
        onUpdate={async (id, data) => {
          await handleUpdateItem(id, data);
        }}
        item={itemToEdit || undefined}
        categories={categories}
        counties={counties}
        models={models}
        loading={editItemLoading}
        error={editItemError || undefined}
      />

      <AlertDialog open={deleteItemModalOpen} onOpenChange={setDeleteItemModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the item "{itemToDelete?.pname}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteItemLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleConfirmDeleteItem}
              disabled={deleteItemLoading}
            >
              {deleteItemLoading ? <span className="flex items-center"><span className="animate-spin mr-2 w-4 h-4 border-2 border-gray-200 border-t-white rounded-full"></span>Deleting...</span> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Render ItemDetailModal (inline for now) */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Item Details</DialogTitle>
          </DialogHeader>
          {detailItemLoading ? (
            <div className="py-8 text-center">Loading...</div>
          ) : detailItemError ? (
            <div className="py-8 text-center text-red-500">{detailItemError}</div>
          ) : detailItem ? (
            <div className="space-y-2">
              <div><strong>Name:</strong> {detailItem.pname}</div>
              <div><strong>Serial No:</strong> {detailItem.serialno}</div>
              <div><strong>Model:</strong> {detailItem.model}</div>
              <div><strong>Category:</strong> {detailItem.category}</div>
              <div><strong>County:</strong> {detailItem.county}</div>
              <div><strong>ID:</strong> {detailItem.id}</div>
              {/* Add more fields here if available from backend */}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Allocation Detail Modal implementation */}
      <AllocationDetailModal
        isOpen={allocationDetailModalOpen}
        allocationId={allocationDetailId}
        onClose={handleCloseAllocationDetail}
        onDeleted={fetchAndSetAllocations}
      />
      <Toaster />
    </div>
  )
}
