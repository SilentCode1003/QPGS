/*
  Warnings:

  - You are about to drop the column `quotation_status_id` on the `quotation` table. All the data in the column will be lost.
  - You are about to drop the `quotation_status` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `quotation` DROP FOREIGN KEY `quotation_quotation_status_id_fkey`;

-- AlterTable
ALTER TABLE `quotation` DROP COLUMN `quotation_status_id`,
    ADD COLUMN `quotation_status` ENUM('pending', 'approved') NOT NULL DEFAULT 'pending';

-- DropTable
DROP TABLE `quotation_status`;
