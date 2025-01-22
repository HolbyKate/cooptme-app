/*
  Warnings:

  - You are about to drop the column `category` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `meetingPlace` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `meetingPlace` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "category",
DROP COLUMN "meetingPlace";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "category",
DROP COLUMN "meetingPlace";
