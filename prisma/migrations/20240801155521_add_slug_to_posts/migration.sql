/*
  Warnings:

  - A unique constraint covering the columns `[Slug]` on the table `Posts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Slug` to the `Posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Posts` ADD COLUMN `Slug` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Posts_Slug_key` ON `Posts`(`Slug`);
