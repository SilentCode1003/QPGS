/*
  Warnings:

  - A unique constraint covering the columns `[summary]` on the table `terms_and_conditions_preset` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `terms_and_conditions_preset_summary_key` ON `terms_and_conditions_preset`(`summary`);
