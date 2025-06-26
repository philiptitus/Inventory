# Inventory Management System API Documentation

This document provides comprehensive API documentation for the form-based endpoints in this project. The backend can be implemented using any server-side framework or language that supports handling POST requests from HTML forms. Endpoints are not RESTful APIs but are defined by form actions and POST parameters.

---

## Table of Contents
- [General Notes](#general-notes)
- [Endpoints](#endpoints)
  - [Add Item](#add-item)
  - [Add Category](#add-category)
  - [Add Member](#add-member)
  - [Add Model](#add-model)
  - [Add County](#add-county)
  - [Add Department](#add-department)
  - [Add Allocation](#add-allocation)

---

## General Notes
- **Base URL:** All endpoints are relative to `/pages/action` (e.g., `http://localhost/inventory/pages/action`)
- **Authentication:** Not handled at the API level (handled via session/cookies if at all)
- **Content-Type:** `application/x-www-form-urlencoded` (standard HTML form POST)
- **Response:** On success, redirects to a related page with a success message. On error, outputs error message.

---

## Endpoints

### 1. Add Item
- **Endpoint:** `/pages/action`
- **Method:** `POST`
- **Form Submit Button Name:** `save_1`
- **Parameters:**
  - `pname` (string) — Item name
  - `serialno` (string) — Serial number
  - `model` (string) — Model name/id
  - `category` (string) — Category name/id
  - `county` (string) — County name/id
- **Success Redirect:** `items?msg=New Record created successfully`

---

### 2. Add Category
- **Endpoint:** `/pages/action`
- **Method:** `POST`
- **Form Submit Button Name:** `save_2`
- **Parameters:**
  - `category` (string) — Category name
- **Success Redirect:** `categories?msg=New Record created successfully`

---

### 3. Add Member
- **Endpoint:** `/pages/action`
- **Method:** `POST`
- **Form Submit Button Name:** `save_3`
- **Parameters:**
  - `payroll_no` (string) — Payroll number
  - `member_name` (string) — Member name
  - `department` (string) — Department name/id
  - `office_location` (string) — Office location
  - `county` (string) — County name/id
- **Success Redirect:** `members?msg=New Record created successfully`

---

### 4. Add Model
- **Endpoint:** `/pages/action`
- **Method:** `POST`
- **Form Submit Button Name:** `save_4`
- **Parameters:**
  - `model_name` (string) — Model name
- **Success Redirect:** `models?msg=New Record created successfully`

---

### 5. Add County
- **Endpoint:** `/pages/action`
- **Method:** `POST`
- **Form Submit Button Name:** `save_5`
- **Parameters:**
  - `county_name` (string) — County name
  - `county_number` (string/int) — County number
- **Success Redirect:** `counties?msg=New Record created successfully`

---

### 6. Add Department
- **Endpoint:** `/pages/action`
- **Method:** `POST`
- **Form Submit Button Name:** `save_6`
- **Parameters:**
  - `Dep_ID` (string/int) — Department ID
  - `Dep_name` (string) — Department name
- **Success Redirect:** `department?msg=New Record created successfully`

---

### 7. Add Allocation
- **Endpoint:** `/pages/action`
- **Method:** `POST`
- **Form Submit Button Name:** `save_7`
- **Parameters:**
  - `ID_PF_No` (string) — Member Payroll/ID Number
  - `Member_Name` (string) — Member name
  - `Department` (string) — Department name/id
  - `Office_Location` (string) — Office location
  - `County` (string) — County name/id
  - `Item_Serial_No` (string) — Item serial number
  - `Category` (string) — Category name/id
  - `Model` (string) — Model name/id
  - `Item_Name` (string) — Item name
  - `Date_Allocated` (date string) — Allocation date
  - `Message` (string) — Additional message
- **Success Redirect:** `allocation?msg=New Record created successfully`

---

## Error Handling
- On database error, the endpoint will output the error message directly in the response.

---

## Security Notes
- **CSRF:** No explicit CSRF protection detected.
- **Validation:** Input is not sanitized or validated server-side (risk of SQL injection).
- **Recommendation:** Use prepared statements and add CSRF tokens for production use.

---

## Example Request (Add Item)

```http
POST /pages/action HTTP/1.1
Content-Type: application/x-www-form-urlencoded

pname=Laptop&serialno=12345&model=HP+Elitebook&category=Electronics&county=Nairobi&save_1=
```

---

*This documentation is auto-generated from the PHP codebase and reflects the current available POST-based API endpoints in the system.*


# Database Models and Fields

Below are the database tables (models) and their fields as defined in `inventorydb5.sql`:

---

## categories
| Field         | Type           | Notes         |
|---------------|----------------|---------------|
| id            | int(11)        | Primary Key   |
| category_name | varchar(30)    | Not Null      |
| status        | tinyint(1)     | Not Null      |

## counties
| Field         | Type           | Notes         |
|---------------|----------------|---------------|
| id            | int(11)        | Primary Key   |
| county_name   | varchar(20)    | Not Null      |
| county_number | int(11)        | Not Null      |

## items
| Field     | Type           | Notes         |
|-----------|----------------|---------------|
| id        | int(10) UNSIGNED| Primary Key   |
| pname     | varchar(50)    | Not Null      |
| serialno  | varchar(50)    | Not Null      |
| model     | varchar(50)    | Not Null      |
| category  | varchar(50)    | Not Null      |
| county    | varchar(50)    | Not Null      |

## members
| Field          | Type           | Notes         |
|----------------|----------------|---------------|
| id             | int(11)        | Primary Key   |
| payroll_no     | varchar(10)    | Not Null      |
| member_name    | varchar(30)    | Not Null      |
| department     | varchar(30)    | Not Null      |
| office_location| varchar(20)    | Not Null      |

## models
| Field      | Type           | Notes         |
|------------|----------------|---------------|
| id         | int(11)        | Primary Key   |
| model_name | varchar(20)    | Not Null      |
| status     | tinyint(1)     | Not Null      |

## users
| Field     | Type           | Notes         |
|-----------|----------------|---------------|
| id        | int(11)        | Primary Key   |
| name      | varchar(255)   | Not Null      |
| email     | varchar(255)   | Not Null      |
| password  | varchar(255)   | Not Null      |
| phone     | varchar(255)   | Not Null      |
