-- CreateTable
CREATE TABLE `quotation_comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quotation_id` VARCHAR(191) NOT NULL,
    `body` TEXT NOT NULL,
    `commenter_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `quotation_comment` ADD CONSTRAINT `quotation_comment_quotation_id_fkey` FOREIGN KEY (`quotation_id`) REFERENCES `quotation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quotation_comment` ADD CONSTRAINT `quotation_comment_commenter_id_fkey` FOREIGN KEY (`commenter_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
