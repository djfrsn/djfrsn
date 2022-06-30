/*
  Warnings:

  - A unique constraint covering the columns `[jobId]` on the table `Job` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Job_jobId_key" ON "Job"("jobId");
