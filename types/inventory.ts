// Backend-aligned data types
export interface Item {
  id: number
  pname: string // Item name
  serialno: string // Serial number
  model: string
  category: string
  county: string
}

export interface Category {
  id: number
  category_name: string
  status: number // tinyint(1)
}

export interface County {
  id: number
  county_name: string
  county_number: number
}

export interface Member {
  id: number
  payroll_no: string
  member_name: string
  department: string
  county?: string // Added for allocation compatibility
}

export interface Model {
  id: number
  model_name: string
  status: number // tinyint(1)
}

export interface Department {
  id: number
  Dep_ID: string
  Dep_name: string
}

export interface Allocation {
  id: number
  ID_PF_No: string // Member Payroll/ID Number
  Member_Name: string
  Department: string
  County: string
  Item_Serial_No: string
  Category: string
  Model: string
  Item_Name: string
  Date_Allocated: string
  Message: string
  userId?: number
  itemId?: number
}

export interface User {
  id: number
  name: string
  email: string
  password: string
  phone: string
}
