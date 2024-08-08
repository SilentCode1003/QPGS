/*
  Warnings:

  - Added the required column `updated_at` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `category` ADD COLUMN `updated_at` DATETIME(3) NOT NULL;
