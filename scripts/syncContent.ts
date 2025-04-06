import prisma from "../lib/db";




async function syncRedditPosts() {
  const posts = await prisma.redditPost.findMany();
  for (const post of posts) {
    await prisma.content.upsert({
      where: { id: `reddit-${post.id}` },
      update: {
        title: post.title,
        url: post.url,
        type: "RedditPost",
        tags: [post.subreddit],
      },
      create: {
        id: `reddit-${post.id}`,
        title: post.title,
        url: post.url,
        type: "RedditPost",
        tags: [post.subreddit],
        createdAt: post.createdAt,
      },
    });
  }
  console.log(`✅ Synced ${posts.length} Reddit posts`);
}

async function syncGitHubRepos() {
  const repos = await prisma.gitHubRepo.findMany();
  for (const repo of repos) {
    await prisma.content.upsert({
      where: { id: `githubrepo-${repo.id}` },
      update: {
        title: repo.fullName,
        url: repo.url,
        type: "GitHubRepo",
        tags: repo.language ? [repo.language] : [],
      },
      create: {
        id: `githubrepo-${repo.id}`,
        title: repo.fullName,
        url: repo.url,
        type: "GitHubRepo",
        tags: repo.language ? [repo.language] : [],
        createdAt: repo.createdAt,
      },
    });
  }
  console.log(`✅ Synced ${repos.length} GitHub repos`);
}

async function syncGitHubIssues() {
  const issues = await prisma.gitHubIssue.findMany();
  for (const issue of issues) {
    await prisma.content.upsert({
      where: { id: `githubissue-${issue.id}` },
      update: {
        title: issue.title,
        url: issue.issueUrl,
        type: "GitHubIssue",
        tags: [issue.repoName],
      },
      create: {
        id: `githubissue-${issue.id}`,
        title: issue.title,
        url: issue.issueUrl,
        type: "GitHubIssue",
        tags: [issue.repoName],
        createdAt: issue.createdAt,
      },
    });
  }
  console.log(`✅ Synced ${issues.length} GitHub issues`);
}

async function syncHackerNewsItems() {
  const items = await prisma.hackerNewsItem.findMany();
  for (const item of items) {
    await prisma.content.upsert({
      where: { id: `hn-${item.id}` },
      update: {
        title: item.title,
        url: item.url || "",
        type: "HackerNewsItem",
        tags: item.author ? [item.author] : [],
      },
      create: {
        id: `hn-${item.id}`,
        title: item.title,
        url: item.url || "",
        type: "HackerNewsItem",
        tags: item.author ? [item.author] : [],
        createdAt: item.createdAt,
      },
    });
  }
  console.log(`✅ Synced ${items.length} Hacker News items`);
}

async function syncTechNewsItems() {
  const items = await prisma.techNewsItem.findMany();
  for (const item of items) {
    await prisma.content.upsert({
      where: { id: `technews-${item.id}` },
      update: {
        title: item.title,
        url: item.url,
        type: "TechNewsItem",
        tags: item.source ? [item.source] : [],
        summary: item.summary || null,
      },
      create: {
        id: `technews-${item.id}`,
        title: item.title,
        url: item.url,
        type: "TechNewsItem",
        tags: item.source ? [item.source] : [],
        summary: item.summary || null,
        createdAt: item.createdAt,
      },
    });
  }
  console.log(`✅ Synced ${items.length} Tech News items`);
}

async function syncStackOverflowQuestions() {
  const questions = await prisma.stackOverflowQuestion.findMany();
  for (const q of questions) {
    await prisma.content.upsert({
      where: { id: `soq-${q.id}` },
      update: {
        title: q.title,
        url: q.link,
        type: "StackOverflowQuestion",
        tags: q.tags,
      },
      create: {
        id: `soq-${q.id}`,
        title: q.title,
        url: q.link,
        type: "StackOverflowQuestion",
        tags: q.tags,
        createdAt: q.creationDate,
      },
    });
  }
  console.log(`✅ Synced ${questions.length} Stack Overflow questions`);
}

async function syncSocialMediaPosts() {
  const posts = await prisma.socialMediaPost.findMany();
  for (const post of posts) {
    await prisma.content.upsert({
      where: { id: `smp-${post.id}` },
      update: {
        title: post.content.slice(0, 100),
        url: post.url,
        type: "SocialMediaPost",
        tags: post.hashtags,
      },
      create: {
        id: `smp-${post.id}`,
        title: post.content.slice(0, 100),
        url: post.url,
        type: "SocialMediaPost",
        tags: post.hashtags,
        createdAt: post.createdAt,
      },
    });
  }
  console.log(`✅ Synced ${posts.length} Social Media posts`);
}

async function syncProductHuntPosts() {
  const posts = await prisma.productHuntPost.findMany();
  for (const post of posts) {
    await prisma.content.upsert({
      where: { id: `ph-${post.id}` },
      update: {
        title: post.name,
        url: post.url,
        type: "ProductHuntPost",
        summary: post.tagline || undefined,
        tags: [],
      },
      create: {
        id: `ph-${post.id}`,
        title: post.name,
        url: post.url,
        type: "ProductHuntPost",
        summary: post.tagline || undefined,
        tags: [],
        createdAt: post.createdAt,
      },
    });
  }
  console.log(`✅ Synced ${posts.length} Product Hunt posts`);
}

async function main() {
  await syncRedditPosts();
  await syncGitHubRepos();
  await syncGitHubIssues();
  await syncHackerNewsItems();
  await syncTechNewsItems();
  await syncStackOverflowQuestions();
  await syncSocialMediaPosts();
  await syncProductHuntPosts();

  console.log("🎉 All sources synced into `Content` table");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("❌ Sync failed:", err);
  prisma.$disconnect();
  process.exit(1);
});
