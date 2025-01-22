/*
  Warnings:

  - You are about to drop the column `function` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `meetAt` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `job` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "function",
DROP COLUMN "photo",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "company" TEXT NOT NULL,
ADD COLUMN     "job" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL,
ALTER COLUMN "meetingPlace" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "meetAt";

-- CreateIndex
CREATE UNIQUE INDEX "Contact_url_key" ON "Contact"("url");
