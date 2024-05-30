/*
  Warnings:

  - Added the required column `subject` to the `quotation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `quotation` ADD COLUMN `subject` VARCHAR(191) NOT NULL;
