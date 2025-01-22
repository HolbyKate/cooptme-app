/*
  Warnings:

  - A unique constraint covering the columns `[firstName,lastName]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Contact_firstName_lastName_key" ON "Contact"("firstName", "lastName");
