/*
  Warnings:

  - You are about to drop the column `connectedOn` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Profile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Profile_email_key";

-- DropIndex
DROP INDEX "Profile_url_key";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "connectedOn",
DROP COLUMN "email",
DROP COLUMN "url",
ADD COLUMN     "emailAddress" TEXT,
ADD COLUMN     "linkedinUrl" TEXT,
ALTER COLUMN "company" DROP NOT NULL,
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL,
ALTER COLUMN "position" DROP NOT NULL;
