-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "customId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "image" TEXT,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_customId_key" ON "User"("customId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
