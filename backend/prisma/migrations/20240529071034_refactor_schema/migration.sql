/*
  Warnings:

  - You are about to drop the column `client_id` on the `quotation` table. All the data in the column will be lost.
  - You are about to drop the column `creator_user_id` on the `quotation` table. All the data in the column will be lost.
  - You are about to drop the column `signatory_user_id` on the `quotation` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `quotation` table. All the data in the column will be lost.
  - You are about to drop the `product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quotation_comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quotation_products` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `quotation_status` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[summary]` on the table `terms_and_conditions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `client` to the `quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `products` to the `quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `quotation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `quotation` DROP FOREIGN KEY `quotation_client_id_fkey`;

-- DropForeignKey
ALTER TABLE `quotation` DROP FOREIGN KEY `quotation_creator_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `quotation` DROP FOREIGN KEY `quotation_signatory_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `quotation_comment` DROP FOREIGN KEY `quotation_comment_quotation_id_fkey`;

-- DropForeignKey
ALTER TABLE `quotation_products` DROP FOREIGN KEY `quotation_products_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `quotation_products` DROP FOREIGN KEY `quotation_products_quotation_id_fkey`;

-- AlterTable
ALTER TABLE `quotation` DROP COLUMN `client_id`,
    DROP COLUMN `creator_user_id`,
    DROP COLUMN `signatory_user_id`,
    DROP COLUMN `subject`,
    ADD COLUMN `approved_by` INTEGER NULL,
    ADD COLUMN `client` JSON NOT NULL,
    ADD COLUMN `created_by` INTEGER NOT NULL,
    ADD COLUMN `products` JSON NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `product`;

-- DropTable
DROP TABLE `quotation_comment`;

-- DropTable
DROP TABLE `quotation_products`;

-- CreateIndex
CREATE UNIQUE INDEX `client_name_key` ON `client`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `quotation_status_name_key` ON `quotation_status`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `role_name_key` ON `role`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `terms_and_conditions_summary_key` ON `terms_and_conditions`(`summary`);

-- AddForeignKey
ALTER TABLE `quotation` ADD CONSTRAINT `quotation_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quotation` ADD CONSTRAINT `quotation_approved_by_fkey` FOREIGN KEY (`approved_by`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
