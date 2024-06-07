-- DropForeignKey
ALTER TABLE `quotation_product` DROP FOREIGN KEY `quotation_product_quotation_id_fkey`;

-- AddForeignKey
ALTER TABLE `quotation_product` ADD CONSTRAINT `quotation_product_quotation_id_fkey` FOREIGN KEY (`quotation_id`) REFERENCES `quotation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
