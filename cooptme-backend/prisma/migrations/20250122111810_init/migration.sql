/*
  Warnings:

  - The primary key for the `Contact` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `company` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `job` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Contact` table. All the data in the column will be lost.
  - Added the required column `function` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meetingPlace` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_pkey",
DROP COLUMN "company",
DROP COLUMN "job",
DROP COLUMN "url",
ADD COLUMN     "function" TEXT NOT NULL,
ADD COLUMN     "meetingPlace" TEXT NOT NULL,
ADD COLUMN     "photo" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Contact_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Contact_id_seq";
