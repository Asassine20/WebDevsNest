/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Post`;

-- CreateTable
CREATE TABLE `Posts` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Title` VARCHAR(191) NOT NULL,
    `Content` VARCHAR(191) NOT NULL,
    `Category` VARCHAR(191) NOT NULL,
    `Created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Last_updated` DATETIME(3) NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
