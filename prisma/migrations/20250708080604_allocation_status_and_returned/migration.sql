/*
  Warnings:

  - Added the required column `status` to the `Allocation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Allocation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "Date_Allocated" TEXT NOT NULL,
    "Date_Returned" TEXT,
    "status" TEXT NOT NULL,
    "Message" TEXT,
    CONSTRAINT "Allocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Allocation_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Allocation" ("Date_Allocated", "Message", "id", "itemId", "userId") SELECT "Date_Allocated", "Message", "id", "itemId", "userId" FROM "Allocation";
DROP TABLE "Allocation";
ALTER TABLE "new_Allocation" RENAME TO "Allocation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
