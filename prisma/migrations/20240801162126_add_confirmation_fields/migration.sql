-- AlterTable
ALTER TABLE `User` ADD COLUMN `confirmationCode` VARCHAR(191) NULL,
    ADD COLUMN `confirmed` BOOLEAN NOT NULL DEFAULT false;
