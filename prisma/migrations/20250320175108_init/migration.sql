-- CreateTable
CREATE TABLE "GitHubRepo" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "watchers" INTEGER NOT NULL,
    "pushedAt" TIMESTAMP(3) NOT NULL,
    "language" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GitHubRepo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GitHubIssue" (
    "id" TEXT NOT NULL,
    "repoName" TEXT NOT NULL,
    "issueUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "comments" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GitHubIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GitHubLanguageStat" (
    "id" SERIAL NOT NULL,
    "language" TEXT NOT NULL,
    "repoCount" INTEGER NOT NULL,

    CONSTRAINT "GitHubLanguageStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StackOverflowQuestion" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL,
    "answerCount" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "tags" TEXT[],
    "isAnswered" BOOLEAN NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StackOverflowQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StackOverflowAnswer" (
    "id" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "link" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "isAccepted" BOOLEAN NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StackOverflowAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StackOverflowTagStat" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,
    "questionCount" INTEGER NOT NULL,
    "unansweredCount" INTEGER NOT NULL,

    CONSTRAINT "StackOverflowTagStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HackerNewsItem" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "author" TEXT,
    "score" INTEGER NOT NULL,
    "comments" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HackerNewsItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechNewsItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "source" TEXT,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TechNewsItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialMediaPost" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "hashtags" TEXT[],
    "url" TEXT NOT NULL,
    "score" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "aggregatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocialMediaPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meme" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "title" TEXT,
    "caption" TEXT,
    "imageUrl" TEXT NOT NULL,
    "upvotes" INTEGER,
    "link" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GitHubRepo_fullName_key" ON "GitHubRepo"("fullName");

-- CreateIndex
CREATE UNIQUE INDEX "GitHubIssue_issueUrl_key" ON "GitHubIssue"("issueUrl");

-- CreateIndex
CREATE UNIQUE INDEX "GitHubLanguageStat_language_key" ON "GitHubLanguageStat"("language");

-- CreateIndex
CREATE UNIQUE INDEX "StackOverflowTagStat_tag_key" ON "StackOverflowTagStat"("tag");
