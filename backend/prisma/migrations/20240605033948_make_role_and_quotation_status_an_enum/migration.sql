/*
  Warnings:

  - You are about to drop the column `quotation_status_id` on the `quotation` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `quotation_status` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `quotation` DROP FOREIGN KEY `quotation_quotation_status_id_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_role_id_fkey`;

-- AlterTable
ALTER TABLE `quotation` DROP COLUMN `quotation_status_id`,
    ADD COLUMN `quotation_status` ENUM('PENDING', 'ACTIVE') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `user` DROP COLUMN `role_id`,
    ADD COLUMN `role` ENUM('ADMIN', 'DEVELOPER', 'USER') NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE `quotation_status`;

-- DropTable
DROP TABLE `role`;
