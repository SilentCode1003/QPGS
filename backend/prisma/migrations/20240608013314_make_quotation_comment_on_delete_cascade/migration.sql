-- DropForeignKey
ALTER TABLE `quotation_comment` DROP FOREIGN KEY `quotation_comment_quotation_id_fkey`;

-- AddForeignKey
ALTER TABLE `quotation_comment` ADD CONSTRAINT `quotation_comment_quotation_id_fkey` FOREIGN KEY (`quotation_id`) REFERENCES `quotation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
