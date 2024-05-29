/*
  Warnings:

  - You are about to alter the column `total_amount` on the `quotation_products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Decimal`.
  - Added the required column `summary` to the `terms_and_conditions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `quotation_products` MODIFY `total_amount` DECIMAL NOT NULL;

-- AlterTable
ALTER TABLE `terms_and_conditions` ADD COLUMN `summary` VARCHAR(191) NOT NULL;
