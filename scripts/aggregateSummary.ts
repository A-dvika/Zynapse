// import prisma from "../lib/db";
// import { generateSummary } from "../lib/ai";

// async function run() {
//   try {
//     // 1) Calculate today's date range (based on server/local time).
//     const now = new Date();
//     const startOfDay = new Date(now);
//     startOfDay.setHours(0, 0, 0, 0);
//     const endOfDay = new Date(now);
//     endOfDay.setHours(23, 59, 59, 999);

//     /***********************************************************************
//      * HELPER: Summarize any data array => single paragraph, then upsert
//      ***********************************************************************/
//     async function summarizeAndUpsert(
//       sourceName: string,
//       contextRecords: string[],
//       promptContextLabel: string
//     ) {
//       // If we have no data for the day, store a fallback text
//       let contextText =
//         contextRecords.length > 0
//           ? contextRecords.join("\n\n")
//           : "No data available for today.";

//       // Build the prompt for Gemini
//       const prompt = `Summarize the following ${promptContextLabel} data from today into a single, detailed paragraph suitable for a dashboard overview:\n\n${contextText}\n\nProvide a concise and informative summary.`;

//       // Generate the summary
//       const summary = await generateSummary(prompt);

//       // Upsert into DataSummary table
//       await prisma.dataSummary.upsert({
//         where: { source: sourceName },
//         update: { summary },
//         create: { source: sourceName, summary },
//       });

//       console.log(`Summary for [${sourceName}] saved:\n`, summary, "\n");
//     }

//     /***********************************************************************
//      * 2) REDDIT
//      ***********************************************************************/
//     const redditPosts = await prisma.redditPost.findMany({
//       where: {
//         createdAt: {
//           gte: startOfDay,
//           lte: endOfDay,
//         },
//       },
//       orderBy: { upvotes: "desc" },
//     });

//     const redditContext = redditPosts.map(
//       (post: { title: string; subreddit: string; upvotes: number; comments: number; author: string }) =>
//         `Title: ${post.title}\nSubreddit: ${post.subreddit}\nUpvotes: ${post.upvotes}\nComments: ${post.comments}\nAuthor: ${post.author}`
//     );

//     await summarizeAndUpsert("reddit", redditContext, "Reddit");

//     /***********************************************************************
//      * 3) STACK OVERFLOW
//      ***********************************************************************/
//     const stackOverflowQuestions = await prisma.stackOverflowQuestion.findMany({
//       where: {
//         creationDate: {
//           gte: startOfDay,
//           lte: endOfDay,
//         },
//       },
//       orderBy: { score: "desc" },
//     });

//     const soContext = stackOverflowQuestions.map(
//       (q: { title: string; score: number; viewCount: number; answerCount: number; tags: string[]; isAnswered: boolean }) =>
//         `Title: ${q.title}\nScore: ${q.score}\nViews: ${q.viewCount}\nAnswers: ${q.answerCount}\nTags: ${q.tags.join(
//           ", "
//         )}\nAnswered: ${q.isAnswered ? "Yes" : "No"}`
//     );

//     await summarizeAndUpsert("stackoverflow", soContext, "Stack Overflow");

//     /***********************************************************************
//      * 4) GITHUB
//      *    Summarize both repos and issues in a single paragraph.
//      ***********************************************************************/
//     const githubRepos = await prisma.gitHubRepo.findMany({
//       where: {
//         createdAt: {
//           gte: startOfDay,
//           lte: endOfDay,
//         },
//       },
//       orderBy: { stars: "desc" },
//     });

//     const githubIssues = await prisma.gitHubIssue.findMany({
//       where: {
//         createdAt: {
//           gte: startOfDay,
//           lte: endOfDay,
//         },
//       },
//       orderBy: { comments: "desc" },
//     });

//     const ghRepoContext = githubRepos.map(
//       (r: { fullName: string; stars: number; forks: number; watchers: number; language: string | null }) =>
//         `Repo: ${r.fullName}\nStars: ${r.stars}\nForks: ${r.forks}\nWatchers: ${r.watchers}\nLanguage: ${r.language ?? "N/A"}`
//     );

