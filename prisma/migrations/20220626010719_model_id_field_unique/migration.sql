/*
  Warnings:

  - A unique constraint covering the columns `[modelId]` on the table `Job` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Job_modelId_key" ON "Job"("modelId");
