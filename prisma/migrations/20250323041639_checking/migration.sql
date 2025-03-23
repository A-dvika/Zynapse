-- CreateTable
CREATE TABLE "ProductHuntPost" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "votesCount" INTEGER NOT NULL,
    "commentsCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "aggregatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductHuntPost_pkey" PRIMARY KEY ("id")
);
