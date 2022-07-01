/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Job` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Job_name_key" ON "Job"("name");
