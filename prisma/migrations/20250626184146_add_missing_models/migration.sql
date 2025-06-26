/*
  Warnings:

  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Inventory";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pname" TEXT NOT NULL,
    "serialno" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "county" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category_name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "County" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "county_name" TEXT NOT NULL,
    "county_number" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Member" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "payroll_no" TEXT NOT NULL,
    "member_name" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "office_location" TEXT NOT NULL,
    "county" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Department" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Dep_ID" INTEGER NOT NULL,
    "Dep_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Allocation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ID_PF_No" TEXT NOT NULL,
    "Member_Name" TEXT NOT NULL,
    "Department" TEXT NOT NULL,
    "Office_Location" TEXT NOT NULL,
    "County" TEXT NOT NULL,
    "Item_Serial_No" TEXT NOT NULL,
    "Category" TEXT NOT NULL,
    "Model" TEXT NOT NULL,
    "Item_Name" TEXT NOT NULL,
    "Date_Allocated" TEXT NOT NULL,
    "Message" TEXT
);
