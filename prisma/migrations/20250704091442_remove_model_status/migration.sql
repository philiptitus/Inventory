/*
  Warnings:

  - You are about to drop the column `status` on the `Model` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Model" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "model_name" TEXT NOT NULL
);
INSERT INTO "new_Model" ("id", "model_name") SELECT "id", "model_name" FROM "Model";
DROP TABLE "Model";
ALTER TABLE "new_Model" RENAME TO "Model";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
