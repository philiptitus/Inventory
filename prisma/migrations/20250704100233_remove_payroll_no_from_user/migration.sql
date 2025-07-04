/*
  Warnings:

  - You are about to drop the column `payroll_no` on the `User` table. All the data in the column will be lost.
  - Made the column `county` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `department` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "department" TEXT NOT NULL,
    "county" TEXT NOT NULL
);
INSERT INTO "new_User" ("county", "department", "email", "id", "isAdmin", "name", "password", "phone") SELECT "county", "department", "email", "id", "isAdmin", "name", "password", "phone" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
