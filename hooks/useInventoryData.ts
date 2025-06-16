"use client"

import { useState } from "react"
import type { Item, Category, County, Member, Model, Department, Allocation } from "../types/inventory"
import {
  fakeItems,
  fakeCategories,
  fakeCounties,
  fakeMembers,
  fakeModels,
  fakeDepartments,
  fakeAllocations,
} from "../data/fake-data"

export function useInventoryData() {
  const [items, setItems] = useState<Item[]>(fakeItems)
  const [categories, setCategories] = useState<Category[]>(fakeCategories)
  const [counties, setCounties] = useState<County[]>(fakeCounties)
  const [members, setMembers] = useState<Member[]>(fakeMembers)
  const [models, setModels] = useState<Model[]>(fakeModels)
  const [departments, setDepartments] = useState<Department[]>(fakeDepartments)
  const [allocations, setAllocations] = useState<Allocation[]>(fakeAllocations)

  // Items CRUD
  const addItem = (item: Omit<Item, "id">) => {
    const newItem = { ...item, id: Math.max(...items.map((i) => i.id)) + 1 }
    setItems([...items, newItem])
  }

  const updateItem = (id: number, item: Omit<Item, "id">) => {
    setItems(items.map((i) => (i.id === id ? { ...item, id } : i)))
  }

  const deleteItem = (id: number) => {
    setItems(items.filter((i) => i.id !== id))
  }

  // Categories CRUD
  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory = { ...category, id: Math.max(...categories.map((c) => c.id)) + 1 }
    setCategories([...categories, newCategory])
  }

  const updateCategory = (id: number, category: Omit<Category, "id">) => {
    setCategories(categories.map((c) => (c.id === id ? { ...category, id } : c)))
  }

  const deleteCategory = (id: number) => {
    setCategories(categories.filter((c) => c.id !== id))
  }

  // Counties CRUD
  const addCounty = (county: Omit<County, "id">) => {
    const newCounty = { ...county, id: Math.max(...counties.map((c) => c.id)) + 1 }
    setCounties([...counties, newCounty])
  }

  const updateCounty = (id: number, county: Omit<County, "id">) => {
    setCounties(counties.map((c) => (c.id === id ? { ...county, id } : c)))
  }

  const deleteCounty = (id: number) => {
    setCounties(counties.filter((c) => c.id !== id))
  }

  // Members CRUD
  const addMember = (member: Omit<Member, "id">) => {
    const newMember = { ...member, id: Math.max(...members.map((m) => m.id)) + 1 }
    setMembers([...members, newMember])
  }

  const updateMember = (id: number, member: Omit<Member, "id">) => {
    setMembers(members.map((m) => (m.id === id ? { ...member, id } : m)))
  }

  const deleteMember = (id: number) => {
    setMembers(members.filter((m) => m.id !== id))
  }

  // Models CRUD
  const addModel = (model: Omit<Model, "id">) => {
    const newModel = { ...model, id: Math.max(...models.map((m) => m.id)) + 1 }
    setModels([...models, newModel])
  }

  const updateModel = (id: number, model: Omit<Model, "id">) => {
    setModels(models.map((m) => (m.id === id ? { ...model, id } : m)))
  }

  const deleteModel = (id: number) => {
    setModels(models.filter((m) => m.id !== id))
  }

  // Departments CRUD
  const addDepartment = (department: Omit<Department, "id">) => {
    const newDepartment = { ...department, id: Math.max(...departments.map((d) => d.id)) + 1 }
    setDepartments([...departments, newDepartment])
  }

  const updateDepartment = (id: number, department: Omit<Department, "id">) => {
    setDepartments(departments.map((d) => (d.id === id ? { ...department, id } : d)))
  }

  const deleteDepartment = (id: number) => {
    setDepartments(departments.filter((d) => d.id !== id))
  }

  // Allocations CRUD
  const addAllocation = (allocation: Omit<Allocation, "id">) => {
    const newAllocation = { ...allocation, id: Math.max(...allocations.map((a) => a.id)) + 1 }
    setAllocations([...allocations, newAllocation])
  }

  const updateAllocation = (id: number, allocation: Omit<Allocation, "id">) => {
    setAllocations(allocations.map((a) => (a.id === id ? { ...allocation, id } : a)))
  }

  const deleteAllocation = (id: number) => {
    setAllocations(allocations.filter((a) => a.id !== id))
  }

  return {
    // Data
    items,
    categories,
    counties,
    members,
    models,
    departments,
    allocations,
    // CRUD operations
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
  }
}
