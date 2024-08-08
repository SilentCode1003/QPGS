/*
  Warnings:

  - A unique constraint covering the columns `[quotation_id,product_id]` on the table `quotation_product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `quotation_product_quotation_id_product_id_key` ON `quotation_product`(`quotation_id`, `product_id`);
