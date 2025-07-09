/*
  Warnings:

  - You are about to drop the column `Category` on the `Allocation` table. All the data in the column will be lost.
  - You are about to drop the column `County` on the `Allocation` table. All the data in the column will be lost.
  - You are about to drop the column `Department` on the `Allocation` table. All the data in the column will be lost.
  - You are about to drop the column `ID_PF_No` on the `Allocation` table. All the data in the column will be lost.
  - You are about to drop the column `Item_Name` on the `Allocation` table. All the data in the column will be lost.
  - You are about to drop the column `Item_Serial_No` on the `Allocation` table. All the data in the column will be lost.
  - You are about to drop the column `Member_Name` on the `Allocation` table. All the data in the column will be lost.
  - You are about to drop the column `Model` on the `Allocation` table. All the data in the column will be lost.
  - You are about to drop the column `Office_Location` on the `Allocation` table. All the data in the column will be lost.
  - Added the required column `itemId` to the `Allocation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Allocation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Allocation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "Date_Allocated" TEXT NOT NULL,
    "Message" TEXT,
    CONSTRAINT "Allocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Allocation_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Allocation" ("Date_Allocated", "Message", "id") SELECT "Date_Allocated", "Message", "id" FROM "Allocation";
DROP TABLE "Allocation";
ALTER TABLE "new_Allocation" RENAME TO "Allocation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