//     const ghIssueContext = githubIssues.map(
//       (i: { title: string; repoName: string; comments: number; author: string }) =>
//         `Issue Title: ${i.title}\nRepo: ${i.repoName}\nComments: ${i.comments}\nAuthor: ${i.author}`
//     );

//     const githubCombinedContext = [
//       ...ghRepoContext,
//       ...ghIssueContext,
//     ];

//     await summarizeAndUpsert("github", githubCombinedContext, "GitHub");

//     /***********************************************************************
//      * 5) HACKER NEWS
//      ***********************************************************************/
//     const hnStories = await prisma.hackerNewsItem.findMany({
//       where: {
//         createdAt: {
//           gte: startOfDay,
//           lte: endOfDay,
//         },
//       },
//       orderBy: { score: "desc" },
//     });

//     const hnContext = hnStories.map(
//       (story: { id: number; url: string | null; createdAt: Date; updatedAt: Date; title: string; comments: number; author: string | null; score: number }) =>
//         `Title: ${story.title}\nScore: ${story.score}\nComments: ${story.comments}\nAuthor: ${story.author ?? "Unknown"}`
//       (story: { id: number; url: string | null; createdAt: Date; updatedAt: Date; title: string; comments: number; author: string | null; score: number }) =>
//         `Title: ${story.title}\nScore: ${story.score}\nComments: ${story.comments}\nAuthor: ${story.author ?? "Unknown"}`
//     await summarizeAndUpsert("hackernews", hnContext, "Hacker News");

//     /***********************************************************************
//      * 6) TECH NEWS
//      ***********************************************************************/
//     const techNewsItems = await prisma.techNewsItem.findMany({
//       where: {
//         createdAt: {
//           gte: startOfDay,
//           lte: endOfDay,
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     const techNewsContext = techNewsItems.map(
//       (item: { id: string; title: string; url: string; createdAt: Date; updatedAt: Date; source: string | null; summary: string | null }) =>
//         `Title: ${item.title}\nSource: ${item.source ?? "Unknown"}\nSummary: ${
//       (item: { id: string; title: string; url: string; createdAt: Date; updatedAt: Date; source: string | null; summary: string | null }) =>
//         `Title: ${item.title}\nSource: ${item.source ?? "Unknown"}\nSummary: ${item.summary ?? "(no summary)"}`
//     await summarizeAndUpsert("technews", techNewsContext, "Tech News");

//     /***********************************************************************
//      * 7) SOCIAL MEDIA POSTS
//      ***********************************************************************/
//     const socialPosts = await prisma.socialMediaPost.findMany({
//       where: {
//         createdAt: {
//           gte: startOfDay,
//           lte: endOfDay,
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     const socialContext = socialPosts.map(
//       (post: { id: string; url: string; author: string; score: number | null; createdAt: Date; platform: string; content: string; hashtags: string[]; aggregatedAt: Date }) =>
//         `Platform: ${post.platform}\nContent: ${post.content}\nAuthor: ${
//           post.author
//         }\nHashtags: ${post.hashtags.join(", ")}\nScore: ${
//       (post: { id: string; url: string; author: string; score: number | null; createdAt: Date; platform: string; content: string; hashtags: string[]; aggregatedAt: Date }) =>
//         `Platform: ${post.platform}\nContent: ${post.content}\nAuthor: ${post.author}\nHashtags: ${post.hashtags.join(", ")}\nScore: ${post.score ?? 0}`
//     /***********************************************************************
//      * 8) MEMES (OPTIONAL)
//      ***********************************************************************/
//     // If you want a "memes" summary, uncomment the lines below
//     // const memes = await prisma.meme.findMany({
//     //   where: {
//     //     createdAt: {
//     //       gte: startOfDay,
//     //       lte: endOfDay,
//     //     },
//     //   },
//     //   orderBy: { upvotes: 'desc' },
//     // });
//     //
//     // const memeContext = memes.map(
//     //   (m) =>
//     //     `Title: ${m.title}\nPlatform: ${m.platform}\nUpvotes: ${
//     //       m.upvotes ?? 0
//     //     }\nLink: ${m.link}`
//     // );
//     //
//     // await summarizeAndUpsert("meme", memeContext, "Memes");

//     console.log("All summaries generated and saved in DataSummary table.");
//   } catch (error) {
//     console.error("Error generating chatbot summaries:", error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// run();
