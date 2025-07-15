import type { Item, Category, County, Member, Model, Department, Allocation } from "../types/inventory"

// Fake data matching backend structure
export const fakeCategories: Category[] = [
  { id: 1, category_name: "Electronics", status: 1 },
  { id: 2, category_name: "Furniture", status: 1 },
  { id: 3, category_name: "Vehicles", status: 1 },
  { id: 4, category_name: "Office Equipment", status: 1 },
  { id: 5, category_name: "IT Equipment", status: 1 },
]

export const fakeCounties: County[] = [
  { id: 1, county_name: "Nairobi", county_number: 47 },
  { id: 2, county_name: "Mombasa", county_number: 1 },
  { id: 3, county_name: "Kisumu", county_number: 42 },
  { id: 4, county_name: "Nakuru", county_number: 32 },
  { id: 5, county_name: "Eldoret", county_number: 27 },
]

export const fakeModels: Model[] = [
  { id: 1, model_name: "HP EliteBook", status: 1 },
  { id: 2, model_name: "Dell Latitude", status: 1 },
  { id: 3, model_name: "Toyota Hilux", status: 1 },
  { id: 4, model_name: "Canon Printer", status: 1 },
  { id: 5, model_name: "Samsung Monitor", status: 1 },
]

export const fakeDepartments: Department[] = [
  { id: 1, Dep_ID: "IT001", Dep_name: "Information Technology" },
  { id: 2, Dep_ID: "HR002", Dep_name: "Human Resources" },
  { id: 3, Dep_ID: "FIN003", Dep_name: "Finance" },
  { id: 4, Dep_ID: "OPS004", Dep_name: "Operations" },
  { id: 5, Dep_ID: "ADM005", Dep_name: "Administration" },
]

export const fakeMembers: Member[] = [
  {
    id: 1,
    payroll_no: "EMP001",
    member_name: "John Doe",
    department: "Information Technology",
    county: "Nairobi",
  },
  {
    id: 2,
    payroll_no: "EMP002",
    member_name: "Jane Smith",
    department: "Human Resources",
    county: "Mombasa",
  },
  {
    id: 3,
    payroll_no: "EMP003",
    member_name: "Mike Johnson",
    department: "Finance",
    county: "Kisumu",
  },
  {
    id: 4,
    payroll_no: "EMP004",
    member_name: "Sarah Wilson",
    department: "Operations",
    county: "Nakuru",
  },
  {
    id: 5,
    payroll_no: "EMP005",
    member_name: "David Brown",
    department: "Administration",
    county: "Eldoret",
  },
]

export const fakeItems: Item[] = [
  {
    id: 1,
    pname: "Laptop Computer",
    serialno: "LP001234",
    model: "HP EliteBook",
    category: "Electronics",
    county: "Nairobi",
  },
  {
    id: 2,
    pname: "Office Desk",
    serialno: "FU005678",
    model: "Executive Desk",
    category: "Furniture",
    county: "Mombasa",
  },
  { id: 3, pname: "Pickup Truck", serialno: "VH009876", model: "Toyota Hilux", category: "Vehicles", county: "Kisumu" },
  {
    id: 4,
    pname: "Laser Printer",
    serialno: "PR004321",
    model: "Canon Printer",
    category: "Office Equipment",
    county: "Nakuru",
  },
  {
    id: 5,
    pname: "Desktop Computer",
    serialno: "PC007890",
    model: "Dell Latitude",
    category: "IT Equipment",
    county: "Eldoret",
  },
  {
    id: 6,
    pname: "Conference Table",
    serialno: "FU001122",
    model: "Round Table",
    category: "Furniture",
    county: "Nairobi",
  },
  { id: 7, pname: "Projector", serialno: "EL003344", model: "Epson Pro", category: "Electronics", county: "Mombasa" },
]

export const fakeAllocations: Allocation[] = [
  {
    id: 1,
    ID_PF_No: "EMP001",
    Member_Name: "John Doe",
    Department: "Information Technology",
    County: "Nairobi",
    Item_Serial_No: "LP001234",
    Category: "Electronics",
    Model: "HP EliteBook",
    Item_Name: "Laptop Computer",
    Date_Allocated: "2024-01-15",
    Message: "Allocated for development work",
  },
  {
    id: 2,
    ID_PF_No: "EMP002",
    Member_Name: "Jane Smith",
    Department: "Human Resources",
    County: "Mombasa",
    Item_Serial_No: "FU005678",
    Category: "Furniture",
    Model: "Executive Desk",
    Item_Name: "Office Desk",
    Date_Allocated: "2024-01-20",
    Message: "Office setup for new employee",
  },
  {
    id: 3,
    ID_PF_No: "EMP003",
    Member_Name: "Mike Johnson",
    Department: "Finance",
    County: "Kisumu",
    Item_Serial_No: "VH009876",
    Category: "Vehicles",
    Model: "Toyota Hilux",
    Item_Name: "Pickup Truck",
    Date_Allocated: "2024-02-01",
    Message: "Field work transportation",
  },
]

// Dashboard metrics based on inventory data
export const getInventoryMetrics = () => {
  return {
    totalItems: fakeItems.length,
    totalMembers: fakeMembers.length,
    totalAllocations: fakeAllocations.length,
    totalCategories: fakeCategories.length,
    itemsByCategory: fakeCategories.map((cat) => ({
      category: cat.category_name,
      count: fakeItems.filter((item) => item.category === cat.category_name).length,
    })),
    itemsByCounty: fakeCounties.map((county) => ({
      county: county.county_name,
      count: fakeItems.filter((item) => item.county === county.county_name).length,
    })),
    recentAllocations: fakeAllocations.slice(-5).reverse(),
  }
}
